import React from "react";
import { CheckCircle } from "lucide-react";

export function AboutSection({ data, theme }: { data?: any; theme?: any }) {
  const aboutImage =
    data?.image ||
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&auto=format&fit=crop&w=1000";
  
  const primaryColor = theme?.primary || "#0ea5e9";

  return (
    <section id="about" className="py-24 px-6 bg-zinc-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* IMAGE SIDE */}
          <div className="relative order-2 lg:order-1 mt-8 lg:mt-0">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] w-full">
              <img
                src={aboutImage}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                alt="About our company"
                style={{ objectPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-6 -right-4 md:-bottom-12 md:-right-12 bg-white p-4 md:p-8 rounded-2xl shadow-xl max-w-[160px] md:max-w-[200px] border border-zinc-100 hidden sm:block">
              <p className="text-3xl md:text-5xl font-bold mb-1 md:mb-2" style={{ color: primaryColor }}>100%</p>
              <p className="text-zinc-600 text-sm md:text-base font-medium leading-tight">Satisfaction Guaranteed</p>
            </div>
          </div>

          {/* TEXT SIDE */}
          <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            <div>
              <span 
                className="text-xs md:text-sm font-bold uppercase tracking-wider mb-2 block"
                style={{ color: primaryColor }}
              >
                About Us
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
                {data?.heading || "Excellence in Every Clean"}
              </h2>
            </div>

            <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
              {data?.body ||
                "We pride ourselves on delivering top-tier cleaning services tailored to your specific needs. Our dedicated team of professionals ensures that every corner of your space sparkles, giving you peace of mind and a healthier environment."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-4">
              {[
                "Professional Staff",
                "Eco-friendly Products",
                "Fully Insured", 
                "Flexible Scheduling"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: primaryColor }} />
                  <span className="text-zinc-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
                <a 
                    href="#contact" 
                    className="inline-flex items-center font-bold border-b-2 hover:border-transparent transition-colors pb-1 text-lg"
                    style={{ 
                        color: primaryColor,
                        borderColor: primaryColor 
                    }}
                >
                    Learn more about our team &rarr;
                </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
