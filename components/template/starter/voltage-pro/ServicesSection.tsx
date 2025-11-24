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
  LucideIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type ServiceItem = {
  title: string;
  description: string;
  icon?: string; // icon key from ICONS
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
};

export function ServicesSection({ data }: { data?: ServicesSectionData }) {
  const [showAll, setShowAll] = useState(false);
  const services =
    data?.services ??
    [
      {
        icon: "home",
        title: "Residential Service",
        description:
          "Complete solutions for homes including upgrades, repairs, and safety checks.",
      },
      {
        icon: "building",
        title: "Commercial Service",
        description:
          "Installations and maintenance for offices, retail, and facilities.",
      },
      {
        icon: "zap",
        title: "Emergency Support",
        description:
          "Fast response for urgent issues and outages.",
      },
    ];

  const INITIAL_LIMIT = 6;
  const displayedServices = showAll ? services : services.slice(0, INITIAL_LIMIT);
  const hasMore = services.length > INITIAL_LIMIT;

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
              <Card key={index} className="p-6 bg-card border-border hover:border-primary transition-all">
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
