import { MapPin } from "lucide-react";

export interface ServiceAreasSectionData {
  heading?: string;
  subheading?: string;
  areas?: string[];
}

export function ServiceAreasSection({ data }: { data?: ServiceAreasSectionData }) {
  const areas =
    data?.areas ?? ["Sydney CBD", "North Sydney", "Eastern Suburbs", "Inner West"];

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
          {areas.map((area, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="font-medium">{area}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
