/**
 * RBAC Constants
 * Centralized constants for Role-Based Access Control
 */

// System Role Names - These are the reserved role names in the RBAC system
export const RBAC_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor', 
  VIEWER: 'viewer',
} as const;

// Role that has all permissions (superuser)
export const SUPER_ADMIN_ROLE = RBAC_ROLES.ADMIN;

// Roles that can manage RBAC settings
export const RBAC_MANAGEMENT_ROLES = [RBAC_ROLES.ADMIN];

// Roles that cannot be deleted
export const PROTECTED_ROLES: string[] = [RBAC_ROLES.ADMIN];


// Permission action types
export const PERMISSION_ACTIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  MANAGE: 'manage',
} as const;

// Permission modules - used for grouping in UI
export const PERMISSION_MODULES = {
  DASHBOARD: 'dashboard',
  NEWS: 'news',
  PRODUCTS: 'products',
  PROJECTS: 'projects',
  MEDIA: 'media',
  RECRUITMENT: 'recruitment',
  CONTACTS: 'contacts',
  USERS: 'users',
  RBAC: 'rbac',
  SYSTEM: 'system',
} as const;

// All permission strings - centralized for type safety
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_READ: 'dashboard:read',
  
  // News
  NEWS_READ: 'news:read',
  NEWS_WRITE: 'news:write',
  NEWS_DELETE: 'news:delete',
  
  // Products
  PRODUCTS_READ: 'products:read',
  PRODUCTS_WRITE: 'products:write',
  PRODUCTS_DELETE: 'products:delete',
  
  // Projects
  PROJECTS_READ: 'projects:read',
  PROJECTS_WRITE: 'projects:write',
  PROJECTS_DELETE: 'projects:delete',
  
  // Media
  MEDIA_READ: 'media:read',
  MEDIA_WRITE: 'media:write',
  MEDIA_DELETE: 'media:delete',
  
  // Jobs
  JOBS_READ: 'jobs:read',
  JOBS_WRITE: 'jobs:write',
  JOBS_DELETE: 'jobs:delete',
  
  // Applications
  APPLICATIONS_READ: 'applications:read',
  APPLICATIONS_WRITE: 'applications:write',
  APPLICATIONS_DELETE: 'applications:delete',
  
  // Contacts
  CONTACTS_READ: 'contacts:read',
  CONTACTS_WRITE: 'contacts:write',
  CONTACTS_DELETE: 'contacts:delete',
  
  // Users
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  
  // RBAC
  RBAC_MANAGE: 'rbac:manage',
  
  // System
  SYSTEM_MANAGE: 'system:manage',
} as const;

// Helper to build permission string
export function buildPermission(module: string, action: string): string {
  return `${module}:${action}`;
}

