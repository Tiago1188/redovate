"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { selectTemplateSchema, updateCustomizationsSchema } from "@/lib/validations";
import type { Template, BusinessTemplate } from "@/types";

export async function getTemplates(): Promise<Template[]> {
  const result = await sql`
    SELECT * FROM templates WHERE status = 'active' ORDER BY name
  `;

  return result as Template[];
}

export async function getTemplateBySlug(slug: string): Promise<Template | null> {
  const result = await sql`
    SELECT * FROM templates WHERE slug = ${slug}
  `;

  return (result[0] as Template) ?? null;
}

export async function getTemplateById(id: string): Promise<Template | null> {
  const result = await sql`
    SELECT * FROM templates WHERE id = ${id}
  `;

  return (result[0] as Template) ?? null;
}

export async function getActiveTemplateForBusiness(
  businessId: string
): Promise<BusinessTemplate | null> {
  const result = await sql`
    SELECT * FROM business_templates 
    WHERE business_id = ${businessId} AND is_active = true
    LIMIT 1
  `;

  return (result[0] as BusinessTemplate) ?? null;
}

export async function selectTemplate(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = selectTemplateSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  const { template_id } = validation.data;

  try {
    // Deactivate any existing active template
    await sql`
      UPDATE business_templates
      SET is_active = false, updated_at = now()
      WHERE business_id = ${businessId} AND is_active = true
    `;

    // Check if this template was previously selected
    const existing = await sql`
      SELECT id FROM business_templates
      WHERE business_id = ${businessId} AND template_id = ${template_id}
    `;

    if (existing.length > 0) {
      // Reactivate existing selection
      await sql`
        UPDATE business_templates
        SET is_active = true, updated_at = now()
        WHERE id = ${existing[0].id}
      `;
    } else {
      // Create new selection
      await sql`
        INSERT INTO business_templates (business_id, template_id, is_active)
        VALUES (${businessId}, ${template_id}, true)
      `;
    }

    return { success: true };
  } catch (error) {
    console.error("Error selecting template:", error);
    return { success: false, error: "Failed to select template" };
  }
}

export async function updateTemplateCustomizations(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = updateCustomizationsSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  try {
    const activeTemplate = await getActiveTemplateForBusiness(businessId);
    if (!activeTemplate) {
      return { success: false, error: "No active template found" };
    }

    const updatedCustomizations = {
      ...activeTemplate.customizations,
      ...validation.data,
    };

    await sql`
      UPDATE business_templates
      SET customizations = ${JSON.stringify(updatedCustomizations)}::jsonb,
          updated_at = now()
      WHERE id = ${activeTemplate.id}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error updating customizations:", error);
    return { success: false, error: "Failed to update customizations" };
  }
}

