import { Card } from "@/components/ui/card";
import { Clock, ShieldCheck, Award, Sparkles, CheckCircle2, LucideIcon, TrendingUp, Users, Target } from "lucide-react";
import Image from "next/image";

type Feature = { title: string; details?: string[]; icon?: string };

export interface AboutSectionData {
    heading?: string;
    body?: string;
    body_2?: string;
    features?: Feature[];
    certifications_title?: string;
    certifications?: string[];
    image?: string;
    aboutShort?: string; // From BaseWebsiteContent
    aboutFull?: string; // From BaseWebsiteContent
    heroImage?: string; // From BaseWebsiteContent
    variant?: 'cleaner' | 'voltage' | 'default';
}

const ICONS: Record<string, LucideIcon> = {
    shield: ShieldCheck,
    clock: Clock,
    award: Award,
    sparkles: Sparkles,
    trending: TrendingUp,
    users: Users,
    target: Target,
};

export function AboutSection({ data }: { data?: AboutSectionData }) {
    const features = data?.features ?? [];
    const certifications = data?.certifications ?? [];
    const variant = data?.variant || 'cleaner';

    // Fallback to base content
    const image = data?.image || data?.heroImage || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&auto=format&fit=crop&w=1200";
    const body = data?.body || data?.aboutFull || data?.aboutShort || "We deliver professional services with a commitment to quality, safety, and customer satisfaction.";

    // Voltage Variant - Stats and Professional Layout
    if (variant === 'voltage') {
        return (
            <section id="about" className="py-24 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image Side - Left */}
                        <div className="relative order-2 lg:order-1">
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                                <Image
                                    src={image}
                                    alt="About Us"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>

                            {/* Stats Overlay */}
                            <div className="absolute -bottom-6 -right-6 grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-xl border border-border">
                                    <div className="text-3xl font-bold text-primary">500+</div>
                                    <div className="text-sm text-muted-foreground">Projects</div>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-xl border border-border">
                                    <div className="text-3xl font-bold text-primary">98%</div>
                                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                                </div>
                            </div>
                        </div>

                        {/* Text Side - Right */}
                        <div className="order-1 lg:order-2">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                {data?.heading ?? "Professional Excellence"}
                            </h2>

                            <div className="space-y-4 text-lg text-muted-foreground mb-8">
                                <p>
                                    {body}
                                </p>
                                {data?.body_2 && <p>{data.body_2}</p>}
                            </div>

                            {/* Key Features - Bold List */}
                            <div className="space-y-3 mb-8">
                                {certifications.slice(0, 4).map((cert, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-semibold">{cert}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Feature Icons */}
                            {features.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {features.slice(0, 4).map((f, i) => {
                                        const Icon = (f.icon && ICONS[f.icon]) || Target;
                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="font-medium text-sm">{f.title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Cleaner Variant (Default) - Friendly Layout
    return (
        <section id="about" className="py-24 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Image Side with Blob Mask */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />

                            <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                                <Image
                                    src={image}
                                    alt="About Us"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Experience Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-border/50 max-w-[180px] text-center">
                                <span className="block text-4xl font-bold text-primary mb-1">10+</span>
                                <span className="text-sm font-medium text-muted-foreground">Years of Excellence</span>
                            </div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            {data?.heading ?? "We Make Your Home Shine"}
                        </h2>

                        <div className="space-y-6 text-lg text-muted-foreground mb-8">
                            <p>
                                {body}
                            </p>
                            {data?.body_2 && <p>{data.body_2}</p>}
                        </div>

                        {/* Certifications/Features List */}
                        <div className="grid sm:grid-cols-2 gap-6 mb-10">
                            {certifications.map((cert, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="font-medium">{cert}</span>
                                </div>
                            ))}
                        </div>

                        {/* Feature Highlights */}
                        <div className="grid gap-4">
                            {features.slice(0, 2).map((f, i) => {
                                const Icon = (f.icon && ICONS[f.icon]) || ShieldCheck;
                                return (
                                    <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-border/50 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{f.title}</h4>
                                            <p className="text-sm text-muted-foreground">{f.details?.[0]}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
