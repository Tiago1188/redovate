'use server';

import { neon } from '@neondatabase/serverless';
import { auth } from '@clerk/nextjs/server';
import { BaseWebsiteContent } from '@/lib/content/base-website-content';

const sql = neon(process.env.DATABASE_URL!);

export async function getBaseContent(businessId?: string): Promise<BaseWebsiteContent> {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // If businessId is not provided, try to find the user's business
    let targetBusinessId = businessId;
    if (!targetBusinessId) {
        const userBusiness = await sql`
      SELECT id FROM businesses WHERE user_id = (SELECT id FROM users WHERE clerk_id = ${userId}) LIMIT 1
    `;
        if (userBusiness.length > 0) {
            targetBusinessId = userBusiness[0].id;
        }
    }

    if (!targetBusinessId) {
        // Return empty default if no business found (e.g. during onboarding)
        return getDefaultBaseContent();
    }

    // Fetch business data including base_content and legacy fields for merging
    const business = await sql`
    SELECT 
      base_content,
      business_name,
      trading_name,
      tagline,
      about,
      year_founded,
      category as industry,
      abn,
      phone,
      mobile,
      email,
      social_links,
      services,
      service_areas,
      locations,
      hours,
      logo,
      hero_image,
      images
    FROM businesses 
    WHERE id = ${targetBusinessId}
  `;

    if (business.length === 0) {
        return getDefaultBaseContent();
    }

    const b = business[0];
    const baseContent = b.base_content || {};

    // Merge logic: Base content takes precedence, but fallback to legacy fields if base is empty
    // This ensures backward compatibility and smooth migration

    return {
        businessName: baseContent.businessName || b.business_name || '',
        tradingName: baseContent.tradingName || b.trading_name || '',
        tagline: baseContent.tagline || b.tagline || '',
        aboutShort: baseContent.aboutShort || b.about || '', // Mapping 'about' to 'aboutShort' as a reasonable default
        aboutFull: baseContent.aboutFull || '',
        yearFounded: baseContent.yearFounded || b.year_founded,
        industry: baseContent.industry || b.industry,

        abn: baseContent.abn || b.abn,
        licenseNumber: baseContent.licenseNumber,

        phone: baseContent.phone || b.phone || '',
        mobile: baseContent.mobile || b.mobile,
        email: baseContent.email || b.email || '',
        address: baseContent.address || (b.locations?.[0]?.address) || '',
        googleMapsUrl: baseContent.googleMapsUrl,

        socialLinks: {
            ...baseContent.socialLinks,
            ...b.social_links // Merge existing social links
        },

        services: baseContent.services?.length > 0 ? baseContent.services : (b.services || []).map((s: any) => ({
            title: s.title || s.name,
            description: s.description,
            price: s.price,
            image: s.image,
            icon: s.icon
        })),

        serviceAreas: baseContent.serviceAreas?.length > 0 ? baseContent.serviceAreas : (b.service_areas || []),

        locations: baseContent.locations?.length > 0 ? baseContent.locations : (b.locations || []),

        hours: baseContent.hours || b.hours || {},

        logo: baseContent.logo || b.logo,
        profileImage: baseContent.profileImage,
        heroImage: baseContent.heroImage || b.hero_image,
        gallery: baseContent.gallery?.length > 0 ? baseContent.gallery : (b.images || []),

        testimonials: baseContent.testimonials || [],
        certifications: baseContent.certifications || [],
        pricing: baseContent.pricing || [],
        faq: baseContent.faq || [],
        team: baseContent.team || [],
        projects: baseContent.projects || [],
    };
}

function getDefaultBaseContent(): BaseWebsiteContent {
    return {
        businessName: '',
        phone: '',
        email: '',
        socialLinks: {},
        services: [],
        serviceAreas: [],
        locations: [],
    };
}
