import { CSSProperties } from "react";
import TemplatePageWrapper from "./TemplatePageWrapper";
import { COMPONENT_MAP } from "@/components/templates/component-map";
import { THEME_PRESETS } from "@/data/theme-presets";
import * as Fonts from "@/lib/fonts";

type SectionComponent = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

interface RenderTemplateProps {
  components?: SectionComponent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  let fontClass = "";
  if (customFont) {
    // Map font ID to class name
    // Our convention is font ID "poppins" -> class "font-poppins"
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
    <div className="contents">
      <TemplatePageWrapper className={finalClass} style={style as CSSProperties}>
        {components.map((section, i) => {
          // Use unified component map
          const Component = COMPONENT_MAP[section.type];

          if (!Component) {
            console.warn(`Component type "${section.type}" not found in component map`);
            return null;
          }

          // Helper to get data for the specific section
          // It tries data[section.type] first, then data[section.id] if available
          const sectionData = data[section.type] || (section.id ? data[section.id] : undefined);

          return <Component key={i} data={sectionData} />;
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
