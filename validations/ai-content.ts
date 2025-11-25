import { z } from "zod";

export const CleanedServicesSchema = z.object({
    cleaned_services: z.array(z.object({
        title: z.string().describe("Service Title"),
        description: z.string().describe("1–2 sentence description"),
    })),
});

export type CleanedServices = z.infer<typeof CleanedServicesSchema>;

export const SiteContentSchema = z.object({
    HeroSection: z.object({
        headline: z.string().describe("Main catchy headline for the hero section"),
        highlight: z.string().describe("Highlighted text in headline"),
        tagline: z.string().describe("Tagline/subheadline"),
        subtagline: z.string().optional().describe("Additional description"),
        hero_image: z.string().optional().describe("URL for hero image"),
        cta_primary: z.string().describe("Primary call to action text"),
        cta_secondary: z.string().optional().describe("Secondary call to action text"),
        phone: z.string().optional().describe("Phone number"),
        show_phone_cta: z.boolean().optional().describe("Whether the CTA should show the phone button"),
    }).optional(),
    ServicesSection: z.object({
        heading: z.string().describe("Main heading for services section"),
        subheading: z.string().describe("Subheading for services section"),
        services: z.array(z.object({
            title: z.string(),
            description: z.string().describe("Short description of the service"),
            icon: z.enum(["zap", "home", "building", "wrench", "shield", "clock"]).optional(),
        })).describe("List of services with descriptions"),
    }).optional(),
    AboutSection: z.object({
        heading: z.string().describe("Heading for about section"),
        body: z.string().describe("Main about content"),
        body_2: z.string().optional().describe("Secondary about content"),
        features: z.array(z.object({
            title: z.string(),
            details: z.array(z.string()),
            icon: z.enum(["shield", "clock", "award"]).optional(),
        })).optional(),
        certifications_title: z.string().optional(),
        certifications: z.array(z.string()).optional(),
    }).optional(),
    NavigationSection: z.object({
        business_name: z.string().optional(),
        nav_links: z.array(z.object({
            id: z.string(),
            label: z.string(),
        })).optional(),
        cta_label: z.string().optional(),
    }).optional(),
    ServiceAreasSection: z.object({
        heading: z.string().describe("Heading for service areas"),
        subheading: z.string().optional(),
        areas: z.array(z.string()).describe("List of service areas"),
    }).optional(),
    ContactSection: z.object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
    }).optional(),
    TestimonialsSection: z.object({
        title: z.string(),
        testimonials: z.array(z.object({
            author: z.string(),
            role: z.string().optional(),
            content: z.string(),
            rating: z.number().min(1).max(5),
        })).describe("Fake testimonials relevant to the business"),
    }).optional(),
    MetaSection: z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string()).describe("SEO keywords"),
    }).optional(),
});

export type SiteContent = z.infer<typeof SiteContentSchema>;
