import RenderTemplate from "@/components/template-renderer/RenderTemplate";

export default function TestRenderTemplatePage() {
    // Test data simulating a template from database
    const components = [
        { type: "NavigationSection" },
        { type: "HeroSection" },
        { type: "ServicesSection" },
        { type: "AboutSection" },
        { type: "ServiceAreasSection" },
        { type: "ContactSection" },
        { type: "FooterSection" },
    ];

    const data = {
        NavigationSection: {
            business_name: "Test Business",
            nav_links: [
                { id: "hero", label: "Home" },
                { id: "services", label: "Services" },
                { id: "about", label: "About" },
                { id: "contact", label: "Contact" },
            ],
            cta_label: "Get Quote",
        },
        HeroSection: {
            headline: "Professional",
            highlight: "Services",
            tagline: "Quality work you can trust",
            subtagline: "Serving the community with excellence",
            hero_image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
            cta_primary: "Book Now",
            cta_secondary: "Learn More",
            show_phone_cta: true,
            phone: "1300 123 456",
            variant: "cleaner",
        },
        ServicesSection: {
            heading: "Our Services",
            subheading: "Professional solutions for all your needs",
            services: [
                { icon: "home", title: "Service 1", description: "Professional service" },
                { icon: "building", title: "Service 2", description: "Quality service" },
                { icon: "zap", title: "Service 3", description: "Expert service" },
            ],
        },
        AboutSection: {
            heading: "About Us",
            body: "We are a professional service company.",
            body_2: "With years of experience, we deliver quality results.",
            image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2070&auto=format&fit=crop",
            features: [
                { icon: "shield", title: "Licensed & Insured", description: "Fully certified" },
                { icon: "clock", title: "24/7 Available", description: "Always here" },
            ],
        },
        ServiceAreasSection: {
            heading: "Service Areas",
            subheading: "We serve the local area",
            areas: ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5"],
        },
        ContactSection: {
            heading: "Get In Touch",
            subheading: "We'd love to hear from you",
        },
        FooterSection: {
            business_name: "Test Business",
            blurb: "Professional services. Reliable and committed to excellence.",
            phone: "1300 123 456",
            email: "info@example.com",
            social: {
                facebook: "https://facebook.com",
                instagram: "https://instagram.com",
            },
        },
    };

    return (
        <div>
            <div className="bg-gray-100 p-4 border-b">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold">RenderTemplate Test</h1>
                    <p className="text-sm text-gray-600">
                        Testing updated RenderTemplate with unified COMPONENT_MAP
                    </p>
                </div>
            </div>
            <RenderTemplate
                components={components}
                data={data}
                templateSlug="cleaner-pro"
                customTheme="theme-neutral"
            />
        </div>
    );
}
