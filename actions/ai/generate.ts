'use server';

import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import pool from "@/lib/db";
import { getBusinessData } from "@/actions/business";
import { getActiveTemplate } from "@/actions/templates";
import { getUserPlanType } from "@/actions/user";
import { SiteContentSchema } from "@/validations/ai-content";

// Define the schema for the generated content
// This covers all possible sections across different templates
// Moved to @/validations/ai-content

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

    // 2. Prepare the system prompt based on plan
    const components = Array.isArray(activeTemplate.components) 
        ? activeTemplate.components 
        : (typeof activeTemplate.components === 'string' ? JSON.parse(activeTemplate.components) : []);
    
    const componentTypes = components.map((c: { type: string }) => c.type).join(", ");

    const locations = businessData.locations && businessData.locations.length > 0 
        ? businessData.locations.map((l: any) => l.location).join(", ")
        : 'Local Area';

    let systemPrompt = `You are an expert copywriter and SEO specialist generating content for a local business website.
    
    Business Details:
    - Name: ${businessData.businessName}
    - Type: ${businessData.category || 'General Business'}
    - Services: ${businessData.services.join(", ")}
    - Locations: ${locations}
    - About (User Input): ${businessData.about || ''}
    
    Instructions:
    - Generate professional, engaging content ONLY for the following components: ${componentTypes}.
    - Do NOT generate content for components not listed.
    - Ensure the tone is professional yet approachable.
    - Map fields precisely to the schema provided.

    KEYWORD STRATEGY:
    - Generate SEO keywords based on REAL user search intent.
    - Include combinations of:
      1. [Service] + [Location] (e.g., "Carpenter in Sydney")
      2. [Service] + "near me"
      3. [Business Name]
      4. "Best" + [Service] + [Location]
    `;

    if (isStarterOrHigher) {
        systemPrompt += `
        PLAN: STARTER/BUSINESS (PREMIUM)
        - Generate comprehensive, detailed descriptions.
        - Tagline: Short and punchy. Optional sub-tagline recommended.
        - Services: Generate between 5 to 15 services. Write rich, benefit-oriented descriptions (2-3 sentences each).
        - Service Areas: Use the provided business locations. If the component requires content, populate it with the provided locations. Do NOT invent new locations unless necessary for layout.
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
        - Services: Generate 3 to 5 services. Descriptions must be 1-2 sentences max.
        - Keywords: Provide 3 to 5 SEO keywords using the strategy above.
        - About: Keep the "About Us" text short (2-3 sentences).
        - Tagline: Short and punchy (8-12 words max).
        - Location: Focus on exactly one primary location.
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

        // 4. Save to Database
        // Merge with existing content if any, or overwrite? Overwrite is usually better for regeneration.
        // But we might want to keep manual edits? For now, the plan implies generation (overwrite).
        
        // We also need to ensure we don't lose data that wasn't generated if we merge.
        // However, this is "generating" state, so we likely just set the initial content.
        
        await pool.query(
            `UPDATE businesses 
             SET site_content = $1, updated_at = now() 
             WHERE id = $2`,
            [JSON.stringify(object), businessData.id]
        );

        return { success: true };
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate content");
    }
}

