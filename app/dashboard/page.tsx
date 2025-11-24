import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Palette } from "lucide-react";
import { getDashboardSections } from "@/actions/dashboard/getDashboardSections"
import { hasActiveTemplate } from "@/actions/dashboard/hasActiveTemplate"
import { SectionCard } from "@/components/dashboard/SectionCard"
import { getBusinessData } from "@/actions/business"
import { getActiveTemplate } from "@/actions/templates"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { DomainCard } from "@/components/dashboard/domain/domain-card";
import { getUserPlanType } from "@/actions/user";
import { getPlanLimits } from "@/lib/plan-limits";
import { getPlatformDomainUrl } from "@/lib/validators/domain";

export default async function Page() {
  const businessData = await getBusinessData();
  const planType = (await getUserPlanType()) || 'free';
  const limits = getPlanLimits(planType);

  // Check if user has an active template - if not, redirect to template selection
  const hasTemplate = await hasActiveTemplate();
  if (!hasTemplate) {
    redirect("/onboarding/template");
  }

  const activeTemplate = await getActiveTemplate();

  const sections = await getDashboardSections();

  // If no sections available, show empty state
  if (sections.length === 0) {
    return (
      <EmptyState businessName={businessData?.businessName} />
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={businessData?.slug ? getPlatformDomainUrl(businessData.slug) : "#"} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Public Preview
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/editor/${activeTemplate?.slug}`}>
              <Palette className="mr-2 h-4 w-4" />
              Customize Template
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businessData && (
          <DomainCard
            slug={businessData.slug}
            domain={businessData.domain}
            verified={businessData.verified}
            canUseCustomDomain={limits.customDomain}
          />
        )}
        {sections.map((section) => {
          const href = section.name === 'ServicesSection'
            ? '/dashboard/services'
            : section.name === 'KeywordsSection'
              ? '/dashboard/keywords'
              : `/dashboard/sections/${section.name}`;

          return (
            <SectionCard
              key={section.name}
              title={section.label || section.name}
              status={section.status}
              completion={section.completion_percent}
              completedItems={section.completed_items}
              totalItems={section.total_items}
              href={href}
            />
          );
        })}
      </div>
    </div>
  )
}
