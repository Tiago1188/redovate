import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getHeroSection } from "@/actions/hero";
import { getUserPlanType } from "@/actions/user";
import { getPlanLimits } from "@/lib/plan-limits";
import { HeroClient } from "@/components/dashboard/hero/hero-client";

export const metadata: Metadata = {
  title: "Hero Section | Dashboard",
  description: "Manage the hero content visitors see first.",
};

export default async function HeroPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const [heroData, planType] = await Promise.all([
    getHeroSection(),
    getUserPlanType(userId),
  ]);

  if (!heroData) {
    redirect("/dashboard");
  }

  const currentPlan = planType || "free";
  const limits = getPlanLimits(currentPlan);

  return (
    <HeroClient
      initialData={heroData}
      maxImages={limits.maxImages}
    />
  );
}

