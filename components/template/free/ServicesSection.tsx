import React from "react";
import { Star, Sparkles, ShieldCheck, Clock, CheckCircle } from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
}

interface ServicesData {
  services?: ServiceItem[];
}

export function ServicesSection({ data, theme }: { data?: ServicesData; theme?: any }) {
  const primaryColor = theme?.primary || "#0ea5e9";
  
  // Enforce min 3, max 5 services
  const rawServices = Array.isArray(data?.services) ? data.services : [];
  const services = rawServices.slice(0, 5);

  // Fallback if fewer than 3 (should be handled by AI/validation but good for UI)
  if (services.length < 3 && rawServices.length === 0) {
      // Default placeholders if absolutely no data
      services.push(
          { title: "Service 1", description: "Description for service 1." },
          { title: "Service 2", description: "Description for service 2." },
          { title: "Service 3", description: "Description for service 3." }
      );
  }

  // Helper to get icon component if available or fallback
  const getIcon = (idx: number) => {
    const icons = [Sparkles, ShieldCheck, Clock, Star, CheckCircle];
    return icons[idx % icons.length];
  };

  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span 
            className="text-xs md:text-sm font-bold uppercase tracking-wider block"
            style={{ color: primaryColor }}
          >
            Our Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900">
            Our Services
          </h2>
          <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
            Professional services tailored to your needs.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
          {services.map((service: any, idx: number) => {
            const Icon = getIcon(idx);
            
            return (
              <div
                key={idx}
                className="group relative p-6 md:p-8 rounded-3xl bg-zinc-50 border border-zinc-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div 
                    className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-110"
                >
                    <Icon className="w-24 h-24 md:w-32 md:h-32" style={{ color: primaryColor }} />
                </div>

                <div className="relative z-10 space-y-4 md:space-y-6">
                  <div 
                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-sm text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-2 md:mb-3 group-hover:text-blue-600 transition-colors">
                        {service.title || service}
                    </h3>
                    <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                        {service.description || "Professional service description."}
                    </p>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

