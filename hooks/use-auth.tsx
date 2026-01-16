"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import { SUPER_ADMIN_ROLE } from "@/constants/rbac";

export interface AuthUser {
  id: string;
  username: string;
  full_name?: string;
  role: string;
  roles: string[];
  permissions: string[];
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decoded = decodeJwt(token) as { user: AuthUser };
        setUser(decoded.user);
      } catch (error) {
        console.error("Failed to decode token", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen for cookie changes or storage events if needed
    // Simple approach: poll every few seconds if we want to be reactive to external logouts
    // but usually Next.js router.refresh() handles this.
  }, [refreshUser]);

  const hasPermission = (permission: string) => {
    if (!user) return false;
    // Only check RBAC roles array for admin, NOT the legacy 'role' field
    if (user.roles?.includes(SUPER_ADMIN_ROLE)) return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (roleName: string) => {
    if (!user) return false;
    return user.roles?.includes(roleName) || false;
  };

  // isAdmin only checks if user has 'admin' role in RBAC system
  const isAdmin = user?.roles?.includes(SUPER_ADMIN_ROLE) || false;

  return {
    user,
    isLoading,
    hasPermission,
    hasRole,
    refreshUser,
    isAdmin,
  };

}
