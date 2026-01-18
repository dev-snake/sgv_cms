'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Loader2, Trash2, Smile, Reply } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface Message {
    id: string;
    session_id: string;
    content: string;
    sender_type: 'guest' | 'admin';
    reply_to_id?: string;
    is_deleted: boolean;
    created_at: string;
}

interface ChatSession {
    id: string;
    admin_last_seen_at?: string;
    guest_last_seen_at?: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [guestId, setGuestId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [sessionData, setSessionData] = useState<ChatSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Guest ID
    useEffect(() => {
        let id = localStorage.getItem('chat_guest_id');
        if (!id) {
            id =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            localStorage.setItem('chat_guest_id', id);
        }
        setGuestId(id);
    }, []);

    // Fetch or create session
    useEffect(() => {
        if (!guestId || !isOpen) return;

        const initSession = async () => {
            try {
                const res = await axios.post('/api/chat/sessions', { guestId });
                setSessionId(res.data.id);
                setSessionData(res.data);

                const msgRes = await axios.get(`/api/chat/messages?sessionId=${res.data.id}`);
                setMessages(msgRes.data);
                handleUpdateSeen(res.data.id);
            } catch (error) {
                console.error('Failed to init chat session:', error);
            }
        };

        if (!sessionId) {
            initSession();
        } else {
            handleUpdateSeen(sessionId);
        }
    }, [guestId, isOpen, sessionId]);

    const handleUpdateSeen = async (id: string) => {
        try {
            await axios.patch(`/api/chat/sessions/${id}`, { guestLastSeen: true });
        } catch (error) {
            // Silently fail
        }
    };

    // Real-time listener with Socket.io
    useEffect(() => {
        if (!sessionId || !isOpen) return;

        const socket = io({
            query: { sessionId },
            transports: ['websocket'],
        });

        socket.on('message', (data: any) => {
            if (data.id && data.session_id === sessionId) {
                setMessages((prev) => {
                    if (prev.find((m) => m.id === data.id)) return prev;
                    return [...prev, data];
                });
                if (data.sender_type === 'admin') {
                    handleUpdateSeen(sessionId);
                }
            }
        });

        socket.on('message_update', (data: any) => {
            if (data.session_id === sessionId) {
                setMessages((prev) => prev.map((m) => (m.id === data.id ? data : m)));
            }
        });

        socket.on('typing', (data: any) => {
            if (data.sessionId === sessionId && data.senderType === 'admin') {
                setIsAdminTyping(data.isTyping);
            }
        });

        socket.on('session_update', (data: any) => {
            if (data.id === sessionId) {
                setSessionData(data);
            }
        });

        socket.on('session_removed', (data: any) => {
            if (data.sessionId === sessionId) {
                setSessionId(null);
                setMessages([]);
            }
        });

        socket.on('connect_error', (err) => {
            console.error('Socket Error:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, [sessionId, isOpen]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (customContent?: string) => {
        const content = customContent || inputValue.trim();
        if (!content || !sessionId) return;

        const replyId = replyingTo?.id;

        if (!customContent) setInputValue('');
        setReplyingTo(null);
        setIsLoading(true);
        sendTypingStatus(false);

        try {
            const res = await axios.post('/api/chat/messages', {
                sessionId,
                content,
                isFromWidget: true,
                replyToId: replyId,
            });

            if (res.data && res.data.id) {
                setMessages((prev) => {
                    if (prev.find((m) => m.id === res.data.id)) return prev;
                    return [...prev, res.data];
                });
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (!sessionId) return;
        if (!confirm('Xóa toàn bộ lịch sử trò chuyện?')) return;

        try {
            await axios.delete(`/api/chat/sessions/${sessionId}`);
            // Success response will be handled by SSE (session_removed)
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    };

    const sendTypingStatus = async (isTyping: boolean) => {
        if (!sessionId) return;
        try {
            await axios.post('/api/chat/typing', {
                sessionId,
                senderType: 'guest',
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

    const addEmoji = (emoji: string) => {
        setInputValue((prev) => prev + emoji);
        setShowEmojis(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-80 md:w-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex items-center justify-between text-white relative">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Hỗ trợ trực tuyến</h3>
                                    <p className="text-xs text-white/80">
                                        Chúng tôi thường trả lời ngay
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {sessionId && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleClearHistory}
                                        className="text-white hover:bg-white/10"
                                        title="Xóa lịch sử"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:bg-white/10"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex flex-col gap-3">
                                {messages.length === 0 && (
                                    <div className="text-center py-10 text-zinc-500">
                                        Xin chào! Bạn cần chúng tôi giúp gì không?
                                    </div>
                                )}
                                {messages.map((msg) => {
                                    const isGuest = msg.sender_type === 'guest';
                                    const repliedMessage = messages.find(
                                        (m) => m.id === msg.reply_to_id,
                                    );

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isGuest ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`flex items-end gap-2 max-w-[80%] ${isGuest ? 'flex-row-reverse' : ''}`}
                                            >
                                                {!isGuest && (
                                                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <div
                                                        className={cn(
                                                            'text-[10px] text-zinc-400 mb-0.5 px-1 flex items-center gap-2',
                                                            isGuest &&
                                                                'text-right flex-row-reverse',
                                                        )}
                                                    >
                                                        <span>{isGuest ? 'Bạn' : 'Admin'}</span>
                                                        {!msg.is_deleted && (
                                                            <button
                                                                onClick={() => setReplyingTo(msg)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                                                            >
                                                                <Reply className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {repliedMessage && !msg.is_deleted && (
                                                        <div
                                                            className={`text-[10px] bg-zinc-50 dark:bg-zinc-800 p-1.5 rounded-t-lg border-l-2 border-primary mb-[-2px] opacity-70 truncate max-w-[150px] ${isGuest ? 'ml-auto text-right' : ''}`}
                                                        >
                                                            {repliedMessage.is_deleted
                                                                ? 'Tin nhắn đã bị gỡ'
                                                                : repliedMessage.content}
                                                        </div>
                                                    )}

                                                    <div
                                                        className={cn(
                                                            'px-3 py-2 text-sm rounded-2xl',
                                                            isGuest
                                                                ? 'bg-primary text-white rounded-br-sm'
                                                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-sm',
                                                            msg.is_deleted &&
                                                                'italic opacity-50 bg-transparent border-dashed border border-zinc-200',
                                                        )}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                    <div
                                                        className={`text-[10px] text-zinc-400 mt-0.5 px-1 flex items-center gap-1 ${isGuest ? 'justify-end' : ''}`}
                                                    >
                                                        {new Date(
                                                            msg.created_at,
                                                        ).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                        {isGuest && (
                                                            <span>
                                                                •{' '}
                                                                {sessionData?.admin_last_seen_at &&
                                                                new Date(
                                                                    sessionData.admin_last_seen_at,
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
                                })}

                                {isAdminTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full flex gap-1 items-center">
                                            <span
                                                className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0s' }}
                                            ></span>
                                            <span
                                                className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.2s' }}
                                            ></span>
                                            <span
                                                className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.4s' }}
                                            ></span>
                                        </div>
                                    </div>
                                )}

                                <div ref={scrollRef} />
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 relative">
                            <AnimatePresence>
                                {replyingTo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mb-2 p-2 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-between border-l-4 border-primary shadow-sm"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-primary font-bold">
                                                Trả lời{' '}
                                                {replyingTo.sender_type === 'guest'
                                                    ? 'Bạn'
                                                    : 'Admin'}
                                            </p>
                                            <p className="text-xs text-zinc-500 truncate">
                                                {replyingTo.content}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {showEmojis && (
                                <div className="absolute bottom-full left-4 mb-2 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 flex gap-2">
                                    {['😊', '❤️', '👍', '😂', '🔥', '🤔'].map((e) => (
                                        <button
                                            key={e}
                                            onClick={() => addEmoji(e)}
                                            className="hover:scale-125 transition-transform"
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex gap-2"
                            >
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 text-zinc-400 hover:text-primary"
                                    onClick={() => setShowEmojis(!showEmojis)}
                                >
                                    <Smile className="w-5 h-5" />
                                </Button>
                                <Input
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tin nhắn..."
                                    className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!inputValue.trim() || isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className="w-14 h-14 rounded-full shadow-lg ring-4 ring-primary/20 transition-all hover:scale-110 active:scale-95"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </Button>
        </div>
    );
}
