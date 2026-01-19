'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Send,
    User,
    ChevronRight,
    Loader2,
    RefreshCw,
    Trash2,
    Reply,
    X,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmationDialog } from '@/components/portal/delete-confirmation-dialog';
import { SimpleConfirmDialog } from '@/components/shared/simple-confirm-dialog';

interface ChatSession {
    id: string;
    guest_id: string;
    guest_name: string;
    last_message_at: string;
    admin_last_seen_at?: string;
    guest_last_seen_at?: string;
    is_active: boolean;
    created_at: string;
}

interface Message {
    id: string;
    session_id: string;
    content: string;
    sender_type: 'guest' | 'admin';
    reply_to_id?: string;
    is_deleted: boolean;
    created_at: string;
}

export default function ChatAdminPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoadingSessions, setIsLoadingSessions] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isGuestTyping, setIsGuestTyping] = useState(false);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
    const [isDeletingSession, setIsDeletingSession] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

    // Fetch sessions
    const fetchSessions = async () => {
        setIsLoadingSessions(true);
        try {
            const res = await axios.get('/api/chat/sessions/admin');
            setSessions(res.data);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setIsLoadingSessions(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    // Fetch messages when session selected
    useEffect(() => {
        if (!selectedSession) return;

        const fetchMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const res = await axios.get(`/api/chat/messages?sessionId=${selectedSession.id}`);
                setMessages(res.data);
                // Mark as seen when opening
                handleUpdateSeen(selectedSession.id);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchMessages();
        setIsGuestTyping(false); // Reset typing status for new session
    }, [selectedSession?.id]);

    const handleUpdateSeen = async (sessionId: string) => {
        try {
            await axios.patch(`/api/chat/sessions/${sessionId}`, { adminLastSeen: true });
        } catch (error) {
            console.error('Failed to update seen status:', error);
        }
    };

    // Real-time listener for admins with Socket.io
    useEffect(() => {
        const socket = io({
            query: {
                isAdmin: 'true',
                sessionId: selectedSession?.id || '',
            },
            transports: ['websocket'], // Force websocket for reliability in dev
        });

        socket.on('message', (data: any) => {
            // Update session list order/last message
            setSessions((prev) => {
                const index = prev.findIndex((s) => s.id === data.session_id);
                if (index === -1) {
                    // We'll let session_update handler add the new session
                    return prev;
                }
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    last_message_at: data.created_at,
                };
                // Move to top
                const [moved] = updated.splice(index, 1);
                return [moved, ...updated];
            });

            // If it's the current session, add to messages
            if (selectedSession?.id === data.session_id) {
                setMessages((prev) => {
                    if (prev.find((m) => m.id === data.id)) return prev;
                    return [...prev, data];
                });

                // Auto-mark as seen if it's from guest
                if (data.sender_type === 'guest') {
                    handleUpdateSeen(data.session_id);
                }
            }
        });

        socket.on('message_update', (data: any) => {
            if (selectedSession?.id === data.session_id) {
                setMessages((prev) => prev.map((m) => (m.id === data.id ? data : m)));
            }
        });

        socket.on('session_update', (data: any) => {
            setSessions((prev) => {
                const exists = prev.find((s) => s.id === data.id);
                if (exists) {
                    return prev.map((s) => (s.id === data.id ? data : s));
                }
                // Add new session to top
                return [data, ...prev];
            });
            if (selectedSession?.id === data.id) {
                setSelectedSession(data);
            }
        });

        socket.on('session_removed', (data: any) => {
            setSessions((prev) => prev.filter((s) => s.id !== data.sessionId));
            if (selectedSession?.id === data.sessionId) {
                setSelectedSession(null);
                setMessages([]);
                toast.info('Cuộc hội thoại đã bị xóa');
            }
        });

        socket.on('typing', (data: any) => {
            if (selectedSession?.id === data.sessionId && data.senderType === 'guest') {
                setIsGuestTyping(data.isTyping);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [selectedSession?.id]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !selectedSession || isSending) return;

        const content = inputValue.trim();
        const replyId = replyingTo?.id;

        setInputValue('');
        setReplyingTo(null);
        setIsSending(true);
        sendTypingStatus(false);

        try {
            await axios.post('/api/chat/messages', {
                sessionId: selectedSession.id,
                content,
                replyToId: replyId,
            });
        } catch (error) {
            console.error('Failed to send admin message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        setSessionToDelete(sessionId);
    };

    const confirmDeleteSession = async () => {
        if (!sessionToDelete) return;

        setIsDeletingSession(true);
        try {
            await axios.delete(`/api/chat/sessions/${sessionToDelete}`);
            // Optimistically update UI
            setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete));
            if (selectedSession?.id === sessionToDelete) {
                setSelectedSession(null);
                setMessages([]);
            }
            toast.success('Đã xóa cuộc hội thoại');
            setSessionToDelete(null);
        } catch (error) {
            console.error('Failed to delete session:', error);
            toast.error('Không thể xóa cuộc hội thoại');
        } finally {
            setIsDeletingSession(false);
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessageToDelete(messageId);
    };

    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return;
        try {
            await axios.delete(`/api/chat/messages/${messageToDelete}`);
            setMessageToDelete(null);
        } catch (error) {
            console.error('Failed to delete message:', error);
            toast.error('Không thể gỡ tin nhắn');
        }
    };

    const sendTypingStatus = async (isTyping: boolean) => {
        if (!selectedSession) return;
        try {
            await axios.post('/api/chat/typing', {
                sessionId: selectedSession.id,
                senderType: 'admin',
                isTyping,
            });
        } catch (error) {
            // Silently fail
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        sendTypingStatus(true);
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false);
        }, 3000);
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Session List */}
            <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <h2 className="font-bold text-lg">Hội thoại</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={fetchSessions}
                        disabled={isLoadingSessions}
                    >
                        <RefreshCw className={cn('w-4 h-4', isLoadingSessions && 'animate-spin')} />
                    </Button>
                </div>
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input placeholder="Tìm kiếm khách hàng..." className="pl-9 text-xs" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="space-y-1 p-2">
                        {isLoadingSessions && sessions.length === 0 ? (
                            <div className="flex justify-center p-10">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="text-center py-10 text-zinc-500 text-sm">
                                Chưa có hội thoại nào
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => setSelectedSession(session)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setSelectedSession(session);
                                        }
                                    }}
                                    className={cn(
                                        'w-full p-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                        selectedSession?.id === session.id &&
                                            'bg-zinc-100 dark:bg-zinc-800',
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                        <User className="w-5 h-5 text-zinc-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-sm truncate">
                                                {session.guest_name || 'Khách'}
                                            </span>
                                            <span className="text-[10px] text-zinc-400">
                                                {new Date(
                                                    session.last_message_at,
                                                ).toLocaleDateString() ===
                                                new Date().toLocaleDateString()
                                                    ? new Date(
                                                          session.last_message_at,
                                                      ).toLocaleTimeString([], {
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : new Date(
                                                          session.last_message_at,
                                                      ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {session.guest_id.substring(0, 8)}...
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <ChevronRight
                                            className={cn(
                                                'w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity',
                                                selectedSession?.id === session.id &&
                                                    'opacity-100 text-primary',
                                            )}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-7 h-7 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            onClick={(e) => handleDeleteSession(e, session.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-zinc-50/30 dark:bg-zinc-950/30">
                {selectedSession ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">
                                    {selectedSession.guest_name || 'Khách'}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs text-zinc-500">Đang hoạt động</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex flex-col gap-4">
                                {isLoadingMessages ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex justify-center py-20 text-zinc-400 text-sm">
                                        Chưa có tin nhắn nào
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isAdmin = msg.sender_type === 'admin';
                                        const repliedMessage = messages.find(
                                            (m) => m.id === msg.reply_to_id,
                                        );

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} group/msg`}
                                            >
                                                <div
                                                    className={`flex items-end gap-3 max-w-[70%] ${isAdmin ? 'flex-row-reverse' : ''}`}
                                                >
                                                    {/* Avatar */}
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                            isAdmin
                                                                ? 'bg-primary'
                                                                : 'bg-zinc-200 dark:bg-zinc-700'
                                                        }`}
                                                    >
                                                        <User
                                                            className={`w-4 h-4 ${isAdmin ? 'text-white' : 'text-zinc-500'}`}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div
                                                            className={`text-xs text-zinc-500 mb-1 flex items-center gap-2 ${isAdmin ? 'flex-row-reverse' : ''}`}
                                                        >
                                                            <span>
                                                                {isAdmin ? 'Admin' : 'Khách'}
                                                            </span>
                                                            {!msg.is_deleted && (
                                                                <div className="flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() =>
                                                                            setReplyingTo(msg)
                                                                        }
                                                                        className="hover:text-primary"
                                                                    >
                                                                        <Reply className="w-3 h-3" />
                                                                    </button>
                                                                    {isAdmin && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteMessage(
                                                                                    msg.id,
                                                                                )
                                                                            }
                                                                            className="hover:text-red-500"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {repliedMessage && !msg.is_deleted && (
                                                            <div
                                                                className={`text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded-t-lg border-l-2 border-primary mb-[-4px] opacity-70 truncate max-w-[200px] ${isAdmin ? 'ml-auto text-right' : ''}`}
                                                            >
                                                                {repliedMessage.is_deleted
                                                                    ? 'Tin nhắn đã bị gỡ'
                                                                    : repliedMessage.content}
                                                            </div>
                                                        )}

                                                        <div
                                                            className={cn(
                                                                'px-4 py-2.5 text-sm rounded-2xl relative',
                                                                isAdmin
                                                                    ? 'bg-primary text-white rounded-br-sm'
                                                                    : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm border border-zinc-200 dark:border-zinc-700',
                                                                msg.is_deleted &&
                                                                    'italic opacity-50 bg-transparent border-dashed',
                                                            )}
                                                        >
                                                            {msg.content}
                                                        </div>

                                                        <div
                                                            className={`text-[10px] text-zinc-400 mt-1 flex items-center gap-1 ${isAdmin ? 'justify-end' : ''}`}
                                                        >
                                                            {new Date(
                                                                msg.created_at,
                                                            ).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}

                                                            {isAdmin && (
                                                                <span>
                                                                    •{' '}
                                                                    {selectedSession.guest_last_seen_at &&
                                                                    new Date(
                                                                        selectedSession.guest_last_seen_at,
                                                                    ) >= new Date(msg.created_at)
                                                                        ? 'Đã xem'
                                                                        : 'Đã gửi'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                {isGuestTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full flex gap-1 items-center">
                                            <span
                                                className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0s' }}
                                            ></span>
                                            <span
                                                className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.2s' }}
                                            ></span>
                                            <span
                                                className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.4s' }}
                                            ></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <AnimatePresence>
                                {replyingTo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mb-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-between border-l-4 border-primary"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-primary font-bold uppercase">
                                                Đang trả lời{' '}
                                                {replyingTo.sender_type === 'guest'
                                                    ? 'Khách'
                                                    : 'Admin'}
                                            </p>
                                            <p className="text-sm text-zinc-500 truncate">
                                                {replyingTo.content}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex gap-4"
                            >
                                <Input
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Nhập câu trả lời cho khách hàng..."
                                    className="flex-1 min-h-[50px] bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                                />
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="px-8 shadow-md"
                                    disabled={!inputValue.trim() || isSending}
                                >
                                    {isSending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5 mr-2" />
                                    )}
                                    {isSending ? '' : 'Gửi'}
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                            <Send className="w-10 h-10 text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Trung tâm phản hồi</h3>
                        <p className="text-zinc-500 max-w-sm">
                            Chọn một hội thoại từ danh sách bên trái để bắt đầu hỗ trợ khách hàng
                            của bạn.
                        </p>
                    </div>
                )}
            </div>

            <ConfirmationDialog
                open={!!sessionToDelete}
                onOpenChange={(open) => !open && setSessionToDelete(null)}
                onConfirm={confirmDeleteSession}
                title="Xóa hội thoại"
                description="Hành động này sẽ xóa toàn bộ lịch sử tin nhắn của khách hàng này. Bạn không thể hoàn tác."
                itemLabel="Cuộc hội thoại"
                itemName={sessions.find((s) => s.id === sessionToDelete)?.guest_name || 'Khách'}
                loading={isDeletingSession}
            />

            <SimpleConfirmDialog
                open={!!messageToDelete}
                onOpenChange={(open) => !open && setMessageToDelete(null)}
                onConfirm={confirmDeleteMessage}
                title="Gỡ tin nhắn?"
                description="Tin nhắn này sẽ được gỡ bỏ đối với cả bạn và khách hàng."
                confirmText="Gỡ tin nhắn"
                variant="destructive"
            />
        </div>
    );
}
