import { z } from "zod";

export const updateBusinessSchema = z.object({
  business_name: z.string().min(2).max(100).optional(),
  trading_name: z.string().max(100).optional(),
  abn: z.string().regex(/^\d{11}$/).optional().or(z.literal("")),
  category: z.string().optional(),
  tagline: z.string().max(200).optional(),
  about: z.string().min(50).max(2000).optional(),
  year_founded: z.number().min(1800).max(new Date().getFullYear()).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  logo: z.string().url().optional(),
  hero_image: z.string().url().optional(),
});

export const updateThemeSchema = z.object({
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  font_heading: z.string().optional(),
  font_body: z.string().optional(),
});

export const updateHoursSchema = z.object({
  monday: z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  }).optional(),
  tuesday: z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  }).optional(),
  wednesday: z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  }).optional(),
  thursday: z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  }).optional(),
  friday: z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  }).optional(),
  saturday: z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  }).optional(),
  sunday: z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  }).optional(),
});

export const updateSocialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  tiktok: z.string().url().optional().or(z.literal("")),
});

export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
export type UpdateHoursInput = z.infer<typeof updateHoursSchema>;
export type UpdateSocialLinksInput = z.infer<typeof updateSocialLinksSchema>;

