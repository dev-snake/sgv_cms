import { create } from 'zustand';
import $api from '@/utils/axios';
import { API_ROUTES } from '@/constants/routes';

export interface Category {
    id: string;
    name: string;
    slug: string;
    type: 'product' | 'news' | 'project';
    description: string | null;
}

export interface Author {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
}

export interface Role {
    id: string;
    code: string;
    name: string;
    description: string;
}

interface ConfigState {
    categories: Category[];
    authors: Author[];
    roles: Role[];
    isLoading: boolean;
    isInitialized: boolean;

    // Actions
    fetchCategories: () => Promise<void>;
    fetchAuthors: () => Promise<void>;
    fetchRoles: () => Promise<void>;
    initialize: (force?: boolean) => Promise<void>;

    // Helpers
    getCategoriesByType: (type: Category['type']) => Category[];
}

export const useConfigStore = create<ConfigState>((set, get) => ({
    categories: [],
    authors: [],
    roles: [],
    isLoading: false,
    isInitialized: false,

    fetchCategories: async () => {
        try {
            const res = await $api.get(API_ROUTES.CATEGORIES);
            if (res.data.success) {
                set({ categories: res.data.data });
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    },

    fetchAuthors: async () => {
        try {
            const res = await $api.get(API_ROUTES.AUTHORS);
            if (res.data.success) {
                set({ authors: res.data.data });
            }
        } catch (error) {
            console.error('Failed to fetch authors:', error);
        }
    },

    fetchRoles: async () => {
        try {
            const res = await $api.get(API_ROUTES.ROLES);
            if (res.data.success) {
                set({ roles: res.data.data });
            }
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        }
    },

    initialize: async (force = false) => {
        if (get().isInitialized && !force) return;

        set({ isLoading: true });
        try {
            // Fetch everything in parallel
            await Promise.all([get().fetchCategories(), get().fetchAuthors(), get().fetchRoles()]);
            set({ isInitialized: true });
        } catch (error) {
            console.error('Config initialization failed:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    getCategoriesByType: (type) => {
        return get().categories.filter((c) => c.type === type);
    },
}));
