import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getBusinessForUser } from "@/actions/businesses";
import { syncUser } from "@/actions/user";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already has a business
  const existingBusiness = await getBusinessForUser();
  if (existingBusiness) {
    redirect("/dashboard");
  }

  // Check if user has a plan selected
  const user = await syncUser();
  if (!user || !user.plan_type) {
    redirect("/select-plan");
  }

  // Redirect to first step
  redirect("/onboarding/business-type");
}
