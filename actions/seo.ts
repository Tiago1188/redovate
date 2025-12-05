"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { updateSeoSchema, addKeywordSchema } from "@/lib/validations";

export async function getKeywords(businessId: string): Promise<string[]> {
  const result = await sql`
    SELECT keywords FROM businesses WHERE id = ${businessId}
  `;

  return (result[0]?.keywords as string[]) ?? [];
}

export async function addKeyword(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = addKeywordSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  try {
    await sql`
      UPDATE businesses
      SET keywords = keywords || ${JSON.stringify([validation.data.keyword])}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error adding keyword:", error);
    return { success: false, error: "Failed to add keyword" };
  }
}

export async function deleteKeyword(
  businessId: string,
  keyword: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const result = await sql`
      SELECT keywords FROM businesses WHERE id = ${businessId}
    `;

    const keywords = (result[0]?.keywords as string[]) ?? [];
    const filteredKeywords = keywords.filter((k) => k !== keyword);

    await sql`
      UPDATE businesses
      SET keywords = ${JSON.stringify(filteredKeywords)}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error deleting keyword:", error);
    return { success: false, error: "Failed to delete keyword" };
  }
}

export async function updateSeoSettings(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = updateSeoSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  try {
    const result = await sql`
      SELECT site_content FROM businesses WHERE id = ${businessId}
    `;

    const siteContent = (result[0]?.site_content as Record<string, unknown>) ?? {};
    const updatedContent = {
      ...siteContent,
      seo: {
        ...(siteContent.seo as Record<string, unknown> ?? {}),
        ...validation.data,
      },
    };

    await sql`
      UPDATE businesses
      SET site_content = ${JSON.stringify(updatedContent)}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error updating SEO settings:", error);
    return { success: false, error: "Failed to update SEO settings" };
  }
}

