'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { PERMISSIONS } from '@/constants/rbac';
import { PORTAL_ROUTES } from '@/constants/routes';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Map of route prefixes to required permissions
const ROUTE_PERMISSIONS: Record<string, string> = {
    [PORTAL_ROUTES.cms.news.list]: PERMISSIONS.BLOG_VIEW,
    [PORTAL_ROUTES.cms.projects.list]: PERMISSIONS.PROJECTS_VIEW,
    [PORTAL_ROUTES.cms.products.list]: PERMISSIONS.PRODUCTS_VIEW,
    [PORTAL_ROUTES.cms.media]: PERMISSIONS.MEDIA_VIEW,
    [PORTAL_ROUTES.settings]: PERMISSIONS.ROLES_VIEW,
    [PORTAL_ROUTES.contacts]: PERMISSIONS.CONTACTS_VIEW,
    [PORTAL_ROUTES.cms.jobs.list]: PERMISSIONS.RECRUITMENT_VIEW,
    [PORTAL_ROUTES.cms.applications.list]: PERMISSIONS.RECRUITMENT_VIEW,
    [PORTAL_ROUTES.users.list]: PERMISSIONS.USERS_VIEW,
    [PORTAL_ROUTES.users.roles.list]: PERMISSIONS.ROLES_VIEW,
    [PORTAL_ROUTES.users.modules.list]: PERMISSIONS.ROLES_VIEW,
};

interface RouteGuardProps {
    children: ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
    const { user, isLoading, hasPermission, isAdmin } = useAuth();
    const pathname = usePathname();

    // If loading, show spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    // Find the required permission for the current route
    const matchingRoute = Object.keys(ROUTE_PERMISSIONS)
        .sort((a, b) => b.length - a.length) // Most specific match first
        .find((route) => pathname.startsWith(route));

    const isAuthorized =
        !matchingRoute || (user && (hasPermission(ROUTE_PERMISSIONS[matchingRoute]) || isAdmin));

    // If not authorized, show inline Permission Denied UI instead of redirecting
    if (!isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-white border border-slate-200 shadow-sm animate-in fade-in duration-500">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <Lock className="size-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-3">
                    Quyền truy cập bị từ chối
                </h3>
                <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-8">
                    Tài khoản của bạn không được cấp quyền truy cập vào chuyên mục này. Vui lòng
                    liên hệ quản trị viên hệ thống để yêu cầu quyền truy cập.
                </p>
                <div className="flex items-center gap-4">
                    <Button
                        asChild
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-8 py-6 h-auto"
                    >
                        <Link href={PORTAL_ROUTES.dashboard}>Quay về Dashboard</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
