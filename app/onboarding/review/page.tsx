"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingData {
  business_type?: string;
  business_name?: string;
  trading_name?: string;
  abn?: string;
  category?: string;
  year_founded?: number;
  about?: string;
  services?: { name: string; description?: string }[];
  service_areas?: { name: string; postcode?: string }[];
}

export default function ReviewPage() {
  const router = useRouter();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const businessType = localStorage.getItem("onboarding_business_type");
    const storedData = localStorage.getItem("onboarding_data");

    if (storedData) {
      setData({
        business_type: businessType || undefined,
        ...JSON.parse(storedData),
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!data) return;

    setIsSubmitting(true);

    try {
      // TODO: Call server action to create business
      // await createBusiness(data);

      // Clear local storage
      localStorage.removeItem("onboarding_business_type");
      localStorage.removeItem("onboarding_data");

      // Redirect to template selection
      router.push("/templates/select");
    } catch (error) {
      console.error("Error creating business:", error);
      alert("Failed to create business. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Review Your Information
          </h1>
          <p className="text-base text-slate-600">
            Make sure everything looks correct before we create your website
          </p>
        </div>

        <div className="space-y-4">
          {/* Business Details */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                Business Details
              </h2>
              <Link
                href="/onboarding/business-basics"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Link>
            </div>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Business Name</dt>
                <dd className="text-sm font-medium text-slate-900">{data.business_name}</dd>
              </div>
              {data.trading_name && (
                <div className="flex justify-between">
                  <dt className="text-sm text-slate-500">Trading Name</dt>
                  <dd className="text-sm font-medium text-slate-900">{data.trading_name}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Category</dt>
                <dd className="text-sm font-medium text-slate-900 capitalize">{data.category}</dd>
              </div>
              {data.year_founded && (
                <div className="flex justify-between">
                  <dt className="text-sm text-slate-500">Year Founded</dt>
                  <dd className="text-sm font-medium text-slate-900">{data.year_founded}</dd>
                </div>
              )}
              <div className="flex justify-between items-center">
                <dt className="text-sm text-slate-500">Business Type</dt>
                <dd className="text-sm font-medium text-slate-900 capitalize flex items-center gap-2">
                  {data.business_type?.replace("_", " ")}
                  <Link
                    href="/onboarding/business-type"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Change
                  </Link>
                </dd>
              </div>
              {data.about && (
                <div className="pt-2 border-t border-slate-100">
                  <dt className="text-sm text-slate-500 mb-1.5">About</dt>
                  <dd className="text-sm text-slate-700 leading-relaxed">{data.about}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Services */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                Services
                <span className="text-sm font-normal text-slate-500">
                  ({data.services?.length || 0})
                </span>
              </h2>
              <Link
                href="/onboarding/services"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Link>
            </div>
            <ul className="space-y-2">
              {data.services?.map((service, index) => (
                <li key={index} className="text-sm text-slate-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {service.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                Service Areas
                <span className="text-sm font-normal text-slate-500">
                  ({data.service_areas?.length || 0})
                </span>
              </h2>
              <Link
                href="/onboarding/locations"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Link>
            </div>
            <ul className="space-y-2">
              {data.service_areas?.map((area, index) => (
                <li key={index} className="text-sm text-slate-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {area.name} {area.postcode && <span className="text-slate-400">({area.postcode})</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between pt-8">
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
            onClick={handleSubmit}
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
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create My Website
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
