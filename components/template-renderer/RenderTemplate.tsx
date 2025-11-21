import { MetaSection } from "../template-sections/MetaSection";
import { HeroSection } from "../template-sections/HeroSection";
import { AboutSection } from "../template-sections/AboutSection";
import { ServicesSection } from "../template-sections/ServicesSection";
import { ContactSection } from "../template-sections/ContactSection";

interface RenderTemplateProps {
    components: any[];
    data: any;
    showBranding?: boolean;
}

/**
 * Map DB-friendly "type" names → actual React components
 */
const SECTION_MAP: Record<string, React.ComponentType<any>> = {
    meta: MetaSection,
    hero: HeroSection,
    about: AboutSection,
    services: ServicesSection,
    contact: ContactSection,
};

export default function RenderTemplate({ components = [], data = {}, showBranding = false }: RenderTemplateProps) {

    if (!Array.isArray(components) || components.length === 0) {
        return (
            <div className="p-10 text-center text-zinc-500">
                No components to render. Check template definition.
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950 relative">
            {components.map((component, index) => {
                
                // DB formats this as: { "type": "hero" }
                const type = component.type || component.name || component;

                const SectionComponent = SECTION_MAP[type];

                if (!SectionComponent) {
                    console.warn(`⚠ Unknown component type: "${type}". Add it to SECTION_MAP.`);
                    return null;
                }

                // fake_content uses keys like: hero, about, services, contact
                const sectionData = data[type] || {};

                return <SectionComponent key={index} data={sectionData} />;
            })}

            {showBranding && (
                <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-full px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 pointer-events-none opacity-80">
                    Powered by Redovate
                </div>
            )}
        </div>
    );
}
