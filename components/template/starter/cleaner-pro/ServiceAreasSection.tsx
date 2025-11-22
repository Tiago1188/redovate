import { MapPin } from "lucide-react";

export interface ServiceAreasSectionData {
  heading?: string;
  subheading?: string;
  areas?: string[];
}

export function ServiceAreasSection({ data }: { data?: ServiceAreasSectionData }) {
  const areas =
    data?.areas ?? ["Sydney CBD", "North Sydney", "Eastern Suburbs", "Inner West", "Parramatta"];

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
          {areas.map((area, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all text-white font-medium"
            >
              <MapPin className="w-4 h-4" />
              {area}
            </span>
          ))}
        </div>
        
        <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-white/60 text-sm">Don&apos;t see your area? Contact us to check availability.</p>
        </div>
      </div>
    </section>
  );
}
