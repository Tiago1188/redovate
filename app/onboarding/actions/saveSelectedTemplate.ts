'use server';

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import pool from "@/lib/db";

export async function saveSelectedTemplate(templateId: string) {
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
        // We want to ensure this template is linked and active
        // First check if it exists
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

        // 4. Note: We are NOT populating business_section_status here.
        // The requirements say: "After the template is selected: Continue to AI generation... Mark all sections...".
        // We assume the AI generation step or a subsequent process handles the section initialization based on the template.
        // However, if the AI generation depends on knowing which sections are pending, we might need to initialize them here.
        // Given the prompt "Mark all sections in business_section_status as pending/completed accordingly" is listed under "After the template is selected",
        // and before "Redirect to /dashboard", it suggests it happens during the flow.
        // I'll initialize them here to be safe, so the AI step knows what to generate.
        
        // Fetch template sections
        const sectionsRes = await pool.query(
            `SELECT id, name FROM template_sections WHERE template_id = $1`,
            [templateId]
        );
        
        // Initialize status for each section
        // We use ON CONFLICT to avoid duplicates if they switch back and forth
        // But wait, business_section_status links to a section_id.
        // If we switch templates, we get new section IDs.
        // So we should probably clean up old status or just add new ones.
        // Since we are switching templates, the old sections might not apply.
        // But we keep history? "business_section_status" links to "template_sections".
        // "template_sections" are specific to a template (foreign key template_id).
        // So yes, we should add entries for the new template's sections.
        
        for (const section of sectionsRes.rows) {
            await pool.query(
                `INSERT INTO business_section_status (business_id, section_id, status)
                 VALUES ($1, $2, 'pending')
                 ON CONFLICT DO NOTHING`, // If already exists for this business+section (unlikely unless re-selecting), leave it
                 [businessId, section.id]
            );
        }

    } catch (error) {
        console.error("Error saving selected template:", error);
        throw new Error("Failed to save template selection");
    }

    // Redirect to the next step
    redirect("/generating");
}

