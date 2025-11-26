'use server';

import pool from "@/lib/db";
import { getPlanLimits, PlanType } from "@/lib/plan-limits";
import { getUserPlanType } from "@/actions/user";
import { AiUsageLimitError } from "@/lib/ai-limit-error";

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
  const plan = ((await getUserPlanType(userId)) || "free") as PlanType;
  const limits = getPlanLimits(plan);

  const now = new Date();
  let periodStart = new Date(aiPeriodStart || now);
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  let usageToCheck = currentUsage;

  if (periodStart < oneMonthAgo) {
    usageToCheck = 0;
    periodStart = now;
    await pool.query(
      `UPDATE businesses SET ai_generations_count = 0, ai_period_start = now() WHERE id = $1`,
      [businessId]
    );
  }

  if (usageToCheck >= limits.maxAiGenerations) {
    const nextReset = new Date(periodStart);
    nextReset.setMonth(nextReset.getMonth() + 1);

    throw new AiUsageLimitError({
      plan,
      limit: limits.maxAiGenerations,
      currentUsage: usageToCheck,
      resetsOn: nextReset,
    });
  }

  return { plan, limits, currentUsage: usageToCheck };
}

export async function incrementAiUsage(businessId: string) {
  await pool.query(
    `UPDATE businesses SET ai_generations_count = ai_generations_count + 1 WHERE id = $1`,
    [businessId]
  );
}

