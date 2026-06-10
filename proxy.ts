import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function proxy(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  const pathname = request.nextUrl.pathname;

  // Protect /app routes
  if (!session) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/analytics") || pathname.startsWith("/content-ideas") || pathname.startsWith("/competitors") || pathname.startsWith("/reports") || pathname.startsWith("/trends") || pathname.startsWith("/evals") || pathname.startsWith("/settings") || pathname.startsWith("/onboarding") || pathname.startsWith("/verify")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    // Authenticated user
    const user = session.user as { emailVerified?: boolean; onboardingComplete?: boolean };
    
    // Auth routes should redirect to dashboard or onboarding
    if (pathname === "/login" || pathname === "/register") {
      if (!user.emailVerified) {
        return NextResponse.redirect(new URL("/verify", request.url));
      }
      if (!user.onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Unverified user accessing app
    if (!user.emailVerified && pathname !== "/verify") {
      return NextResponse.redirect(new URL("/verify", request.url));
    }

    // Verified but incomplete onboarding accessing app
    if (user.emailVerified && !user.onboardingComplete && pathname !== "/onboarding" && pathname !== "/verify") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Complete onboarding accessing onboarding
    if (user.emailVerified && user.onboardingComplete && (pathname === "/onboarding" || pathname === "/verify")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/content-ideas/:path*",
    "/competitors/:path*",
    "/reports/:path*",
    "/trends/:path*",
    "/evals/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
    "/verify/:path*",
    "/login",
    "/register",
  ],
};
