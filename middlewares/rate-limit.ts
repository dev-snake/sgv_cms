/**
 * Rate Limiter Utility
 * In-memory rate limiting for API endpoints
 * For production, consider using Redis-based solution like @upstash/ratelimit
 */

import { NextRequest } from "next/server";
import { apiError } from "@/utils/api-response";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production!)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute

export interface RateLimitConfig {
  /**
   * Maximum number of requests
   */
  max: number;
  
  /**
   * Time window in seconds
   */
  windowSeconds: number;
  
  /**
   * Custom key generator
   * Default: IP address
   */
  keyGenerator?: (request: NextRequest) => string;
  
  /**
   * Custom error message
   */
  message?: string;
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real.trim();
  }
  
  // Fallback (won't work in production without proxy headers)
  return 'unknown';
}

/**
 * Rate limit checker
 * Returns null if allowed, or error Response if rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Response | null {
  const { max, windowSeconds, keyGenerator, message } = config;
  
  // Generate key (default: IP + path)
  const ip = keyGenerator ? keyGenerator(request) : getClientIp(request);
  const path = new URL(request.url).pathname;
  const key = `${ip}:${path}`;
  
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  
  // Get or create entry
  let entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    // New window
    entry = {
      count: 1,
      resetTime: now + windowMs
    };
    rateLimitStore.set(key, entry);
    return null; // Allowed
  }
  
  // Increment count
  entry.count++;
  
  // Check if exceeded
  if (entry.count > max) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    
    const response = apiError(
      message || `Too many requests. Please try again in ${retryAfter} seconds.`,
      429
    );
    
    // Add rate limit headers
    const headers = new Headers(response.headers);
    headers.set('X-RateLimit-Limit', max.toString());
    headers.set('X-RateLimit-Remaining', '0');
    headers.set('X-RateLimit-Reset', entry.resetTime.toString());
    headers.set('Retry-After', retryAfter.toString());
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
  
  // Still within limit
  rateLimitStore.set(key, entry);
  return null; // Allowed
}

/**
 * Rate limit configurations for different endpoint types
 */
export const RATE_LIMITS = {
  // Strict limit for authentication endpoints
  AUTH: {
    max: 5,
    windowSeconds: 60, // 5 attempts per minute
    message: "Too many login attempts. Please try again later."
  },
  
  // Moderate limit for write operations
  WRITE: {
    max: 20,
    windowSeconds: 60, // 20 requests per minute
    message: "Too many requests. Please slow down."
  },
  
  // Relaxed limit for read operations
  READ: {
    max: 100,
    windowSeconds: 60, // 100 requests per minute
  },
  
  // Very relaxed for public content
  PUBLIC: {
    max: 300,
    windowSeconds: 60, // 300 requests per minute
  },
  
  // Strict limit for contact form to prevent spam
  CONTACT: {
    max: 3,
    windowSeconds: 300, // 3 submissions per 5 minutes
    message: "Too many contact form submissions. Please try again later."
  },
  
  // For file uploads
  UPLOAD: {
    max: 10,
    windowSeconds: 60, // 10 uploads per minute
    message: "Too many file uploads. Please wait before uploading more."
  }
} as const;

/**
 * Wrapper for rate-limited API route handlers
 */
export function withRateLimit(
  handler: (request: NextRequest, context?: any) => Promise<Response>,
  config: RateLimitConfig
) {
  return async (request: NextRequest, context?: any) => {
    // Check rate limit
    const rateLimitError = checkRateLimit(request, config);
    if (rateLimitError) {
      return rateLimitError;
    }
    
    // Proceed with handler
    return handler(request, context);
  };
}

/**
 * Get rate limit status for a request (useful for headers)
 */
export function getRateLimitStatus(
  request: NextRequest,
  config: RateLimitConfig
): {
  limit: number;
  remaining: number;
  reset: number;
} {
  const { max, windowSeconds, keyGenerator } = config;
  
  const ip = keyGenerator ? keyGenerator(request) : getClientIp(request);
  const path = new URL(request.url).pathname;
  const key = `${ip}:${path}`;
  
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    return {
      limit: max,
      remaining: max,
      reset: now + (windowSeconds * 1000)
    };
  }
  
  return {
    limit: max,
    remaining: Math.max(0, max - entry.count),
    reset: entry.resetTime
  };
}
