"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { createServiceSchema, updateServiceSchema } from "@/lib/validations";
import type { Service } from "@/types";

export async function getServices(businessId: string): Promise<Service[]> {
  const result = await sql`
    SELECT services FROM businesses WHERE id = ${businessId}
  `;

  return (result[0]?.services as Service[]) ?? [];
}

export async function addService(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = createServiceSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  try {
    const newService = {
      id: crypto.randomUUID(),
      ...validation.data,
    };

    await sql`
      UPDATE businesses
      SET services = services || ${JSON.stringify([newService])}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error adding service:", error);
    return { success: false, error: "Failed to add service" };
  }
}

export async function updateService(
  businessId: string,
  serviceId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = updateServiceSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  try {
    const result = await sql`
      SELECT services FROM businesses WHERE id = ${businessId}
    `;

    const services = (result[0]?.services as Service[]) ?? [];
    const updatedServices = services.map((service) =>
      service.id === serviceId ? { ...service, ...validation.data } : service
    );

    await sql`
      UPDATE businesses
      SET services = ${JSON.stringify(updatedServices)}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: "Failed to update service" };
  }
}

export async function deleteService(
  businessId: string,
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const result = await sql`
      SELECT services FROM businesses WHERE id = ${businessId}
    `;

    const services = (result[0]?.services as Service[]) ?? [];
    const filteredServices = services.filter((s) => s.id !== serviceId);

    await sql`
      UPDATE businesses
      SET services = ${JSON.stringify(filteredServices)}::jsonb,
          updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Failed to delete service" };
  }
}

