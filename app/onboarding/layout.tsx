import { redirect } from "next/navigation";
import { syncUser } from "@/actions/user";
import OnboardingLayoutClient from "./OnboardingLayoutClient";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await syncUser();
  
  if (!user || !user.plan_type) {
    redirect("/select-plan");
  }

  return <OnboardingLayoutClient>{children}</OnboardingLayoutClient>;
}

