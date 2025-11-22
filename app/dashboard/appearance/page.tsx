import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBusinessTheme } from "@/actions/business/theme";
import { getUserPlanType, getUserOnboardingStatus } from "@/actions/user";
import { AppearanceForm } from "./appearance-form";

export default async function AppearancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const onboardingStatus = await getUserOnboardingStatus(userId);
  if (!onboardingStatus.hasValidAccountType || !onboardingStatus.businessId) {
    redirect("/onboarding");
  }

  const plan = await getUserPlanType(userId);
  const theme = await getBusinessTheme(onboardingStatus.businessId);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appearance & Branding</h1>
        <p className="text-muted-foreground mt-2">
          Customize how your business website looks correctly.
        </p>
      </div>

      <AppearanceForm 
        initialTheme={theme}
        businessId={onboardingStatus.businessId}
        userPlan={plan || 'free'}
      />
    </div>
  );
}

