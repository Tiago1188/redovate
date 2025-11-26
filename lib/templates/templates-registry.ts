// lib/templates/templates-registry.ts

/**
 * Master Component Registry for ALL plans.
 * This determines:
 *  - Which components exist
 *  - Which props each component supports
 *  - Which plans can use each component
 *  - Required props vs optional props
 */

export type ComponentPlan = "free" | "starter" | "business";

export interface ComponentDefinition {
    label: string;
    allowedPlans: ComponentPlan[];
    allowedProps: Record<string, string>;     // propName → type
    requiredProps?: string[];                 // optional
}

/**
 * MASTER REGISTRY
 * Each component defines:
 *  - label: UI name
 *  - allowedPlans: free/starter/business
 *  - allowedProps: what can be stored in supported_props
 *  - requiredProps: what must exist in fake_content + business content
 */

export const TEMPLATE_COMPONENT_REGISTRY: Record<string, ComponentDefinition> = {
    // =====================================================
    // FREE PLAN
    // =====================================================
    NavigationSection: {
        label: "Navigation",
        allowedPlans: ["free", "starter", "business"],
        allowedProps: {
            business_name: "string",
            nav_links: "array",
            cta_label: "string",
        },
        requiredProps: ["business_name"],
    },

    HeroSection: {
        label: "Hero Section",
        allowedPlans: ["free", "starter", "business"],
        allowedProps: {
            headline: "string",
            highlight: "string",
            tagline: "string",
            subtagline: "string",
            hero_image: "string",
            cta_primary: "string",
            cta_secondary: "string",
            show_phone_cta: "boolean",
            // New props for template flexibility
            features: "array",
            top_badge: "string",
            floating_badge_title: "string",
            floating_badge_subtitle: "string",
            variant: "string", // 'cleaner' | 'voltage' | 'default'
        },
        requiredProps: ["headline", "hero_image", "cta_primary"],
    },

    ServicesSection: {
        label: "Services",
        allowedPlans: ["free", "starter", "business"],
        allowedProps: {
            heading: "string",
            subheading: "string",
            services: "array",
        },
        requiredProps: ["services"],
    },

    ContactSection: {
        label: "Contact",
        allowedPlans: ["free", "starter", "business"],
        allowedProps: {
            heading: "string",
            subheading: "string",
        },
    },

    FooterSection: {
        label: "Footer",
        allowedPlans: ["free", "starter", "business"],
        allowedProps: {
            business_name: "string",
            email: "string",
            phone: "string",
            abn: "string",
            blurb: "string",
            license: "string",
            social: "object",
        },
    },

    // =====================================================
    // STARTER PLAN
    // =====================================================
    AboutSection: {
        label: "About",
        allowedPlans: ["starter", "business"],
        allowedProps: {
            heading: "string",
            body: "string",
            body_2: "string",
            image: "string",
            features: "array",
            certifications: "array",
            certifications_title: "string",
        },
    },

    ServiceAreasSection: {
        label: "Service Areas",
        allowedPlans: ["starter", "business"],
        allowedProps: {
            heading: "string",
            subheading: "string",
            areas: "array",
        },
    },

    FAQSection: {
        label: "FAQs",
        allowedPlans: ["starter", "business"],
        allowedProps: {
            heading: "string",
            items: "array",
        },
    },

    WorkingHoursSection: {
        label: "Working Hours",
        allowedPlans: ["starter", "business"],
        allowedProps: {
            heading: "string",
            hours: "array",
        },
    },

    TeamSection: {
        label: "Team",
        allowedPlans: ["starter", "business"],
        allowedProps: {
            heading: "string",
            members: "array",
        },
    },

    GallerySection: {
        label: "Gallery",
        allowedPlans: ["starter", "business"],
        allowedProps: {
            heading: "string",
            images: "array",
        },
    },

    TestimonialsSection: {
        label: "Testimonials",
        allowedPlans: ["starter", "business"],
        allowedProps: {
            heading: "string",
            testimonials: "array",
        },
    },

    CTASection: {
        label: "Call to Action",
        allowedPlans: ["starter", "business"],
        allowedProps: {
            heading: "string",
            subheading: "string",
            button_label: "string",
            button_target: "string",
        },
    },

    MapSection: {
        label: "Map",
        allowedPlans: ["starter", "business"],
        allowedProps: {
            location: "string",
            embed_url: "string",
        },
    },

    // =====================================================
    // BUSINESS PLAN
    // =====================================================
    PortfolioSection: {
        label: "Portfolio",
        allowedPlans: ["business"],
        allowedProps: {
            heading: "string",
            projects: "array",
        },
    },

    PricingTableSection: {
        label: "Pricing Tables",
        allowedPlans: ["business"],
        allowedProps: {
            heading: "string",
            tiers: "array",
        },
    },

    ProductsSection: {
        label: "Products",
        allowedPlans: ["business"],
        allowedProps: {
            heading: "string",
            products: "array",
        },
    },

    FeaturesSection: {
        label: "Features",
        allowedPlans: ["business"],
        allowedProps: {
            heading: "string",
            features: "array",
        },
    },

    MultiCTASection: {
        label: "Multi CTA",
        allowedPlans: ["business"],
        allowedProps: {
            primary_label: "string",
            primary_target: "string",
            secondary_label: "string",
            secondary_target: "string",
            tertiary_label: "string",
            tertiary_target: "string",
        },
    },

    BlogListSection: {
        label: "Blog",
        allowedPlans: ["business"],
        allowedProps: {
            heading: "string",
            posts: "array",
        },
    },

    BusinessLocationsSection: {
        label: "Business Locations",
        allowedPlans: ["business"],
        allowedProps: {
            heading: "string",
            locations: "array",
        },
    },

    AdvancedContactSection: {
        label: "Advanced Contact",
        allowedPlans: ["business"],
        allowedProps: {
            heading: "string",
            fields: "array",
            success_message: "string",
        },
    },

    StatsSection: {
        label: "Stats",
        allowedPlans: ["business"],
        allowedProps: {
            stats: "array",
            heading: "string",
        },
    },

    CertificationBadgesSection: {
        label: "Certifications",
        allowedPlans: ["business"],
        allowedProps: {
            heading: "string",
            badges: "array",
        },
    },
};

/**
 * Helper: returns only components allowed for a plan.
 */
export function getComponentsForPlan(plan: ComponentPlan) {
    return Object.entries(TEMPLATE_COMPONENT_REGISTRY)
        .filter(([_, def]) => def.allowedPlans.includes(plan))
        .map(([key]) => key);
}
