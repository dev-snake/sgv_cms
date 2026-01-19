'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { PERMISSIONS } from '@/constants/rbac';
import { PORTAL_ROUTES } from '@/constants/routes';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RouteGuardProps {
    children: ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
    const { user, isLoading, isAdmin } = useAuth();
    const pathname = usePathname();

    // If loading, show spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    // Determine authorization dynamically based on modules in DB
    const isAuthorized = (() => {
        if (isAdmin) return true;
        if (!user) return false;

        // Exact dashboard match is always allowed for logged-in users?
        // Or check if DASHBOARD module exists for user
        if (pathname === PORTAL_ROUTES.dashboard) return true;

        // Find if any allowed module path contains the current path
        const allowedModules = user.modules || [];
        const matchingModule = allowedModules
            .filter((m) => m.routePath)
            .sort((a, b) => b.routePath.length - a.routePath.length)
            .find((m) => pathname.startsWith(m.routePath));

        return !!matchingModule;
    })();

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
