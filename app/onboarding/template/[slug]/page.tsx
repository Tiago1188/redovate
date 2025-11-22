import { notFound, redirect } from "next/navigation";
import { getTemplateBySlug } from "@/actions/templates";
import { getUserPlanType } from "@/actions/user";
import { hasActiveTemplate } from "@/actions/dashboard/hasActiveTemplate";
import ClientTemplatePreview from "@/components/template/ClientTemplatePreview";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function TemplatePreviewPage({ params }: PageProps) {
    const { slug } = await params;

    // Check if user already has an active template and redirect to dashboard if so
    const hasTemplate = await hasActiveTemplate();
    if (hasTemplate) {
        redirect("/dashboard");
    }

    const template = await getTemplateBySlug(slug);
    if (!template) notFound();

    const userPlan = (await getUserPlanType()) || 'free';

    return (
        <ClientTemplatePreview
            template={template}
            userPlan={userPlan}
            mode="onboarding"
            backLink="/onboarding/template"
            iframeUrl={`/onboarding/template/${slug}/frame`}
        />
    );
}
