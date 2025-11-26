'use server';

import { auth } from "@clerk/nextjs/server";
import sql from "@/lib/db";
import { getUserPlanType } from "@/actions/user";

export async function getTemplateBySlug(slug: string) {
    try {
        const result = await sql`
            SELECT * FROM templates WHERE slug = ${slug} AND status = 'active' LIMIT 1
        `;

        if (result.length === 0) {
            return null;
        }

        return result[0];
    } catch (error) {
        console.error('Error fetching template by slug:', error);
        return null;
    }
}

export async function getActiveTemplate() {
    const { userId } = await auth();
    if (!userId) return null;

    try {
        const result = await sql`
            SELECT t.* 
            FROM templates t
            JOIN business_templates bt ON t.id = bt.template_id
            JOIN businesses b ON bt.business_id = b.id
            JOIN users u ON b.user_id = u.id
            WHERE u.clerk_id = ${userId} AND bt.is_active = true
            LIMIT 1
        `;

        if (result.length === 0) {
            return null;
        }
        return result[0];
    } catch (error) {
        console.error('Error fetching active template:', error);
        return null;
    }
}

export async function getTemplatesByPlan() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const planType = await getUserPlanType(userId);
    const userPlan = planType || 'free';

    try {
        let result;
        if (userPlan === 'free') {
            result = await sql`
                SELECT id, name, slug, thumbnail, description, plan_level, fake_content
                FROM templates
                WHERE status = 'active' AND plan_level = 'free'
                ORDER BY created_at DESC
            `;
        } else if (userPlan === 'starter') {
            result = await sql`
                SELECT id, name, slug, thumbnail, description, plan_level, fake_content
                FROM templates
                WHERE status = 'active' AND plan_level IN ('free', 'starter')
                ORDER BY created_at DESC
            `;
        } else {
            // business plan sees all
            result = await sql`
                SELECT id, name, slug, thumbnail, description, plan_level, fake_content
                FROM templates
                WHERE status = 'active'
                ORDER BY created_at DESC
            `;
        }
        return result;
    } catch (error) {
        console.error('Error fetching templates:', error);
        return [];
    }
}

export async function saveSelectedTemplate(templateId: string, customizations?: { theme?: string, font?: string }) {
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
        // We want to ensure this template is linked and active
        // First check if it exists
        const existingLink = await sql`
            SELECT id FROM business_templates 
            WHERE business_id = ${businessId} AND template_id = ${templateId}
        `;

        // Save customizations to businesses.theme if provided
        if (customizations && (customizations.theme || customizations.font)) {
            const themeData = {
                font: customizations.font,
                themeId: customizations.theme
            };

            await sql`
                UPDATE businesses 
                SET theme = ${JSON.stringify(themeData)}, updated_at = now() 
                WHERE id = ${businessId}
            `;
        }

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

        // 4. Initialize section status based on template components
        // With the new component-based system, we use the components JSON array
        // First, get the template to access its components
        const templateRes = await sql`
            SELECT components FROM templates WHERE id = ${templateId}
        `;

        if (templateRes.length === 0) {
            throw new Error("Template not found");
        }

        const template = templateRes[0];
        const components = Array.isArray(template.components)
            ? template.components
            : (typeof template.components === 'string' ? JSON.parse(template.components || "[]") : []);

        // If no components, that's okay - just skip section initialization
        if (!components || components.length === 0) {
            console.log("Template has no components, skipping section initialization");
            return { success: true };
        }

        // Clean up old section statuses for this business (from previous template)
        // Get all section IDs for the old template
        const oldBusinessTemplateRes = await sql`
            SELECT template_id FROM business_templates 
            WHERE business_id = ${businessId} AND is_active = false
            ORDER BY updated_at DESC LIMIT 1
        `;

        if (oldBusinessTemplateRes.length > 0) {
            const oldTemplateId = oldBusinessTemplateRes[0].template_id;
            await sql`
                DELETE FROM business_section_status 
                WHERE business_id = ${businessId} 
                AND section_id IN (
                    SELECT id FROM template_sections WHERE template_id = ${oldTemplateId}
                )
            `;
        }

        // For each component type, ensure we have a template_section entry
        // and then create business_section_status
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (!component || !component.type) continue;

            // Get or create template_section entry
            let sectionRes = await sql`
                SELECT id FROM template_sections 
                WHERE template_id = ${templateId} AND name = ${component.type} 
                LIMIT 1
            `;

            let sectionId: string;
            if (sectionRes.length === 0) {
                // Create the section entry
                const insertRes = await sql`
                    INSERT INTO template_sections (template_id, name, label, sort_order)
                    VALUES (${templateId}, ${component.type}, ${component.type}, ${i})
                    RETURNING id
                `;
                sectionId = insertRes[0].id;
            } else {
                sectionId = sectionRes[0].id;
            }

            // Delete any existing status for this business+section (in case of re-selection)
            await sql`
                DELETE FROM business_section_status 
                WHERE business_id = ${businessId} AND section_id = ${sectionId}
            `;

            // Insert new status
            await sql`
                INSERT INTO business_section_status (business_id, section_id, status)
                VALUES (${businessId}, ${sectionId}, 'pending')
            `;
        }

    } catch (error) {
        console.error("Error saving selected template:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to save template selection: ${errorMessage}`);
    }

    return { success: true };
}
