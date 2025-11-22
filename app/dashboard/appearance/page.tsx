import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Palette } from "lucide-react";
import { getBusinessTheme } from "@/actions/business/theme";
import { getUserPlanType, getUserOnboardingStatus } from "@/actions/user";
import { AppearanceForm } from "./appearance-form";
import { Button } from "@/components/ui/button";
import { getBusinessData } from "@/actions/business";
import { getActiveTemplate } from "@/actions/templates";

export default async function AppearancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const onboardingStatus = await getUserOnboardingStatus(userId);
  if (!onboardingStatus.hasValidAccountType || !onboardingStatus.businessId) {
    redirect("/onboarding");
  }

  const plan = await getUserPlanType(userId);
  const theme = await getBusinessTheme(onboardingStatus.businessId);
  const business = await getBusinessData();
  const activeTemplate = await getActiveTemplate();

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appearance & Branding</h1>
          <p className="text-muted-foreground mt-2">
            Customize how your business website looks.
          </p>
        </div>
        <div className="flex gap-3">
             <Button asChild variant="outline">
                <Link href={`/preview/${business?.slug}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Public Preview
                </Link>
            </Button>
            <Button asChild>
                <Link href={`/editor/${activeTemplate?.slug}`}>
                    <Palette className="mr-2 h-4 w-4" />
                    Open Visual Editor
                </Link>
            </Button>
        </div>
      </div>

      <AppearanceForm 
        initialTheme={theme}
        businessId={onboardingStatus.businessId}
        userPlan={plan || 'free'}
      />
    </div>
  );
}
