import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { getBusinessData } from "@/actions/business";
import { getUserPlanType } from "@/actions/user";
import { getPlanLimits } from "@/lib/plan-limits";
import { AIUsageProvider } from "@/components/ai-usage-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const businessData = await getBusinessData();
  const planType = (await getUserPlanType()) || 'free';
  const limits = getPlanLimits(planType);
  
  const usage = businessData?.aiGenerationsCount || 0;
  // If limit is null (unlimited), treat as high number for display purposes or handle in component
  const limit = limits.maxAiGenerations || 0;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AIUsageProvider usage={usage} limit={limit} planType={planType}>
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
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AIUsageProvider>
    </ThemeProvider>
  );
}

