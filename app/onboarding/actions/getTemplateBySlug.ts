'use server';

import pool from "@/lib/db";

export async function getTemplateBySlug(slug: string) {
    try {
        const result = await pool.query(
            `SELECT * FROM templates WHERE slug = $1 AND status = 'active' LIMIT 1`,
            [slug]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error fetching template by slug:', error);
        return null;
    }
}

