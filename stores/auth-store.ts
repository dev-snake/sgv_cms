import { create } from 'zustand';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';
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
                let isSystemSuper = false;

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
                    permissions: Array.from(new Set(permissionStrings)),
                    modules: sidebarModules,
                };

                set({ user: synchronizedUser, isInitialized: true });
            } else {
                set({ user: null, isInitialized: true });
            }
        } catch (error: any) {
            console.error('Failed to fetch profile', error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
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
}));
