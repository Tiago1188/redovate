import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

export interface TestimonialsSectionData {
    heading?: string;
    testimonials?: {
        name: string;
        role?: string;
        content: string;
        avatar?: string;
    }[];
}

export function TestimonialsSection({ data }: { data?: TestimonialsSectionData }) {
    const testimonials = data?.testimonials ?? [
        {
            name: "Jane Doe",
            role: "Homeowner",
            content: "Absolutely amazing service! My house has never looked cleaner.",
        },
        {
            name: "John Smith",
            role: "Business Owner",
            content: "Professional, reliable, and thorough. Highly recommended.",
        },
    ];

    return (
        <section id="testimonials" className="py-24 bg-secondary/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">
                        {data?.heading ?? "What Our Clients Say"}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <Card key={i} className="p-8 relative">
                            <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
                            <p className="text-lg text-muted-foreground mb-6 relative z-10">
                                "{t.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold">{t.name}</p>
                                    {t.role && <p className="text-sm text-muted-foreground">{t.role}</p>}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
