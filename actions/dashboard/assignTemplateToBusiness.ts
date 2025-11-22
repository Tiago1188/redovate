'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export async function assignTemplateToBusiness(templateId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        // 1. Get the user's business ID
        const businessRes = await pool.query(
            `SELECT b.id 
             FROM businesses b
             JOIN users u ON b.user_id = u.id
             WHERE u.clerk_id = $1
             LIMIT 1`,
            [userId]
        );

        if (businessRes.rows.length === 0) {
            throw new Error("Business not found");
        }

        const businessId = businessRes.rows[0].id;

        // 2. Deactivate any existing active templates for this business
        await pool.query(
            `UPDATE business_templates 
             SET is_active = false 
             WHERE business_id = $1`,
            [businessId]
        );

        // 3. Insert new selection or update existing one
        const existingLink = await pool.query(
            `SELECT id FROM business_templates 
             WHERE business_id = $1 AND template_id = $2`,
            [businessId, templateId]
        );

        if (existingLink.rows.length > 0) {
            await pool.query(
                `UPDATE business_templates 
                 SET is_active = true, updated_at = now() 
                 WHERE id = $1`,
                [existingLink.rows[0].id]
            );
        } else {
            await pool.query(
                `INSERT INTO business_templates (business_id, template_id, is_active) 
                 VALUES ($1, $2, true)`,
                [businessId, templateId]
            );
        }

        // 4. Fetch sections from template_sections for the template
        const sectionsRes = await pool.query(
            `SELECT id FROM template_sections 
             WHERE template_id = $1 
             ORDER BY sort_order ASC`,
            [templateId]
        );

        const sections = sectionsRes.rows;

        // 5. Insert rows in business_section_status
        // Use ON CONFLICT to skip duplicates
        for (const section of sections) {
            await pool.query(
                `INSERT INTO business_section_status (business_id, section_id, status, completion_percent)
                 VALUES ($1, $2, 'missing', 0)
                 ON CONFLICT (business_id, section_id) DO NOTHING`,
                [businessId, section.id]
            );
        }

        return { success: true };
    } catch (error) {
        console.error("Error assigning template to business:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to assign template: ${errorMessage}`);
    }
}

