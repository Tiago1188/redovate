export interface BaseWebsiteContent {
    businessName: string;
    tradingName?: string;
    tagline?: string;
    aboutShort?: string;
    aboutFull?: string;
    yearFounded?: number;
    industry?: string;

    abn?: string;
    licenseNumber?: string;

    phone: string;
    mobile?: string;
    email: string;
    address?: string;
    googleMapsUrl?: string;

    socialLinks: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
        tiktok?: string;
        whatsapp?: string;
    };

    services: Array<{
        title: string;
        description?: string;
        price?: string;
        image?: string;
        icon?: string;
    }>;

    serviceAreas: string[];
    keywords?: string[];

    locations: Array<{
        label: string;
        address: string;
    }>;

    hours?: Record<string, string>;

    logo?: string;
    profileImage?: string;
    heroImage?: string;
    gallery?: string[];

    testimonials?: Array<{
        name: string;
        message: string;
        rating?: number;
    }>;

    certifications?: string[];

    pricing?: Array<{
        name: string;
        price: string;
        features: string[];
    }>;

    faq?: Array<{
        question: string;
        answer: string;
    }>;

    team?: Array<{
        name: string;
        role: string;
        image?: string;
    }>;

    projects?: Array<{
        title: string;
        description: string;
        images: string[];
    }>;
}
