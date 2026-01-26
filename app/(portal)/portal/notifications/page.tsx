'use client';

import api from '@/utils/axios';
import {
    Bell,
    MessageSquare,
    Mail,
    Briefcase,
    ExternalLink,
    Check,
    CheckCheck,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { API_ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { RadialChartGrid } from '@/components/portal/charts/RadialChartGrid';

interface Notification {
    id: string;
    type: 'comment' | 'contact' | 'application';
    title: string;
    content: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}


const notificationLabels = {
    comment: 'Bình luận',
    contact: 'Liên hệ',
    application: 'Ứng tuyển',
};


export default function NotificationsPage() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [activeTab, setActiveTab] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [totalItems, setTotalItems] = React.useState(0);
    const { user } = useAuth();

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(API_ROUTES.NOTIFICATIONS, {
                params: {
                    page,
                    limit: 10,
                },
            });
            setNotifications(res.data.data || []);
            setUnreadCount(res.data.meta?.unreadCount || 0);
            setTotalItems(res.data.meta?.total || res.data.data?.length || 0);
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải danh sách thông báo');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNotifications();
    }, [page]);

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
        let filtered = notifications;

        // Filter by tab
        if (activeTab !== 'all') {
            if (activeTab === 'unread') {
                filtered = filtered.filter((n) => !n.is_read);
            } else {
                filtered = filtered.filter((n) => n.type === activeTab);
            }
        }

        // Filter by search
        if (searchTerm) {
            filtered = filtered.filter(
                (n) =>
                    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    n.content.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        return filtered;
    }, [notifications, activeTab, searchTerm]);

    const stats = React.useMemo(() => {
        return {
            total: notifications.length,
            unread: unreadCount,
            comment: notifications.filter((n) => n.type === 'comment').length,
            contact: notifications.filter((n) => n.type === 'contact').length,
            application: notifications.filter((n) => n.type === 'application').length,
        };
    }, [notifications, unreadCount]);

    // Prepare chart data
    const notificationChartData = [
        {
            browser: 'comment',
            visitors: stats.comment,
            fill: '#3b82f6',
        },
        {
            browser: 'contact',
            visitors: stats.contact,
            fill: '#10b981',
        },
        {
            browser: 'application',
            visitors: stats.application,
            fill: '#a855f7',
        },
    ];

    const notificationStatusData = [
        {
            browser: 'read',
            visitors: stats.total - stats.unread,
            fill: '#10b981',
        },
        {
            browser: 'unread',
            visitors: stats.unread,
            fill: '#f59e0b',
        },
    ];

    return (
        <div className="flex-1 space-y-10 py-8 pt-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-[#002d6b] text-white text-[8px] font-black uppercase tracking-widest">
                            Notification Center
                        </span>
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                            <span className="size-1.5 bg-amber-500 rounded-full animate-pulse" />{' '}
                            Real-time Monitoring
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

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RadialChartGrid
                    title="Phân loại thông báo"
                    description="Tỷ lệ thông báo theo từng loại"
                    data={notificationChartData}
                    config={{
                        visitors: { label: 'Thông báo' },
                        comment: { label: 'Bình luận', color: '#3b82f6' },
                        contact: { label: 'Liên hệ', color: '#10b981' },
                        application: { label: 'Ứng tuyển', color: '#a855f7' },
                    }}
                    footerTitle="Phân bố hoạt động"
                    footerDescription="Cập nhật theo thời gian thực"
                    className="lg:col-span-1"
                />
                <RadialChartGrid
                    title="Trạng thái xử lý"
                    description="Tỷ lệ thông báo đã đọc vs chưa đọc"
                    data={notificationStatusData}
                    config={{
                        visitors: { label: 'Thông báo' },
                        read: { label: 'Đã đọc', color: '#10b981' },
                        unread: { label: 'Chưa đọc', color: '#f59e0b' },
                    }}
                    footerTitle="Mức độ phản hồi"
                    footerDescription={`${stats.unread} thông báo cần xử lý`}
                    className="lg:col-span-1"
                />
            </div>

            <div className="grid gap-4">
                <Card className="rounded-none border border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 pb-6 border-b border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 flex-1 max-w-md">
                                <div className="relative w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="TÌM KIẾM THÔNG BÁO..."
                                        className="pl-12 h-12 rounded-none border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest placeholder:text-slate-300 focus-visible:ring-brand-primary focus-visible:ring-offset-0"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter size={16} className="text-slate-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        Lọc:
                                    </span>
                                </div>
                                <Select value={activeTab} onValueChange={setActiveTab}>
                                    <SelectTrigger className="h-12 w-[200px] rounded-none border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest focus:ring-0 focus:ring-offset-0">
                                        <SelectValue placeholder="Tất cả" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-slate-100">
                                        <SelectItem
                                            value="all"
                                            className="text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Tất cả ({stats.total})
                                        </SelectItem>
                                        <SelectItem
                                            value="unread"
                                            className="text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Chưa đọc ({stats.unread})
                                        </SelectItem>
                                        <SelectItem
                                            value="comment"
                                            className="text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Bình luận ({stats.comment})
                                        </SelectItem>
                                        <SelectItem
                                            value="contact"
                                            className="text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Liên hệ ({stats.contact})
                                        </SelectItem>
                                        <SelectItem
                                            value="application"
                                            className="text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Ứng tuyển ({stats.application})
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <div className="h-12 w-12 border-4 border-[#002d6b] border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">
                                    Đang tải dữ liệu...
                                </p>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Bell size={48} className="mb-4 opacity-10" />
                                <p className="text-[10px] font-black uppercase tracking-widest">
                                    Không có thông báo nào
                                </p>
                                <p className="text-[9px] font-medium text-slate-300 mt-2">
                                    {activeTab === 'unread'
                                        ? 'Bạn đã xem hết tất cả thông báo'
                                        : 'Chưa có thông báo mới nào'}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredNotifications.map((notification) => {
                                    const label = notificationLabels[notification.type];

                                    return (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                'p-8 hover:bg-slate-50/30 transition-colors',
                                                !notification.is_read && 'bg-amber-50/20',
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-8">
                                                <div className="flex-1 space-y-4">
                                                    {/* Header */}
                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                                        <Badge className="rounded-none text-[9px] uppercase tracking-widest font-black py-1 px-3 h-auto border-none">
                                                            {label}
                                                        </Badge>

                                                        <div className="px-3 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                                            {format(
                                                                new Date(notification.created_at),
                                                                'HH:mm - dd/MM/yyyy',
                                                                { locale: vi },
                                                            )}
                                                        </div>

                                                        {!notification.is_read && (
                                                            <Badge className="rounded-none text-[8px] font-black uppercase tracking-widest px-3 py-1 h-auto bg-[#fbbf24] text-[#002d6b] border-none">
                                                                MỚI
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="space-y-2">
                                                        <h3 className="text-sm font-black text-[#002d6b] uppercase tracking-tight">
                                                            {notification.title}
                                                        </h3>
                                                        <div className="bg-slate-50/50 border-l-4 border-l-[#002d6b] p-6 text-sm text-slate-700 leading-relaxed italic">
                                                            {notification.content}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-1">
                                                    {notification.link && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-10 rounded-none gap-3 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-[#002d6b] hover:text-white hover:border-[#002d6b] transition-all"
                                                            asChild
                                                        >
                                                            <Link href={notification.link}>
                                                                <ExternalLink size={14} />
                                                                Xem chi tiết
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {!notification.is_read && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-10 rounded-none gap-3 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
                                                            onClick={() =>
                                                                handleMarkAsRead(notification.id)
                                                            }
                                                        >
                                                            <Check size={14} />
                                                            Đánh dấu đã đọc
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {totalItems > 10 && (
                    <div className="flex items-center justify-between px-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Hiển thị {filteredNotifications.length} / {totalItems} thông báo
                        </p>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-none border-slate-200 transition-all hover:bg-slate-50"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <div className="h-10 min-w-[60px] flex items-center justify-center text-[10px] font-black border border-slate-200 px-4 bg-white uppercase tracking-widest">
                                TRANG {page}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-none border-slate-200 transition-all hover:bg-slate-50"
                                onClick={() => setPage(page + 1)}
                                disabled={page * 10 >= totalItems}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
