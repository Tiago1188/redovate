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

    let systemPrompt = `You are an expert copywriter and SEO specialist generating content for a local business website.
    
    Business Details:
    - Name: ${businessData.businessName}
    - Type: ${businessData.category || 'General Business'}
    - Services: ${businessData.services.join(", ")}
    - Location: ${businessData.locations[0]?.location || 'Local Area'}
    - About (User Input): ${businessData.about || ''}
    
    Instructions:
    - Generate professional, engaging content ONLY for the following components: ${componentTypes}.
    - Do NOT generate content for components not listed.
    - Ensure the tone is professional yet approachable.
    - Use the business location to enhance local SEO appeal.
    - Map fields precisely to the schema provided.
    `;

    if (isStarterOrHigher) {
        systemPrompt += `
        PLAN: STARTER/BUSINESS (PREMIUM)
        - Generate comprehensive, detailed descriptions.
        - Provide 10+ high-value SEO keywords in the MetaSection.
        - Create 3-4 distinct, detailed testimonials for the TestimonialsSection (if requested).
        - For Services, write rich, benefit-oriented descriptions (2-3 sentences each).
        - Create a compelling, detailed "About Us" story expanding on the user's input.
        - For Voltage Pro template:
            - AboutSection: Include 3 features (Licensed & Insured, Working Hours, Quality Guarantee) and 3 relevant certifications.
            - NavigationSection: Generate links for Home, Services, Service Areas, About, Contact.
        `;
    } else {
        systemPrompt += `
        PLAN: FREE
        - Keep descriptions concise and direct.
        - Provide exactly 5 SEO keywords in the MetaSection.
        - Generate 1 generic testimonial if the section exists.
        - For Services, write brief, single-sentence descriptions.
        - Keep the "About Us" text standard and functional.
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

