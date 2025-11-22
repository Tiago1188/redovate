import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/actions/business/getBusinessBySlug";
import { getBusinessActiveTemplate } from "@/actions/templates/getBusinessActiveTemplate";
import { getTemplateBySlug } from "@/actions/templates";
import ClientFrame from "@/components/template/ClientFrame";

interface PageProps {
  params: Promise<{ businessSlug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

// Helper to map business data to template content
// (Reuse logic from dashboard/appearance/preview/frame/page.tsx)
function mapBusinessDataToContent(data: any) {
  return {
      HeroSection: {
          headline: data.tagline || data.category || "Professional Services",
          highlight: data.businessName,
          tagline: data.about?.substring(0, 100),
          business_name: data.businessName,
          hero_image: data.heroImage,
          phone: data.phone,
          cta_primary: "Contact Us",
          cta_secondary: data.phone
      },
      AboutSection: {
          business_name: data.businessName,
          about: data.about,
          image: data.heroImage // fallback if no specific about image
      },
      ServicesSection: {
          title: "Our Services",
          subtitle: `We offer a wide range of ${data.category || 'professional'} services`,
          services: data.services.map((s: string) => ({ title: s, description: "" }))
      },
      ServiceAreasSection: {
          title: "Service Areas",
          areas: data.serviceAreas
      },
      ContactSection: {
          email: data.email,
          phone: data.phone,
          address: data.locations.length > 0 ? data.locations[0].address : undefined,
          hours: data.hours
      },
      FooterSection: {
          business_name: data.businessName,
          email: data.email,
          phone: data.phone,
          social_links: data.socialLinks
      },
      NavigationSection: {
          business_name: data.businessName,
          logo: data.logo,
          phone: data.phone
      },
      // Fallbacks for components that might check ID
      ...data
  };
}

export default async function PreviewPage({ params, searchParams }: PageProps) {
  const { businessSlug } = await params;
  const { templateSlug, theme, font, primary, background } = await searchParams;

  const business = await getBusinessBySlug(businessSlug);
  if (!business) notFound();

  let template;
  if (templateSlug) {
     template = await getTemplateBySlug(templateSlug);
  } else {
     template = await getBusinessActiveTemplate(business.id);
  }
  
  if (!template) notFound();

  // Merge business data with template structure
  const content = mapBusinessDataToContent(business);

  const components = Array.isArray(template.components)
      ? template.components
      : JSON.parse(template.components || "[]");

  // Extract theme configuration from business theme (saved state)
  const businessTheme = (business as any).theme || {};
  
  // Determine theme settings (Prioritize URL params -> Saved State -> Template Default)
  const customTheme = theme || businessTheme.themeId || (template.slug.includes('voltage-pro') ? 'theme-voltage-pro' : 'theme-neutral');
  const customFont = font || businessTheme.font || "inter";
  
  // Handle colors
  let customColors = undefined;
  
  // 1. Check URL params
  if (primary && background) {
      customColors = { primary, background };
  } 
  // 2. Check Saved State
  else if (businessTheme.colors) {
      customColors = {
          primary: businessTheme.colors.primary,
          background: businessTheme.colors.background,
      };
  }

  return (
    <ClientFrame
      template={template}
      components={components}
      data={content}
      initialTheme={customTheme}
      initialFont={customFont}
      initialColors={customColors}
      // Enable listeners so the editor can control this page via iframe
      enableListeners={true}
      showBranding={false}
    />
  );
}
