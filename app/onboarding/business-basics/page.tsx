"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { businessBasicsSchema, type BusinessBasicsInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BusinessBasicsPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
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

  const inputClasses = cn(
    "w-full px-4 py-3 rounded-xl border bg-white text-slate-900",
    "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
    "placeholder:text-slate-400 transition-all duration-200"
  );

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Business Details
          </h1>
          <p className="text-base text-slate-600">
            Tell us about your business
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("business_name")}
                className={inputClasses}
                placeholder="e.g., Smith's Plumbing"
              />
              {errors.business_name && (
                <p className="text-red-500 text-sm mt-1.5">{errors.business_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trading Name <span className="text-slate-400">(optional)</span>
              </label>
              <input
                {...register("trading_name")}
                className={inputClasses}
                placeholder="If different from business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ABN <span className="text-slate-400">(optional)</span>
              </label>
              <input
                {...register("abn")}
                className={inputClasses}
                placeholder="11 digit ABN"
                maxLength={11}
              />
              {errors.abn && (
                <p className="text-red-500 text-sm mt-1.5">{errors.abn.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select {...register("category")} className={inputClasses}>
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1.5">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Year Founded <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="number"
                  {...register("year_founded", { valueAsNumber: true })}
                  className={inputClasses}
                  placeholder={`e.g., ${new Date().getFullYear() - 5}`}
                  min={1800}
                  max={new Date().getFullYear()}
                />
                {errors.year_founded && (
                  <p className="text-red-500 text-sm mt-1.5">{errors.year_founded.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                About Your Business <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("about")}
                rows={4}
                className={cn(inputClasses, "resize-none")}
                placeholder="Tell customers about your business, experience, and what makes you different..."
              />
              {errors.about && (
                <p className="text-red-500 text-sm mt-1.5">{errors.about.message}</p>
              )}
            </div>
          </div>

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
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "px-8 h-12 rounded-xl",
                "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                "text-white shadow-md shadow-blue-600/20"
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
    </div>
  );
}
