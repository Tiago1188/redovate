'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

export interface BusinessData {
    id: string;
    businessName: string;
    slug: string;
    about: string | null;
    category: string | null;
    tagline: string | null;
    phone: string | null;
    email: string | null;
    heroImage: string | null;
    logo: string | null;
    services: any[];
    servicesRaw: string[];
    locations: any[];
    serviceAreas: string[];
    hours: any;
    socialLinks: any;
    theme?: any;
    siteContent?: any; // Added site content field
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
                b.slug,
                b.about,
                b.category,
                b.tagline,
                b.phone,
                b.email,
                b.hero_image,
                b.logo,
                b.services,
                b.services_raw,
                b.locations,
                b.service_areas,
                b.hours,
                b.social_links,
                b.theme,
                b.site_content
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
            slug: row.slug,
            about: row.about,
            category: row.category,
            tagline: row.tagline,
            phone: row.phone,
            email: row.email,
            heroImage: row.hero_image,
            logo: row.logo,
            services: Array.isArray(row.services) ? row.services : [],
            servicesRaw: Array.isArray(row.services_raw) ? row.services_raw : [],
            locations: Array.isArray(row.locations) ? row.locations : [],
            serviceAreas: Array.isArray(row.service_areas) ? row.service_areas : [],
            hours: row.hours || {},
            socialLinks: row.social_links || {},
            theme: row.theme || {},
            siteContent: row.site_content || {},
        };
    } catch (error) {
        console.error('Error fetching business data:', error);
        return null;
    }
}
