'use server';

import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getBusinessData } from "@/actions/business";
import { checkAiUsageLimit, incrementAiUsage } from "@/actions/ai/usage";
import { AiUsageLimitError, formatAiLimitError } from "@/lib/ai-limit-error";
import {
  CustomDomainSchema,
  SubdomainSchema,
  normalizeDomain,
  normalizeSubdomain,
} from "@/lib/validators/domain";

const DomainSuggestionSchema = z.object({
  subdomain: z
    .string()
    .describe("A clean, human-friendly subdomain slug tied to the business name."),
  customDomain: z
    .string()
    .nullable()
    .optional()
    .describe("A potential full custom domain (example.com)."),
});

export async function generateDomainSuggestion() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const business = await getBusinessData();
  if (!business) throw new Error("Business not found");

  try {
    await checkAiUsageLimit({
      businessId: business.id,
      userId,
      currentUsage: business.aiGenerationsCount,
      aiPeriodStart: business.aiPeriodStart,
    });

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: DomainSuggestionSchema,
      system: `You help local businesses pick memorable domains.
Business: ${business.businessName}
Industry: ${business.category || "General"}
About: ${(business.about || "").slice(0, 400)}
Keywords: ${(business.services || []).map((s: any) => s.title || s.name).join(", ")}
Existing slug: ${business.slug}
Return only clean values with no explanations.`,
      prompt: `Suggest a short subdomain (no TLD) and a matching .com style custom domain.
The subdomain should be <= 20 characters, lowercase, and hyphenated if needed.
Custom domain must be available in principle (don't use famous brands).`,
    });

    const normalizedSubdomain = SubdomainSchema.parse(normalizeSubdomain(object.subdomain));
    let normalizedCustomDomain: string | null = null;
    if (object.customDomain) {
      const candidate = normalizeDomain(object.customDomain);
      normalizedCustomDomain = CustomDomainSchema.safeParse(candidate).success ? candidate : null;
    }

    await incrementAiUsage(business.id);

    return {
      success: true,
      subdomain: normalizedSubdomain,
      customDomain: normalizedCustomDomain,
    };
  } catch (error) {
    if (error instanceof AiUsageLimitError) {
      return {
        success: false,
        ...formatAiLimitError(error),
      };
    }

    console.error("Error generating domain suggestion:", error);
    return {
      success: false,
      error: "Unable to generate a domain suggestion right now.",
    };
  }
}

