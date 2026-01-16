/**
 * Security Middleware Utilities
 * Helper functions for authentication, authorization, and input validation
 */

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/services/auth";
import { ZodSchema, ZodError } from "zod";
import { apiError } from "@/utils/api-response";

/**
 * User session interface
 */
export interface UserSession {
  user: {
    id: string;
    username: string;
    full_name?: string | null;
    role: string; // Legacy role string
    roles: string[];
    permissions: string[];
  };
}

/**
 * Verify authentication from request
 * Checks session cookie and returns user data
 */
export async function verifyAuth(request: NextRequest): Promise<UserSession | null> {
  const session = request.cookies.get("session")?.value;
  
  if (!session) {
    return null;
  }

  try {
    const sessionData = await decrypt(session);
    return sessionData as UserSession;
  } catch (error) {
    return null;
  }
}

/**
 * Require authentication
 * Returns 401 if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<UserSession | Response> {
  const session = await verifyAuth(request);
  
  if (!session) {
    return apiError("Unauthorized - Authentication required", 401);
  }
  
  return session;
}

export function hasRole(user: UserSession['user'], allowedRoles: string[]): boolean {
  // Only check RBAC roles array, not legacy role field
  return user.roles?.some(r => allowedRoles.includes(r)) || false;
}

/**
 * Check if user has specific permission
 */
export function hasPermission(user: UserSession['user'], permission: string): boolean {
  // Only admins in RBAC roles array bypass permission checks
  if (user.roles?.includes('admin')) return true;
  
  return user.permissions?.includes(permission) || false;
}

/**
 * Require specific permission
 */
export async function requirePermission(
  request: NextRequest,
  permission: string
): Promise<UserSession | Response> {
  const sessionOrError = await requireAuth(request);
  
  if (sessionOrError instanceof Response) {
    return sessionOrError;
  }
  
  if (!hasPermission(sessionOrError.user, permission)) {
    return apiError(
      `Forbidden - Required permission: ${permission}`,
      403
    );
  }
  
  return sessionOrError;
}

/**
 * Require specific role(s)
 * Returns 403 if user doesn't have required role
 */
export async function requireRole(
  request: NextRequest, 
  allowedRoles: string[]
): Promise<UserSession | Response> {
  const sessionOrError = await requireAuth(request);
  
  if (sessionOrError instanceof Response) {
    return sessionOrError;
  }
  
  if (!hasRole(sessionOrError.user, allowedRoles)) {
    return apiError(
      `Forbidden - Requires one of: ${allowedRoles.join(', ')}`,
      403
    );
  }
  
  return sessionOrError;
}

/**
 * Validate request body against Zod schema
 * Returns validated data or error response
 */
export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<T | Response> {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    return validated;
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(
        "Validation failed",
        400,
        { errors: error.issues }
      );
    }
    return apiError("Invalid request body", 400);
  }
}

/**
 * Validate query parameters against Zod schema
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): T | Response {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const validated = schema.parse(params);
    return validated;
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(
        "Invalid query parameters",
        400,
        { errors: error.issues }
      );
    }
    return apiError("Invalid query parameters", 400);
  }
}

/**
 * Sanitize HTML input to prevent XSS
 * Basic implementation - consider using a library like DOMPurify for production
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Basic sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export function isAdmin(user: UserSession['user']): boolean {
  // Only check RBAC roles array
  return user.roles?.includes('admin') || false;
}

/**
 * Check if user can edit (admin or editor)
 */
export function canEdit(user: UserSession['user']): boolean {
  if (isAdmin(user)) return true;
  return ['editor'].includes(user.role) || user.roles?.includes('editor');
}

/**
 * Get user from request or return error
 */
export async function getUserOrError(request: NextRequest): Promise<
  { user: UserSession['user'] } | Response
> {
  const session = await requireAuth(request);
  
  if (session instanceof Response) {
    return session;
  }
  
  return { user: session.user };
}

/**
 * Wrapper for API route handlers with auth and validation
 */
export function withAuth(
  handler: (request: NextRequest, session: UserSession, context?: any) => Promise<Response>,
  options?: {
    allowedRoles?: string[];
    requiredPermissions?: string[];
  }
) {
  return async (request: NextRequest, context?: any) => {
    let sessionOrError: UserSession | Response;
    
    if (options?.allowedRoles) {
      sessionOrError = await requireRole(request, options.allowedRoles);
    } else {
      sessionOrError = await requireAuth(request);
    }
    
    if (sessionOrError instanceof Response) {
      return sessionOrError;
    }

    if (options?.requiredPermissions && options.requiredPermissions.length > 0) {
      const hasAll = options.requiredPermissions.every(p => hasPermission(sessionOrError.user, p));
      if (!hasAll && !isAdmin(sessionOrError.user)) {
        return apiError(
          `Forbidden - Required permissions: ${options.requiredPermissions.join(', ')}`,
          403
        );
      }
    }
    
    return handler(request, sessionOrError, context);
  };
}

/**
 * Wrapper for API route handlers with validation
 */
export function withValidation<T>(
  handler: (request: NextRequest, data: T, context?: any) => Promise<Response>,
  schema: ZodSchema<T>
) {
  return async (request: NextRequest, context?: any) => {
    const dataOrError = await validateBody(request, schema);
    
    if (dataOrError instanceof Response) {
      return dataOrError;
    }
    
    return handler(request, dataOrError, context);
  };
}
