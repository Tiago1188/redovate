"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ArrowRight, ArrowLeft, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Load existing services from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.services && Array.isArray(parsed.services)) {
        setServices(parsed.services.map((s: { name: string }) => s.name));
      }
    }
  }, []);

  const addService = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !services.includes(trimmed)) {
      setServices([...services, trimmed]);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const removeService = (service: string) => {
    setServices(services.filter((s) => s !== service));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addService();
    }
  };

  const handleContinue = () => {
    if (services.length < 3) {
      alert("Please add at least 3 services");
      return;
    }

    const existing = localStorage.getItem("onboarding_data");
    const onboardingData = existing ? JSON.parse(existing) : {};
    localStorage.setItem(
      "onboarding_data",
      JSON.stringify({
        ...onboardingData,
        services: services.map((name) => ({ name })),
      })
    );
    router.push("/onboarding/locations");
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
          Your Services
        </h1>
        <p className="text-base text-muted-foreground mb-4">
          Add at least 3 services you offer to your customers
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Don&apos;t worry about descriptions — our AI will generate them for you!
        </div>
      </div>

      {/* Service Input */}
      <div className="relative mb-8">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
            <Wrench className="w-5 h-5" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a service name and press Enter..."
            className={cn(
              "w-full pl-12 pr-14 py-6 rounded-2xl h-auto text-base shadow-sm border-border/60 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
            )}
          />
          <button
            onClick={addService}
            disabled={!inputValue.trim()}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-200",
              inputValue.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transform hover:scale-105"
                : "bg-surface-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Selected Services as Badges */}
      {services.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-foreground mb-3">
            Added services ({services.length})
            {services.length < 3 && (
              <span className="text-muted-foreground font-normal">
                {" "}— add {3 - services.length} more
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <div
                key={service}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                  "bg-primary/10 text-primary border border-primary/20",
                  "text-sm font-medium transition-all duration-200",
                  "hover:bg-primary/20"
                )}
              >
                <Wrench className="w-4 h-4" />
                <span>{service}</span>
                <button
                  onClick={() => removeService(service)}
                  className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                  aria-label={`Remove ${service}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-12 px-4 bg-surface-muted/50 rounded-2xl border-2 border-dashed border-border/60 mb-8">
          <Wrench className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground mb-2 font-medium">No services added yet</p>
          <p className="text-sm text-muted-foreground/80">
            Type a service name above and press Enter to add
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="px-6 h-12 text-muted-foreground hover:text-foreground hover:bg-surface-muted/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={services.length < 3}
          className={cn(
            "px-8 h-12 text-base font-medium rounded-xl transition-all duration-200",
            "bg-primary hover:bg-primary/90",
            "text-primary-foreground shadow-premium hover:shadow-premium-hover",
            "disabled:opacity-50 disabled:shadow-none min-w-[140px]"
          )}
        >
          <span className="flex items-center gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
      </div>
    </div>
  );
}
