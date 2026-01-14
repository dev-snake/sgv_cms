/**
 * Centralized Route Definitions
 * Use these constants instead of hard-coded strings throughout the app.
 */

export const SITE_ROUTES = {
  HOME: "/",
  ABOUT: "/gioi-thieu",
  PRODUCTS: "/san-pham",
  PROJECTS: "/du-an",
  NEWS: "/tin-tuc",
  CONTACT: "/lien-he",
  LOGIN: "/login",
} as const;

export const PORTAL_ROUTES = {
  // Dashboard
  dashboard: "/portal",

  // CMS Routes
  cms: {
    news: {
      list: "/portal/cms/news",
      add: "/portal/cms/news/add",
      edit: (id: string) => `/portal/cms/news/${id}/edit`,
      categories: {
        list: "/portal/cms/news/categories",
        add: "/portal/cms/news/categories/add",
        edit: (id: string) => `/portal/cms/news/categories/${id}/edit`,
      }
    },
    projects: {
      list: "/portal/cms/projects",
      add: "/portal/cms/projects/add",
      edit: (id: string) => `/portal/cms/projects/${id}/edit`,
      categories: {
        list: "/portal/cms/projects/categories",
        add: "/portal/cms/projects/categories/add",
        edit: (id: string) => `/portal/cms/projects/categories/${id}/edit`,
      }
    },
    products: {
      list: "/portal/cms/products",
      add: "/portal/cms/products/add",
      edit: (id: string) => `/portal/cms/products/${id}/edit`,
      categories: {
        list: "/portal/cms/products/categories",
        add: "/portal/cms/products/categories/add",
        edit: (id: string) => `/portal/cms/products/categories/${id}/edit`,
      }
    },
  },

  // Contacts
  contacts: "/portal/contacts",

  // Settings
  settings: "/portal/settings",
} as const;

export const ADMIN_ROUTES = {
  ROOT: "/portal",
  DASHBOARD: "/portal/cms/news", // Current landing for admin
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  PRODUCTS: "/api/products",
  NEWS: "/api/news",
  PROJECTS: "/api/projects",
  CONTACTS: "/api/contacts",
  CATEGORIES: "/api/categories",
  MEDIA: "/api/media",
} as const;

export type PortalRoute = typeof PORTAL_ROUTES;
