/**
 * RBAC Constants
 * Centralized constants for Role-Based Access Control
 */

// System Role Names - These are the reserved role names in the RBAC system
export const RBAC_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN', 
  EDITOR: 'EDITOR', 
  VIEWER: 'VIEWER',
} as const;

// Role that has all permissions (superuser)
export const SUPER_ADMIN_ROLE = RBAC_ROLES.SUPER_ADMIN;

// Roles that can manage RBAC settings
export const RBAC_MANAGEMENT_ROLES = [RBAC_ROLES.SUPER_ADMIN];

// Roles that cannot be deleted
export const PROTECTED_ROLES: string[] = [RBAC_ROLES.SUPER_ADMIN];


// Permission action types
export const PERMISSION_ACTIONS = {
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

// Permission modules - used for grouping in UI
export const PERMISSION_MODULES = {
  DASHBOARD: 'DASHBOARD',
  BLOG: 'BLOG',
  CMS: 'CMS',
  PRODUCTS: 'PRODUCTS',
  PROJECTS: 'PROJECTS',
  MEDIA: 'MEDIA',
  RECRUITMENT: 'RECRUITMENT',
  CONTACTS: 'CONTACTS',
  USERS: 'USERS',
  ROLES: 'ROLES',
  SYSTEM: 'SYSTEM',
} as const;

// Modules that cannot be deleted
export const PROTECTED_MODULES: string[] = Object.values(PERMISSION_MODULES);

// All permission strings - centralized for type safety
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'DASHBOARD:VIEW',
  
  // Blog
  BLOG_VIEW: 'BLOG:VIEW',
  BLOG_CREATE: 'BLOG:CREATE',
  BLOG_UPDATE: 'BLOG:UPDATE',
  BLOG_DELETE: 'BLOG:DELETE',
  
  // CMS
  CMS_VIEW: 'CMS:VIEW',
  CMS_CREATE: 'CMS:CREATE',
  CMS_UPDATE: 'CMS:UPDATE',
  CMS_DELETE: 'CMS:DELETE',
  
  // Products
  PRODUCTS_VIEW: 'PRODUCTS:VIEW',
  PRODUCTS_CREATE: 'PRODUCTS:CREATE',
  PRODUCTS_UPDATE: 'PRODUCTS:UPDATE',
  PRODUCTS_DELETE: 'PRODUCTS:DELETE',
  
  // Projects
  PROJECTS_VIEW: 'PROJECTS:VIEW',
  PROJECTS_CREATE: 'PROJECTS:CREATE',
  PROJECTS_UPDATE: 'PROJECTS:UPDATE',
  PROJECTS_DELETE: 'PROJECTS:DELETE',
  
  // Media
  MEDIA_VIEW: 'MEDIA:VIEW',
  MEDIA_CREATE: 'MEDIA:CREATE',
  MEDIA_UPDATE: 'MEDIA:UPDATE',
  MEDIA_DELETE: 'MEDIA:DELETE',
  
  // Recruitment
  RECRUITMENT_VIEW: 'RECRUITMENT:VIEW',
  RECRUITMENT_CREATE: 'RECRUITMENT:CREATE',
  RECRUITMENT_UPDATE: 'RECRUITMENT:UPDATE',
  RECRUITMENT_DELETE: 'RECRUITMENT:DELETE',
  
  // Contacts
  CONTACTS_VIEW: 'CONTACTS:VIEW',
  CONTACTS_CREATE: 'CONTACTS:CREATE',
  CONTACTS_UPDATE: 'CONTACTS:UPDATE',
  CONTACTS_DELETE: 'CONTACTS:DELETE',
  
  // Users
  USERS_VIEW: 'USERS:VIEW',
  USERS_CREATE: 'USERS:CREATE',
  USERS_UPDATE: 'USERS:UPDATE',
  USERS_DELETE: 'USERS:DELETE',
  
  // Roles
  ROLES_VIEW: 'ROLES:VIEW',
  ROLES_CREATE: 'ROLES:CREATE',
  ROLES_UPDATE: 'ROLES:UPDATE',
  ROLES_DELETE: 'ROLES:DELETE',
  
  // System
  SYSTEM_VIEW: 'SYSTEM:VIEW',
  SYSTEM_CREATE: 'SYSTEM:CREATE',
  SYSTEM_UPDATE: 'SYSTEM:UPDATE',
  SYSTEM_DELETE: 'SYSTEM:DELETE',
} as const;

// Helper to build permission string
export function buildPermission(module: string, action: string): string {
  return `${module}:${action}`;
}


