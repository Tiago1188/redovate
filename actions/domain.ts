'use server';

import { randomBytes } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import pool from "@/lib/db";
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

  const existing = await pool.query(
    `SELECT 1 FROM businesses WHERE slug = $1 AND id <> $2 LIMIT 1`,
    [subdomain, business.id]
  );

  if ((existing.rowCount ?? 0) > 0) {
    throw new Error("That subdomain is already taken. Please choose another.");
  }

  await pool.query(
    `UPDATE businesses SET slug = $1, updated_at = now() WHERE id = $2`,
    [subdomain, business.id]
  );

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

  if (!hasDomainValue) {
    await pool.query(
      `UPDATE businesses
       SET domain = NULL,
           dns_verification_token = NULL,
           verified = false,
           verified_date = NULL,
           verified_method = NULL,
           website_url = NULL,
           updated_at = now()
       WHERE id = $1`,
      [business.id]
    );
  } else if (domainChanged) {
    await pool.query(
      `UPDATE businesses
       SET domain = $1,
           dns_verification_token = NULL,
           verified = false,
           verified_date = NULL,
           verified_method = NULL,
           website_url = NULL,
           updated_at = now()
       WHERE id = $2`,
      [parsedDomain, business.id]
    );
  } else {
    await pool.query(
      `UPDATE businesses
       SET domain = $1,
           updated_at = now()
       WHERE id = $2`,
      [parsedDomain, business.id]
    );
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

  await pool.query(
    `UPDATE businesses
     SET dns_verification_token = $1,
         verified = false,
         verified_date = NULL,
         verified_method = NULL,
         updated_at = now()
     WHERE id = $2`,
    [token, business.id]
  );

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

export async function publishSiteAction() {
  await requireAuth();
  const business = await requireBusiness();

  const defaultUrl = getPlatformDomainUrl(business.slug);
  const publishedAt = new Date();
  const liveUrl = business.domain && business.verified ? `https://${business.domain}` : defaultUrl;

  await pool.query(
    `UPDATE businesses
     SET website_url = $1,
         updated_at = $2
     WHERE id = $3`,
    [liveUrl, publishedAt, business.id]
  );

  await revalidateDashboardDomain();

  return {
    success: true,
    url: liveUrl,
    publishedAt: publishedAt.toISOString(),
  };
}

