'use client';

import api from '@/services/axios';
import {
    Bell,
    MessageSquare,
    Mail,
    Briefcase,
    ExternalLink,
    Check,
    CheckCheck,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { API_ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: 'comment' | 'contact' | 'application';
    title: string;
    content: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

const notificationIcons = {
    comment: MessageSquare,
    contact: Mail,
    application: Briefcase,
};

const notificationLabels = {
    comment: 'Bình luận',
    contact: 'Liên hệ',
    application: 'Ứng tuyển',
};

const notificationColorClasses = {
    comment: 'bg-blue-500/10 border-blue-200 text-blue-700',
    contact: 'bg-green-500/10 border-green-200 text-green-700',
    application: 'bg-purple-500/10 border-purple-200 text-purple-700',
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [activeTab, setActiveTab] = React.useState('all');
    const { user } = useAuth();

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(API_ROUTES.NOTIFICATIONS);
            setNotifications(res.data.data || []);
            setUnreadCount(res.data.meta?.unreadCount || 0);
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải danh sách thông báo');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.patch(API_ROUTES.NOTIFICATIONS, { id });
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
            setUnreadCount((prev) => Math.max(0, prev - 1));
            toast.success('Đã đánh dấu là đã đọc');
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi đánh dấu đã đọc');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.patch(API_ROUTES.NOTIFICATIONS, { all: true });
            setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
            toast.success('Đã đánh dấu tất cả là đã đọc');
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi đánh dấu tất cả đã đọc');
        }
    };

    const filteredNotifications = React.useMemo(() => {
        if (activeTab === 'all') return notifications;
        if (activeTab === 'unread') return notifications.filter((n) => !n.is_read);
        return notifications.filter((n) => n.type === activeTab);
    }, [notifications, activeTab]);

    const stats = React.useMemo(() => {
        return {
            total: notifications.length,
            unread: unreadCount,
            comment: notifications.filter((n) => n.type === 'comment').length,
            contact: notifications.filter((n) => n.type === 'contact').length,
            application: notifications.filter((n) => n.type === 'application').length,
        };
    }, [notifications, unreadCount]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-40">
                <Loader2 className="animate-spin text-brand-primary opacity-20" size={48} />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-10 py-8 pt-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-[#002d6b] text-white text-[8px] font-black uppercase tracking-widest">
                            Sài Gòn Valve CMS
                        </span>
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                            <span className="size-1.5 bg-amber-500 rounded-full animate-pulse" />{' '}
                            Notification Center
                        </span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic text-[#002d6b] border-l-8 border-[#002d6b] pl-6 leading-none">
                        Trung tâm Thông báo
                    </h2>
                    <p className="text-slate-500 font-medium italic text-xs max-w-2xl leading-relaxed">
                        Theo dõi hoạt động hệ thống theo thời gian thực. Quản lý thông báo từ bình
                        luận, liên hệ khách hàng và hồ sơ ứng tuyển.
                    </p>
                </div>
                <Button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className="h-14 px-10 bg-[#002d6b] hover:bg-[#002d6b]/90 text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10"
                >
                    <CheckCheck size={18} className="mr-2" />
                    Đánh dấu tất cả đã đọc
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#002d6b] to-[#001d4a] p-6 border-b-4 border-[#fbbf24] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                                Tổng số
                            </span>
                            <Bell className="size-5 text-[#fbbf24]" />
                        </div>
                        <div className="text-4xl font-black text-white mb-1">{stats.total}</div>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-white/40">
                            Tổng thông báo
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 border-b-4 border-orange-500 relative overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Chưa đọc
                            </span>
                            <AlertCircle className="size-5 text-orange-500" />
                        </div>
                        <div className="text-4xl font-black text-orange-500 mb-1">
                            {stats.unread}
                        </div>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                            Cần xử lý
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 border-b-4 border-blue-500 relative overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Bình luận
                            </span>
                            <MessageSquare className="size-5 text-blue-500" />
                        </div>
                        <div className="text-4xl font-black text-blue-500 mb-1">
                            {stats.comment}
                        </div>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                            Phản hồi mới
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 border-b-4 border-green-500 relative overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Tổng hợp
                            </span>
                            <div className="flex gap-1">
                                <Mail className="size-4 text-green-500" />
                                <Briefcase className="size-4 text-purple-500" />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-green-500 mb-1">
                            {stats.contact + stats.application}
                        </div>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                            Liên hệ & Ứng tuyển
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-slate-50 border border-slate-100 p-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={cn(
                            'px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all border-b-2',
                            activeTab === 'all'
                                ? 'bg-[#002d6b] text-white border-[#fbbf24]'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300',
                        )}
                    >
                        Tất cả ({stats.total})
                    </button>
                    <button
                        onClick={() => setActiveTab('unread')}
                        className={cn(
                            'px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all border-b-2',
                            activeTab === 'unread'
                                ? 'bg-[#002d6b] text-white border-[#fbbf24]'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300',
                        )}
                    >
                        Chưa đọc ({stats.unread})
                    </button>
                    <button
                        onClick={() => setActiveTab('comment')}
                        className={cn(
                            'px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all border-b-2',
                            activeTab === 'comment'
                                ? 'bg-[#002d6b] text-white border-[#fbbf24]'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300',
                        )}
                    >
                        <MessageSquare className="inline-block size-3 mr-2" />
                        Bình luận ({stats.comment})
                    </button>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={cn(
                            'px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all border-b-2',
                            activeTab === 'contact'
                                ? 'bg-[#002d6b] text-white border-[#fbbf24]'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300',
                        )}
                    >
                        <Mail className="inline-block size-3 mr-2" />
                        Liên hệ ({stats.contact})
                    </button>
                    <button
                        onClick={() => setActiveTab('application')}
                        className={cn(
                            'px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all border-b-2',
                            activeTab === 'application'
                                ? 'bg-[#002d6b] text-white border-[#fbbf24]'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300',
                        )}
                    >
                        <Briefcase className="inline-block size-3 mr-2" />
                        Ứng tuyển ({stats.application})
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white border border-slate-100 p-16 text-center">
                        <div className="inline-flex items-center justify-center size-20 bg-slate-50 rounded-full mb-6">
                            <Bell className="size-10 text-slate-300" />
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Không có thông báo
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">
                            {activeTab === 'unread'
                                ? 'Bạn đã xem hết tất cả thông báo'
                                : 'Chưa có thông báo mới nào'}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => {
                        const Icon = notificationIcons[notification.type];
                        const colorClass = notificationColorClasses[notification.type];
                        const label = notificationLabels[notification.type];

                        return (
                            <div
                                key={notification.id}
                                className={cn(
                                    'bg-white border border-slate-100 p-6 transition-all hover:shadow-lg',
                                    !notification.is_read &&
                                        'border-l-4 border-l-[#fbbf24] bg-amber-50/30',
                                )}
                            >
                                <div className="flex gap-6">
                                    <div
                                        className={cn(
                                            'flex size-12 shrink-0 items-center justify-center border-2 rounded-none',
                                            colorClass,
                                        )}
                                    >
                                        <Icon className="size-6" />
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Badge
                                                        className={cn(
                                                            'text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-none border',
                                                            colorClass,
                                                        )}
                                                    >
                                                        {label}
                                                    </Badge>
                                                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                                                        {format(
                                                            new Date(notification.created_at),
                                                            'dd/MM/yyyy • HH:mm',
                                                            { locale: vi },
                                                        )}
                                                    </span>
                                                    {!notification.is_read && (
                                                        <Badge className="bg-[#fbbf24] text-[#002d6b] text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none border-none">
                                                            MỚI
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-sm font-bold text-[#002d6b] leading-tight">
                                                    {notification.title}
                                                </h3>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    {notification.content}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            {notification.link && (
                                                <Button
                                                    size="sm"
                                                    className="h-9 px-6 bg-[#002d6b] hover:bg-[#002d6b]/90 text-white rounded-none text-[9px] font-black uppercase tracking-widest"
                                                    asChild
                                                >
                                                    <Link href={notification.link}>
                                                        <ExternalLink className="mr-2 size-3" />
                                                        Xem chi tiết
                                                    </Link>
                                                </Button>
                                            )}

                                            {!notification.is_read && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-9 px-6 rounded-none text-[9px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50"
                                                    onClick={() =>
                                                        handleMarkAsRead(notification.id)
                                                    }
                                                >
                                                    <Check className="mr-2 size-3" />
                                                    Đánh dấu đã đọc
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
