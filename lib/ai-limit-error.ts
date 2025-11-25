import { PlanType } from "@/lib/plan-limits";

const PLAN_LABELS: Record<PlanType, string> = {
  free: "Free",
  starter: "Starter",
  business: "Business",
};

const RESET_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
});

export interface AiUsageLimitErrorParams {
  plan: PlanType;
  limit: number;
  currentUsage: number;
  resetsOn: Date;
}

export class AiUsageLimitError extends Error {
  readonly code = "AI_USAGE_LIMIT";
  readonly plan: PlanType;
  readonly limit: number;
  readonly currentUsage: number;
  readonly resetsOn: string;
  readonly resetsOnLabel: string;

  constructor({ plan, limit, currentUsage, resetsOn }: AiUsageLimitErrorParams) {
    const planLabel = PLAN_LABELS[plan] ?? "Current";
    const resetsOnLabel = RESET_DATE_FORMATTER.format(resetsOn);

    super(
      `You've used all ${limit} AI generations included in your ${planLabel} plan. Upgrade to unlock more requests or wait until ${resetsOnLabel} when your monthly allowance resets.`
    );

    this.name = "AiUsageLimitError";
    this.plan = plan;
    this.limit = limit;
    this.currentUsage = currentUsage;
    this.resetsOn = resetsOn.toISOString();
    this.resetsOnLabel = resetsOnLabel;
    Object.setPrototypeOf(this, AiUsageLimitError.prototype);
  }
}

export function formatAiLimitError(error: AiUsageLimitError) {
  return {
    error: error.message,
    code: error.code,
    plan: error.plan,
    limit: error.limit,
    currentUsage: error.currentUsage,
    resetsOn: error.resetsOn,
    resetsOnLabel: error.resetsOnLabel,
  };
}

