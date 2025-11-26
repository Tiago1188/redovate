'use server';

import sql from "@/lib/db";
import { BusinessData } from "@/actions/business";

export async function getBusinessBySlug(slug: string): Promise<BusinessData | null> {
  try {
    const result = await sql`
      SELECT 
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
          b.base_content,
          b.images,
          b.ai_generations_count,
          b.ai_period_start,
          b.domain,
          b.dns_verification_token,
          b.verified,
          b.verified_date,
          b.verified_method,
          b.website_url,
          b.updated_at
       FROM businesses b
       WHERE b.slug = ${slug}
       LIMIT 1
    `;

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
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
      baseContent: row.base_content || {},
      images: Array.isArray(row.images) ? row.images : [],
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
    console.error('Error fetching business by slug:', error);
    return null;
  }
}
