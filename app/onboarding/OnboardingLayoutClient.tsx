"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

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
    <div className="min-h-screen w-full flex bg-surface">
      {/* Left Panel - Premium Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-[45%] bg-sidebar border-r border-sidebar-border relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-premium text-primary-foreground font-bold text-lg">
              R
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">Redovate</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md space-y-8">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
            Start building your digital presence today.
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-muted/50 border border-sidebar-border/50 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Tell us about your business</h3>
                <p className="text-sm text-muted-foreground mt-1">We'll assume the structure and needs based on your trade.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-muted/50 border border-sidebar-border/50 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Select your services</h3>
                <p className="text-sm text-muted-foreground mt-1">Our AI will generate service pages for you automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4 text-xs text-muted-foreground">
          <span>© 2025 Redovate</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Privacy Policy</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Terms of Service</span>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {/* Top Navigation */}
        <header className="w-full h-20 flex items-center justify-between px-8 lg:px-12 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-20">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm text-primary-foreground font-bold">R</div>
          </div>

          {/* Progress - Desktop */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Step {currentStep} of {steps.length}</span>
            <div className="h-1.5 flex-1 bg-surface-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* User Nav */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs text-muted-foreground text-right">
              <p>Logged in as</p>
              <p className="font-medium text-foreground">User Account</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-12 lg:px-12 lg:py-16">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
