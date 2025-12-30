/**
 * Next.js Middleware for Route Protection
 *
 * Protects routes based on authentication state:
 * - Redirects unauthenticated users to /login for protected routes
 * - Redirects authenticated users away from /login and /register
 *
 * @see US3: Protected Route Access
 */

import { NextRequest, NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register"];

// Auth routes that authenticated users should be redirected away from
const authRoutes = ["/login", "/register"];

// API routes to exclude from middleware
const apiRoutes = ["/api/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes
  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for Better Auth session cookie
  // Better Auth uses 'better-auth.session_token' cookie by default
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSession = !!sessionCookie?.value;

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  // Check if current path is an auth route (login/register)
  const isAuthRoute = authRoutes.includes(pathname);

  // Redirect unauthenticated users to login for protected routes
  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    // Add redirect parameter to return after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
