import { z } from "zod";

const SUBDOMAIN_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/;
const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export const PLATFORM_SUBDOMAIN_SUFFIX =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN?.replace(/^https?:\/\//, "")?.replace(/\/.*$/, "") ||
  "myredovate.com";

export const SubdomainSchema = z
  .string()
  .min(3, "Subdomain must be at least 3 characters.")
  .max(63, "Subdomain cannot be longer than 63 characters.")
  .regex(SUBDOMAIN_REGEX, "Only lowercase letters, numbers, and single hyphens are allowed.");

export const CustomDomainSchema = z
  .string()
  .min(3, "Domain must be at least 3 characters.")
  .max(253, "Domain is too long.")
  .regex(DOMAIN_REGEX, "Enter a valid domain like example.com or site.example.com.");

export function normalizeSubdomain(input: string): string {
  let value = input.toLowerCase().trim();
  value = value.replace(/^https?:\/\//, "");
  value = value.replace(/\s+/g, "-");
  value = value.replace(/[^a-z0-9-]/g, "");
  value = value.replace(/-+/g, "-");
  value = value.replace(/^-+/, "").replace(/-+$/, "");
  return value.slice(0, 63);
}

export function normalizeDomain(input: string): string {
  let value = input.toLowerCase().trim();
  value = value.replace(/^https?:\/\//, "");
  value = value.replace(/\/.*$/, "");
  value = value.replace(/[^a-z0-9.-]/g, "");
  value = value.replace(/-+/g, "-");
  value = value.replace(/^-+/, "").replace(/-+$/, "");
  return value;
}

export function getPlatformDomainUrl(subdomain: string) {
  const cleaned = normalizeSubdomain(subdomain);
  const value = cleaned.length > 0 ? cleaned : subdomain;
  
  if (process.env.NODE_ENV === "development") {
    return `http://${value}.localhost:3000`;
  }
  
  return `https://${value}.${PLATFORM_SUBDOMAIN_SUFFIX}`;
}

