'use server';

import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";

export async function assignTemplateToBusiness(templateId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        // 1. Get the user's business ID
        const businessRes = await sql`
            SELECT b.id 
            FROM businesses b
            JOIN users u ON b.user_id = u.id
            WHERE u.clerk_id = ${userId}
            LIMIT 1
        `;

        if (businessRes.length === 0) {
            throw new Error("Business not found");
        }

        const businessId = businessRes[0].id;

        // 2. Deactivate any existing active templates for this business
        await sql`
            UPDATE business_templates 
            SET is_active = false 
            WHERE business_id = ${businessId}
        `;

        // 3. Insert new selection or update existing one
        const existingLink = await sql`
            SELECT id FROM business_templates 
            WHERE business_id = ${businessId} AND template_id = ${templateId}
        `;

        if (existingLink.length > 0) {
            await sql`
                UPDATE business_templates 
                SET is_active = true, updated_at = now() 
                WHERE id = ${existingLink[0].id}
            `;
        } else {
            await sql`
                INSERT INTO business_templates (business_id, template_id, is_active) 
                VALUES (${businessId}, ${templateId}, true)
            `;
        }

        // 4. Fetch sections from template_sections for the template
        const sectionsRes = await sql`
            SELECT id FROM template_sections 
            WHERE template_id = ${templateId} 
            ORDER BY sort_order ASC
        `;

        const sections = sectionsRes;

        // 5. Insert rows in business_section_status
        // Use ON CONFLICT to skip duplicates
        for (const section of sections) {
            await sql`
                INSERT INTO business_section_status (business_id, section_id, status, completion_percent)
                VALUES (${businessId}, ${section.id}, 'missing', 0)
                ON CONFLICT (business_id, section_id) DO NOTHING
            `;
        }

        return { success: true };
    } catch (error) {
        console.error("Error assigning template to business:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to assign template: ${errorMessage}`);
    }
}
