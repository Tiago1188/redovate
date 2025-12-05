"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, User } from "lucide-react";

export default function BusinessTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"sole_trader" | "company" | null>(null);

  const handleContinue = () => {
    if (selected) {
      // Store in session/local storage or pass as query param
      localStorage.setItem("onboarding_business_type", selected);
      router.push("/onboarding/business-basics");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            What type of business are you?
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            This helps us customize your website experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelected("sole_trader")}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              selected === "sole_trader"
                ? "border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            <User className="w-8 h-8 text-zinc-900 dark:text-white mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Sole Trader
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Individual operating as a business. ABN required.
            </p>
          </button>

          <button
            onClick={() => setSelected("company")}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              selected === "company"
                ? "border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            <Building2 className="w-8 h-8 text-zinc-900 dark:text-white mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Company
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Registered business entity. ABN/ACN required.
            </p>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

