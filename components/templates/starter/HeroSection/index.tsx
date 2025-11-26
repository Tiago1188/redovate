import { Button } from "@/components/ui/button";
import { Phone, Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

    // New props
    features?: string[];
    top_badge?: string;
    floating_badge_title?: string;
    floating_badge_subtitle?: string;
    variant?: 'cleaner' | 'voltage' | 'default';
}

export function HeroSection({ data }: { data?: HeroSectionData }) {
    const variant = data?.variant || 'cleaner';
    const canShowPhoneCTA = Boolean(data?.show_phone_cta && data?.phone);
    const phoneHref = data?.phone ? `tel:${data.phone.replace(/\s/g, "")}` : undefined;

    // Default features if not provided (legacy support)
    const features = data?.features || (variant === 'cleaner' ? ["Fully Insured", "Police Checked", "Eco-Friendly"] : []);

    // Voltage Variant
    if (variant === 'voltage') {
        const secondaryLabel = canShowPhoneCTA
            ? data?.cta_secondary || data?.phone || "Call Now"
            : data?.cta_secondary;

        const heroImage = data?.hero_image || "https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=1600&auto=format&fit=crop";

        return (
            <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-background via-background to-secondary">
                    <div className="absolute inset-0 opacity-50">
                        <Image
                            fill
                            src="/heroImages/electrician.png" // Ideally this should be dynamic too, but keeping it for now
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

    // Cleaner (Default) Variant
    const secondaryLabel = data?.cta_secondary || data?.phone || "Call Us";
    const topBadge = data?.top_badge ?? "#1 Rated Cleaning Service";

    return (
        <section id="hero" className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-secondary/30">
            {/* Abstract blobs/shapes background */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Text Content */}
                    <div className="max-w-2xl">
                        {topBadge && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border shadow-sm mb-6">
                                <div className="flex -space-x-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">{topBadge}</span>
                            </div>
                        )}

                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
                            {data?.headline ?? "Sparkling"}{" "}
                            <span className="text-primary relative">
                                {data?.highlight ?? "Clean"}
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                            <br />
                            {data?.tagline && <span className="block mt-2 text-4xl lg:text-6xl text-foreground/80">{data.tagline.split(' ').slice(0, 3).join(' ')}...</span>}
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

                            {canShowPhoneCTA ? (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full border-2 h-14 px-8 text-lg hover:bg-secondary transition-all"
                                    asChild
                                >
                                    <a href={phoneHref}>
                                        <Phone className="mr-2 w-5 h-5" />
                                        {secondaryLabel}
                                    </a>
                                </Button>
                            ) : (
                                data?.cta_secondary && (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="rounded-full border-2 h-14 px-8 text-lg hover:bg-secondary transition-all"
                                        asChild
                                    >
                                        <a href="#contact">{data.cta_secondary}</a>
                                    </Button>
                                )
                            )}
                        </div>

                        {features.length > 0 && (
                            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-primary" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Hero Image */}
                    <div className="relative lg:h-[600px] h-[400px] w-full rounded-4xl overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500">
                        <Image
                            fill
                            src={data?.hero_image || "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?q=80&w=1600&auto=format&fit=crop"}
                            alt="Professional"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

                        {/* Floating badge */}
                        {(data?.floating_badge_title || variant === 'cleaner') && (
                            <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg max-w-[200px]">
                                <p className="font-bold text-foreground">{data?.floating_badge_title ?? "100% Satisfaction"}</p>
                                <p className="text-xs text-muted-foreground">{data?.floating_badge_subtitle ?? "Guaranteed on every clean"}</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
