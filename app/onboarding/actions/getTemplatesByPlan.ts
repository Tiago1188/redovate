'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";
import { getUserPlanType } from "@/actions/user";

export async function getTemplatesByPlan() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const planType = await getUserPlanType(userId);
    const userPlan = planType || 'free';

    let query = `
        SELECT id, name, slug, thumbnail, description, plan_level, fake_content
        FROM templates
        WHERE status = 'active'
    `;
    
    const params: any[] = [];

    if (userPlan === 'free') {
        query += ` AND plan_level = 'free'`;
    } else if (userPlan === 'starter') {
        query += ` AND plan_level IN ('free', 'starter')`;
    } else {
        // business plan sees all
        // No extra filter needed for plan_level as they can access all active templates
    }

    query += ` ORDER BY created_at DESC`;

    try {
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error fetching templates:', error);
        return [];
    }
}

