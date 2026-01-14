import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/services/auth";

// Add paths that don't require authentication
const publicPaths = [
  "/login",
  "/api/auth/login",
  "/api/contacts", // Allow public to send contact messages
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle public paths explicitly if they fall under the matcher
  if (publicPaths.some((path) => pathname === path || pathname.startsWith(path))) {
    // Special case for POST /api/contacts - it's public
    if (pathname === "/api/contacts" && request.method === "POST") {
      return NextResponse.next();
    }
    
    // If it's the login page and user is already logged in, redirect to portal
    if (pathname === "/login") {
      const session = request.cookies.get("session")?.value;
      if (session) {
        try {
          await decrypt(session);
          return NextResponse.redirect(new URL("/portal", request.url));
        } catch (e) {
          // Invalid session, continue to login
        }
      }
    }
    return NextResponse.next();
  }

  // Check for session cookie
  const session = request.cookies.get("session")?.value;

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await decrypt(session);
    return NextResponse.next();
  } catch (error) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/portal/:path*",
    "/api/:path*",
    "/login",
  ],
};

