'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export interface DashboardSection {
    name: string;
    label: string;
    description: string;
    status: string;
    completion_percent: number;
    completed_items?: number;
    total_items?: number;
}

export async function getDashboardSections(): Promise<DashboardSection[]> {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    try {
        // Get the user's business ID
        const businessRes = await pool.query(
            `SELECT b.id 
             FROM businesses b
             JOIN users u ON b.user_id = u.id
             WHERE u.clerk_id = $1
             LIMIT 1`,
            [userId]
        );

        if (businessRes.rows.length === 0) {
            return [];
        }

        const businessId = businessRes.rows[0].id;

        // Get the active template for this business
        const templateRes = await pool.query(
            `SELECT template_id 
             FROM business_templates 
             WHERE business_id = $1 AND is_active = true
             LIMIT 1`,
            [businessId]
        );

        if (templateRes.rows.length === 0) {
            return [];
        }

        const templateId = templateRes.rows[0].template_id;

        // Join template_sections with business_section_status
        // Filter by current business's active template
        const result = await pool.query(
            `SELECT 
                ts.name,
                ts.label,
                ts.description,
                COALESCE(bss.status, 'missing') as status,
                COALESCE(bss.completion_percent, 0) as completion_percent
             FROM template_sections ts
             LEFT JOIN business_section_status bss 
                ON ts.id = bss.section_id AND bss.business_id = $1
             WHERE ts.template_id = $2
             ORDER BY ts.sort_order ASC`,
            [businessId, templateId]
        );

        return result.rows.map((row) => ({
            name: row.name,
            label: row.label || row.name,
            description: row.description || '',
            status: row.status,
            completion_percent: row.completion_percent || 0,
            completed_items: undefined,
            total_items: undefined,
        }));
    } catch (error) {
        console.error('Error fetching dashboard sections:', error);
        return [];
    }
}

