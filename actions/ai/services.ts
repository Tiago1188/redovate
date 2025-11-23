'use server';

import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getBusinessData } from "@/actions/business";
import { checkAiUsageLimit, incrementAiUsage } from "@/actions/ai/usage";

const ServiceDescriptionSchema = z.object({
  description: z.string().describe("A professional description of the service (1-2 sentences)."),
});

export async function generateServiceDescription(serviceName: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const business = await getBusinessData();
  if (!business) throw new Error("Business not found");

  // Check usage before generating
  await checkAiUsageLimit({
    businessId: business.id,
    userId,
    currentUsage: business.aiGenerationsCount,
    aiPeriodStart: business.aiPeriodStart,
  });

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ServiceDescriptionSchema,
      system: `You are an expert copywriter for local businesses.
      Business Name: ${business.businessName}
      Industry: ${business.category || "General"}
      Location: ${business.locations?.[0]?.location || "local area"}
      
      Task: Generate a concise, benefit-driven description for the service "${serviceName}".
      Tone: Professional, trustworthy, and engaging.
      Length: 1-2 sentences max.`,
      prompt: `Generate a description for the service: ${serviceName}`,
    });

    await incrementAiUsage(business.id);

    return { success: true, description: object.description };
  } catch (error) {
    console.error("Error generating service description:", error);
    return { success: false, error: "Failed to generate description" };
  }
}

const SuggestedServicesSchema = z.object({
  services: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).describe("List of suggested services"),
});

export async function generateSuggestedServices(count: number = 3) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const business = await getBusinessData();
  if (!business) throw new Error("Business not found");

  // Check usage before generating
  await checkAiUsageLimit({
    businessId: business.id,
    userId,
    currentUsage: business.aiGenerationsCount,
    aiPeriodStart: business.aiPeriodStart,
  });

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: SuggestedServicesSchema,
      system: `You are a business consultant for local service providers.
      Business Name: ${business.businessName}
      Industry: ${business.category || "General"}
      Location: ${business.locations?.[0]?.location || "local area"}
      Existing Services: ${JSON.stringify(business.services || [])}
      
      Task: Suggest ${count} NEW services that this business should offer based on their industry.
      Do NOT duplicate existing services.
      Tone: Professional.`,
      prompt: `Suggest ${count} new services for this business.`,
    });

    await incrementAiUsage(business.id);

    return { success: true, services: object.services };
  } catch (error) {
    console.error("Error generating suggested services:", error);
    return { success: false, error: "Failed to generate suggestions" };
  }
}
