import TemplatePageWrapper from "./TemplatePageWrapper";
import * as Free from "../template/free";
import * as VoltagePro from "../template/starter/voltage-pro";

// Define the component maps for each theme
const FREE_MAP = {
  HeroSection: Free.HeroSection,
  AboutSection: Free.AboutSection,
  ListingsSection: Free.ListingsSection,
  TestimonialsSection: Free.TestimonialsSection,
  ContactSection: Free.ContactSection,
  ServicesSection: Free.ServicesSection,
  MetaSection: Free.MetaSection,
};

const VOLTAGE_PRO_MAP = {
  NavigationSection: VoltagePro.NavigationSection,
  HeroSection: VoltagePro.HeroSection,
  ServicesSection: VoltagePro.ServicesSection,
  ServiceAreasSection: VoltagePro.ServiceAreasSection,
  AboutSection: VoltagePro.AboutSection,
  ContactSection: VoltagePro.ContactSection,
  FooterSection: VoltagePro.FooterSection,
};

// Map template slugs/names to their component maps
// We'll use a default fallback if the exact slug isn't found
const THEME_MAPS: Record<string, any> = {
  "default": FREE_MAP,
  "voltage-pro-free": VOLTAGE_PRO_MAP,
  "voltage-pro": VOLTAGE_PRO_MAP,
};

type SectionComponent = {
  type: string;
  [key: string]: any;
};

interface RenderTemplateProps {
  components?: SectionComponent[];
  data?: any;
  showBranding?: boolean;
  templateSlug?: string;
}

export default function RenderTemplate({
  components = [],
  data = {},
  showBranding = false,
  templateSlug = "default",
}: RenderTemplateProps) {
  // Select the appropriate map based on the slug
  const sectionMap = THEME_MAPS[templateSlug] || THEME_MAPS["default"];

  const themeClass = templateSlug.includes('voltage-pro') ? 'theme-voltage-pro' : '';

  return (
    <TemplatePageWrapper className={themeClass}>
      {components.map((section, i) => {
        const Component = sectionMap[section.type];
        
        // Fallback: try to find the component in the default map if not in the specific one
        // (Useful if we mix and match or if a key is missing in a specific theme)
        const FinalComponent = Component || (THEME_MAPS["default"] as any)[section.type];

        if (!FinalComponent) {
            console.warn(`Component type "${section.type}" not found for template "${templateSlug}"`);
            return null;
        }

        // Helper to get data for the specific section
        // It tries data[section.type] first, then data[section.id] if available
        const sectionData = data[section.type] || (section.id ? data[section.id] : undefined);

        return <FinalComponent key={i} data={sectionData} />;
      })}

      {showBranding && (
        <div className="text-xs text-gray-400 text-right py-10 px-4">
          Powered by Redovate
        </div>
      )}
    </TemplatePageWrapper>
  );
}
