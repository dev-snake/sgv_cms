"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";

interface HasPermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A declarative component to conditionally render children based on user permissions.
 */
export function HasPermission({ permission, children, fallback = null }: HasPermissionProps) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) return null;

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
