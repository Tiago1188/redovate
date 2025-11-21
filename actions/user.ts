'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export interface OnboardingStatus {
    hasValidAccountType: boolean;
    businessId: string | null;
    businessType: string | null;
}

/**
 * Check if a user has completed onboarding by querying the database
 * This can be used in middleware or other server-side code
 */
export async function getUserOnboardingStatus(userId?: string): Promise<OnboardingStatus> {
    // If userId is not provided, get it from auth
    const authResult = userId ? { userId } : await auth();
    const clerkUserId = userId || authResult.userId;

    if (!clerkUserId) {
        return {
            hasValidAccountType: false,
            businessId: null,
            businessType: null,
        };
    }

    try {
        // Get user's business from database
        const userRes = await pool.query(
            `SELECT b.id, b.business_type 
             FROM users u
             LEFT JOIN businesses b ON b.user_id = u.id
             WHERE u.clerk_id = $1
             LIMIT 1`,
            [clerkUserId]
        );

        // If user exists in database and has a business
        if (userRes.rows.length > 0) {
            const businessIdValue = userRes.rows[0].id;
            const businessType = userRes.rows[0].business_type;

            // User has valid account type only if:
            // 1. They have a business (businessId is not null)
            // 2. The business_type is either 'sole_trader' or 'company'
            if (businessIdValue && (businessType === 'sole_trader' || businessType === 'company')) {
                return {
                    hasValidAccountType: true,
                    businessId: businessIdValue,
                    businessType: businessType,
                };
            }
        }

        // User doesn't exist, has no business, or invalid business_type
        return {
            hasValidAccountType: false,
            businessId: null,
            businessType: null,
        };
    } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, assume invalid for safety
        return {
            hasValidAccountType: false,
            businessId: null,
            businessType: null,
        };
    }
}

