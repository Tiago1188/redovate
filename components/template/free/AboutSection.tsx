import React from "react";

interface AboutData {
  about?: string;
  logo?: string;
}

export function AboutSection({ data, theme }: { data?: AboutData; theme?: any }) {
  const aboutImage = data?.logo || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&auto=format&fit=crop&w=1000";
  
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
                About Our Business
              </h2>
            </div>

            <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
              {data?.about ||
                "We are a professional business dedicated to providing excellent service to our customers. Our team is committed to quality and reliability in everything we do."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

