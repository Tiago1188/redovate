import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getBusinessForUser } from "@/actions/businesses";

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

  // Redirect to first step
  redirect("/onboarding/business-type");
}

