/**
 * Universal Required Fields - Every Business Must Provide
 * These fields are required across all templates and business types
 */

export interface UniversalField {
  name: string;
  required: boolean;
  notes: string;
  usedIn: string[];
}

export const UNIVERSAL_FIELDS: UniversalField[] = [
  {
    name: "business_name",
    required: true,
    notes: "Shown in hero, footer, SEO",
    usedIn: ["hero", "footer", "seo", "header"],
  },
  {
    name: "abn",
    required: true,
    notes: "Required for AU businesses",
    usedIn: ["footer", "legal"],
  },
  {
    name: "category",
    required: true,
    notes: "e.g., plumber, cleaner, builder",
    usedIn: ["seo", "directory"],
  },
  {
    name: "primary_service",
    required: true,
    notes: "Used by templates + SEO",
    usedIn: ["hero", "seo", "services"],
  },
  {
    name: "about",
    required: true,
    notes: "Base content for AI expansion",
    usedIn: ["about", "seo"],
  },
  {
    name: "phone_or_email",
    required: true,
    notes: "At least one must be provided",
    usedIn: ["header", "footer", "contact"],
  },
  {
    name: "services",
    required: true,
    notes: "At least 3 services",
    usedIn: ["services", "seo"],
  },
  {
    name: "service_areas",
    required: true,
    notes: "Minimum 1 service area",
    usedIn: ["footer", "seo", "service-areas"],
  },
  {
    name: "logo",
    required: true,
    notes: "Used in search results + dashboard",
    usedIn: ["header", "footer", "favicon"],
  },
];

export const MINIMUM_SERVICES = 3;
export const MINIMUM_SERVICE_AREAS = 1;

export function isUniversalFieldRequired(fieldName: string): boolean {
  const field = UNIVERSAL_FIELDS.find((f) => f.name === fieldName);
  return field?.required ?? false;
}

export function getFieldUsage(fieldName: string): string[] {
  const field = UNIVERSAL_FIELDS.find((f) => f.name === fieldName);
  return field?.usedIn ?? [];
}

