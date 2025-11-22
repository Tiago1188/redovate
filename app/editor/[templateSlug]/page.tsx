import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getBusinessData } from "@/actions/business";
import { getTemplateBySlug } from "@/actions/templates";
import { getBusinessTheme } from "@/actions/business/theme";
import { getUserOnboardingStatus, getUserPlanType } from "@/actions/user";
import ClientTemplatePreview from "@/components/template/ClientTemplatePreview";

interface PageProps {
    params: Promise<{ templateSlug: string }>;
}

export default async function EditorPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { templateSlug } = await params;

  const onboardingStatus = await getUserOnboardingStatus(userId);
  if (!onboardingStatus.hasValidAccountType || !onboardingStatus.businessId) {
    redirect("/onboarding");
  }

  const business = await getBusinessData();
  if (!business) redirect("/onboarding");

  const template = await getTemplateBySlug(templateSlug);
  if (!template) notFound();

  const initialTheme = await getBusinessTheme(onboardingStatus.businessId);
  const userPlan = await getUserPlanType(userId);

  return (
    <ClientTemplatePreview
      template={template}
      userPlan={userPlan || 'free'}
      mode="edit"
      backLink="/dashboard"
      // Point to the public preview route, optionally overriding template if we support that
      iframeUrl={`/preview/${business.slug}?templateSlug=${templateSlug}`}
      businessId={onboardingStatus.businessId}
      initialTheme={initialTheme}
    />
  );
}

