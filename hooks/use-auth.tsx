'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';
import { RBAC_ROLES } from '@/constants/rbac';
import api from '@/services/axios';
import axios from 'axios';
import { API_ROUTES } from '@/constants/routes';

export interface SidebarModule {
    code: string;
    name: string;
    icon: string | null;
    route: string | null;
    order: number;
}

export interface AuthUser {
    id: string;
    username: string;
    fullName?: string;
    email?: string;
    isActive?: boolean;
    is_super?: boolean; // New flag for system-wide super access
    avatarUrl?: string; // Image URL for profile
    phone?: string;
    roles: string[]; // Role codes
    permissions: string[]; // Permission strings
    modules: SidebarModule[]; // Modules for sidebar
}

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isInitialized = useRef(false);

    const refreshUser = useCallback(async () => {
        setIsLoading(true);

        // 1. First try to get initial state from JWT for immediate UI feedback
        const token = Cookies.get('accessToken');
        if (token && !isInitialized.current) {
            try {
                const decoded = decodeJwt(token) as { user: AuthUser };
                setUser(decoded.user);
            } catch (error) {
                console.error('Failed to decode token', error);
            }
        }

        // 2. Fetch fresh data from server to ensure accuracy
        try {
            const response = await api.get(API_ROUTES.AUTH.PROFILE);
            if (response.data.success) {
                const profileData = response.data.data;

                // Flatten roles and permissions from the nested structure
                const roleCodes = profileData.roles.map((r: any) => r.code);

                const permissionStrings = profileData.roles.flatMap((r: any) =>
                    r.permissions
                        .map(
                            (p: any) =>
                                `${p.module.code}:${p.canView ? 'VIEW' : ''}${p.canCreate ? ',CREATE' : ''}${p.canUpdate ? ',UPDATE' : ''}${p.canDelete ? ',DELETE' : ''}`,
                        )
                        .flatMap((s: string) => {
                            const [mod, perms] = s.split(':');
                            return perms
                                .split(',')
                                .filter(Boolean)
                                .map((p) => `${mod}:${p}`);
                        }),
                );

                // Extract unique modules with VIEW permission for sidebar
                const moduleMap = new Map<string, SidebarModule>();
                let isSystemSuper = false; // Flag to track if any role is super

                profileData.roles.forEach((r: any) => {
                    if (r.is_super) isSystemSuper = true;

                    r.permissions.forEach((p: any) => {
                        if (p.canView && p.module && !moduleMap.has(p.module.code)) {
                            moduleMap.set(p.module.code, {
                                code: p.module.code,
                                name: p.module.name,
                                icon: p.module.icon,
                                route: p.module.route,
                                order: p.module.order ?? 0,
                            });
                        }
                    });
                });

                const sidebarModules = Array.from(moduleMap.values()).sort(
                    (a, b) => a.order - b.order,
                );

                const synchronizedUser: AuthUser = {
                    id: profileData.id,
                    username: profileData.username || profileData.email.split('@')[0],
                    fullName: profileData.fullName,
                    email: profileData.email,
                    isActive: profileData.isActive,
                    is_super: isSystemSuper,
                    avatarUrl: profileData.avatarUrl,
                    phone: profileData.phone,
                    roles: roleCodes,
                    permissions: Array.from(new Set(permissionStrings)), // Unique permissions
                    modules: sidebarModules,
                };

                setUser(synchronizedUser);
            } else {
                setUser(null);
            }
        } catch (error: any) {
            console.error('Failed to fetch profile', error);
            // Only clear user if it's a 401/403
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setUser(null);
            }
        } finally {
            setIsLoading(false);
            isInitialized.current = true;
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const hasPermission = (permission: string) => {
        if (!user) return false;
        if (user.is_super) return true;
        return user.permissions?.includes(permission) || false;
    };

    const hasRole = (roleCode: string) => {
        if (!user) return false;
        return user.roles?.includes(roleCode) || false;
    };

    // isSuperAdmin checks the new is_super flag
    const isSuperAdmin = user?.is_super || false;

    return {
        user,
        isLoading,
        hasPermission,
        hasRole,
        refreshUser,
        isSuperAdmin,
        isAdmin: isSuperAdmin || user?.roles?.includes(RBAC_ROLES.ADMIN) || false,
    };
}
