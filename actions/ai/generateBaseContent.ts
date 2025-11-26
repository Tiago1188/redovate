'use server';

import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { getBusinessData } from "@/actions/business";
import { saveBaseContent } from "@/actions/business/saveBaseContent";
import { getUserPlanType } from "@/actions/user";
import { getPlanLimits } from "@/lib/plan-limits";
import { BaseContentGenerationSchema } from "@/validations/base-content";
import sql from "@/lib/db";

export async function generateBaseContent() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    // 1. Fetch context
    const [businessData, userPlan] = await Promise.all([
        getBusinessData(),
        getUserPlanType(userId)
    ]);

    if (!businessData) throw new Error("Business data not found");

    const plan = userPlan || 'free';
    const limits = getPlanLimits(plan);

    // 2. Check Limits
    // (Reuse usage check logic from generate.ts or move to shared utility)
    // For now, simple check:
    if (businessData.aiGenerationsCount >= limits.maxAiGenerations) {
        throw new Error(`AI generation limit reached for your ${plan} plan.`);
    }

    // 3. Prepare Prompt
    const locations = businessData.locations && businessData.locations.length > 0
        ? businessData.locations.map((l: any) => l.location).join(", ")
        : 'Local Area';

    const systemPrompt = `You are an expert copywriter for local businesses.
    
    Business: ${businessData.businessName}
    Type: ${businessData.category || 'General'}
    Location: ${locations}
    User Input: ${businessData.about || ''}
    
    Task: Generate comprehensive baseline content for this business.
    
    Guidelines:
    - Tagline: Catchy, professional.
    - About Short: Elevator pitch.
    - About Full: Trust-building narrative.
    - Services: Generate ${limits.maxServices} key services.
    - Service Areas: Generate ${limits.maxServiceAreas} nearby areas based on the location.
    - Keywords: 10 high-value SEO keywords.
    `;

    try {
        // 4. Call AI
        const { object } = await generateObject({
            model: openai("gpt-4o"), // Use a more capable model for structured output
            schema: BaseContentGenerationSchema,
            system: systemPrompt,
            prompt: "Generate the business content.",
        });

        // 5. Save to Base Content
        // We use saveBaseContent to handle merging and validation
        await saveBaseContent({
            tagline: object.tagline,
            aboutShort: object.aboutShort,
            aboutFull: object.aboutFull,
            services: object.services.slice(0, limits.maxServices),
            serviceAreas: object.serviceAreas.slice(0, limits.maxServiceAreas),
            keywords: object.keywords,
        });

        // 6. Increment Usage
        await sql`
            UPDATE businesses 
            SET ai_generations_count = ai_generations_count + 1,
                updated_at = now() 
            WHERE id = ${businessData.id}
        `;

        return { success: true, data: object };
    } catch (error: any) {
        console.error("AI Base Content Generation Error:", error);
        throw new Error(error.message || "Failed to generate content");
    }
}
