'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import pool from "@/lib/db";
import { onboardingSchema } from "@/validations/onboarding";

export async function completeOnboarding(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const rawData = {
        accountType: formData.get("account-type"),
    };

    const validatedData = onboardingSchema.parse(rawData);

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Generate a default business name since we removed the input
    // e.g. "Tiago's Business" or just "My Business" if name is missing
    const defaultBusinessName = user.firstName
        ? `${user.firstName}'s Business`
        : "My Business";

    // Generate a simple slug
    const slug = defaultBusinessName
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

        if (existingBusinessRes.rows.length > 0) {
            // Update existing business
            businessId = existingBusinessRes.rows[0].id;
            await pool.query(
                `UPDATE businesses SET business_type = $1, updated_at = now() WHERE id = $2`,
                [validatedData.accountType, businessId]
            );
        } else {
            // Create new business
            const businessRes = await pool.query(
                `INSERT INTO businesses (user_id, business_name, slug, business_type)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
                [internalUserId, defaultBusinessName, slug, validatedData.accountType]
            );
            businessId = businessRes.rows[0].id;
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
        throw new Error("Failed to create or update business");
    }
}
