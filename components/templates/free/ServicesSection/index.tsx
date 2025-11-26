'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Zap,
    Home,
    Building2,
    Wrench,
    ShieldCheck,
    Clock,
    Sparkles,
    BedDouble,
    ArrowRight,
    LucideIcon,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

type ServiceItem = {
    title: string;
    description: string;
    icon?: string;
};

export interface ServicesSectionData {
    heading?: string;
    subheading?: string;
    services?: ServiceItem[];
}

const ICONS: Record<string, LucideIcon> = {
    zap: Zap,
    home: Home,
    building: Building2,
    wrench: Wrench,
    shield: ShieldCheck,
    clock: Clock,
    sparkles: Sparkles,
    bed: BedDouble,
    // Add more as needed
};

export function ServicesSection({ data }: { data?: ServicesSectionData }) {
    const [showAll, setShowAll] = useState(false);
    const services =
        data?.services ??
        [
            {
                icon: "home",
                title: "Residential",
                description: "Deep cleaning for houses and apartments.",
            },
            {
                icon: "building",
                title: "Commercial",
                description: "Office and workspace maintenance.",
            },
            {
                icon: "bed",
                title: "Airbnb",
                description: "Turnover cleaning for hosts.",
            },
        ];

    const INITIAL_LIMIT = 6;
    const displayedServices = showAll ? services : services.slice(0, INITIAL_LIMIT);
    const hasMore = services.length > INITIAL_LIMIT;

    return (
        <section id="services" className="py-24 bg-background relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="max-w-2xl">
                        <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Our Expertise</span>
                        <h2 className="text-4xl font-bold mb-4 tracking-tight">
                            {data?.heading ?? "Premium Cleaning Services"}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            {data?.subheading ?? "We offer a comprehensive range of cleaning solutions tailored to your specific needs."}
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedServices.map((service, index) => {
                        const Icon = (service.icon && ICONS[service.icon]) || Sparkles;
                        return (
                            <Card
                                key={index}
                                className="group relative p-8 bg-secondary/20 hover:bg-primary text-foreground hover:text-primary-foreground border-0 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Icon className="w-24 h-24" />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-background group-hover:bg-white/20 flex items-center justify-center mb-6 transition-colors shadow-sm">
                                        <Icon className="w-6 h-6 text-primary group-hover:text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                    <p className="text-muted-foreground group-hover:text-primary-foreground/90 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {hasMore && (
                    <div className="mt-12 text-center">
                        <Button
                            variant="outline"
                            onClick={() => setShowAll(!showAll)}
                            className="gap-2"
                        >
                            {showAll ? (
                                <>
                                    Show Less <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Show All Services <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
