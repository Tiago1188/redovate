"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { updateBusinessSchema } from "@/lib/validations";
import type { Business } from "@/types";

export async function getBusinessForUser(): Promise<Business | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const result = await sql`
    SELECT b.* FROM businesses b
    JOIN users u ON b.user_id = u.id
    WHERE u.clerk_id = ${userId}
    LIMIT 1
  `;

  return result[0] as Business | null;
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const result = await sql`
    SELECT * FROM businesses WHERE slug = ${slug}
  `;

  return result[0] as Business | null;
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const result = await sql`
    SELECT * FROM businesses WHERE id = ${id}
  `;

  return result[0] as Business | null;
}

export async function updateBusiness(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = updateBusinessSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  const validData = validation.data;

  try {
    // Verify ownership
    const business = await sql`
      SELECT b.id FROM businesses b
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ${businessId} AND u.clerk_id = ${userId}
    `;

    if (business.length === 0) {
      return { success: false, error: "Business not found" };
    }

    // Update individual fields
    const { 
      business_name, 
      trading_name, 
      abn, 
      category, 
      tagline, 
      about, 
      year_founded,
      email,
      phone,
      mobile,
      logo,
      hero_image
    } = validData;

    await sql`
      UPDATE businesses 
      SET 
        business_name = COALESCE(${business_name ?? null}, business_name),
        trading_name = COALESCE(${trading_name ?? null}, trading_name),
        abn = COALESCE(${abn ?? null}, abn),
        category = COALESCE(${category ?? null}, category),
        tagline = COALESCE(${tagline ?? null}, tagline),
        about = COALESCE(${about ?? null}, about),
        year_founded = COALESCE(${year_founded ?? null}, year_founded),
        email = COALESCE(${email ?? null}, email),
        phone = COALESCE(${phone ?? null}, phone),
        mobile = COALESCE(${mobile ?? null}, mobile),
        logo = COALESCE(${logo ?? null}, logo),
        hero_image = COALESCE(${hero_image ?? null}, hero_image),
        updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error updating business:", error);
    return { success: false, error: "Failed to update business" };
  }
}

export async function deleteBusiness(
  businessId: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const result = await sql`
      DELETE FROM businesses b
      USING users u
      WHERE b.user_id = u.id 
      AND b.id = ${businessId} 
      AND u.clerk_id = ${userId}
      RETURNING b.id
    `;

    if (result.length === 0) {
      return { success: false, error: "Business not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting business:", error);
    return { success: false, error: "Failed to delete business" };
  }
}

