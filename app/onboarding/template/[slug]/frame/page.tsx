import { notFound } from "next/navigation";
import { getTemplateBySlug } from "@/actions/templates";
import ClientFrame from "./ClientFrame";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function TemplateFramePage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { theme, font, primary, background } = await searchParams;

    const template = await getTemplateBySlug(slug);
    if (!template) notFound();

    const components = Array.isArray(template.components)
        ? template.components
        : JSON.parse(template.components || "[]");

    const fakeContent = typeof template.fake_content === "object"
        ? template.fake_content
        : JSON.parse(template.fake_content || "{}");

    // Determine initial theme/font defaults same as ClientTemplatePreview if not provided
    const initialTheme = theme || (template.slug.includes('voltage-pro') ? 'theme-voltage-pro' : 'theme-neutral');
    const initialFont = font || "inter";
    
    let initialColors;
    if (primary && background) {
        initialColors = { primary, background };
    }

    return (
        <ClientFrame
            template={template}
            components={components}
            fakeContent={fakeContent}
            initialTheme={initialTheme}
            initialFont={initialFont}
            initialColors={initialColors}
        />
    );
}

