import RegistryRenderer from "@/components/template-renderer/RegistryRenderer";

export default function TestRendererPage() {
    const sections = [
        { type: "NavigationSection", id: "nav-1" },
        { type: "HeroSection", id: "hero-1" },
        { type: "ServicesSection", id: "services-1" },
        { type: "ContactSection", id: "contact-1" },
        { type: "FooterSection", id: "footer-1" },
    ];

    const data = {
        "nav-1": {
            business_name: "Test Business",
            cta_label: "Call Now"
        },
        "hero-1": {
            headline: "Welcome to the Future",
            subtagline: "Testing the new registry renderer.",
            cta_primary: "Get Started"
        },
        "services-1": {
            heading: "Our Services",
            services: [
                { title: "Service A", description: "Description A" },
                { title: "Service B", description: "Description B" }
            ]
        },
        "contact-1": {
            heading: "Contact Us"
        },
        "footer-1": {
            business_name: "Test Business",
            email: "test@example.com"
        }
    };

    return (
        <RegistryRenderer
            sections={sections}
            data={data}
            showBranding={true}
        />
    );
}
