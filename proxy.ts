import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/services/auth";

import { SITE_ROUTES, ADMIN_ROUTES, API_ROUTES } from "@/constants/routes";

// Add paths that don't require authentication
const publicPaths = [
  SITE_ROUTES.LOGIN,
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.REFRESH,
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Allow public paths explicitly
  if (publicPaths.some((path) => pathname === path || pathname.startsWith(path))) {
    // If it's the login page and user is already logged in, redirect to portal
    if (pathname === SITE_ROUTES.LOGIN) {
      const session = request.cookies.get("session")?.value;
      if (session) {
        try {
          await decrypt(session);
          return NextResponse.redirect(new URL(ADMIN_ROUTES.DASHBOARD, request.url));
        } catch (e) {
          // Invalid session, continue to login
        }
      }
    }
    return NextResponse.next();
  }

  // 2. Allow ALL public GET requests for API (Content fetching)
  // Except for portal-specific APIs if any, but usually content APIs are public for GET
  if (pathname.startsWith("/api/") && method === "GET") {
    return NextResponse.next();
  }

  // 3. Special case: POST /api/contacts is public
  if (pathname === API_ROUTES.CONTACTS && method === "POST") {
    return NextResponse.next();
  }

  // 4. Protect /portal and other API methods (POST/PATCH/DELETE)
  const isPortalPath = pathname.startsWith(ADMIN_ROUTES.ROOT);
  const isProtectedApi = pathname.startsWith("/api/") && ["POST", "PATCH", "DELETE", "PUT"].includes(method);

  if (isPortalPath || isProtectedApi) {
    const session = request.cookies.get("session")?.value;

    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL(SITE_ROUTES.LOGIN, request.url));
    }

    try {
      await decrypt(session);
      return NextResponse.next();
    } catch (error) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL(SITE_ROUTES.LOGIN, request.url));
    }
  }

  // Allow everything else (site pages like /, /san-pham, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

