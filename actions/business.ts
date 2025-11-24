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
    keywords: string[];
    hours: any;
    socialLinks: any;
    theme?: any;
    siteContent?: any; // Added site content field
    aiGenerationsCount: number;
    aiPeriodStart: Date;
    domain: string | null;
    dnsVerificationToken: string | null;
    verified: boolean;
    verifiedDate: Date | null;
    verifiedMethod: string | null;
    websiteUrl: string | null;
    updatedAt: Date | null;
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
                b.keywords,
                b.hours,
                b.social_links,
                b.theme,
                b.site_content,
                b.ai_generations_count,
                b.ai_period_start,
                b.domain,
                b.dns_verification_token,
                b.verified,
                b.verified_date,
                b.verified_method,
                b.website_url,
                b.updated_at
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
            keywords: Array.isArray(row.keywords) ? row.keywords : [],
            hours: row.hours || {},
            socialLinks: row.social_links || {},
            theme: row.theme || {},
            siteContent: row.site_content || {},
            aiGenerationsCount: row.ai_generations_count || 0,
            aiPeriodStart: row.ai_period_start || new Date(),
            domain: row.domain || null,
            dnsVerificationToken: row.dns_verification_token || null,
            verified: Boolean(row.verified),
            verifiedDate: row.verified_date || null,
            verifiedMethod: row.verified_method || null,
            websiteUrl: row.website_url || null,
            updatedAt: row.updated_at || null,
        };
    } catch (error) {
        console.error('Error fetching business data:', error);
        return null;
    }
}

