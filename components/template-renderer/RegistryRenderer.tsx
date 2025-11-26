import { CSSProperties } from "react";
import TemplatePageWrapper from "./TemplatePageWrapper";
import { COMPONENT_MAP } from "@/components/templates/component-map";

interface Section {
    type: string;
    id?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface RegistryRendererProps {
    sections?: Section[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    showBranding?: boolean;
    customTheme?: string;
    customFont?: string;
    customColors?: {
        primary: string;
        secondary: string;
        background: string;
        foreground: string;
    };
}

export default function RegistryRenderer({
    sections = [],
    data = {},
    showBranding = false,
    customTheme,
    customFont,
    customColors,
}: RegistryRendererProps) {

    // Determine the base theme class
    const themeClass = customTheme || 'theme-neutral';

    // Append custom font class if provided
    const fontClass = customFont ? `font-${customFont}` : "";

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
                {sections.map((section, i) => {
                    const Component = COMPONENT_MAP[section.type];

                    if (!Component) {
                        console.warn(`RegistryRenderer: Component type "${section.type}" not found in COMPONENT_MAP.`);
                        return null;
                    }

                    // Data resolution:
                    // 1. data[section.id] (specific instance data - preferred for business.sections)
                    // 2. data[section.type] (fallback to type-based data - legacy/template default)
                    const sectionData = (section.id ? data[section.id] : undefined) || data[section.type];

                    return <Component key={section.id || i} data={sectionData} />;
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
