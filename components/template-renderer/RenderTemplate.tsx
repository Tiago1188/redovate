import { MetaSection } from "../template-sections/MetaSection";
import { HeroSection } from "../template-sections/HeroSection";
import { AboutSection } from "../template-sections/AboutSection";
import { ServicesSection } from "../template-sections/ServicesSection";
import { ContactSection } from "../template-sections/ContactSection";

const SECTION_MAP: Record<string, any> = {
  MetaSection,
  HeroSection,
  AboutSection,
  ServicesSection,
  ContactSection
};
interface RenderTemplateProps {
  html_template?: string;
  components?: any[];
  data?: any;
  showBranding?: boolean;
}

export default function RenderTemplate({
  html_template,
  components = [],
  data = {},
  showBranding = false
}: RenderTemplateProps) {

  // ---- CASE 1: HTML Template from Database ----
  if (html_template && html_template.length > 0) {
    // Simple placeholder replacement {{value}}
    const renderedHtml = html_template.replace(/{{(.*?)}}/g, (match, key) => {
      const value = key.trim().split('.').reduce((o: any, i: string) => o?.[i], data);
      return value ?? "";
    });

    return (
      <div
        className="w-full min-h-screen"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  // ---- CASE 2: OLD COMPONENT SYSTEM ----
  return (
    <div className="w-full min-h-screen bg-white">
      {components.map((component: any, index: number) => {
        const SectionComponent = SECTION_MAP[component.type];
        return SectionComponent ? (
          <SectionComponent key={index} data={data[component.type]} />
        ) : null;
      })}

      {showBranding && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-white border text-xs rounded-full shadow">
          Powered by Redovate
        </div>
      )}
    </div>
  );
}
