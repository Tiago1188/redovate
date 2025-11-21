export function HeroSection({ data }: { data?: any }) {
  const heroImage = data?.hero_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&auto=format&fit=crop&w=1920&h=1080";

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          {data?.business_name || "Your Business Name"}
        </h1>

        {data?.tagline && (
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
            {data.tagline}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <a
            href="#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </a>
          <a
            href="#about"
            className="inline-block bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-10 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
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
