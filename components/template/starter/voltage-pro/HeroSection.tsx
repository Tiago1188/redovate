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
  show_phone_cta?: boolean;
}

export function HeroSection({ data }: { data?: HeroSectionData }) {
  const canShowPhoneCTA = Boolean(data?.show_phone_cta && data?.phone);
  const phoneHref = data?.phone ? `tel:${data.phone.replace(/\s/g, "")}` : undefined;
  const secondaryLabel = canShowPhoneCTA
    ? data?.cta_secondary || data?.phone || "Call Now"
    : data?.cta_secondary;
  const heroImage =
    data?.hero_image ||
    "https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=1600&auto=format&fit=crop";

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

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="max-w-3xl space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-foreground">
              {data?.headline ?? "Professional Services"}
              {data?.highlight && (
                <span className="block text-primary/80">{data.highlight}</span>
              )}
            </h1>

            {data?.tagline && (
              <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
                {data.tagline}
              </p>
            )}

            {data?.subtagline && (
              <p className="text-base text-muted-foreground/90">
                {data.subtagline}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold"
                asChild
              >
                <a href="#contact">{data?.cta_primary ?? "Request Free Quote"}</a>
              </Button>

              {secondaryLabel && (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg"
                  asChild
                >
                  <a href={canShowPhoneCTA ? phoneHref : "#contact"} className="inline-flex items-center justify-center gap-2">
                    {canShowPhoneCTA && <Phone className="h-4 w-4" />}
                    {secondaryLabel}
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative aspect-[4/5] rounded-3xl border border-white/10 bg-background/90 shadow-2xl">
              <Image
                src={heroImage}
                alt="Hero visual"
                fill
                className="object-cover rounded-3xl"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
