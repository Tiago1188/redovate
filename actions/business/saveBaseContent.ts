'use server';

import { neon } from '@neondatabase/serverless';
import { auth } from '@clerk/nextjs/server';
import { BaseWebsiteContent } from '@/lib/content/base-website-content';
import { getPlanLimits, exceedsLimit } from '@/lib/plan-limits';
import { z } from 'zod';

const sql = neon(process.env.DATABASE_URL!);

// Validation Schema
const baseContentSchema = z.object({
    businessName: z.string().min(1, "Business name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    // Add other validations as needed, keeping it flexible for now
});

export async function saveBaseContent(content: Partial<BaseWebsiteContent>) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // Get user and business
    const userResult = await sql`
    SELECT id, plan_type FROM users WHERE clerk_id = ${userId}
  `;
    if (userResult.length === 0) throw new Error('User not found');
    const user = userResult[0];

    const businessResult = await sql`
    SELECT id, base_content, business_name, email, phone FROM businesses WHERE user_id = ${user.id}
  `;
    if (businessResult.length === 0) throw new Error('Business not found');
    const business = businessResult[0];

    // Validate ONLY the fields being updated
    // We use partial() so that missing fields in the update don't cause errors
    const validated = baseContentSchema.partial().parse(content);

    // Enforce Plan Limits
    const planType = user.plan_type as 'free' | 'starter' | 'business';
    const limits = getPlanLimits(planType);

    const currentContent = business.base_content || {};

    if (content.services && content.services.length > limits.maxServices) {
        throw new Error(`Plan limit exceeded: You can only have ${limits.maxServices} services.`);
    }

    // Check Service Areas Limit
    if (content.serviceAreas && content.serviceAreas.length > limits.maxServiceAreas && limits.maxServiceAreas > 0) {
        // Note: maxServiceAreas 0 means only main location allowed, handled by UI usually but good to check
        if (limits.maxServiceAreas === 0 && content.serviceAreas.length > 0) {
            throw new Error(`Plan limit exceeded: Your plan does not support additional service areas.`);
        } else if (limits.maxServiceAreas > 0) {
            throw new Error(`Plan limit exceeded: You can only have ${limits.maxServiceAreas} service areas.`);
        }
    }

    // Check Gallery Images Limit (approximate check on gallery array)
    if (content.gallery && content.gallery.length > limits.maxImages) {
        throw new Error(`Plan limit exceeded: You can only have ${limits.maxImages} gallery images.`);
    }

    // Merge with existing base_content to avoid overwriting missing fields if partial update
    // currentContent is already defined above
    const newContent = {
        ...currentContent,
        ...content,
    };

    // Save to database
    await sql`
    UPDATE businesses
    SET base_content = ${JSON.stringify(newContent)},
        updated_at = now()
    WHERE id = ${business.id}
  `;

    // Also sync back to legacy fields for backward compatibility if needed
    // For now, we primarily rely on base_content, but keeping core fields in sync is good practice
    if (content.businessName) {
        await sql`UPDATE businesses SET business_name = ${content.businessName} WHERE id = ${business.id}`;
    }
    if (content.phone) {
        await sql`UPDATE businesses SET phone = ${content.phone} WHERE id = ${business.id}`;
    }
    if (content.email) {
        await sql`UPDATE businesses SET email = ${content.email} WHERE id = ${business.id}`;
    }

    return { success: true, data: newContent };
}
