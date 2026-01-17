"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import { SUPER_ADMIN_ROLE, RBAC_ROLES } from "@/constants/rbac";
import api from "@/services/axios";
import axios from "axios";
import { API_ROUTES } from "@/constants/routes";

export interface AuthUser {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  isActive?: boolean;
  roles: string[]; // Role codes
  permissions: string[]; // Permission strings
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    
    // 1. First try to get initial state from JWT for immediate UI feedback
    const token = Cookies.get("accessToken");
    if (token && !isInitialized.current) {
      try {
        const decoded = decodeJwt(token) as { user: AuthUser };
        setUser(decoded.user);
      } catch (error) {
        console.error("Failed to decode token", error);
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
          r.permissions.map((p: any) => `${p.module.code}:${p.canView ? 'VIEW' : ''}${p.canCreate ? ',CREATE' : ''}${p.canUpdate ? ',UPDATE' : ''}${p.canDelete ? ',DELETE' : ''}`)
            .flatMap((s: string) => {
              const [mod, perms] = s.split(':');
              return perms.split(',').filter(Boolean).map(p => `${mod}:${p}`);
            })
        );

        const synchronizedUser: AuthUser = {
          id: profileData.id,
          username: profileData.username || profileData.email.split('@')[0],
          fullName: profileData.fullName,
          email: profileData.email,
          isActive: profileData.isActive,
          roles: roleCodes,
          permissions: Array.from(new Set(permissionStrings)), // Unique permissions
        };

        setUser(synchronizedUser);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error("Failed to fetch profile", error);
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
    // Super admins have all permissions
    if (user.roles?.includes(SUPER_ADMIN_ROLE)) return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (roleCode: string) => {
    if (!user) return false;
    return user.roles?.includes(roleCode) || false;
  };

  // isAdmin only checks if user has 'SUPER_ADMIN' role in RBAC system
  const isSuperAdmin = user?.roles?.includes(SUPER_ADMIN_ROLE) || false;

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

