import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getServices } from "@/actions/services";
import { getUserPlanType } from "@/actions/user";
import { getPlanLimits } from "@/lib/plan-limits";
import { ServicesClient } from "@/components/dashboard/services/services-client";

export const metadata: Metadata = {
  title: "Services | Dashboard",
  description: "Manage your business services",
};

export default async function ServicesPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const [services, planType] = await Promise.all([
    getServices(),
    getUserPlanType(userId),
  ]);

  const currentPlan = planType || "free";
  const limits = getPlanLimits(currentPlan);

  return (
    <ServicesClient
      initialServices={services}
      maxServices={limits.maxServices}
    />
  );
}

