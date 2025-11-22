"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

type NavLink = { id: string; label: string };

export interface NavigationSectionData {
  business_name?: string;
  nav_links?: NavLink[];
  cta_label?: string;
}

export function NavigationSection({ data }: { data?: NavigationSectionData }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const links: NavLink[] =
    data?.nav_links ?? [
      { id: "hero", label: "Home" },
      { id: "services", label: "Services" },
      { id: "areas", label: "Service Areas" },
      { id: "about", label: "About" },
      { id: "contact", label: "Contact" },
    ];

  return (
    <nav
      style={{ top: "var(--header-offset, 0px)" }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity text-primary"
          >
            {data?.business_name ?? "Your Business"}
          </button>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button onClick={() => scrollToSection("contact")}>
              {data?.cta_label ?? "Get Quote"}
            </Button>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md absolute left-0 right-0 top-20 px-4 shadow-lg">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left py-3 text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button onClick={() => scrollToSection("contact")} className="w-full mt-2">
              {data?.cta_label ?? "Get Quote"}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
