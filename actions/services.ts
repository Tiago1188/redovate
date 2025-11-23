'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getBusinessData } from "@/actions/business";
import { getPlanLimits, exceedsLimit } from "@/lib/plan-limits";
import { getUserPlanType } from "@/actions/user";

const ServiceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;

export async function getServices() {
  const { userId } = await auth();
  if (!userId) return [];

  const business = await getBusinessData();
  if (!business) return [];

  // Ensure services are in the correct format
  const services = Array.isArray(business.services) ? business.services : [];
  
  // Map to ensure ID exists (for legacy data)
  return services.map((s: any) => ({
    id: s.id || crypto.randomUUID(),
    title: s.title || s.name || "",
    description: s.description || "",
    price: s.price || ""
  })) as Service[];
}

export async function addService(serviceData: Omit<Service, "id">) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const business = await getBusinessData();
  if (!business) throw new Error("Business not found");

  const planType = await getUserPlanType(userId) || "free";
  const services = await getServices();

  if (exceedsLimit(planType, "maxServices", services.length + 1)) {
    throw new Error("Plan limit reached. Upgrade to add more services.");
  }

  const newService: Service = {
    id: crypto.randomUUID(),
    ...serviceData
  };

  const updatedServices = [...services, newService];

  await pool.query(
    `UPDATE businesses SET services = $1, updated_at = now() WHERE id = $2`,
    [JSON.stringify(updatedServices), business.id]
  );

  revalidatePath("/dashboard/services");
  return { success: true, service: newService };
}

export async function updateService(id: string, serviceData: Partial<Service>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const business = await getBusinessData();
  if (!business) throw new Error("Business not found");

  const services = await getServices();
  const index = services.findIndex(s => s.id === id);

  if (index === -1) throw new Error("Service not found");

  const updatedServices = [...services];
  updatedServices[index] = { ...updatedServices[index], ...serviceData };

  await pool.query(
    `UPDATE businesses SET services = $1, updated_at = now() WHERE id = $2`,
    [JSON.stringify(updatedServices), business.id]
  );

  revalidatePath("/dashboard/services");
  return { success: true, service: updatedServices[index] };
}

export async function deleteService(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const business = await getBusinessData();
  if (!business) throw new Error("Business not found");

  const services = await getServices();
  const updatedServices = services.filter(s => s.id !== id);

  await pool.query(
    `UPDATE businesses SET services = $1, updated_at = now() WHERE id = $2`,
    [JSON.stringify(updatedServices), business.id]
  );

  revalidatePath("/dashboard/services");
  return { success: true };
}

