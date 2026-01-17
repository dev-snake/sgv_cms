/**
 * Application Constants
 * Centralized configuration to avoid hard-coded values
 */

// ============================================================================
// COMPANY INFORMATION
// ============================================================================
export const COMPANY = {
  NAME: "Sài Gòn Valve",
  SHORT_NAME: "SGV",
  EMAIL: process.env.ADMIN_EMAIL || "info@saigonvalve.vn",
  WEBSITE: process.env.APP_URL || "https://saigonvalve.vn",
} as const;

// ============================================================================
// PAGINATION DEFAULTS
// ============================================================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  NEWS_LIMIT: 10,
  PRODUCTS_LIMIT: 12,
  PROJECTS_LIMIT: 12,
  CONTACTS_LIMIT: 10,
  APPLICATIONS_LIMIT: 10,
} as const;

// ============================================================================
// FILE UPLOAD
// ============================================================================
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_DOC_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

// ============================================================================
// NEWS / ARTICLES
// ============================================================================
export const ARTICLE = {
  WORDS_PER_MINUTE: 200, // Average reading speed
  DEFAULT_CATEGORY: "Tin tức",
  DEFAULT_AUTHOR: "Admin",
  READ_TIME_SUFFIX: "PHÚT",
  FALLBACK_IMAGE: "/uploads/images/placeholder-news.jpg",
} as const;

// ============================================================================
// AUTHENTICATION
// ============================================================================
export const AUTH = {
  JWT_EXPIRY: "24h",
  BCRYPT_SALT_ROUNDS: 10,
  SESSION_COOKIE_NAME: "session",
  DEFAULT_ROLE: "admin",
} as const;

// ============================================================================
// DEFAULT ADMIN (for seeding - should use env vars in production)
// ============================================================================
export const SEED_DEFAULTS = {
  ADMIN_USERNAME: process.env.SEED_ADMIN_USERNAME || "admin",
  ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD || "admin123",
  SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME || "superadmin",
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "Super@123",
} as const;

// ============================================================================
// RATE LIMITING
// ============================================================================
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 100,
} as const;
