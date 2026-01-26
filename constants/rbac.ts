
export const RBAC_ROLES = {
    ADMIN: 'ADMIN',
    EDITOR: 'EDITOR',
    VIEWER: 'VIEWER',
} as const;

// Permission action types
export const PERMISSION_ACTIONS = {
    VIEW: 'VIEW',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
} as const;

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

export function buildPermission(module: string, action: string): string {
    return `${module}:${action}`;
}
