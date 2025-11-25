'use server';

import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { getBusinessData } from "@/actions/business";
import { checkAiUsageLimit, incrementAiUsage } from "@/actions/ai/usage";
import { AiUsageLimitError, formatAiLimitError } from "@/lib/ai-limit-error";
import { HeroFormData } from "@/validations/hero";

const GeneratedHeroSchema = z.object({
  headline: z.string(),
  highlight: z.string().optional(),
  tagline: z.string().optional(),
  subtagline: z.string().optional(),
  cta_primary: z.string().optional(),
  cta_secondary: z.string().optional(),
});

export async function generateHeroContent() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const business = await getBusinessData();
  if (!business) {
    throw new Error("Business not found");
  }

  try {
    await checkAiUsageLimit({
      businessId: business.id,
      userId,
      currentUsage: business.aiGenerationsCount,
      aiPeriodStart: business.aiPeriodStart,
    });

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: GeneratedHeroSchema,
      system: `You are an expert conversion copywriter building hero sections for local service businesses.
Business: ${business.businessName}
Industry: ${business.category || "General services"}
Primary Location: ${business.locations?.[0]?.location || "Local area"}
Tone: Confident, trustworthy, and action-driven.
Return compelling, benefit-focused text that would sit above-the-fold on the website.`,
      prompt: `Create a headline, highlight, tagline, supporting copy, and two CTA labels for ${business.businessName}. Focus on their services: ${JSON.stringify(business.services || [])}`,
    });

    await incrementAiUsage(business.id);

    const data: Partial<HeroFormData> = {
      headline: object.headline,
      highlight: object.highlight,
      tagline: object.tagline,
      subtagline: object.subtagline,
      ctaPrimary: object.cta_primary,
      ctaSecondary: object.cta_secondary,
    };

    return { success: true, data };
  } catch (error) {
    if (error instanceof AiUsageLimitError) {
      return { success: false, ...formatAiLimitError(error) };
    }

    console.error("Hero AI generation error:", error);
    return { success: false, error: "Failed to generate hero content" };
  }
}

