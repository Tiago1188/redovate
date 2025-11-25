"use client";

import Image from "next/image";

// Helper to inject theme CSS variables
const ThemeStyles = ({ theme }: { theme: any }) => {
  if (!theme) return null;
  return (
    <style jsx global>{`
      :root {
        --primary: ${theme.primary};
        --background: ${theme.background};
      }
    `}</style>
  );
};

interface HeroData {
  business_name?: string;
  hero_image?: string;
  tagline?: string;
  cta_primary?: string;
}

export function HeroSection({ data, theme }: { data?: HeroData; theme?: any }) {
  // Validate hero_image is a valid URL string before using it
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop";
  const heroImage: string = isValidImageUrl(data?.hero_image) ? data!.hero_image! : defaultImage;
  const primaryColor = theme?.primary || "#0ea5e9";

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <ThemeStyles theme={theme} />
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          width={1920}
          height={1080}
          src={heroImage}
          alt="Hero background"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6 md:space-y-8 py-12 md:py-20">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-xl leading-tight">
          {data?.business_name || "Business Name"}
        </h1>

        {data?.tagline && (
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-200 drop-shadow-md max-w-3xl mx-auto font-light leading-relaxed px-4">
            {data.tagline}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 w-full px-4">
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-bold text-white transition-all duration-200 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
            style={{ backgroundColor: primaryColor }}
          >
            {data?.cta_primary || "Book Now"}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

