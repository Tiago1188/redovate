"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

interface ServiceArea {
  name: string;
  postcode?: string;
}

export default function LocationsPage() {
  const router = useRouter();
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([
    { name: "", postcode: "" },
  ]);

  const addArea = () => {
    setServiceAreas([...serviceAreas, { name: "", postcode: "" }]);
  };

  const removeArea = (index: number) => {
    if (serviceAreas.length > 1) {
      setServiceAreas(serviceAreas.filter((_, i) => i !== index));
    }
  };

  const updateArea = (index: number, field: keyof ServiceArea, value: string) => {
    const updated = [...serviceAreas];
    updated[index] = { ...updated[index], [field]: value };
    setServiceAreas(updated);
  };

  const handleContinue = () => {
    const validAreas = serviceAreas.filter((a) => a.name.trim());
    if (validAreas.length < 1) {
      alert("Please add at least 1 service area");
      return;
    }

    const existing = localStorage.getItem("onboarding_data");
    const onboardingData = existing ? JSON.parse(existing) : {};
    localStorage.setItem(
      "onboarding_data",
      JSON.stringify({ ...onboardingData, service_areas: validAreas })
    );
    router.push("/onboarding/review");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Service Areas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Where do you provide your services?
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {serviceAreas.map((area, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Area {index + 1}
                </span>
                {serviceAreas.length > 1 && (
                  <button
                    onClick={() => removeArea(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={area.name}
                  onChange={(e) => updateArea(index, "name", e.target.value)}
                  placeholder="Suburb/Area name"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
                <input
                  value={area.postcode || ""}
                  onChange={(e) => updateArea(index, "postcode", e.target.value)}
                  placeholder="Postcode"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addArea}
          className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Another Area
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

