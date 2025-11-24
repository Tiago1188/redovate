'use client';

import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface ServiceAreasSectionData {
  heading?: string;
  subheading?: string;
  areas?: string[];
}

export function ServiceAreasSection({ data }: { data?: ServiceAreasSectionData }) {
  const [showAll, setShowAll] = useState(false);
  const areas =
    data?.areas ?? ["Sydney CBD", "North Sydney", "Eastern Suburbs", "Inner West"];

  const INITIAL_LIMIT = 6;
  const displayedAreas = showAll ? areas : areas.slice(0, INITIAL_LIMIT);
  const hasMore = areas.length > INITIAL_LIMIT;

  return (
    <section id="areas" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {data?.heading ?? "Service Areas"}
          </h2>
          {data?.subheading && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {data.subheading}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {displayedAreas.map((area, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="font-medium">{area}</span>
            </div>
          ))}
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
                  Show All Areas <ChevronDown className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
