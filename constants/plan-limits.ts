import type { PlanType, PlanLimits, Plan } from "@/types";

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxServices: 5,
    maxServiceAreas: 1,
    maxKeywords: 5,
    maxImages: 1,
    maxLocations: 1,
    customDomain: false,
    removeBranding: false,
    customThemes: false,
    analyticsIntegration: false,
    socialMediaIntegration: false,
    maxAiGenerations: 10,
  },
  starter: {
    maxServices: 15,
    maxServiceAreas: 5,
    maxKeywords: 15,
    maxImages: 15,
    maxLocations: 1,
    customDomain: true,
    removeBranding: true,
    customThemes: true,
    analyticsIntegration: true,
    socialMediaIntegration: true,
    maxAiGenerations: 75,
  },
  business: {
    maxServices: 999,
    maxServiceAreas: 999,
    maxKeywords: 999,
    maxImages: 999,
    maxLocations: 999,
    customDomain: true,
    removeBranding: true,
    customThemes: true,
    analyticsIntegration: true,
    socialMediaIntegration: true,
    maxAiGenerations: 999,
  },
};

export const PLANS: Plan[] = [
  {
    type: "free",
    name: "Free",
    description: "Get started with a basic website",
    price: 0,
    limits: PLAN_LIMITS.free,
    features: [
      "1 business website",
      "Up to 5 services",
      "1 service area",
      "10 AI generations",
      "Redovate subdomain",
    ],
  },
  {
    type: "starter",
    name: "Starter",
    description: "Perfect for growing businesses",
    price: 19,
    limits: PLAN_LIMITS.starter,
    features: [
      "Everything in Free",
      "Up to 15 services",
      "5 service areas",
      "75 AI generations",
      "Custom domain",
      "Remove branding",
      "Custom themes",
      "Analytics integration",
    ],
  },
  {
    type: "business",
    name: "Business",
    description: "For established businesses",
    price: 49,
    limits: PLAN_LIMITS.business,
    features: [
      "Everything in Starter",
      "Unlimited services",
      "Unlimited service areas",
      "Unlimited AI generations",
      "Multiple locations",
      "Priority support",
    ],
  },
];

export function getPlanLimits(planType: PlanType): PlanLimits {
  return PLAN_LIMITS[planType];
}

export function canAccessFeature(
  planType: PlanType,
  feature: keyof PlanLimits
): boolean {
  const limits = PLAN_LIMITS[planType];
  const value = limits[feature];
  return typeof value === "boolean" ? value : true;
}

export function isWithinLimit(
  planType: PlanType,
  feature: keyof PlanLimits,
  currentCount: number
): boolean {
  const limits = PLAN_LIMITS[planType];
  const limit = limits[feature];
  if (typeof limit === "number") {
    return currentCount < limit;
  }
  return true;
}

