import TemplatePageWrapper from "./TemplatePageWrapper";
import * as Free from "../template/free";
import * as VoltagePro from "../template/starter/voltage-pro";
import * as CleanerPro from "../template/starter/cleaner-pro";
import { THEME_PRESETS } from "@/data/theme-presets";
import * as Fonts from "@/lib/fonts";

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

const CLEANER_PRO_MAP = {
  NavigationSection: CleanerPro.NavigationSection,
  HeroSection: CleanerPro.HeroSection,
  ServicesSection: CleanerPro.ServicesSection,
  ServiceAreasSection: CleanerPro.ServiceAreasSection,
  AboutSection: CleanerPro.AboutSection,
  ContactSection: CleanerPro.ContactSection,
  FooterSection: CleanerPro.FooterSection,
};

// Map template slugs/names to their component maps
// We'll use a default fallback if the exact slug isn't found
const THEME_MAPS: Record<string, any> = {
  "default": FREE_MAP,
  "voltage-pro-free": VOLTAGE_PRO_MAP,
  "voltage-pro": VOLTAGE_PRO_MAP,
  "cleaner-pro-free": CLEANER_PRO_MAP,
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
  customTheme?: string;
  customFont?: string;
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
}

export default function RenderTemplate({
  components = [],
  data = {},
  showBranding = false,
  templateSlug = "default",
  customTheme,
  customFont,
  customColors,
}: RenderTemplateProps) {
  // Select the appropriate map based on the slug
  const sectionMap = THEME_MAPS[templateSlug] || THEME_MAPS["default"];

  // Determine the base theme class
  // If customTheme is provided, use it.
  // If not provided, check template slug or fallback to neutral
  let themeClass = "";
  if (customTheme) {
    themeClass = customTheme;
  } else {
    // Fallback to template default if no custom theme is active (initial load)
    // If it's not voltage pro, we default to 'theme-neutral' which is the template default
    themeClass = templateSlug.includes('voltage-pro') ? 'theme-voltage-pro' : 'theme-neutral';
  }

  // Append custom font class if provided
  // We check if the font exists in our fonts map, otherwise default or leave empty
  let fontClass = "";
  if (customFont) {
     // Map font ID to class name if needed, or use ID directly if it matches class convention
     // Our convention is font ID "poppins" -> class "font-poppins"
     // But the input customFont is likely the ID "poppins"
     fontClass = `font-${customFont}`;
  }

  const finalClass = `${themeClass} ${fontClass}`.trim();

  // Style object for custom colors
  const style: Record<string, string> = {};
  if (customColors) {
    if (customColors.primary) style['--primary'] = customColors.primary;
    if (customColors.secondary) style['--secondary'] = customColors.secondary;
    if (customColors.background) style['--background'] = customColors.background;
    if (customColors.foreground) style['--foreground'] = customColors.foreground;
  }

  return (
    <div style={style as any} className="contents">
        <TemplatePageWrapper className={finalClass}>
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
    </div>
  );
}
