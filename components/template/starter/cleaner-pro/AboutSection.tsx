import { Card } from "@/components/ui/card";
import { Clock, ShieldCheck, Award, Sparkles, CheckCircle2, LucideIcon } from "lucide-react";
import Image from "next/image";

type Feature = { title: string; details?: string[]; icon?: string };

export interface AboutSectionData {
  heading?: string;
  body?: string;
  body_2?: string;
  features?: Feature[];
  certifications_title?: string;
  certifications?: string[];
}

const ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  clock: Clock,
  award: Award,
  sparkles: Sparkles,
};

export function AboutSection({ data }: { data?: AboutSectionData }) {
  const features = data?.features ?? [];
  const certifications = data?.certifications ?? [];

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
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&auto=format&fit=crop&w=1200" 
                    alt="About Cleaner Pro"
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
                {data?.body ??
                  "We pride ourselves on delivering exceptional service with a focus on safety, reliability, and customer satisfaction."}
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
