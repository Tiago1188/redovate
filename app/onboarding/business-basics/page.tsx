"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { businessBasicsSchema, type BusinessBasicsInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function BusinessBasicsPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BusinessBasicsInput>({
    resolver: zodResolver(businessBasicsSchema),
  });

  // Load existing data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      reset({
        business_name: parsed.business_name || "",
        trading_name: parsed.trading_name || "",
        abn: parsed.abn || "",
        category: parsed.category || "",
        year_founded: parsed.year_founded || undefined,
        about: parsed.about || "",
      });
    }
  }, [reset]);

  const onSubmit = async (data: BusinessBasicsInput) => {
    const existing = localStorage.getItem("onboarding_data");
    const onboardingData = existing ? JSON.parse(existing) : {};
    localStorage.setItem("onboarding_data", JSON.stringify({ ...onboardingData, ...data }));
    router.push("/onboarding/services");
  };

  const categories = [
    "Plumber",
    "Electrician",
    "Builder",
    "Carpenter",
    "Painter",
    "Cleaner",
    "Landscaper",
    "Roofer",
    "HVAC",
    "Other",
  ];

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
          Business Details
        </h1>
        <p className="text-base text-muted-foreground">
          Tell us about your business
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="business_name" className="mb-2 text-base font-medium">
              Business Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="business_name"
              {...register("business_name")}
              className="rounded-xl px-4 py-6 h-auto text-base shadow-sm border-border/60 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
              placeholder="e.g., Smith's Plumbing"
            />
            {errors.business_name && (
              <p className="text-destructive text-sm mt-1.5">{errors.business_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="trading_name" className="mb-2 text-base font-medium">
              Trading Name <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="trading_name"
              {...register("trading_name")}
              className="rounded-xl px-4 py-6 h-auto text-base shadow-sm border-border/60 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
              placeholder="If different from business name"
            />
          </div>

          <div>
            <Label htmlFor="abn" className="mb-2 text-base font-medium">
              ABN <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="abn"
              {...register("abn")}
              className="rounded-xl px-4 py-6 h-auto text-base shadow-sm border-border/60 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
              placeholder="11 digit ABN"
              maxLength={11}
            />
            {errors.abn && (
              <p className="text-destructive text-sm mt-1.5">{errors.abn.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="category" className="mb-2 text-base font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("category") || ""}
                onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
              >
                <SelectTrigger id="category" className="rounded-xl px-4 py-6 h-auto text-base shadow-sm border-border/60 focus:ring-4 focus:ring-primary/10 transition-all duration-300">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-destructive text-sm mt-1.5">{errors.category.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="year_founded" className="mb-2 text-base font-medium">
                Year Founded <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="year_founded"
                type="number"
                {...register("year_founded", { valueAsNumber: true })}
                className="rounded-xl px-4 py-6 h-auto text-base shadow-sm border-border/60 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                placeholder={`e.g., ${new Date().getFullYear() - 5}`}
                min={1800}
                max={new Date().getFullYear()}
              />
              {errors.year_founded && (
                <p className="text-destructive text-sm mt-1.5">{errors.year_founded.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="about" className="mb-2 text-base font-medium">
              About Your Business <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="about"
              {...register("about")}
              rows={4}
              className="rounded-xl p-4 resize-none text-base shadow-sm border-border/60 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
              placeholder="Tell customers about your business, experience, and what makes you different..."
            />
            {errors.about && (
              <p className="text-destructive text-sm mt-1.5">{errors.about.message}</p>
            )}
          </div>
        </div>

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
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-8 h-12 text-base font-medium rounded-xl transition-all duration-200",
              "bg-primary hover:bg-primary/90",
              "text-primary-foreground shadow-premium hover:shadow-premium-hover",
              "min-w-[140px]"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
