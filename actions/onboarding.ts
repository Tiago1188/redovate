'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import pool from "@/lib/db";
import { onboardingSchema } from "@/validations/onboarding";
import { getStarterPlanCount, getUserPlanType } from "@/actions/user";
import { getPlanLimits, type PlanType } from "@/lib/plan-limits";

export async function completeOnboarding(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Extract form data
    const services: string[] = [];
    const serviceAreas: string[] = [];
    
    formData.forEach((value, key) => {
        if (key === 'services[]') {
            services.push(value.toString());
        } else if (key === 'service-areas[]') {
            serviceAreas.push(value.toString());
        }
    });

    const rawData = {
        accountType: formData.get("account-type"),
        businessName: formData.get("business-name"),
        about: formData.get("about"),
        category: formData.get("category"),
        yearFounded: formData.get("year-founded") || undefined,
        services: services,
        mainLocation: formData.get("main-location"),
        serviceAreas: serviceAreas,
        colorStyle: formData.get("color-style") || "default",
    };

    // Validate data with better error handling
    const validationResult = onboardingSchema.safeParse(rawData);
    
    if (!validationResult.success) {
        const errors = validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
        }));
        return { 
            success: false, 
            error: "Validation failed",
            errors 
        };
    }

    const validatedData = validationResult.data;

    // Get user's plan type and validate against plan limits
    const userPlanType = await getUserPlanType(userId);
    const planType: PlanType = userPlanType || 'free'; // Default to free if not found
    const planLimits = getPlanLimits(planType);

    // Validate services against plan limit
    if (validatedData.services.length > planLimits.maxServices && planLimits.maxServices < 999) {
        return {
            success: false,
            error: `Plan limit exceeded: You can only add up to ${planLimits.maxServices} services on the ${planType} plan. Please remove some services or upgrade your plan.`,
            errors: [{
                field: 'services',
                message: `Maximum ${planLimits.maxServices} services allowed on ${planType} plan`
            }]
        };
    }

    // Validate service areas against plan limit
    if (planLimits.maxServiceAreas === 0 && validatedData.serviceAreas.length > 0) {
        return {
            success: false,
            error: `Plan limit: Service areas are not available on the ${planType} plan. Only the main location is allowed.`,
            errors: [{
                field: 'serviceAreas',
                message: 'Service areas are not available on the free plan. Upgrade to add multiple service areas.'
            }]
        };
    }

    if (validatedData.serviceAreas.length > planLimits.maxServiceAreas && planLimits.maxServiceAreas < 999) {
        return {
            success: false,
            error: `Plan limit exceeded: You can only add up to ${planLimits.maxServiceAreas} service areas on the ${planType} plan.`,
            errors: [{
                field: 'serviceAreas',
                message: `Maximum ${planLimits.maxServiceAreas} service areas allowed on ${planType} plan`
            }]
        };
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Generate a slug from business name
    const slug = validatedData.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Math.floor(Math.random() * 10000);

    // Ensure user exists in our DB first
    try {
        await pool.query(
            `INSERT INTO users (clerk_id, email, full_name) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (clerk_id) DO NOTHING`,
            [userId, user.emailAddresses[0].emailAddress, user.fullName || ""]
        );

        // Get the internal user ID
        const userRes = await pool.query(
            `SELECT id FROM users WHERE clerk_id = $1`,
            [userId]
        );
        const internalUserId = userRes.rows[0]?.id;

        if (!internalUserId) throw new Error("User not found");

        // Check if business already exists for this user
        const existingBusinessRes = await pool.query(
            `SELECT id FROM businesses WHERE user_id = $1 LIMIT 1`,
            [internalUserId]
        );

        let businessId: string;

        // Prepare theme object with color style
        const theme = {
            colorStyle: validatedData.colorStyle,
        };

        // Prepare locations array (main location as primary)
        const locations = validatedData.mainLocation ? [{
            primary: true,
            location: validatedData.mainLocation,
        }] : [];

        if (existingBusinessRes.rows.length > 0) {
            // Update existing business
            businessId = existingBusinessRes.rows[0].id;
            await pool.query(
                `UPDATE businesses 
                 SET business_name = $1, 
                     slug = $2, 
                     business_type = $3,
                     about = $4,
                     category = $5,
                     year_founded = $6,
                     services = '[]'::jsonb,
                     services_raw = $7,
                     locations = $8,
                     service_areas = $9,
                     theme = $10,
                     updated_at = now()
                 WHERE id = $11`,
                [
                    validatedData.businessName,
                    slug,
                    validatedData.accountType,
                    validatedData.about,
                    validatedData.category,
                    validatedData.yearFounded, // This is now number | null
                    JSON.stringify(validatedData.services),
                    JSON.stringify(locations),
                    JSON.stringify(validatedData.serviceAreas),
                    JSON.stringify(theme),
                    businessId,
                ]
            );
        } else {
            // Create new business
            const businessRes = await pool.query(
                `INSERT INTO businesses (
                    user_id, 
                    business_name, 
                    slug, 
                    business_type,
                    about,
                    category,
                    year_founded,
                    services,
                    services_raw,
                    locations,
                    service_areas,
                    theme
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, '[]'::jsonb, $8, $9, $10, $11)
                RETURNING id`,
                [
                    internalUserId,
                    validatedData.businessName,
                    slug,
                    validatedData.accountType,
                    validatedData.about,
                    validatedData.category,
                    validatedData.yearFounded, // This is now number | null
                    JSON.stringify(validatedData.services),
                    JSON.stringify(locations),
                    JSON.stringify(validatedData.serviceAreas),
                    JSON.stringify(theme),
                ]
            );
            businessId = businessRes.rows[0].id;
        }

        // Track starter plan users who completed onboarding
        // Check if user has starter plan and if they're within the first 500 (grandfathered)
        const userPlanRes = await pool.query(
            `SELECT plan_type FROM users WHERE clerk_id = $1`,
            [userId]
        );
        const userPlanType = userPlanRes.rows[0]?.plan_type;

        if (userPlanType === 'starter') {
            // Count how many starter users have completed onboarding (have a business)
            const starterCount = await getStarterPlanCount();
            // Users within first 500 are grandfathered (no action needed now, just tracked)
            // We can check this later when implementing payment logic
            if (starterCount <= 500) {
                console.log(`User ${userId} is within first 500 starter users (count: ${starterCount})`);
            }
        }

        // Update Clerk Metadata
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                businessId: businessId,
                businessType: validatedData.accountType,
            },
        });

        return { success: true };

    } catch (error) {
        console.error("Onboarding error:", error);
        if (error instanceof Error) {
            return { 
                success: false, 
                error: error.message 
            };
        }
        return { 
            success: false, 
            error: "Failed to create or update business" 
        };
    }
}
