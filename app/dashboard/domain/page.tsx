import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBusinessData } from "@/actions/business";
import { getUserPlanType } from "@/actions/user";
import { getPlanLimits } from "@/lib/plan-limits";
import { DomainManager } from "@/components/dashboard/domain/domain-manager";

export const metadata: Metadata = {
  title: "Domain Settings | Dashboard",
  description: "Configure your Redovate subdomain, custom domain, and publishing status.",
};

export default async function DomainSettingsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const business = await getBusinessData();
  if (!business) {
    redirect("/onboarding");
  }

  const planType = (await getUserPlanType(userId)) || "free";
  const limits = getPlanLimits(planType);

  return (
    <div className="px-4 md:px-6 py-4 md:py-6">
      <DomainManager
        planType={planType}
        canUseCustomDomain={limits.customDomain}
        business={{
          id: business.id,
          name: business.businessName,
          slug: business.slug,
          domain: business.domain,
          verified: business.verified,
          verifiedDate: business.verifiedDate ? new Date(business.verifiedDate).toISOString() : null,
          dnsVerificationToken: business.dnsVerificationToken,
          websiteUrl: business.websiteUrl,
          updatedAt: business.websiteUrl && business.updatedAt ? new Date(business.updatedAt).toISOString() : null,
        }}
      />
    </div>
  );
}

