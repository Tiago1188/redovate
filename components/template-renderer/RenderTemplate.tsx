import TemplatePageWrapper from "./TemplatePageWrapper";
import { HeroSection } from "../template-sections/HeroSection";
import { AboutSection } from "../template-sections/AboutSection";
import { ListingsSection } from "../template-sections/ListingsSection";
import { TestimonialsSection } from "../template-sections/TestimonialsSection";
import { ContactSection } from "../template-sections/ContactSection";

export const SECTION_MAP = {
  hero: HeroSection,
  about: AboutSection,
  listings: ListingsSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
};

interface RenderTemplateProps {
  components?: any[];
  data?: any;
  showBranding?: boolean;
}

export default function RenderTemplate({
  components = [],
  data = {},
  showBranding = false
}: RenderTemplateProps) {
  return (
    <TemplatePageWrapper>
      {components.map((section, i) => {
        const Component = SECTION_MAP[section.type];
        if (!Component) return null;

        return <Component key={i} data={data[section.type]} />;
      })}

      {showBranding && (
        <div className="text-xs text-gray-400 text-right py-10">
          Powered by Redovate
        </div>
      )}
    </TemplatePageWrapper>
  );
}
