"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ArrowRight, ArrowLeft, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Your Services
          </h1>
          <p className="text-base text-slate-600 mb-4">
            Add at least 3 services you offer to your customers
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm">
            <Sparkles className="w-4 h-4" />
            Don&apos;t worry about descriptions — our AI will generate them for you!
          </div>
        </div>

        {/* Service Input */}
        <div className="relative mb-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Wrench className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a service name and press Enter..."
              className={cn(
                "w-full pl-12 pr-14 py-4 rounded-2xl border bg-white text-slate-900",
                "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                "placeholder:text-slate-400 transition-all duration-200 text-base"
              )}
            />
            <button
              onClick={addService}
              disabled={!inputValue.trim()}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200",
                inputValue.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Services as Badges */}
        {services.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Added services ({services.length})
              {services.length < 3 && (
                <span className="text-slate-400 font-normal">
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
                    "bg-blue-50 text-blue-700 border border-blue-200",
                    "text-sm font-medium transition-all duration-200",
                    "hover:bg-blue-100"
                  )}
                >
                  <Wrench className="w-4 h-4" />
                  <span>{service}</span>
                  <button
                    onClick={() => removeService(service)}
                    className="ml-1 p-0.5 rounded-full hover:bg-blue-200 transition-colors"
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
          <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mb-8">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-2">No services added yet</p>
            <p className="text-sm text-slate-400">
              Type a service name above and press Enter to add
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-6 h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={services.length < 3}
            className={cn(
              "px-8 h-12 rounded-xl",
              "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
              "text-white shadow-md shadow-blue-600/20",
              "disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
            )}
          >
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
