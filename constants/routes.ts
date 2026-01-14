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

export type PortalRoute = typeof PORTAL_ROUTES;
