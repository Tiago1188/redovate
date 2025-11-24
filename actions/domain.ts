'use server';

import { randomBytes } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { resolveTxt } from "node:dns/promises";
import { getBusinessData } from "@/actions/business";
import { getUserPlanType } from "@/actions/user";
import { getPlanLimits } from "@/lib/plan-limits";
import {
  CustomDomainSchema,
  SubdomainSchema,
  getPlatformDomainUrl,
  normalizeDomain,
  normalizeSubdomain,
} from "@/lib/validators/domain";

async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

async function requireBusiness() {
  const business = await getBusinessData();
  if (!business) {
    throw new Error("Business not found");
  }
  return business;
}

async function revalidateDashboardDomain() {
  await Promise.all([
    revalidatePath("/dashboard"),
    revalidatePath("/dashboard/domain"),
  ]);
}

export async function updateSubdomainAction(data: { subdomain: string }) {
  await requireAuth();
  const business = await requireBusiness();

  const normalized = normalizeSubdomain(data.subdomain || "");
  const subdomain = SubdomainSchema.parse(normalized);

  if (business.slug === subdomain) {
    return { success: true, slug: subdomain, url: getPlatformDomainUrl(subdomain) };
  }

  const sql = neon(process.env.DATABASE_URL!);
  const existing = await sql`
    SELECT 1 FROM businesses WHERE slug = ${subdomain} AND id <> ${business.id} LIMIT 1
  `;

  if (existing.length > 0) {
    throw new Error("That subdomain is already taken. Please choose another.");
  }

  await sql`
    UPDATE businesses SET slug = ${subdomain}, updated_at = now() WHERE id = ${business.id}
  `;

  await revalidateDashboardDomain();

  return {
    success: true,
    slug: subdomain,
    url: getPlatformDomainUrl(subdomain),
  };
}

export async function updateCustomDomainAction(data: { domain: string | null }) {
  const userId = await requireAuth();
  const planType = (await getUserPlanType(userId)) || "free";
  const limits = getPlanLimits(planType);

  if (!limits.customDomain) {
    throw new Error("Upgrade your plan to connect a custom domain.");
  }

  const business = await requireBusiness();
  const normalized = data.domain ? normalizeDomain(data.domain) : "";
  const hasDomainValue = normalized.length > 0;
  const parsedDomain = hasDomainValue ? CustomDomainSchema.parse(normalized) : null;
  const domainChanged = parsedDomain !== (business.domain || null);

  const sql = neon(process.env.DATABASE_URL!);

  if (!hasDomainValue) {
    await sql`
      UPDATE businesses
      SET domain = NULL,
          dns_verification_token = NULL,
          verified = false,
          verified_date = NULL,
          verified_method = NULL,
          website_url = NULL,
          updated_at = now()
      WHERE id = ${business.id}
    `;
  } else if (domainChanged) {
    await sql`
      UPDATE businesses
      SET domain = ${parsedDomain},
          dns_verification_token = NULL,
          verified = false,
          verified_date = NULL,
          verified_method = NULL,
          website_url = NULL,
          updated_at = now()
      WHERE id = ${business.id}
    `;
  } else {
    await sql`
      UPDATE businesses
      SET domain = ${parsedDomain},
          updated_at = now()
      WHERE id = ${business.id}
    `;
  }

  await revalidateDashboardDomain();

  return {
    success: true,
    domain: parsedDomain,
  };
}

export async function generateDnsTokenAction() {
  const userId = await requireAuth();
  const planType = (await getUserPlanType(userId)) || "free";
  const limits = getPlanLimits(planType);

  if (!limits.customDomain) {
    throw new Error("Upgrade your plan to generate DNS settings.");
  }

  const business = await requireBusiness();

  if (!business.domain) {
    throw new Error("Add a custom domain before generating DNS records.");
  }

  const token = randomBytes(16).toString("hex");
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    UPDATE businesses
    SET dns_verification_token = ${token},
        verified = false,
        verified_date = NULL,
        verified_method = NULL,
        updated_at = now()
    WHERE id = ${business.id}
  `;

  await revalidateDashboardDomain();

  return {
    success: true,
    token,
    record: {
      type: "TXT",
      host: `_redovate.${business.domain}`,
      value: token,
    },
  };
}

export async function verifyDomainAction() {
  const userId = await requireAuth();
  const business = await requireBusiness();

  if (!business.domain || !business.dnsVerificationToken) {
    throw new Error("Domain or verification token missing.");
  }

  const hostname = `_redovate.${business.domain}`;
  let records: string[][] = [];

  try {
    records = await resolveTxt(hostname);
  } catch (error) {
    console.error("DNS resolution failed:", error);
    throw new Error(`Could not find TXT record for ${hostname}. Please verify your DNS settings.`);
  }

  const flatRecords = records.flat();
  const isVerified = flatRecords.includes(business.dnsVerificationToken);

  if (!isVerified) {
    throw new Error("Verification failed. TXT record does not match the token.");
  }

  const sql = neon(process.env.DATABASE_URL!);
  const verifiedDate = new Date();

  await sql`
    UPDATE businesses
    SET verified = true,
        verified_date = ${verifiedDate},
        verified_method = 'dns-txt',
        updated_at = now()
    WHERE id = ${business.id}
  `;

  await revalidateDashboardDomain();

  return {
    success: true,
    verified: true,
    verifiedDate: verifiedDate.toISOString(),
  };
}

export async function publishSiteAction() {
  await requireAuth();
  const business = await requireBusiness();

  const defaultUrl = getPlatformDomainUrl(business.slug);
  const publishedAt = new Date();
  const liveUrl = business.domain && business.verified ? `https://${business.domain}` : defaultUrl;

  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    UPDATE businesses
    SET website_url = ${liveUrl},
        updated_at = ${publishedAt}
    WHERE id = ${business.id}
  `;

  await revalidateDashboardDomain();

  return {
    success: true,
    url: liveUrl,
    publishedAt: publishedAt.toISOString(),
  };
}
