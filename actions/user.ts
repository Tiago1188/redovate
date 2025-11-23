'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export interface OnboardingStatus {
    hasValidAccountType: boolean;
    businessId: string | null;
    businessType: string | null;
}

/**
 * Select a plan for the current user
 * Creates user record if it doesn't exist, or updates existing plan
 */
export async function selectPlan(planType: 'free' | 'starter') {
    const { userId } = await auth();

    if (!userId) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        // Ensure user exists in our DB (create if needed, update plan if exists)
        await pool.query(
            `INSERT INTO users (clerk_id, email, full_name, plan_type) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (clerk_id) 
             DO UPDATE SET plan_type = $4, updated_at = now()`,
            [
                userId,
                user.emailAddresses[0].emailAddress,
                user.fullName || "",
                planType
            ]
        );

        return { success: true };
    } catch (error) {
        console.error('Error selecting plan:', error);
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: false,
            error: "Failed to select plan"
        };
    }
}

/**
 * Check if the current user has selected a plan
 * Returns true if user exists in database (which means they've selected a plan)
 */
export async function hasSelectedPlan(userId?: string): Promise<boolean> {
    const authResult = userId ? { userId } : await auth();
    const clerkUserId = userId || authResult.userId;

    if (!clerkUserId) {
        return false;
    }

    try {
        const userRes = await pool.query(
            `SELECT id FROM users WHERE clerk_id = $1 LIMIT 1`,
            [clerkUserId]
        );

        // User exists in DB means they've selected a plan
        return userRes.rows.length > 0;
    } catch (error) {
        console.error('Error checking plan selection:', error);
        return false;
    }
}

/**
 * Get count of users with starter plan who have completed onboarding
 * (i.e., have a business record)
 */
export async function getStarterPlanCount(): Promise<number> {
    try {
        const result = await pool.query(
            `SELECT COUNT(DISTINCT u.id) as count
             FROM users u
             INNER JOIN businesses b ON b.user_id = u.id
             WHERE u.plan_type = 'starter'`,
            []
        );

        return parseInt(result.rows[0]?.count || '0', 10);
    } catch (error) {
        console.error('Error getting starter plan count:', error);
        return 0;
    }
}

/**
 * Get the current user's plan type
 * Resolves to the highest plan type found between 'users' and 'businesses' tables
 * to handle potential data inconsistencies.
 */
export async function getUserPlanType(userId?: string): Promise<'free' | 'starter' | 'business' | null> {
    const authResult = userId ? { userId } : await auth();
    const clerkUserId = userId || authResult.userId;

    if (!clerkUserId) {
        return null;
    }

    try {
        // Check both tables for the plan type
        const result = await pool.query(
            `SELECT u.plan_type as user_plan, b.plan_type as business_plan
             FROM users u
             LEFT JOIN businesses b ON b.user_id = u.id
             WHERE u.clerk_id = $1
             LIMIT 1`,
            [clerkUserId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const userPlan = result.rows[0].user_plan;
        const businessPlan = result.rows[0].business_plan;

        // Determine the highest plan
        // Plan hierarchy: business > starter > free
        
        const planWeight = (p: string | null) => {
            if (p === 'business') return 3;
            if (p === 'starter') return 2;
            if (p === 'free') return 1;
            return 0;
        };

        const userWeight = planWeight(userPlan);
        const businessWeight = planWeight(businessPlan);

        if (businessWeight > userWeight) {
            return businessPlan as 'free' | 'starter' | 'business';
        }

        return userPlan as 'free' | 'starter' | 'business' | null;
    } catch (error) {
        console.error('Error getting user plan type:', error);
        return null;
    }
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
