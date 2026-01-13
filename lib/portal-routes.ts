/**
 * Portal Route Constants
 * Centralized route definitions for the admin portal.
 * Update routes here to reflect changes across the entire application.
 */

export const PORTAL_ROUTES = {
  // Dashboard
  dashboard: "/portal",

  // CMS Routes
  cms: {
    news: {
      list: "/portal/cms/news",
      add: "/portal/cms/news/add",
      edit: (id: string) => `/portal/cms/news/${id}/edit`,
    },
    projects: {
      list: "/portal/cms/projects",
      add: "/portal/cms/projects/add",
      edit: (id: string) => `/portal/cms/projects/${id}/edit`,
    },
    products: {
      list: "/portal/cms/products",
      add: "/portal/cms/products/add",
      edit: (id: string) => `/portal/cms/products/${id}/edit`,
    },
  },

  // Contacts
  contacts: "/portal/contacts",

  // Settings
  settings: "/portal/settings",
} as const;

// Type for route paths
export type PortalRoute = typeof PORTAL_ROUTES;
