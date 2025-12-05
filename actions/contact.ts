"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { updateContactSchema } from "@/lib/validations";

export async function updateContactInfo(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = updateContactSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  const { email, phone, mobile } = validation.data;

  try {
    await sql`
      UPDATE businesses
      SET 
        email = ${email ?? null},
        phone = ${phone ?? null},
        mobile = ${mobile ?? null},
        updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return { success: false, error: "Failed to update contact info" };
  }
}

export async function getContactInfo(businessId: string) {
  const result = await sql`
    SELECT email, phone, mobile FROM businesses WHERE id = ${businessId}
  `;

  return result[0] ?? { email: null, phone: null, mobile: null };
}

