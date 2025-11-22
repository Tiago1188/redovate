'use server';

import pool from "@/lib/db";
import { BusinessData } from "@/actions/business";

export async function getBusinessBySlug(slug: string): Promise<BusinessData | null> {
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
          b.locations,
          b.service_areas,
          b.hours,
          b.social_links,
          b.theme,
          b.site_content
       FROM businesses b
       WHERE b.slug = $1
       LIMIT 1`,
      [slug]
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
      locations: Array.isArray(row.locations) ? row.locations : [],
      serviceAreas: Array.isArray(row.service_areas) ? row.service_areas : [],
      hours: row.hours || {},
      socialLinks: row.social_links || {},
      theme: row.theme || {},
      siteContent: row.site_content || {},
    };
  } catch (error) {
    console.error('Error fetching business by slug:', error);
    return null;
  }
}
