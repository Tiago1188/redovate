"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OnboardingData {
  business_type?: string;
  business_name?: string;
  trading_name?: string;
  abn?: string;
  category?: string;
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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Review Your Information
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Make sure everything looks correct before we create your website
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Business Details
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-zinc-500 dark:text-zinc-400">Business Name</dt>
                <dd className="text-zinc-900 dark:text-white">{data.business_name}</dd>
              </div>
              {data.trading_name && (
                <div>
                  <dt className="text-sm text-zinc-500 dark:text-zinc-400">Trading Name</dt>
                  <dd className="text-zinc-900 dark:text-white">{data.trading_name}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-zinc-500 dark:text-zinc-400">Category</dt>
                <dd className="text-zinc-900 dark:text-white capitalize">{data.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500 dark:text-zinc-400">Business Type</dt>
                <dd className="text-zinc-900 dark:text-white capitalize">
                  {data.business_type?.replace("_", " ")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Services ({data.services?.length || 0})
            </h2>
            <ul className="space-y-2">
              {data.services?.map((service, index) => (
                <li key={index} className="text-zinc-900 dark:text-white">
                  • {service.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Service Areas ({data.service_areas?.length || 0})
            </h2>
            <ul className="space-y-2">
              {data.service_areas?.map((area, index) => (
                <li key={index} className="text-zinc-900 dark:text-white">
                  • {area.name} {area.postcode && `(${area.postcode})`}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between pt-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isSubmitting ? "Creating..." : "Create My Website"}
          </button>
        </div>
      </div>
    </div>
  );
}

