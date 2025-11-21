import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserOnboardingStatus, hasSelectedPlan } from "@/actions/user";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)"
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isGeneratingRoute = createRouteMatcher(["/generating"]);
const isPlansRoute = createRouteMatcher(["/plans"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is not signed in and trying to access a protected route, redirect to sign in
  if (!userId && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
  }

    if (userId) {
        // Check if user has selected a plan
        // Allow access to plans page, onboarding, generating, and public routes
        const allowedRoutesWithoutPlan = isPlansRoute(req) || isOnboardingRoute(req) || isGeneratingRoute(req) || isPublicRoute(req);
        
        if (!allowedRoutesWithoutPlan) {
            const userHasSelectedPlan = await hasSelectedPlan(userId);
            
            if (!userHasSelectedPlan) {
                // User hasn't selected a plan, redirect to plans page
                const plansUrl = new URL("/plans", req.url);
                return NextResponse.redirect(plansUrl);
            }
        }

        // Check onboarding status from database (most reliable source)
        // This handles cases where Clerk session metadata hasn't refreshed yet
        const onboardingStatus = await getUserOnboardingStatus(userId);

        // For dashboard route, check if user has completed onboarding
        if (isDashboardRoute(req)) {
            if (onboardingStatus.hasValidAccountType) {
                // User has valid account type, allow access to dashboard
                return;
            } else {
                // User doesn't have valid account type, redirect to onboarding
                const onboardingUrl = new URL("/onboarding", req.url);
                return NextResponse.redirect(onboardingUrl);
            }
        }

        // For onboarding route, check if user has already completed onboarding
        if (isOnboardingRoute(req)) {
            if (onboardingStatus.hasValidAccountType) {
                // User has already completed onboarding, redirect to dashboard
                const dashboardUrl = new URL("/dashboard", req.url);
                return NextResponse.redirect(dashboardUrl);
            } else {
                // User hasn't completed onboarding, allow access to onboarding page
                return;
            }
        }

        // For other protected routes, check if user has completed onboarding
        // Allow access to generating page (users who just completed onboarding)
        // Allow access to plans page (users selecting plan)
        if (!isGeneratingRoute(req) && !isPlansRoute(req) && !isPublicRoute(req)) {
            if (!onboardingStatus.hasValidAccountType) {
                // User hasn't completed onboarding, redirect to onboarding
                const onboardingUrl = new URL("/onboarding", req.url);
                return NextResponse.redirect(onboardingUrl);
            }
        }
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

