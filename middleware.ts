import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)"
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // If user is not signed in and trying to access a protected route, Clerk handles this by default 
  // if we use auth.protect() or similar, but here we want custom logic.
  // Actually, clerkMiddleware doesn't auto-protect unless we tell it to.

  if (!userId && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId) {
    const businessId = sessionClaims?.publicMetadata?.businessId;

    // If user has a business but is on onboarding page, redirect to dashboard
    if (businessId && isOnboardingRoute(req)) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // If user has NO business and is NOT on onboarding/dashboard page (and not public), redirect to onboarding
    // We allow dashboard access even without businessId because the session needs time to refresh after onboarding
    if (!businessId && !isOnboardingRoute(req) && !isDashboardRoute(req) && !isPublicRoute(req)) {
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
