"use client";

import { usePathname } from "next/navigation";

export const dynamic = "force-dynamic";

const steps = [
  { path: "/onboarding/business-type", label: "Business Type", step: 1 },
  { path: "/onboarding/business-basics", label: "Details", step: 2 },
  { path: "/onboarding/services", label: "Services", step: 3 },
  { path: "/onboarding/locations", label: "Locations", step: 4 },
  { path: "/onboarding/review", label: "Review", step: 5 },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = steps.find((s) => s.path === pathname)?.step || 1;
  const progress = (currentStep / steps.length) * 100;

  // Don't show layout wrapper for the main /onboarding redirect page
  if (pathname === "/onboarding") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.15) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full pt-6 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-slate-900">Redovate</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-900">Step {currentStep}</span>
              <span>of {steps.length}</span>
            </div>
          </div>
        </header>

        {/* Progress bar */}
        <div className="w-full pt-4 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
