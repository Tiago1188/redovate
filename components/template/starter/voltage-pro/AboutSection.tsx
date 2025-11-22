import { Card } from "@/components/ui/card";
import { Clock, ShieldCheck, Award } from "lucide-react";

type Feature = { title: string; details?: string[]; icon?: "shield" | "clock" | "award" };

export interface AboutSectionData {
  heading?: string;
  body?: string;
  body_2?: string;
  features?: Feature[];
  certifications_title?: string;
  certifications?: string[];
}

const ICONS = {
  shield: ShieldCheck,
  clock: Clock,
  award: Award,
};

export function AboutSection({ data }: { data?: AboutSectionData }) {
  const features =
    data?.features ??
    [
      {
        icon: "shield",
        title: "Licensed & Insured",
        details: ["ABN and license details available on request"],
      },
      {
        icon: "clock",
        title: "Working Hours",
        details: ["Mon-Fri: 7am - 6pm", "Sat: 8am - 4pm"],
      },
      {
        icon: "award",
        title: "Quality Guarantee",
        details: ["Warranty on workmanship"],
      },
    ];

  const certifications =
    data?.certifications ??
    [
      "Certified Professionals",
      "Safety & Compliance Focused",
      "Public Liability Insured",
    ];

  return (
    <section id="about" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {data?.heading ?? "Why Choose Us?"}
            </h2>

            <p className="text-lg text-muted-foreground mb-6">
              {data?.body ??
                "We pride ourselves on delivering exceptional service with a focus on safety, reliability, and customer satisfaction."}
            </p>

            {data?.body_2 && (
              <p className="text-lg text-muted-foreground mb-8">{data.body_2}</p>
            )}

            <div className="space-y-4">
              {features.map((f, i) => {
                const Icon = f.icon ? ICONS[f.icon] : ShieldCheck;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                    <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">{f.title}</h3>
                      {f.details?.map((d, j) => (
                        <p key={j} className="text-sm text-muted-foreground">
                          {d}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <h3 className="text-2xl font-bold mb-6">
              {data?.certifications_title ?? "Our Certifications"}
            </h3>
            <ul className="space-y-4">
              {certifications.map((c, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
