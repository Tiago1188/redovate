"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HardHat, Building2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BusinessType = "sole_trader" | "company";

interface BusinessOption {
  type: BusinessType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const businessOptions: BusinessOption[] = [
  {
    type: "sole_trader",
    title: "Sole Tradie",
    subtitle: "Individual Operator",
    description:
      "You work independently, managing your own jobs and clients. Perfect for plumbers, electricians, carpenters, and other skilled tradespeople working on their own.",
    icon: <HardHat className="w-8 h-8" />,
    features: [
      "One person operation",
      "Direct client relationships",
      "ABN required",
      "Personal liability",
    ],
  },
  {
    type: "company",
    title: "Company",
    subtitle: "Registered Business Entity",
    description:
      "You operate as a registered company with employees or contractors. Ideal for established businesses looking to grow their team and take on larger projects.",
    icon: <Building2 className="w-8 h-8" />,
    features: [
      "Multiple team members",
      "Separate legal entity",
      "ABN/ACN required",
      "Limited liability",
    ],
  },
];

export default function BusinessTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<BusinessType | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Load existing selection from localStorage
  useEffect(() => {
    const savedType = localStorage.getItem("onboarding_business_type") as BusinessType | null;
    if (savedType && (savedType === "sole_trader" || savedType === "company")) {
      setSelected(savedType);
    }
  }, []);

  const handleContinue = () => {
    if (selected) {
      setIsNavigating(true);
      localStorage.setItem("onboarding_business_type", selected);
      router.push("/onboarding/business-basics");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            What type of business are you?
          </h1>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            This helps us customize your website and provide the right
            features for your business structure.
          </p>
        </div>

        {/* Business type options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {businessOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelected(option.type)}
              className={cn(
                "relative group text-left p-6 rounded-2xl border transition-all duration-200",
                "bg-card hover:shadow-lg hover:shadow-primary/5",
                selected === option.type
                  ? "border-primary ring-1 ring-primary shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              {/* Selection indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200",
                  selected === option.type
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-border bg-card"
                )}
              >
                {selected === option.type && <Check className="w-4 h-4" />}
              </div>

              {/* Icon */}
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200",
                  selected === option.type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}
              >
                {option.icon}
              </div>

              {/* Title & Subtitle */}
              <div className="mb-3 pr-8">
                <h3 className="text-lg font-semibold text-foreground mb-0.5">
                  {option.title}
                </h3>
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    selected === option.type
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {option.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {option.description}
              </p>

              {/* Features */}
              <ul className="space-y-1.5">
                {option.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div
                      className={cn(
                        "w-1 h-1 rounded-full transition-colors",
                        selected === option.type
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Continue button */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleContinue}
            disabled={!selected || isNavigating}
            size="lg"
            className={cn(
              "px-8 h-12 text-base font-medium rounded-xl transition-all duration-200",
              "bg-primary hover:bg-primary/90",
              "text-primary-foreground shadow-md",
              "disabled:opacity-50 disabled:shadow-none"
            )}
          >
            {isNavigating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
          <p className="text-sm text-slate-400">
            You can change this later in settings
          </p>
        </div>
      </div>
    </div>
  );
}
