'use server';

import sql from "@/lib/db";

export async function getBusinessActiveTemplate(businessId: string) {
  try {
    const result = await sql`
      SELECT t.* 
      FROM templates t
      JOIN business_templates bt ON t.id = bt.template_id
      WHERE bt.business_id = ${businessId} AND bt.is_active = true
      LIMIT 1
    `;

    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (error) {
    console.error('Error fetching active template for business:', error);
    return null;
  }
}
