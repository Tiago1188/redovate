'use server';

import pool from "@/lib/db";

export async function getBusinessActiveTemplate(businessId: string) {
  try {
    const result = await pool.query(
      `SELECT t.* 
       FROM templates t
       JOIN business_templates bt ON t.id = bt.template_id
       WHERE bt.business_id = $1 AND bt.is_active = true
       LIMIT 1`,
      [businessId]
    );

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching active template for business:', error);
    return null;
  }
}

