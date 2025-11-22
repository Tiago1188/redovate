import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
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
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-secondary">
        <div className="absolute inset-0 opacity-50">
          <Image
            fill
            src={
              "/heroImages/electrician.png"
            }
            alt="Hero background"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-background/90 via-background/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {data?.headline ?? "Professional"}{" "}
            <span className="text-primary">{data?.highlight ?? "Services"}</span>
          </h1>

          {data?.tagline && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {data.tagline}
            </p>
          )}

          {data?.subtagline && (
            <p className="text-lg text-muted-foreground mb-10">{data.subtagline}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              asChild
            >
              <a href="#contact">{data?.cta_primary ?? "Request Free Quote"}</a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
              asChild
            >
              <a href={`tel:${phone.replace(/\s/g, "")}`}>
                <Phone className="mr-2" />
                {data?.cta_secondary ?? phone}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
