"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

interface Service {
  name: string;
  description?: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([
    { name: "", description: "" },
    { name: "", description: "" },
    { name: "", description: "" },
  ]);

  const addService = () => {
    setServices([...services, { name: "", description: "" }]);
  };

  const removeService = (index: number) => {
    if (services.length > 3) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleContinue = () => {
    const validServices = services.filter((s) => s.name.trim());
    if (validServices.length < 3) {
      alert("Please add at least 3 services");
      return;
    }

    const existing = localStorage.getItem("onboarding_data");
    const onboardingData = existing ? JSON.parse(existing) : {};
    localStorage.setItem(
      "onboarding_data",
      JSON.stringify({ ...onboardingData, services: validServices })
    );
    router.push("/onboarding/locations");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Your Services
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Add at least 3 services you offer
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Service {index + 1}
                </span>
                {services.length > 3 && (
                  <button
                    onClick={() => removeService(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <input
                value={service.name}
                onChange={(e) => updateService(index, "name", e.target.value)}
                placeholder="Service name"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white mb-2"
              />
              <input
                value={service.description || ""}
                onChange={(e) => updateService(index, "description", e.target.value)}
                placeholder="Brief description (optional)"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
              />
            </div>
          ))}
        </div>

        <button
          onClick={addService}
          className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Another Service
        </button>

        <div className="flex justify-between pt-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

