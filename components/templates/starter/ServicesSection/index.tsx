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
    LucideIcon,
    ChevronDown,
    ChevronUp,
    ArrowRight,
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
    variant?: 'cleaner' | 'voltage' | 'default';
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
};

export function ServicesSection({ data }: { data?: ServicesSectionData }) {
    const [showAll, setShowAll] = useState(false);
    const variant = data?.variant || 'cleaner';

    const services =
        data?.services ??
        [
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
        ];

    const INITIAL_LIMIT = 6;
    const displayedServices = showAll ? services : services.slice(0, INITIAL_LIMIT);
    const hasMore = services.length > INITIAL_LIMIT;

    // Voltage Variant - Numbered List Layout
    if (variant === 'voltage') {
        return (
            <section id="services" className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            {data?.heading ?? "Our Services"}
                        </h2>
                        {data?.subheading && (
                            <p className="text-xl text-muted-foreground">
                                {data.subheading}
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        {displayedServices.map((service, index) => {
                            const Icon = service.icon ? ICONS[service.icon] : Zap;
                            const isEven = index % 2 === 0;

                            return (
                                <div
                                    key={index}
                                    className={`group relative flex items-center gap-6 p-6 rounded-lg border border-border hover:border-primary/50 transition-all ${isEven ? 'bg-secondary/30' : 'bg-background'
                                        }`}
                                >
                                    {/* Number */}
                                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-primary">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Icon */}
                                    <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-muted-foreground">{service.description}</p>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
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

    // Cleaner Variant (Default) - Card Grid Layout
    return (
        <section id="services" className="py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        {data?.heading ?? "Our Services"}
                    </h2>
                    {data?.subheading && (
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {data.subheading}
                        </p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedServices.map((service, index) => {
                        const Icon = service.icon ? ICONS[service.icon] : Zap;
                        return (
                            <Card key={index} className="p-6 bg-card border-border hover:border-primary transition-all hover:shadow-lg">
                                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-muted-foreground">{service.description}</p>
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
