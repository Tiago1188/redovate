'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import pool from "@/lib/db";

const onboardingSchema = z.object({
    businessName: z.string().min(2, "Business name must be at least 2 characters"),
    accountType: z.enum(["sole_trader", "company"]),
});

export async function completeOnboarding(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const rawData = {
        businessName: formData.get("business-name"),
        accountType: formData.get("account-type"),
    };

    const validatedData = onboardingSchema.parse(rawData);

    // Generate a simple slug from the business name
    const slug = validatedData.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Math.floor(Math.random() * 10000);

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Ensure user exists in our DB first
    // We try to insert the user if they don't exist (idempotent-ish)
    // In a real app, we might use webhooks to sync users, but for now we ensure it here.
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

        // Create the business
        const businessRes = await pool.query(
            `INSERT INTO businesses (user_id, business_name, slug, business_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
            [internalUserId, validatedData.businessName, slug, validatedData.accountType]
        );

        const businessId = businessRes.rows[0].id;

        // Update Clerk Metadata
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                businessId: businessId,
                businessType: validatedData.accountType,
            },
        });

    } catch (error) {
        console.error("Onboarding error:", error);
        throw new Error("Failed to create business");
    }

    redirect("/dashboard");
}
