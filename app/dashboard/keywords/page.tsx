import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getKeywords } from "@/actions/keywords";
import { getUserPlanType } from "@/actions/user";
import { getPlanLimits } from "@/lib/plan-limits";
import { KeywordsClient } from "@/components/dashboard/keywords/keywords-client";

export const metadata: Metadata = {
    title: "Keywords | Dashboard",
    description: "Manage your SEO keywords",
};

export default async function KeywordsPage() {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

    const [keywords, planType] = await Promise.all([
        getKeywords(),
        getUserPlanType(userId),
    ]);

    const currentPlan = planType || "free";
    const limits = getPlanLimits(currentPlan);

    return (
        <KeywordsClient
            initialKeywords={keywords}
            maxKeywords={limits.maxKeywords}
        />
    );
}
