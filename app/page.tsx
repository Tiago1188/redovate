import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getBusinessForUser } from "@/actions/businesses";
import { syncUser } from "@/actions/user";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { userId } = await auth();

  // If user is logged in, redirect based on onboarding status
  if (userId) {
    const business = await getBusinessForUser();

    if (business) {
      // User has completed onboarding, go to dashboard
      redirect("/dashboard");
    } else {
      // Check if user has a plan selected
      const user = await syncUser();

      if (!user || !user.plan_type) {
        redirect("/select-plan");
      }

      // User hasn't completed onboarding but has plan
      redirect("/onboarding");
    }
  }

  // Not logged in - show landing page
  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl -z-10" />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border/60 shadow-sm text-xs font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-primary" />
            New: Templates for every industry
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tight text-balance animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Build your business <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">online identity.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Create a professional website for your trade or service business in minutes used Stripe/Linear-class design standards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "text-lg h-14 px-10 gap-2 shadow-premium hover:shadow-premium-hover hover:scale-105 transition-all"
              )}
            >
              Start Building Free
            </Link>
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-lg h-14 px-10 bg-surface/50 backdrop-blur-sm border-border/60 hover:bg-surface hover:border-border"
              )}
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Abstract UI Preview */}
        <div className="mt-24 relative max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="rounded-xl border border-border/60 bg-surface/80 backdrop-blur-xl shadow-2xl p-4 md:p-8 aspect-video flex items-center justify-center text-muted-foreground/30 font-mono text-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-50" />
            <div className="text-center space-y-2">
              <p>[ Application UI Preview ]</p>
              <p className="text-xs">Interactive Dashboard Interface</p>
            </div>
          </div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </main>
  );
}
