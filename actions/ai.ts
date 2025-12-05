"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { generateSectionContent, type GenerateSectionContentParams } from "@/lib/ai/generateSectionContent";
import { PLAN_LIMITS } from "@/constants";
import type { PlanType } from "@/types";

export async function generateContent(
  businessId: string,
  params: Omit<GenerateSectionContentParams, "businessName" | "category">
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get business info and check AI limits
  const result = await sql`
    SELECT 
      b.business_name, 
      b.category, 
      b.about,
      b.services,
      b.service_areas,
      b.ai_generations_count,
      b.plan_type
    FROM businesses b
    JOIN users u ON b.user_id = u.id
    WHERE b.id = ${businessId} AND u.clerk_id = ${userId}
  `;

  if (result.length === 0) {
    throw new Error("Business not found");
  }

  const business = result[0];
  const planType = business.plan_type as PlanType;
  const limit = PLAN_LIMITS[planType].maxAiGenerations;

  if (business.ai_generations_count >= limit) {
    throw new Error(`AI generation limit reached. Upgrade your plan for more generations.`);
  }

  // Generate content
  const content = await generateSectionContent({
    ...params,
    businessName: business.business_name,
    category: business.category ?? "business",
    about: business.about,
    services: (business.services as { name: string }[])?.map(s => s.name),
    serviceAreas: (business.service_areas as { name: string }[])?.map(a => a.name),
  });

  // Increment usage counter
  await sql`
    UPDATE businesses
    SET ai_generations_count = ai_generations_count + 1,
        updated_at = now()
    WHERE id = ${businessId}
  `;

  return content;
}

export async function getAIUsage(businessId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await sql`
    SELECT 
      b.ai_generations_count,
      b.ai_period_start,
      b.plan_type
    FROM businesses b
    JOIN users u ON b.user_id = u.id
    WHERE b.id = ${businessId} AND u.clerk_id = ${userId}
  `;

  if (result.length === 0) {
    throw new Error("Business not found");
  }

  const { ai_generations_count, ai_period_start, plan_type } = result[0];
  const limit = PLAN_LIMITS[plan_type as PlanType].maxAiGenerations;

  return {
    used: ai_generations_count as number,
    limit,
    remaining: Math.max(0, limit - (ai_generations_count as number)),
    periodStart: ai_period_start as Date,
    planType: plan_type as PlanType,
  };
}

export async function resetAIUsage(businessId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // This would typically be called by a cron job or billing webhook
  await sql`
    UPDATE businesses
    SET ai_generations_count = 0,
        ai_period_start = now(),
        updated_at = now()
    WHERE id = ${businessId}
  `;

  return { success: true };
}

