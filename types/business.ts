export type BusinessType = "sole_trader" | "company";
export type BusinessStatus = "active" | "pending" | "suspended";

export interface Business {
  id: string;
  user_id: string;
  industry_id?: string;
  business_name: string;
  trading_name?: string;
  slug: string;
  abn?: string;
  category?: string;
  business_type: BusinessType;
  year_founded?: number;
  tagline?: string;
  about?: string;
  locations: Location[];
  service_areas: ServiceArea[];
  services: Service[];
  keywords: string[];
  products: Product[];
  images: BusinessImage[];
  site_content: Record<string, unknown>;
  logo?: string;
  hero_image?: string;
  favicon?: string;
  theme: BusinessTheme;
  hours: BusinessHours;
  email?: string;
  phone?: string;
  mobile?: string;
  social_links: SocialLinks;
  website_url?: string;
  base_content: Record<string, unknown>;
  domain?: string;
  dns_verification_token?: string;
  verified: boolean;
  verified_date?: Date;
  verified_method?: string;
  terms_accepted: boolean;
  plan_type: PlanType;
  plan_expiry_date?: Date;
  status: BusinessStatus;
  ai_generations_count: number;
  ai_period_start: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Location {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  is_primary: boolean;
}

export interface ServiceArea {
  id?: string;
  name: string;
  suburb?: string;
  postcode?: string;
  radius_km?: number;
}

export interface Service {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  price_type?: "fixed" | "hourly" | "quote";
  is_featured?: boolean;
}

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface BusinessImage {
  id?: string;
  url: string;
  alt?: string;
  type: "gallery" | "hero" | "logo" | "favicon";
}

export interface BusinessTheme {
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_heading?: string;
  font_body?: string;
}

export interface BusinessHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

// PlanType is defined in ./plan.ts
import type { PlanType } from "./plan";
export type { PlanType };

