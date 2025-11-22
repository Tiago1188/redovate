import { Button } from "@/components/ui/button";
import { Phone, Star } from "lucide-react";
import Image from "next/image";

export interface HeroSectionData {
  headline?: string;
  highlight?: string;
  tagline?: string;
  subtagline?: string;
  hero_image?: string;
  cta_primary?: string;
  cta_secondary?: string;
  phone?: string;
}

export function HeroSection({ data }: { data?: HeroSectionData }) {
  const phone = data?.phone ?? "1300 123 456";
  
  return (
    <section id="hero" className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-secondary/30">
      {/* Abstract blobs/shapes background */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border shadow-sm mb-6">
              <div className="flex -space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground">#1 Rated Cleaning Service</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              {data?.headline ?? "Sparkling"}{" "}
              <span className="text-primary relative">
                {data?.highlight ?? "Clean"}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
              <br />
              {data?.tagline && <span className="block mt-2 text-4xl lg:text-6xl text-foreground/80">{data.tagline.split(' ').slice(0,3).join(' ')}...</span>}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              {data?.subtagline ?? "Professional cleaning for homes and businesses. We don't just clean, we care."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-full text-lg px-8 h-14 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                asChild
              >
                <a href="#contact">{data?.cta_primary ?? "Book Now"}</a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 h-14 px-8 text-lg hover:bg-secondary transition-all"
                asChild
              >
                <a href={`tel:${phone.replace(/\s/g, "")}`}>
                  <Phone className="mr-2 w-5 h-5" />
                  {data?.cta_secondary ?? phone}
                </a>
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
               <div className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-primary" />
                 <span>Fully Insured</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-primary" />
                 <span>Police Checked</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-primary" />
                 <span>Eco-Friendly</span>
               </div>
            </div>
          </div>

            {/* Hero Image */}
            <div className="relative lg:h-[600px] h-[400px] w-full rounded-4xl overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500">
              <Image
                fill
                src={data?.hero_image || "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?q=80&w=1600&auto=format&fit=crop"}
                alt="Cleaning Professional"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
            
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg max-w-[200px]">
              <p className="font-bold text-foreground">100% Satisfaction</p>
              <p className="text-xs text-muted-foreground">Guaranteed on every clean</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
