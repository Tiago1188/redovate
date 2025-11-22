import { redirect } from "next/navigation";
import { getDashboardSections } from "@/actions/dashboard/getDashboardSections"
import { hasActiveTemplate } from "@/actions/dashboard/hasActiveTemplate"
import { SectionCard } from "@/components/dashboard/SectionCard"
import { getBusinessData } from "@/actions/business"
import { EmptyState } from "@/components/empty-state"

export default async function Page() {
  const businessData = await getBusinessData();
  
  // Check if user has an active template - if not, redirect to template selection
  const hasTemplate = await hasActiveTemplate();
  if (!hasTemplate) {
    redirect("/onboarding/template");
  }

  const sections = await getDashboardSections();
  const hasData = businessData && businessData.services.length > 0;

  // If no sections available, show empty state
  if (sections.length === 0) {
    return (
      <EmptyState businessName={businessData?.businessName} />
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <SectionCard
            key={section.name}
            title={section.label || section.name}
            status={section.status}
            completion={section.completion_percent}
            completedItems={section.completed_items}
            totalItems={section.total_items}
            href={`/dashboard/sections/${section.name}`}
          />
        ))}
      </div>
    </div>
  )
}
