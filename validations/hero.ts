import { z } from "zod";

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const HeroFormSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(3, "Headline must be at least 3 characters")
    .max(160, "Headline must be under 160 characters"),
  highlight: optionalString(80),
  tagline: optionalString(180),
  subtagline: optionalString(240),
  ctaPrimary: optionalString(60),
  ctaSecondary: optionalString(60),
  showPhoneCTA: z.boolean().default(false),
  heroImage: z
    .string()
    .url("Hero image must be a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  heroImagePublicId: optionalString(120),
});

export type HeroFormInput = z.input<typeof HeroFormSchema>;
export type HeroFormData = z.output<typeof HeroFormSchema>;

