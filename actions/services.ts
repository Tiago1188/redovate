'use server';

import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getBusinessData } from "@/actions/business";
import { exceedsLimit } from "@/lib/plan-limits";
import { getUserPlanType } from "@/actions/user";

import { ServiceSchema, type Service } from "@/validations/services";

export { type Service };

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

  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    UPDATE businesses 
    SET services = ${JSON.stringify(updatedServices)}, updated_at = now() 
    WHERE id = ${business.id}
  `;

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

  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    UPDATE businesses 
    SET services = ${JSON.stringify(updatedServices)}, updated_at = now() 
    WHERE id = ${business.id}
  `;

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

  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    UPDATE businesses 
    SET services = ${JSON.stringify(updatedServices)}, updated_at = now() 
    WHERE id = ${business.id}
  `;

  revalidatePath("/dashboard/services");
  return { success: true };
}
