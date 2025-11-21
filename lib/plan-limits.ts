/**
 * Plan limits configuration
 * Defines the maximum values for different features based on plan type
 */

export type PlanType = 'free' | 'starter' | 'business';

export interface PlanLimits {
    maxServices: number;
    maxServiceAreas: number; // 0 means only main location allowed, no additional service areas
    maxKeywords: number;
    maxImages: number;
    maxLocations: number;
    customDomain: boolean;
    removeBranding: boolean;
    customThemes: boolean;
    analyticsIntegration: boolean;
    socialMediaIntegration: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    free: {
        maxServices: 5,
        maxServiceAreas: 0, // Only main location allowed, no additional service areas
        maxKeywords: 5,
        maxImages: 1,
        maxLocations: 1,
        customDomain: false,
        removeBranding: false,
        customThemes: false,
        analyticsIntegration: false,
        socialMediaIntegration: false,
    },
    starter: {
        maxServices: 15,
        maxServiceAreas: 100, // Unlimited for practical purposes
        maxKeywords: 15,
        maxImages: 999, // Unlimited for practical purposes
        maxLocations: 100, // Unlimited for practical purposes
        customDomain: true,
        removeBranding: true,
        customThemes: true,
        analyticsIntegration: true,
        socialMediaIntegration: true,
    },
    business: {
        maxServices: 999, // Unlimited
        maxServiceAreas: 999, // Unlimited
        maxKeywords: 999, // Unlimited
        maxImages: 999, // Unlimited
        maxLocations: 999, // Unlimited
        customDomain: true,
        removeBranding: true,
        customThemes: true,
        analyticsIntegration: true,
        socialMediaIntegration: true,
    },
};

/**
 * Get plan limits for a given plan type
 */
export function getPlanLimits(planType: PlanType): PlanLimits {
    return PLAN_LIMITS[planType];
}

/**
 * Check if a value exceeds the plan limit
 */
export function exceedsLimit(
    planType: PlanType,
    limitKey: keyof PlanLimits,
    currentValue: number
): boolean {
    const limits = getPlanLimits(planType);
    const limit = limits[limitKey];
    
    if (typeof limit !== 'number') {
        return false;
    }
    
    // If limit is 999 or above, treat as unlimited
    if (limit >= 999) {
        return false;
    }
    
    return currentValue > limit;
}

/**
 * Get the maximum allowed value for a limit
 */
export function getMaxAllowed(planType: PlanType, limitKey: keyof PlanLimits): number | null {
    const limits = getPlanLimits(planType);
    const limit = limits[limitKey];
    
    if (typeof limit !== 'number') {
        return null;
    }
    
    // If limit is 999 or above, return null (unlimited)
    if (limit >= 999) {
        return null;
    }
    
    return limit;
}

