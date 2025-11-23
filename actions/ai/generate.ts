'use server';

import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import pool from "@/lib/db";
import { getBusinessData } from "@/actions/business";
import { getActiveTemplate } from "@/actions/templates";
import { getUserPlanType } from "@/actions/user";
import { SiteContentSchema, CleanedServicesSchema } from "@/validations/ai-content";
import { getPlanLimits } from "@/lib/plan-limits";

export async function generateSiteContent() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    // 1. Fetch all necessary context
    const [businessData, activeTemplate, userPlan] = await Promise.all([
        getBusinessData(),
        getActiveTemplate(),
        getUserPlanType(userId)
    ]);

    if (!businessData) throw new Error("Business data not found");
    if (!activeTemplate) throw new Error("No active template found");

    const plan = userPlan || 'free';
    const isStarterOrHigher = plan !== 'free';
    const limits = getPlanLimits(plan);

    // ===================================================
    // CHECK AI USAGE LIMITS
    // ===================================================
    const now = new Date();
    const periodStart = new Date(businessData.aiPeriodStart);
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    let currentUsage = businessData.aiGenerationsCount;

    // Reset if period is older than 1 month
    if (periodStart < oneMonthAgo) {
        currentUsage = 0;
        // Update start date in DB
        await pool.query(
            `UPDATE businesses SET ai_generations_count = 0, ai_period_start = now() WHERE id = $1`,
            [businessData.id]
        );
    }

    if (currentUsage >= limits.maxAiGenerations) {
        throw new Error(`AI generation limit reached for your ${plan} plan. Upgrade to generate more content.`);
    }

    // ===================================================
    // STEP 1: CLEAN SERVICES
    // ===================================================
    
    // Determine limits
    const minServices = isStarterOrHigher ? 5 : 3;
    const maxServices = isStarterOrHigher ? 15 : 5;

    const servicesRaw = businessData.servicesRaw && businessData.servicesRaw.length > 0 
        ? businessData.servicesRaw 
        : businessData.services;

    // Helper to get array from maybe array
    const servicesList = Array.isArray(servicesRaw) ? servicesRaw : [];

    const cleanServicesPrompt = `You are an expert copywriter.
    
    Task: Clean and Structure the following list of services provided by a user.
    User Services: ${JSON.stringify(servicesList)}
    
    Instructions:
    - Fix typos.
    - Improve clarity.
    - Remove duplicates.
    - Expand vague terms (e.g. "fix pipes" -> "Pipe Repair & Maintenance").
    - Generate structured output: { title, description }.
    - Title: concise service name.
    - Description: 1-2 sentences describing the service benefits.
    - TARGET COUNT: Minimum ${minServices}, Maximum ${maxServices}.
    - If user provided too few, EXPAND logically based on the business category (${businessData.category}).
    - If user provided too many, MERGE or SELECT the best ones.
    `;

    let cleanedServices: { title: string; description: string }[] = [];

    try {
        const { object } = await generateObject({
            model: openai("gpt-5-mini"),
            schema: CleanedServicesSchema,
            system: cleanServicesPrompt,
            prompt: "Clean the services list.",
        });
        cleanedServices = object.cleaned_services;

        // SAVE CLEANED SERVICES TO DB
        await pool.query(
            `UPDATE businesses 
             SET services = $1, updated_at = now() 
             WHERE id = $2`,
            [JSON.stringify(cleanedServices), businessData.id]
        );

    } catch (error) {
        console.error("Service Cleaning Error:", error);
        // Fallback: use raw services structured minimally if AI fails
        cleanedServices = servicesList.map(s => ({
            title: String(s),
            description: "Professional service offered."
        })).slice(0, maxServices);
    }

    // ===================================================
    // STEP 2: GENERATE SITE CONTENT
    // ===================================================

    // 2. Prepare the system prompt based on plan
    const components = Array.isArray(activeTemplate.components) 
        ? activeTemplate.components 
        : (typeof activeTemplate.components === 'string' ? JSON.parse(activeTemplate.components) : []);
    
    const componentTypes = components.map((c: { type: string }) => c.type).join(", ");

    const locations = businessData.locations && businessData.locations.length > 0 
        ? businessData.locations.map((l: any) => l.location).join(", ")
        : 'Local Area';

    const serviceAreas = businessData.serviceAreas && businessData.serviceAreas.length > 0
        ? businessData.serviceAreas.join(", ")
        : locations; // Fallback to location if no service areas defined

    // Format services for the prompt
    const formattedServices = cleanedServices.map(s => `${s.title}: ${s.description}`).join("\n");

    let systemPrompt = `You are an expert copywriter and SEO specialist generating content for a local business website.
    
    Business Details:
    - Name: ${businessData.businessName}
    - Type: ${businessData.category || 'General Business'}
    - Services: 
${formattedServices}
    - Business Location (Physical Address): ${locations}
    - Service Areas (Coverage): ${serviceAreas}
    - About (User Input): ${businessData.about || ''}
    
    Instructions:
    - Generate professional, engaging content ONLY for the following components: ${componentTypes}.
    - Do NOT generate content for components not listed.
    - Ensure the tone is professional yet approachable.
    - Map fields precisely to the schema provided.
    
    IMPORTANT: USE THE CLEANED SERVICES LIST PROVIDED ABOVE. Do not invent completely new services unless required to meet length requirements.

    KEYWORD STRATEGY:
    - Generate SEO keywords based on REAL user search intent.
    - Include combinations of:
      1. [Service] + [Service Area] (e.g., "Carpenter in Sydney")
      2. [Service] + "near me"
      3. [Business Name]
      4. "Best" + [Service] + [Location]
    `;

    if (isStarterOrHigher) {
        systemPrompt += `
        PLAN: STARTER/BUSINESS (PREMIUM)
        - Generate comprehensive, detailed descriptions.
        - Tagline: Short and punchy. Optional sub-tagline recommended.
        - Services: You have the list of ${cleanedServices.length} services. Use their titles and descriptions. Ensure rich, benefit-oriented text.
        - Service Areas: Use the provided Service Areas (Coverage) list. If the component requires content, populate it with these areas. Do NOT invent new locations unless necessary for layout.
        - About: Create a compelling, detailed "About Us" story (300-500 characters) expanding on the user's input.
        - Keywords: Provide 10-15 high-value SEO keywords using the strategy above.
        - Testimonials: Create 3-4 distinct, detailed testimonials (if requested).
        - Footer: Include placeholder for License number if applicable.
        - For Voltage Pro template:
            - AboutSection: Include 3 features (Licensed & Insured, Working Hours, Quality Guarantee) and 3 relevant certifications.
            - NavigationSection: Generate links for Home, Services, Service Areas, About, Contact.
        `;
    } else {
        systemPrompt += `
        PLAN: FREE
        - STRICTLY LIMIT content to the following requirements:
        - Services: You have the list of ${cleanedServices.length} services. Use them.
        - Keywords: Provide 3 to 5 SEO keywords using the strategy above.
        - About: Keep the "About Us" text short (2-3 sentences).
        - Tagline: Short and punchy (8-12 words max).
        - Location: Focus on the primary Business Location.
        - NO Certifications.
        - NO FAQ generation.
        - NO Social links.
        - NO secondary CTA.
        - NO extra images or premium content.
        `;
    }

    try {
        // 3. Call OpenAI
        const { object } = await generateObject({
            model: openai("gpt-5-mini"), // Cost-effective and fast
            schema: SiteContentSchema,
            system: systemPrompt,
            prompt: "Generate the website content based on the business details and plan limits.",
        });

        // 4. Save to Database and increment usage
        await pool.query(
            `UPDATE businesses 
             SET site_content = $1, 
                 ai_generations_count = ai_generations_count + 1,
                 updated_at = now() 
             WHERE id = $2`,
            [JSON.stringify(object), businessData.id]
        );

        return { success: true };
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate content");
    }
}
