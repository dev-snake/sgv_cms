'use client';

import * as React from 'react';
import { Bell, MessageSquare, Mail, UserPlus, Check, CheckCheck } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import api from '@/services/axios';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';
import { API_ROUTES, PORTAL_ROUTES } from '@/constants/routes';

interface Notification {
    id: string;
    type: 'comment' | 'contact' | 'application';
    title: string;
    content: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

export function NotificationDropdown() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);
    const socketRef = React.useRef<Socket | null>(null);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const fetchNotifications = React.useCallback(async () => {
        try {
            const response = await api.get(API_ROUTES.NOTIFICATIONS);
            if (response.data.success) {
                setNotifications(response.data.data);
                setUnreadCount(response.data.meta.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [API_ROUTES.NOTIFICATIONS]);

    React.useEffect(() => {
        fetchNotifications();

        // Setup Socket.io
        const socket = io({
            query: { isAdmin: 'true' }, // Join admins room
            transports: ['websocket', 'polling'], // Ensure consistent connection
            reconnectionAttempts: 5,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[NotificationDropdown] Connected to Socket.io', socket.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('[NotificationDropdown] Disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('[NotificationDropdown] Socket.io connection error:', error.message);
        });

        socket.on('new-notification', (notification: Notification) => {
            console.log('[NotificationDropdown] Received notification:', notification.title);
            setNotifications((prev) => [notification, ...prev].slice(0, 20));
            setUnreadCount((prev) => prev + 1);

            // Optional: Play sound or show toast
            if (typeof window !== 'undefined') {
                const audio = new Audio('/sounds/notification.mp3');
                audio.play().catch(() => {});
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(API_ROUTES.NOTIFICATIONS, { id });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch(API_ROUTES.NOTIFICATIONS, { all: true });
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'comment':
                return <MessageSquare size={16} className="text-blue-500" />;
            case 'contact':
                return <Mail size={16} className="text-emerald-500" />;
            case 'application':
                return <UserPlus size={16} className="text-purple-500" />;
            default:
                return <Bell size={16} />;
        }
    };

    if (!isMounted) return null;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-none transition-all relative group">
                    <Bell size={18} className="group-hover:animate-ring" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-none border border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-none border-slate-200">
                <DropdownMenuLabel className="p-4 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest">Thông báo</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-[10px] font-bold text-brand-primary hover:bg-transparent"
                            onClick={markAllAsRead}
                        >
                            Đánh dấu tất cả là đã đọc
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0" />
                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                Không có thông báo nào
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {notifications.map((n) => (
                                <DropdownMenuItem
                                    key={n.id}
                                    className={`p-4 cursor-pointer focus:bg-slate-50 transition-colors flex flex-col items-start gap-1 ${
                                        !n.is_read ? 'bg-blue-50/30' : ''
                                    }`}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        if (!n.is_read) markAsRead(n.id);
                                        if (n.link) {
                                            window.location.href = n.link;
                                            setIsOpen(false);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <div
                                            className={`p-2 rounded-full ${!n.is_read ? 'bg-white shadow-sm' : 'bg-slate-100'}`}
                                        >
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p
                                                className={`text-[11px] leading-tight ${!n.is_read ? 'font-black text-slate-900' : 'font-medium text-slate-600'}`}
                                            >
                                                {n.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                                                {n.content}
                                            </p>
                                        </div>
                                        {!n.is_read && (
                                            <div className="size-2 bg-blue-500 rounded-full shrink-0" />
                                        )}
                                    </div>
                                    <div className="pl-10 mt-1 flex items-center justify-between w-full">
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                                            {formatDistanceToNow(new Date(n.created_at), {
                                                addSuffix: true,
                                                locale: vi,
                                            })}
                                        </span>
                                        {!n.is_read && (
                                            <button
                                                className="text-[9px] font-black text-blue-500 hover:underline uppercase tracking-widest"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(n.id);
                                                }}
                                            >
                                                Đã đọc
                                            </button>
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator className="m-0" />
                <div className="p-3 bg-slate-50 text-center">
                    {/* <Link
                        href={PORTAL_ROUTES.notifications}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Xem tất cả thông báo
                    </Link> */}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
