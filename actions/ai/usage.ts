'use server';

import pool from "@/lib/db";
import { getPlanLimits } from "@/lib/plan-limits";
import { getUserPlanType } from "@/actions/user";

interface AiUsageContext {
  businessId: string;
  userId: string;
  currentUsage: number;
  aiPeriodStart: Date;
}

export async function checkAiUsageLimit({
  businessId,
  userId,
  currentUsage,
  aiPeriodStart,
}: AiUsageContext) {
  const plan = (await getUserPlanType(userId)) || "free";
  const limits = getPlanLimits(plan);

  const now = new Date();
  const periodStart = new Date(aiPeriodStart || now);
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  let usageToCheck = currentUsage;

  if (periodStart < oneMonthAgo) {
    usageToCheck = 0;
    await pool.query(
      `UPDATE businesses SET ai_generations_count = 0, ai_period_start = now() WHERE id = $1`,
      [businessId]
    );
  }

  if (usageToCheck >= limits.maxAiGenerations) {
    throw new Error(`AI generation limit reached for your ${plan} plan. Upgrade to generate more content.`);
  }

  return { plan, limits, currentUsage: usageToCheck };
}

export async function incrementAiUsage(businessId: string) {
  await pool.query(
    `UPDATE businesses SET ai_generations_count = ai_generations_count + 1 WHERE id = $1`,
    [businessId]
  );
}

