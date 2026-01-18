import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/services/auth';
import { checkRateLimit, RATE_LIMITS } from '@/middlewares/rate-limit';

import { SITE_ROUTES, ADMIN_ROUTES, API_ROUTES } from '@/constants/routes';
import { RBAC_ROLES } from '@/constants/rbac';

// Add paths that don't require authentication
const publicPaths = [
    SITE_ROUTES.LOGIN,
    API_ROUTES.AUTH.LOGIN,
    API_ROUTES.AUTH.REFRESH,
    API_ROUTES.AUTH.LOGOUT,
];

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const method = request.method;

    // ===== RATE LIMITING =====
    // Apply rate limits based on endpoint type
    if (pathname.startsWith(API_ROUTES.AUTH.LOGIN)) {
        const rateLimitError = checkRateLimit(request, RATE_LIMITS.AUTH);
        if (rateLimitError) return rateLimitError;
    } else if (pathname === API_ROUTES.CONTACTS && method === 'POST') {
        const rateLimitError = checkRateLimit(request, RATE_LIMITS.CONTACT);
        if (rateLimitError) return rateLimitError;
    } else if (pathname.startsWith('/api/upload')) {
        const rateLimitError = checkRateLimit(request, RATE_LIMITS.UPLOAD);
        if (rateLimitError) return rateLimitError;
    } else if (method === 'GET') {
        // Relaxed rate limit for public reads
        const rateLimitError = checkRateLimit(request, RATE_LIMITS.PUBLIC);
        if (rateLimitError) return rateLimitError;
    } else if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
        // Moderate rate limit for writes
        const rateLimitError = checkRateLimit(request, RATE_LIMITS.WRITE);
        if (rateLimitError) return rateLimitError;
    }

    // 1. Allow public paths explicitly
    if (publicPaths.some((path) => pathname === path || pathname.startsWith(path))) {
        // If it's the login page and user is already logged in, redirect to portal
        if (pathname === SITE_ROUTES.LOGIN) {
            const session = request.cookies.get('session')?.value;
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
    if (pathname.startsWith('/api/') && method === 'GET') {
        return NextResponse.next();
    }

    // 3. Special case: POST /api/contacts is public (with rate limit already applied)
    if (pathname === API_ROUTES.CONTACTS && method === 'POST') {
        return NextResponse.next();
    }

    // 4. Special case: Chat API routes are public (for guest users)
    if (pathname.startsWith('/api/chat/') && ['POST', 'GET'].includes(method)) {
        return NextResponse.next();
    }

    // 4. Protect /portal and other API methods (POST/PATCH/DELETE)
    const isPortalPath = pathname.startsWith(ADMIN_ROUTES.ROOT);
    const isProtectedApi =
        pathname.startsWith('/api/') && ['POST', 'PATCH', 'DELETE', 'PUT'].includes(method);

    if (isPortalPath || isProtectedApi) {
        const session = request.cookies.get('session')?.value;

        if (!session) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Unauthorized - Authentication required',
                    },
                    { status: 401 },
                );
            }
            return NextResponse.redirect(new URL(SITE_ROUTES.LOGIN, request.url));
        }

        try {
            const sessionData = await decrypt(session);
            const userRoles = sessionData?.user?.roles || [];
            const isSuperAdmin = userRoles.includes(RBAC_ROLES.SUPER_ADMIN);
            const isAdmin = userRoles.includes(RBAC_ROLES.ADMIN) || isSuperAdmin;
            const isEditor = userRoles.includes(RBAC_ROLES.EDITOR) || isAdmin;

            // Check role-based permissions for sensitive operations
            if (isProtectedApi) {
                // DELETE operations require admin role (now checked via RBAC codes)
                if (method === 'DELETE' && !isAdmin) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: 'Forbidden - Admin role required for delete operations',
                        },
                        { status: 403 },
                    );
                }

                // User management requires admin
                if (pathname.startsWith('/api/users') && !isAdmin) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: 'Forbidden - Admin role required for user management',
                        },
                        { status: 403 },
                    );
                }

                // Write operations require at least editor role
                if (['POST', 'PATCH', 'PUT'].includes(method)) {
                    if (!isEditor) {
                        return NextResponse.json(
                            {
                                success: false,
                                error: 'Forbidden - Editor or Admin role required',
                            },
                            { status: 403 },
                        );
                    }
                }
            }

            return NextResponse.next();
        } catch (error) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Unauthorized - Invalid session',
                    },
                    { status: 401 },
                );
            }
            return NextResponse.redirect(new URL(SITE_ROUTES.LOGIN, request.url));
        }
    }

    // Allow everything else (site pages like /, /san-pham, etc.)
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
