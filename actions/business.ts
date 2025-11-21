'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export interface BusinessData {
    id: string;
    businessName: string;
    about: string | null;
    category: string | null;
    services: string[];
    locations: any[];
    serviceAreas: string[];
}

/**
 * Get business data for the current user
 */
export async function getBusinessData(): Promise<BusinessData | null> {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    try {
        const result = await pool.query(
            `SELECT 
                b.id,
                b.business_name,
                b.about,
                b.category,
                b.services,
                b.locations,
                b.service_areas
             FROM users u
             INNER JOIN businesses b ON b.user_id = u.id
             WHERE u.clerk_id = $1
             LIMIT 1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return {
            id: row.id,
            businessName: row.business_name,
            about: row.about,
            category: row.category,
            services: Array.isArray(row.services) ? row.services : [],
            locations: Array.isArray(row.locations) ? row.locations : [],
            serviceAreas: Array.isArray(row.service_areas) ? row.service_areas : [],
        };
    } catch (error) {
        console.error('Error fetching business data:', error);
        return null;
    }
}

