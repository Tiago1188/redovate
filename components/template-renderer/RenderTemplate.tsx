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
} as const;

type SectionType = keyof typeof SECTION_MAP;

interface SectionComponent {
  type: SectionType;
  [key: string]: any;
}

interface RenderTemplateProps {
  components?: SectionComponent[];
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
        const sectionType = section.type as SectionType;
        const Component = SECTION_MAP[sectionType];
        if (!Component) return null;

        return <Component key={i} data={data[sectionType]} />;
      })}

      {showBranding && (
        <div className="text-xs text-gray-400 text-right py-10">
          Powered by Redovate
        </div>
      )}
    </TemplatePageWrapper>
  );
}
