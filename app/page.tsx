import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getBusinessForUser } from "@/actions/businesses";
import { syncUser } from "@/actions/user";

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
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Redovate
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12">
            Build a professional website for your trade or service business in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-white text-zinc-900 rounded-lg font-semibold text-lg hover:bg-zinc-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-4 border border-zinc-600 text-white rounded-lg font-semibold text-lg hover:bg-zinc-800 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
