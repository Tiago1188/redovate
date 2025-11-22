import { notFound } from "next/navigation";
import { getTemplateBySlug } from "@/actions/templates";
import { getUserPlanType } from "@/actions/user";
import ClientTemplatePreview from "./ClientTemplatePreview";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function TemplatePreviewPage({ params }: PageProps) {
    const { slug } = await params;

    const template = await getTemplateBySlug(slug);
    if (!template) notFound();

    const userPlan = (await getUserPlanType()) || 'free';

    // Parse components array (fallback for old templates)
    const components = Array.isArray(template.components)
        ? template.components
        : JSON.parse(template.components || "[]");

    // Parse fake content (preview props)
    const fakeContent = typeof template.fake_content === "object"
        ? template.fake_content
        : JSON.parse(template.fake_content || "{}");

    return (
        <ClientTemplatePreview
            template={template}
            components={components}
            fakeContent={fakeContent}
            userPlan={userPlan}
        />
    );
}
