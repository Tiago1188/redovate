import { HeroSection as FreeHero } from "@/components/templates/free/HeroSection";
import { NavigationSection as FreeNav } from "@/components/templates/free/NavigationSection";
import { ServicesSection as FreeServices } from "@/components/templates/free/ServicesSection";
import { ContactSection as FreeContact } from "@/components/templates/free/ContactSection";
import { FooterSection as FreeFooter } from "@/components/templates/free/FooterSection";

import { HeroSection as StarterHero } from "@/components/templates/starter/HeroSection";
import { NavigationSection as StarterNav } from "@/components/templates/starter/NavigationSection";
import { ServicesSection as StarterServices } from "@/components/templates/starter/ServicesSection";
import { ContactSection as StarterContact } from "@/components/templates/starter/ContactSection";
import { FooterSection as StarterFooter } from "@/components/templates/starter/FooterSection";
import { AboutSection as StarterAbout } from "@/components/templates/starter/AboutSection";
import { ServiceAreasSection as StarterAreas } from "@/components/templates/starter/ServiceAreasSection";
import { TestimonialsSection as StarterTestimonials } from "@/components/templates/starter/TestimonialsSection";

// Import other components as they are added

export const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    // Free Plan Components
    HeroSection: FreeHero,
    NavigationSection: FreeNav,
    ServicesSection: FreeServices,
    ContactSection: FreeContact,
    FooterSection: FreeFooter,

    // Starter Plan Components (override Free where needed)
    // Note: These will be used when rendering Starter templates
    // HeroSection: StarterHero, // Uncomment to use Starter variant
    // NavigationSection: StarterNav,
    // ServicesSection: StarterServices,
    // ContactSection: StarterContact,
    // FooterSection: StarterFooter,
    AboutSection: StarterAbout,
    ServiceAreasSection: StarterAreas,
    TestimonialsSection: StarterTestimonials,

    // Business Plan Components (To be added)
};
