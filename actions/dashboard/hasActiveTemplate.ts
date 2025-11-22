'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

/**
 * Check if the current user's business has an active template
 * @returns true if active template exists, false otherwise
 */
export async function hasActiveTemplate(): Promise<boolean> {
    const { userId } = await auth();

    if (!userId) {
        return false;
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
            return false;
        }

        const businessId = businessRes.rows[0].id;

        // Check if there's an active template for this business
        const templateRes = await pool.query(
            `SELECT template_id 
             FROM business_templates 
             WHERE business_id = $1 AND is_active = true
             LIMIT 1`,
            [businessId]
        );

        return templateRes.rows.length > 0;
    } catch (error) {
        console.error('Error checking active template:', error);
        return false;
    }
}

