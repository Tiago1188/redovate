"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { serviceAreaSchema } from "@/lib/validations";
import type { ServiceArea } from "@/types";

export async function getServiceAreas(businessId: string): Promise<ServiceArea[]> {
  const result = await sql`
    SELECT service_areas FROM businesses WHERE id = ${businessId}
  `;

  return (result[0]?.service_areas as ServiceArea[]) ?? [];
}

export async function addServiceArea(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = serviceAreaSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  try {
    const newArea = {
      id: crypto.randomUUID(),
      ...validation.data,
    };

    await sql`
      UPDATE businesses
      SET service_areas = service_areas || ${JSON.stringify([newArea])}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error adding service area:", error);
    return { success: false, error: "Failed to add service area" };
  }
}

export async function updateServiceArea(
  businessId: string,
  areaId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = serviceAreaSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  try {
    const result = await sql`
      SELECT service_areas FROM businesses WHERE id = ${businessId}
    `;

    const areas = (result[0]?.service_areas as ServiceArea[]) ?? [];
    const updatedAreas = areas.map((area) =>
      area.id === areaId ? { ...area, ...validation.data } : area
    );

    await sql`
      UPDATE businesses
      SET service_areas = ${JSON.stringify(updatedAreas)}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error updating service area:", error);
    return { success: false, error: "Failed to update service area" };
  }
}

export async function deleteServiceArea(
  businessId: string,
  areaId: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const result = await sql`
      SELECT service_areas FROM businesses WHERE id = ${businessId}
    `;

    const areas = (result[0]?.service_areas as ServiceArea[]) ?? [];
    const filteredAreas = areas.filter((a) => a.id !== areaId);

    await sql`
      UPDATE businesses
      SET service_areas = ${JSON.stringify(filteredAreas)}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error deleting service area:", error);
    return { success: false, error: "Failed to delete service area" };
  }
}

