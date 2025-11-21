import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getBusinessData } from "@/actions/business"
import { EmptyState } from "@/components/empty-state"

import data from "./data.json"

export default async function Page() {
  const businessData = await getBusinessData();
  const hasData = businessData && businessData.services.length > 0;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {hasData ? (
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
              </div>
            ) : (
              <EmptyState businessName={businessData?.businessName} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
