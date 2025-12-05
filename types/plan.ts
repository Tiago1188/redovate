export type PlanType = "free" | "starter" | "business";

export interface PlanLimits {
  maxServices: number;
  maxServiceAreas: number;
  maxKeywords: number;
  maxImages: number;
  maxLocations: number;
  customDomain: boolean;
  removeBranding: boolean;
  customThemes: boolean;
  analyticsIntegration: boolean;
  socialMediaIntegration: boolean;
  maxAiGenerations: number;
}

export interface Plan {
  type: PlanType;
  name: string;
  description: string;
  price: number;
  limits: PlanLimits;
  features: string[];
}

