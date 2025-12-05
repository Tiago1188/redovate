"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { updateDomainSchema, verifyDomainSchema } from "@/lib/validations";
import crypto from "crypto";

export async function getDomainInfo(businessId: string) {
  const result = await sql`
    SELECT domain, dns_verification_token, verified, verified_date, verified_method
    FROM businesses 
    WHERE id = ${businessId}
  `;

  return result[0] ?? null;
}

export async function setCustomDomain(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; verificationToken?: string; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = updateDomainSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.message };
  }

  const { domain } = validation.data;

  try {
    // Generate verification token
    const verificationToken = crypto.randomBytes(16).toString("hex");

    await sql`
      UPDATE businesses
      SET 
        domain = ${domain ?? null},
        dns_verification_token = ${domain ? verificationToken : null},
        verified = false,
        verified_date = null,
        verified_method = null,
        updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true, verificationToken };
  } catch (error) {
    console.error("Error setting custom domain:", error);
    return { success: false, error: "Failed to set custom domain" };
  }
}

export async function verifyDomain(
  businessId: string,
  data: unknown
): Promise<{ success: boolean; verified: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, verified: false, error: "Unauthorized" };
  }

  const validation = verifyDomainSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, verified: false, error: validation.error.message };
  }

  const { domain, verification_method } = validation.data;

  try {
    // Get the verification token
    const result = await sql`
      SELECT dns_verification_token FROM businesses WHERE id = ${businessId}
    `;

    const token = result[0]?.dns_verification_token;
    if (!token) {
      return { success: false, verified: false, error: "No verification token found" };
    }

    // In a real implementation, you would:
    // 1. For DNS verification: query DNS records for TXT record with token
    // 2. For file verification: check if the verification file exists

    // For now, we'll simulate verification (replace with actual DNS lookup)
    const isVerified = await performDnsVerification(domain, token);

    if (isVerified) {
      await sql`
        UPDATE businesses
        SET 
          verified = true,
          verified_date = now(),
          verified_method = ${verification_method},
          updated_at = now()
        WHERE id = ${businessId}
      `;
    }

    return { success: true, verified: isVerified };
  } catch (error) {
    console.error("Error verifying domain:", error);
    return { success: false, verified: false, error: "Failed to verify domain" };
  }
}

async function performDnsVerification(
  domain: string,
  expectedToken: string
): Promise<boolean> {
  // TODO: Implement actual DNS TXT record verification
  // This would use the dns module to resolve TXT records
  // and check for the verification token

  // Placeholder - always returns false in development
  console.log(`Would verify DNS for ${domain} with token ${expectedToken}`);
  return false;
}

export async function removeDomain(
  businessId: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await sql`
      UPDATE businesses
      SET 
        domain = null,
        dns_verification_token = null,
        verified = false,
        verified_date = null,
        verified_method = null,
        updated_at = now()
      WHERE id = ${businessId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error removing domain:", error);
    return { success: false, error: "Failed to remove domain" };
  }
}

