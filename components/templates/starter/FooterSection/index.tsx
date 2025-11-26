import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export interface FooterSectionData {
    business_name?: string;
    blurb?: string;
    phone?: string;
    email?: string;
    social?: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
    };
    abn?: string;
    license?: string;
}

export function FooterSection({ data }: { data?: FooterSectionData }) {
    const name = data?.business_name ?? "Your Business";
    const social = data?.social ?? {};

    return (
        <footer className="bg-secondary/50 border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-primary">{name}</span>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            {data?.blurb ??
                                "Professional services across Sydney. Reliable, insured, and committed to excellence."}
                        </p>
                        {data?.abn && <p className="text-sm text-muted-foreground">ABN: {data.abn}</p>}
                        {data?.license && <p className="text-sm text-muted-foreground">License: {data.license}</p>}
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact</h3>
                        <div className="space-y-3">
                            <a
                                href={`tel:${(data?.phone ?? "1300 123 456").replace(/\s/g, "")}`}
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                {data?.phone ?? "1300 123 456"}
                            </a>
                            <a
                                href={`mailto:${data?.email ?? "info@example.com"}`}
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                {data?.email ?? "info@example.com"}
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            {social.facebook && (
                                <a
                                    href={social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {social.instagram && (
                                <a
                                    href={social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {social.linkedin && (
                                <a
                                    href={social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
