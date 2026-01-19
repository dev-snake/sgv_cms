/**
 * RBAC Constants
 * Centralized constants for Role-Based Access Control
 */

// System Role Names - These are the reserved role names in the RBAC system
export const RBAC_ROLES = {
    ADMIN: 'ADMIN',
    EDITOR: 'EDITOR',
    VIEWER: 'VIEWER',
} as const;

// Roles that cannot be deleted
export const PROTECTED_ROLES: string[] = [RBAC_ROLES.ADMIN];

// Permission action types
export const PERMISSION_ACTIONS = {
    VIEW: 'VIEW',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
} as const;

/**
 * Dynamic Permissions Proxy
 * Automatically maps property access to MODULE:ACTION strings.
 * Example: PERMISSIONS.BLOG_VIEW -> 'BLOG:VIEW'
 */
export const PERMISSIONS: Record<string, string> = new Proxy({} as any, {
    get: (_target, prop: string) => {
        if (typeof prop !== 'string' || prop === '$$typeof' || prop === 'toJSON') {
            return undefined;
        }

        // Split by last underscore: MODULE_ACTION -> [MODULE, ACTION]
        // Example: RECRUITMENT_VIEW -> ["RECRUITMENT", "VIEW"]
        // Important: Action should be one of PERMISSION_ACTIONS
        const lastUnderscoreIndex = prop.lastIndexOf('_');
        if (lastUnderscoreIndex === -1) return prop;

        const moduleCode = prop.substring(0, lastUnderscoreIndex);
        const action = prop.substring(lastUnderscoreIndex + 1);

        return `${moduleCode}:${action}`;
    },
});

// Modules that cannot be deleted - we keep some core ones as static list if needed
export const PROTECTED_MODULES: string[] = ['DASHBOARD', 'USERS', 'ROLES', 'MODULES'];

// Helper to build permission string
export function buildPermission(module: string, action: string): string {
    return `${module}:${action}`;
}
