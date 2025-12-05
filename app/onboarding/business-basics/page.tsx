"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { businessBasicsSchema, type BusinessBasicsInput } from "@/lib/validations";

export default function BusinessBasicsPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessBasicsInput>({
    resolver: zodResolver(businessBasicsSchema),
  });

  const onSubmit = async (data: BusinessBasicsInput) => {
    // Store data for later submission
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Business Details
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Tell us about your business
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Business Name *
            </label>
            <input
              {...register("business_name")}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent"
              placeholder="e.g., Smith's Plumbing"
            />
            {errors.business_name && (
              <p className="text-red-500 text-sm mt-1">{errors.business_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Trading Name (optional)
            </label>
            <input
              {...register("trading_name")}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent"
              placeholder="If different from business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              ABN (optional)
            </label>
            <input
              {...register("abn")}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent"
              placeholder="11 digit ABN"
              maxLength={11}
            />
            {errors.abn && (
              <p className="text-red-500 text-sm mt-1">{errors.abn.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Category *
            </label>
            <select
              {...register("category")}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              About Your Business *
            </label>
            <textarea
              {...register("about")}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent"
              placeholder="Tell customers about your business, experience, and what makes you different..."
            />
            {errors.about && (
              <p className="text-red-500 text-sm mt-1">{errors.about.message}</p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

