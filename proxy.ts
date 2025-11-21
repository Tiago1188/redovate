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
  const { userId, sessionClaims } = await auth();

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

    // For dashboard route, check database to ensure we have the latest data
    // This handles cases where Clerk session metadata hasn't refreshed yet
    if (isDashboardRoute(req)) {
      const onboardingStatus = await getUserOnboardingStatus(userId);
      if (onboardingStatus.hasValidAccountType) {
        // User has valid account type, allow access to dashboard
        return;
      } else {
        // User doesn't have valid account type, redirect to onboarding
        const onboardingUrl = new URL("/onboarding", req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    }

    // For other routes, use Clerk session metadata (faster)
    const businessId = sessionClaims?.publicMetadata?.businessId as string | undefined;
    const businessType = sessionClaims?.publicMetadata?.businessType as string | undefined;

    // User has valid account type if they have a businessId and valid businessType
    const hasValidAccountType = !!(
      businessId && 
      (businessType === 'sole_trader' || businessType === 'company')
    );

    // If user has a valid account type and is on onboarding page, redirect to dashboard
    if (hasValidAccountType && isOnboardingRoute(req)) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // If user does NOT have a valid account type, redirect to onboarding
    // This includes: no businessId, no businessType, or invalid businessType
    // Allow access to generating page (users who just completed onboarding)
    // Allow access to plans page (users selecting plan)
    if (!hasValidAccountType && !isOnboardingRoute(req) && !isGeneratingRoute(req) && !isPlansRoute(req) && !isPublicRoute(req)) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
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

