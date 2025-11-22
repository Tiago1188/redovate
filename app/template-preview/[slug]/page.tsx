import { notFound, redirect } from "next/navigation";
import { getTemplateBySlug } from "@/actions/templates";
import { getUserPlanType } from "@/actions/user";
import ClientTemplatePreview from "@/components/template/ClientTemplatePreview";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function TemplatePreviewPage({ params }: PageProps) {
    const { slug } = await params;

    const template = await getTemplateBySlug(slug);
    if (!template) notFound();

    const userPlan = (await getUserPlanType()) || 'free';

    return (
        <ClientTemplatePreview
            template={template}
            userPlan={userPlan}
            mode="onboarding"
            backLink="/dashboard/templates"
            iframeUrl={`/onboarding/template/${slug}/frame`}
            redirectPath="/dashboard"
        />
    );
}

