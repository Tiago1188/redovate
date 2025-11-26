"use client";

import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeroFormInput } from "@/validations/hero";

interface HeroPreviewProps {
  data: HeroFormInput;
}

export function HeroPreview({ data }: HeroPreviewProps) {
  const heroImage = data.heroImage;
  const fallbackImage =
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop";
  const secondaryLabel = data.ctaSecondary || "Call Us";

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative min-h-[520px] w-full">
          <div className="absolute inset-0">
            <Image
              src={heroImage || fallbackImage}
              alt="Hero preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-center gap-6 p-8 text-white">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Hero Section</p>
              <h2 className="text-4xl font-bold leading-tight md:text-5xl">
                {data.headline || "Showcase your business"}
              </h2>
              <p className="text-xl text-white/80">
                {data.tagline || "This is where your unique value proposition will shine."}
              </p>
              {data.subtagline && (
                <p className="text-base text-white/70">{data.subtagline}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full">
                {data.ctaPrimary || "Book Now"}
              </Button>
              {data.showPhoneCTA ? (
                <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10">
                  {secondaryLabel}
                </Button>
              ) : data.ctaSecondary ? (
                <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10">
                  {data.ctaSecondary}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

