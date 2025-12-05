import type { SectionType, PlanType } from "@/types";

export interface TemplateMetadata {
  slug: string;
  name: string;
  description: string;
  planLevel: PlanType;
  sections: SectionMetadata[];
  thumbnail?: string;
}

export interface SectionMetadata {
  type: SectionType;
  variants: SectionVariant[];
}

export interface SectionVariant {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

export const SECTION_TYPES: SectionType[] = [
  "header",
  "hero",
  "services",
  "about",
  "gallery",
  "testimonials",
  "contact",
  "cta",
  "footer",
];

export const SECTION_VARIANTS: Record<SectionType, SectionVariant[]> = {
  header: [
    { id: "Header1", name: "Simple", description: "Clean navigation bar" },
    { id: "Header2", name: "With CTA", description: "Navigation with call-to-action button" },
  ],
  hero: [
    { id: "Hero1", name: "Centered", description: "Centered text with background image" },
    { id: "Hero2", name: "Split", description: "Text on left, image on right" },
    { id: "Hero3", name: "Full Width", description: "Full-width background with overlay" },
    { id: "Hero4", name: "Minimal", description: "Simple text-focused hero" },
    { id: "Hero5", name: "Video", description: "Background video hero" },
  ],
  services: [
    { id: "Services1", name: "Grid", description: "Services in a grid layout" },
    { id: "Services2", name: "Cards", description: "Service cards with icons" },
    { id: "Services3", name: "List", description: "Detailed service list" },
  ],
  about: [
    { id: "About1", name: "Simple", description: "Text with side image" },
    { id: "About2", name: "Timeline", description: "Company timeline format" },
  ],
  gallery: [
    { id: "Gallery1", name: "Grid", description: "Image grid gallery" },
    { id: "Gallery2", name: "Masonry", description: "Masonry-style gallery" },
  ],
  testimonials: [
    { id: "Testimonials1", name: "Carousel", description: "Sliding testimonials" },
    { id: "Testimonials2", name: "Grid", description: "Testimonial cards in grid" },
  ],
  contact: [
    { id: "Contact1", name: "Form + Info", description: "Contact form with info sidebar" },
    { id: "Contact2", name: "Map", description: "Contact form with embedded map" },
  ],
  cta: [
    { id: "Cta1", name: "Simple", description: "Single call-to-action banner" },
    { id: "Cta2", name: "Split", description: "Two-column CTA section" },
  ],
  footer: [
    { id: "Footer1", name: "Simple", description: "Minimal footer with links" },
    { id: "Footer2", name: "Full", description: "Full footer with multiple columns" },
  ],
};

export const TEMPLATES: TemplateMetadata[] = [
  {
    slug: "starter",
    name: "Starter",
    description: "A clean, professional template for service businesses",
    planLevel: "free",
    sections: SECTION_TYPES.map((type) => ({
      type,
      variants: SECTION_VARIANTS[type],
    })),
  },
  {
    slug: "professional",
    name: "Professional",
    description: "Premium template with advanced sections",
    planLevel: "starter",
    sections: SECTION_TYPES.map((type) => ({
      type,
      variants: SECTION_VARIANTS[type],
    })),
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    description: "Full-featured template for established businesses",
    planLevel: "business",
    sections: SECTION_TYPES.map((type) => ({
      type,
      variants: SECTION_VARIANTS[type],
    })),
  },
];

export function getTemplateBySlug(slug: string): TemplateMetadata | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function getSectionVariants(sectionType: SectionType): SectionVariant[] {
  return SECTION_VARIANTS[sectionType] ?? [];
}

