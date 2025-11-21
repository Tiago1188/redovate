import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserOnboardingStatus, getUserPlanType } from "@/actions/user";
import { OnboardingForm } from "@/components/forms/onboarding-form";

export default async function OnboardingPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Check onboarding status server-side using database (same as middleware does for dashboard)
    const onboardingStatus = await getUserOnboardingStatus(userId);
    
    // If user has completed onboarding, redirect to dashboard
    if (onboardingStatus.hasValidAccountType) {
        redirect("/dashboard");
    }

    // Fetch plan type server-side to pass to form
    const planType = await getUserPlanType(userId);

    return <OnboardingForm initialPlanType={planType} />;
}
