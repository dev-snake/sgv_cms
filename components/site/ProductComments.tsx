'use client';

import * as React from 'react';
import {
    MessageSquare,
    Send,
    User,
    Clock,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Reply,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import $api from '@/utils/axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';

interface Comment {
    id: string;
    guest_name: string;
    content: string;
    reply_content: string | null;
    created_at: string;
    is_approved: boolean; // Added for admin view
    is_pending?: boolean; // Helper flag for local UI
}

interface ProductCommentsProps {
    productId: string;
    productSlug: string;
}

export function ProductComments({ productId, productSlug }: ProductCommentsProps) {
    const { isAdmin } = useAuth();
    const [comments, setComments] = React.useState<Comment[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [showAll, setShowAll] = React.useState(false);

    // Admin Reply State
    const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
    const [adminReply, setAdminReply] = React.useState('');
    const [isReplying, setIsReplying] = React.useState(false);

    const [formData, setFormData] = React.useState({
        guest_name: '',
        guest_email: '',
        content: '',
    });

    const fetchComments = React.useCallback(async () => {
        try {
            const response = await $api.get(`/api/products/${productSlug}/comments`);
            if (response.data.success) {
                let fetchedComments = response.data.data || [];

                // Persistence for guests: Merge local pending comments
                if (!isAdmin) {
                    const localPendingRaw = localStorage.getItem(`pending_comments_${productSlug}`);
                    if (localPendingRaw) {
                        try {
                            const localPending: Comment[] = JSON.parse(localPendingRaw);
                            // Only add if not already in fetched (e.g. might have been approved)
                            const fetchedIds = new Set(fetchedComments.map((c: Comment) => c.id));
                            const validLocalPending = localPending.filter(
                                (c) => !fetchedIds.has(c.id),
                            );

                            if (validLocalPending.length > 0) {
                                fetchedComments = [...validLocalPending, ...fetchedComments];
                                // Sort again by date
                                fetchedComments.sort(
                                    (a: Comment, b: Comment) =>
                                        new Date(b.created_at).getTime() -
                                        new Date(a.created_at).getTime(),
                                );
                            }
                        } catch (e) {
                            console.error('Error parsing local pending comments:', e);
                        }
                    }
                }

                setComments(fetchedComments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [productSlug, isAdmin]);

    React.useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.guest_name || !formData.guest_email || !formData.content) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await $api.post(`/api/products/${productSlug}/comments`, formData);
            if (response.data.success) {
                toast.success('Cảm ơn bạn! Bình luận của bạn đã được gửi và đang chờ duyệt.');

                const newComment: Comment = {
                    ...response.data.data,
                    is_pending: true,
                };

                // For guest, save to localStorage to persist across reloads
                if (!isAdmin) {
                    const localPendingRaw = localStorage.getItem(`pending_comments_${productSlug}`);
                    let localPending: Comment[] = [];
                    if (localPendingRaw) {
                        try {
                            localPending = JSON.parse(localPendingRaw);
                        } catch (e) {}
                    }
                    localPending.unshift(newComment);
                    // Keep only last 10 local pending comments
                    localStorage.setItem(
                        `pending_comments_${productSlug}`,
                        JSON.stringify(localPending.slice(0, 10)),
                    );
                }

                setComments((prev) => [newComment, ...prev]);
                setFormData({ guest_name: '', guest_email: '', content: '' });
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Không thể gửi bình luận. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAdminReply = async (commentId: string) => {
        if (!adminReply.trim()) return;
        setIsReplying(true);
        try {
            const response = await $api.patch(`/api/portal/comments/${commentId}`, {
                reply_content: adminReply,
                is_approved: true, // Auto approve when admin replies
            });

            if (response.data.success) {
                toast.success('Đã gửi phản hồi');
                setReplyingToId(null);
                setAdminReply('');
                fetchComments(); // Refresh list
            }
        } catch (error) {
            console.error('Error replying:', error);
            toast.error('Không thể gửi phản hồi');
        } finally {
            setIsReplying(false);
        }
    };

    const displayedComments = showAll ? comments : comments.slice(0, 3);

    return (
        <div className="mt-16 border-t border-slate-100 pt-16">
            <div className=" mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="bg-brand-primary p-3 shadow-lg shadow-brand-primary/20">
                        <MessageSquare className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                            Hỏi đáp & Thảo luận
                        </h2>
                        <p className="text-slate-500 font-medium italic text-sm">
                            Chia sẻ thắc mắc của bạn về sản phẩm, chúng tôi sẽ phản hồi sớm nhất.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Comment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-50 p-8  border border-slate-100 sticky top-24">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                <Send size={16} className="text-brand-primary" />
                                Gửi câu hỏi của bạn
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Họ và tên *"
                                        value={formData.guest_name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, guest_name: e.target.value })
                                        }
                                        className="bg-white border-slate-200  h-12 text-sm focus:ring-brand-primary"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="Email (Để nhận thông báo) *"
                                        value={formData.guest_email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                guest_email: e.target.value,
                                            })
                                        }
                                        className="bg-white border-slate-200  h-12 text-sm focus:ring-brand-primary"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Nội dung câu hỏi hoặc góp ý... *"
                                        value={formData.content}
                                        onChange={(e) =>
                                            setFormData({ ...formData, content: e.target.value })
                                        }
                                        className="bg-white border-slate-200  min-h-[120px] text-sm focus:ring-brand-primary resize-none"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white h-12  text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20"
                                >
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                                </Button>
                                <p className="text-[10px] text-slate-400 text-center italic mt-4">
                                    * Thông tin của bạn sẽ được bảo mật theo chính sách của Sài Gòn
                                    Valve.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="lg:col-span-3 space-y-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-40">
                                <div className="size-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs font-bold uppercase tracking-widest">
                                    Đang tải thảo luận...
                                </p>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50  border border-dashed border-slate-200">
                                <MessageSquare size={48} className="text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold italic">
                                    Chưa có thảo luận nào cho sản phẩm này.
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">
                                    Hãy là người đầu tiên đặt câu hỏi!
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-8">
                                    {displayedComments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
                                        >
                                            {/* Guest Comment */}
                                            <div className="flex gap-4 mb-4">
                                                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-slate-400">
                                                    <User size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                                        <span className="text-sm font-black text-slate-900">
                                                            {comment.guest_name}
                                                        </span>
                                                        {(comment.is_pending ||
                                                            (isAdmin && !comment.is_approved)) && (
                                                            <span className="text-[9px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                                                Đang chờ duyệt
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {format(
                                                                new Date(comment.created_at),
                                                                'dd/MM/yyyy',
                                                                { locale: vi },
                                                            )}
                                                        </span>

                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => {
                                                                    setReplyingToId(comment.id);
                                                                    setAdminReply(
                                                                        comment.reply_content || '',
                                                                    );
                                                                }}
                                                                className="text-[10px] font-black uppercase text-brand-primary hover:underline flex items-center gap-1 ml-auto"
                                                            >
                                                                <Reply size={12} />{' '}
                                                                {comment.reply_content
                                                                    ? 'Sửa phản hồi'
                                                                    : 'Phản hồi'}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="bg-white border border-slate-100 p-4 rounded-tl-none text-sm text-slate-600 leading-relaxed shadow-sm">
                                                        {comment.content}
                                                    </div>

                                                    {/* Admin Reply Form (Inline) */}
                                                    {isAdmin && replyingToId === comment.id && (
                                                        <div className="mt-4 p-4 bg-slate-50 border border-brand-primary/20 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest italic">
                                                                    Phản hồi của Admin:
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        setReplyingToId(null)
                                                                    }
                                                                >
                                                                    <X
                                                                        size={14}
                                                                        className="text-slate-400 hover:text-rose-500"
                                                                    />
                                                                </button>
                                                            </div>
                                                            <Textarea
                                                                value={adminReply}
                                                                onChange={(e) =>
                                                                    setAdminReply(e.target.value)
                                                                }
                                                                placeholder="Nhập nội dung phản hồi..."
                                                                className="text-sm min-h-[100px] bg-white border-slate-200"
                                                            />
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setReplyingToId(null)
                                                                    }
                                                                    className="text-xs font-bold"
                                                                >
                                                                    Hủy
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    disabled={
                                                                        isReplying ||
                                                                        !adminReply.trim()
                                                                    }
                                                                    onClick={() =>
                                                                        handleAdminReply(comment.id)
                                                                    }
                                                                    className="bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold"
                                                                >
                                                                    {isReplying
                                                                        ? 'Đang gửi...'
                                                                        : 'Gửi phản hồi'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Admin Reply (Displayed) */}
                                            {comment.reply_content &&
                                                replyingToId !== comment.id && (
                                                    <div className="flex gap-4 pl-14">
                                                        <div className="size-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 border border-brand-primary/20 text-brand-primary">
                                                            <CheckCircle2 size={16} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <span className="text-xs font-black text-brand-primary uppercase tracking-tighter italic">
                                                                    Sài Gòn Valve Phản hồi
                                                                </span>
                                                                <span className="text-[10px] bg-brand-primary/5 text-brand-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                                    BTV
                                                                </span>
                                                            </div>
                                                            <div className="bg-brand-primary/5 border border-brand-primary/10 p-4  text-sm text-slate-700 leading-relaxed italic">
                                                                {comment.reply_content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>

                                {comments.length > 3 && (
                                    <button
                                        onClick={() => setShowAll(!showAll)}
                                        className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-primary transition-all flex items-center justify-center gap-2 group border-b border-transparent hover:border-brand-primary/10"
                                    >
                                        {showAll ? (
                                            <>
                                                Thu gọn bình luận <ChevronUp size={14} />
                                            </>
                                        ) : (
                                            <>
                                                Xem thêm {comments.length - 3} thảo luận khác{' '}
                                                <ChevronDown
                                                    size={14}
                                                    className="group-hover:translate-y-1 transition-transform"
                                                />
                                            </>
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
