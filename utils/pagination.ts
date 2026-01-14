/**
 * Pagination Utility
 * Reusable pagination logic for all API endpoints
 */

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Parse pagination parameters from URL search params
 * @param searchParams - URL search params
 * @param defaults - Default values for page and limit
 * @returns Parsed pagination parameters
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults: { page?: number; limit?: number } = {}
): PaginationParams {
  const { page: defaultPage = 1, limit: defaultLimit = 10 } = defaults;
  
  const page = Math.max(1, parseInt(searchParams.get("page") || String(defaultPage), 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || String(defaultLimit), 10)));
  
  return { page, limit };
}

/**
 * Calculate pagination offset for database queries
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Offset for database query
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Create pagination metadata
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Create a paginated result object
 * @param data - Array of data items
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Paginated result with data and meta
 */
export function createPaginatedResult<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResult<T> {
  return {
    data,
    meta: createPaginationMeta(page, limit, total),
  };
}
