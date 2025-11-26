'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import sql from "@/lib/db";
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
        const email = user.emailAddresses[0].emailAddress;
        const fullName = user.fullName || "";

        await sql`
            INSERT INTO users (clerk_id, email, full_name) 
            VALUES (${userId}, ${email}, ${fullName}) 
            ON CONFLICT (clerk_id) DO NOTHING
        `;

        // Get the internal user ID
        const userRes = await sql`
            SELECT id FROM users WHERE clerk_id = ${userId}
        `;
        const internalUserId = userRes[0]?.id;

        if (!internalUserId) throw new Error("User not found");

        // Check if business already exists for this user
        const existingBusinessRes = await sql`
            SELECT id FROM businesses WHERE user_id = ${internalUserId} LIMIT 1
        `;

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

        // Prepare JSON strings for JSONB columns
        const servicesJson = JSON.stringify(validatedData.services);
        const locationsJson = JSON.stringify(locations);
        const serviceAreasJson = JSON.stringify(validatedData.serviceAreas);
        const themeJson = JSON.stringify(theme);

        if (existingBusinessRes.length > 0) {
            // Update existing business
            businessId = existingBusinessRes[0].id;
            await sql`
                UPDATE businesses 
                SET business_name = ${validatedData.businessName}, 
                    slug = ${slug}, 
                    business_type = ${validatedData.accountType},
                    about = ${validatedData.about},
                    category = ${validatedData.category},
                    year_founded = ${validatedData.yearFounded},
                    services = '[]'::jsonb,
                    services_raw = ${servicesJson},
                    locations = ${locationsJson},
                    service_areas = ${serviceAreasJson},
                    theme = ${themeJson},
                    updated_at = now()
                WHERE id = ${businessId}
            `;
        } else {
            // Create new business
            const businessRes = await sql`
                INSERT INTO businesses (
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
                VALUES (
                    ${internalUserId}, 
                    ${validatedData.businessName}, 
                    ${slug}, 
                    ${validatedData.accountType}, 
                    ${validatedData.about}, 
                    ${validatedData.category}, 
                    ${validatedData.yearFounded}, 
                    '[]'::jsonb, 
                    ${servicesJson}, 
                    ${locationsJson}, 
                    ${serviceAreasJson}, 
                    ${themeJson}
                )
                RETURNING id
            `;
            businessId = businessRes[0].id;
        }

        // Track starter plan users who completed onboarding
        // Check if user has starter plan and if they're within the first 500 (grandfathered)
        const userPlanRes = await sql`
            SELECT plan_type FROM users WHERE clerk_id = ${userId}
        `;
        const userPlanType = userPlanRes[0]?.plan_type;

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
