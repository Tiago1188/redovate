"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { uploadImageSchema } from "@/lib/validations";
import type { BusinessImage } from "@/types";

export async function getImages(businessId: string): Promise<BusinessImage[]> {
  const result = await sql`
    SELECT images FROM businesses WHERE id = ${businessId}
  `;

  return (result[0]?.images as BusinessImage[]) ?? [];
}

export async function addImage(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = uploadImageSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  try {
    const newImage = {
      id: crypto.randomUUID(),
      ...validation.data,
    };

    await sql`
      UPDATE businesses
      SET images = images || ${JSON.stringify([newImage])}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error adding image:", error);
    return { success: false, error: "Failed to add image" };
  }
}

export async function deleteImage(
  businessId: string,
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const result = await sql`
      SELECT images FROM businesses WHERE id = ${businessId}
    `;

    const images = (result[0]?.images as BusinessImage[]) ?? [];
    const filteredImages = images.filter((img) => img.id !== imageId);

    await sql`
      UPDATE businesses
      SET images = ${JSON.stringify(filteredImages)}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: "Failed to delete image" };
  }
}

export async function updateLogo(
  businessId: string,
  logoUrl: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await sql`
      UPDATE businesses
      SET logo = ${logoUrl}, updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error updating logo:", error);
    return { success: false, error: "Failed to update logo" };
  }
}

export async function updateHeroImage(
  businessId: string,
  heroUrl: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await sql`
      UPDATE businesses
      SET hero_image = ${heroUrl}, updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error updating hero image:", error);
    return { success: false, error: "Failed to update hero image" };
  }
}

