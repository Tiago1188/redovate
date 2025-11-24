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
    data?.areas ?? ["Sydney CBD", "North Sydney", "Eastern Suburbs", "Inner West", "Parramatta"];

  const INITIAL_LIMIT = 6;
  const displayedAreas = showAll ? areas : areas.slice(0, INITIAL_LIMIT);
  const hasMore = areas.length > INITIAL_LIMIT;

  return (
    <section id="areas" className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {data?.heading ?? "Proudly Serving Your Community"}
          </h2>
          {data?.subheading && (
            <p className="text-lg text-white/80">
              {data.subheading}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {displayedAreas.map((area, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all text-white font-medium"
            >
              <MapPin className="w-4 h-4" />
              {area}
            </span>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8">
            <Button
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              className="text-white hover:bg-white/10 hover:text-white gap-2"
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

        <div className="mt-12 pt-12 border-t border-white/10">
          <p className="text-white/60 text-sm">Don&apos;t see your area? Contact us to check availability.</p>
        </div>
      </div>
    </section>
  );
}
