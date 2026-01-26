import { create } from 'zustand';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';
import api from '@/utils/axios';
import axios from 'axios';
import { API_ROUTES } from '@/constants/routes';

export interface SidebarModule {
    id: string;
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
    is_super?: boolean;
    avatarUrl?: string;
    phone?: string;
    roles: string[];
    permissions: string[];
    modules: SidebarModule[];
}

interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
    isInitialized: boolean;
    setUser: (user: AuthUser | null) => void;
    setLoading: (isLoading: boolean) => void;
    refreshUser: () => Promise<void>;
    initialize: () => void;
    logout: () => void;
    setModulesOrder: (newModules: SidebarModule[]) => void;
    syncModulesOrder: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,
    isInitialized: false,

    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),

    refreshUser: async () => {
        set({ isLoading: true });

        // 1. First try to get initial state from JWT if not initialized
        if (!get().isInitialized) {
            const token = Cookies.get('accessToken');
            if (token) {
                try {
                    const decoded = decodeJwt(token) as { user: AuthUser };
                    set({ user: decoded.user });
                } catch (error) {
                    console.error('Failed to decode token', error);
                }
            }
        }

        // 2. Fetch fresh data from server
        try {
            const response = await api.get(API_ROUTES.AUTH.PROFILE);
            if (response.data.success) {
                const profileData = response.data.data;

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

                const moduleMap = new Map<string, SidebarModule>();
                let isSystemSuper = !!profileData.is_super;

                profileData.roles.forEach((r: any) => {
                    if (r.is_super) isSystemSuper = true;
                    r.permissions.forEach((p: any) => {
                        if (p.canView && p.module && !moduleMap.has(p.module.code)) {
                            moduleMap.set(p.module.code, {
                                id: p.module.id,
                                code: p.module.code,
                                name: p.module.name,
                                icon: p.module.icon,
                                route: p.module.route,
                                order: p.module.order ?? 0,
                            });
                        }
                    });
                });

                // If superadmin, use ALL modules from allModules field
                if (isSystemSuper && profileData.allModules) {
                    profileData.allModules.forEach((module: any) => {
                        if (module.route && !moduleMap.has(module.code)) {
                            moduleMap.set(module.code, {
                                id: module.id,
                                code: module.code,
                                name: module.name,
                                icon: module.icon,
                                route: module.route,
                                order: module.order ?? 0,
                            });
                        }
                    });
                }

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
                    permissions: Array.from(new Set(permissionStrings)),
                    modules: sidebarModules,
                };

                set({ user: synchronizedUser, isInitialized: true });
            } else {
                // If success: false, treat as unauthorized
                await get().logout();
            }
        } catch (error: any) {
            console.error('Auth check failed:', error);
            // If any 401, 403, 404 or missing response, force logout
            if (
                axios.isAxiosError(error) &&
                (error.response?.status === 401 ||
                    error.response?.status === 404 ||
                    error.response?.status === 403)
            ) {
                await get().logout();
            } else {
                set({ user: null, isInitialized: true });
            }
        } finally {
            set({ isLoading: false });
        }
    },

    initialize: () => {
        if (!get().isInitialized) {
            get().refreshUser();
        }
    },

    logout: async () => {
        // 1. Clear State
        set({ user: null, isInitialized: true, isLoading: false });

        // 2. Clear Client-side non-HttpOnly cookies
        Cookies.remove('accessToken', { path: '/' });

        // 3. Call server to clear HttpOnly cookies (session, refreshToken)
        try {
            await api.post(API_ROUTES.AUTH.LOGOUT);
        } catch (error) {
            console.error('Logout API failed:', error);
        }

        // 4. Force redirect if in portal
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/portal')) {
            window.location.href = '/login';
        }
    },
    setModulesOrder: (newModules: SidebarModule[]) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
            user: {
                ...currentUser,
                modules: newModules.map((m, index) => ({ ...m, order: index })),
            },
        });
    },
    syncModulesOrder: async () => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
            await api.patch('/api/modules/reorder', {
                items: currentUser.modules.map((m) => ({ id: m.id, order: m.order })),
            });
        } catch (error) {
            console.error('Failed to sync modules order:', error);
            // Optional: You might want to re-fetch if sync fails to ensure consistency
            // get().refreshUser();
            throw error;
        }
    },
}));
