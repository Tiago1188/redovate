import { z } from "zod";

export const BaseContentGenerationSchema = z.object({
    tagline: z.string().describe("A short, punchy tagline for the business (max 60 chars)"),
    aboutShort: z.string().describe("A concise 2-3 sentence summary of the business"),
    aboutFull: z.string().describe("A comprehensive 'About Us' description (300-500 chars)"),
    services: z.array(z.object({
        title: z.string().describe("Service name"),
        description: z.string().describe("Short description of the service benefit"),
        icon: z.string().optional().describe("Suggested icon name (e.g. zap, home, building, wrench, shield, clock, star, users, check)"),
    })).describe("List of key services offered"),
    serviceAreas: z.array(z.string()).describe("List of areas or neighborhoods served"),
    keywords: z.array(z.string()).describe("SEO keywords relevant to the business"),
});

export type BaseContentGeneration = z.infer<typeof BaseContentGenerationSchema>;
