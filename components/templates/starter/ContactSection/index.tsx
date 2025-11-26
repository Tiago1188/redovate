"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().email("Invalid email address").max(255),
    phone: z.string().trim().min(1, "Phone is required").max(20),
    message: z.string().trim().min(1, "Message is required").max(1000),
});

export interface ContactSectionData {
    heading?: string;
    subheading?: string;
    phone?: string; // From BaseWebsiteContent
    email?: string; // From BaseWebsiteContent
    address?: string; // From BaseWebsiteContent
    variant?: 'cleaner' | 'voltage' | 'default';
}

export function ContactSection({ data }: { data?: ContactSectionData }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const variant = data?.variant || 'cleaner';

    const phone = data?.phone || "1300 123 456";
    const email = data?.email || "info@example.com";
    const address = data?.address || "Sydney, NSW";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            contactSchema.parse(formData);
            toast.success("Message Sent!", {
                description: "We will get back to you soon.",
            });
            setFormData({ name: "", email: "", phone: "", message: "" });
            setErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    const key = err.path[0]?.toString();
                    if (key) fieldErrors[key] = err.message;
                });
                setErrors(fieldErrors);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Voltage Variant - Split Layout with Sidebar
    if (variant === 'voltage') {
        return (
            <section id="contact" className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact Info Sidebar */}
                        <div className="lg:col-span-2 bg-primary text-primary-foreground p-8 rounded-lg">
                            <h2 className="text-3xl font-bold mb-4 text-white">
                                {data?.heading ?? "Contact Us"}
                            </h2>
                            {data?.subheading && (
                                <p className="text-white/80 mb-8">
                                    {data.subheading}
                                </p>
                            )}

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Phone</div>
                                        <div className="text-white/80">{phone}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Email</div>
                                        <div className="text-white/80">{email}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Location</div>
                                        <div className="text-white/80">{address}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Hours</div>
                                        <div className="text-white/80">Mon-Fri: 8am-6pm</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Input
                                            name="name"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={errors.name ? "border-red-500" : ""}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? "border-red-500" : ""}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <Input
                                        name="phone"
                                        type="tel"
                                        placeholder="Your Phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={errors.phone ? "border-red-500" : ""}
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <Textarea
                                        name="message"
                                        placeholder="Your Message"
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={errors.message ? "border-red-500" : ""}
                                    />
                                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                </div>

                                <Button type="submit" size="lg" className="w-full md:w-auto px-12">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Cleaner Variant (Default) - Centered Layout
    return (
        <section id="contact" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            {data?.heading ?? "Get In Touch"}
                        </h2>
                        {data?.subheading && (
                            <p className="text-xl text-muted-foreground">
                                {data.subheading}
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Input
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <Input
                                name="phone"
                                type="tel"
                                placeholder="Your Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={errors.phone ? "border-red-500" : ""}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <Textarea
                                name="message"
                                placeholder="Your Message"
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                className={errors.message ? "border-red-500" : ""}
                            />
                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                        </div>

                        <Button type="submit" size="lg" className="w-full">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
