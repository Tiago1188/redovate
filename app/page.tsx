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
    <main className="min-h-screen bg-background flex flex-col justify-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Redovate
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            Build a professional website for your trade or service business in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "text-lg h-14 px-8"
              )}
            >
              Get Started Free
            </Link>
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-lg h-14 px-8"
              )}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
