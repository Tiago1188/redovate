import RegistryRenderer from "@/components/template-renderer/RegistryRenderer";

export default function TestStarterPage() {
    // Test data for Starter components
    const sections = [
        {
            type: "NavigationSection",
            data: {
                business_name: "Test Starter Business",
                nav_links: [
                    { id: "hero", label: "Home" },
                    { id: "services", label: "Services" },
                    { id: "areas", label: "Service Areas" },
                    { id: "about", label: "About" },
                    { id: "contact", label: "Contact" },
                ],
                cta_label: "Get Quote",
            },
        },
        {
            type: "HeroSection",
            data: {
                headline: "Professional",
                highlight: "Services",
                tagline: "Quality work you can trust",
                subtagline: "Serving Sydney with excellence since 2020",
                hero_image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
                cta_primary: "Book Now",
                cta_secondary: "Learn More",
                show_phone_cta: true,
                phone: "1300 123 456",
                variant: "cleaner", // Test cleaner variant
                features: ["Fully Insured", "Police Checked", "Eco-Friendly"],
                top_badge: "#1 Rated Service",
                floating_badge_title: "100% Satisfaction",
                floating_badge_subtitle: "Guaranteed on every job",
            },
        },
        {
            type: "ServicesSection",
            data: {
                heading: "Our Services",
                subheading: "Professional solutions for all your needs",
                services: [
                    {
                        icon: "home",
                        title: "Residential",
                        description: "Complete home services",
                    },
                    {
                        icon: "building",
                        title: "Commercial",
                        description: "Business solutions",
                    },
                    {
                        icon: "zap",
                        title: "Emergency",
                        description: "24/7 support",
                    },
                ],
            },
        },
        {
            type: "AboutSection",
            data: {
                heading: "About Us",
                body: "We are a professional service company dedicated to excellence.",
                body_2: "With years of experience, we deliver quality results every time.",
                image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2070&auto=format&fit=crop",
                features: [
                    { icon: "shield", title: "Licensed & Insured", description: "Fully certified" },
                    { icon: "clock", title: "24/7 Available", description: "Always here for you" },
                    { icon: "sparkles", title: "Quality Guaranteed", description: "100% satisfaction" },
                ],
            },
        },
        {
            type: "ServiceAreasSection",
            data: {
                heading: "Service Areas",
                subheading: "We serve the greater Sydney area",
                areas: ["Sydney CBD", "North Shore", "Eastern Suburbs", "Inner West", "South Sydney"],
            },
        },
        {
            type: "TestimonialsSection",
            data: {
                heading: "What Our Clients Say",
                testimonials: [
                    {
                        name: "John Smith",
                        role: "Homeowner",
                        content: "Excellent service! Highly recommended.",
                        rating: 5,
                    },
                ],
            },
        },
        {
            type: "ContactSection",
            data: {
                heading: "Get In Touch",
                subheading: "We'd love to hear from you",
            },
        },
        {
            type: "FooterSection",
            data: {
                business_name: "Test Starter Business",
                blurb: "Professional services across Sydney. Reliable, insured, and committed to excellence.",
                phone: "1300 123 456",
                email: "info@test.com",
                social: {
                    facebook: "https://facebook.com",
                    instagram: "https://instagram.com",
                    linkedin: "https://linkedin.com",
                },
                abn: "12 345 678 901",
                license: "LIC123456",
            },
        },
    ];

    return (
        <div>
            <RegistryRenderer sections={sections} />
        </div>
    );
}
