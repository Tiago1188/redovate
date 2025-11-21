import { SectionCards } from "@/components/section-cards"
import { getBusinessData } from "@/actions/business"
import { EmptyState } from "@/components/empty-state"

export default async function Page() {
  const businessData = await getBusinessData();
  const hasData = businessData && businessData.services.length > 0;

  return (
    hasData ? (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
      </div>
    ) : (
      <EmptyState businessName={businessData?.businessName} />
    )
  )
}
