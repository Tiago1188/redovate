import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/actions/business/getBusinessBySlug";
import { getBusinessActiveTemplate } from "@/actions/templates/getBusinessActiveTemplate";
import RenderTemplate from "@/components/template-renderer/RenderTemplate";

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Fetch the business by slug
  const business = await getBusinessBySlug(slug);
  if (!business) {
    notFound();
  }

  // 2. Fetch the active template for the business
  const activeTemplate = await getBusinessActiveTemplate(business.id);

  // If no active template, show 404 (or could be a "Coming Soon" placeholder)
  if (!activeTemplate) {
    console.log(`No active template found for business: ${slug}`);
    notFound();
  }

  // 3. Prepare data for the template renderer
  // Merge global business data into section-specific data
  // This ensures sections have access to core business info even if not explicitly saved in siteContent
  const templateData = {
    ...business.siteContent,
    HeroSection: {
      ...business.siteContent?.HeroSection,
      business_name: business.businessName,
      tagline: business.tagline,
      hero_image: business.heroImage,
    },
    AboutSection: {
      ...business.siteContent?.AboutSection,
      business_name: business.businessName,
      about: business.about,
      hero_image: business.heroImage,
    },
    ServicesSection: {
      ...business.siteContent?.ServicesSection,
      services: business.services,
    },
    ContactSection: {
      ...business.siteContent?.ContactSection,
      business_name: business.businessName,
      email: business.email,
      phone: business.phone,
      social_links: business.socialLinks,
      locations: business.locations,
      hours: business.hours,
    },
    FooterSection: {
      ...business.siteContent?.FooterSection,
      business_name: business.businessName,
      email: business.email,
      phone: business.phone,
      social_links: business.socialLinks,
      locations: business.locations,
    },
    // Add global fallback for any section looking for common data
    global: {
      business_name: business.businessName,
      email: business.email,
      phone: business.phone,
      logo: business.logo,
      social_links: business.socialLinks,
    }
  };

  // 4. Extract theme customizations
  const customTheme = business.theme?.themeId;
  const customFont = business.theme?.font;
  const customColors = business.theme?.colors;

  return (
    <RenderTemplate
      components={activeTemplate.components}
      data={templateData}
      templateSlug={activeTemplate.slug}
      customTheme={customTheme}
      customFont={customFont}
      customColors={customColors}
      showBranding={true} // Can be conditional based on plan
    />
  );
}
