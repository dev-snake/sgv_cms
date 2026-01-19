'use client';

import * as React from 'react';
import {
    MessageSquare,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Reply,
    Trash2,
    MoreHorizontal,
    Clock,
    User,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/services/axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { SimpleConfirmDialog } from '@/components/shared/simple-confirm-dialog';

interface Comment {
    id: string;
    guest_name: string;
    guest_email: string;
    content: string;
    reply_content: string | null;
    is_approved: boolean;
    created_at: string;
    product_name: string;
    product_slug: string;
}

export default function CommentsManagementPage() {
    const [comments, setComments] = React.useState<Comment[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [search, setSearch] = React.useState('');
    const [status, setStatus] = React.useState<string>('all');

    // Reply Dialog State
    const [replyingTo, setReplyingTo] = React.useState<Comment | null>(null);
    const [replyContent, setReplyContent] = React.useState('');
    const [isSubmittingReply, setIsSubmittingReply] = React.useState(false);

    // Delete confirmation state
    const [commentToDelete, setCommentToDelete] = React.useState<string | null>(null);

    const fetchComments = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/portal/comments', {
                params: {
                    page,
                    limit: 10,
                    search: search || undefined,
                    status: status !== 'all' ? status : undefined,
                },
            });
            if (response.data.success) {
                setComments(response.data.data || []);
                setTotal(response.data.meta?.total || 0);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Không thể tải danh sách bình luận');
        } finally {
            setIsLoading(false);
        }
    }, [page, search, status]);

    React.useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleApprove = async (id: string, currentStatus: boolean) => {
        try {
            const response = await api.patch(`/api/portal/comments/${id}`, {
                is_approved: !currentStatus,
            });
            if (response.data.success) {
                toast.success(currentStatus ? 'Đã ẩn bình luận' : 'Đã duyệt bình luận');
                fetchComments();
            }
        } catch (error) {
            toast.error('Thao tác thất bại');
        }
    };

    const handleDelete = (id: string) => {
        setCommentToDelete(id);
    };

    const confirmDeleteComment = async () => {
        if (!commentToDelete) return;
        try {
            const response = await api.delete(`/api/portal/comments/${commentToDelete}`);
            if (response.data.success) {
                toast.success('Đã xóa bình luận');
                fetchComments();
            }
        } catch (error) {
            toast.error('Xóa thất bại');
        } finally {
            setCommentToDelete(null);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyingTo || !replyContent.trim()) return;
        setIsSubmittingReply(true);
        try {
            const response = await api.patch(`/api/portal/comments/${replyingTo.id}`, {
                reply_content: replyContent,
                is_approved: true,
            });
            if (response.data.success) {
                toast.success('Đã gửi phản hồi');
                setReplyingTo(null);
                setReplyContent('');
                fetchComments();
            }
        } catch (error) {
            toast.error('Không thể gửi phản hồi');
        } finally {
            setIsSubmittingReply(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 py-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic text-[#002d6b]">
                        Quản lý Bình luận
                    </h2>
                    <p className="text-muted-foreground font-medium italic">
                        Theo dõi, phê duyệt và phản hồi các thắc mắc của khách hàng về sản phẩm.
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                <Card className="rounded-none border-none">
                    <CardHeader className="bg-slate-50/50 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 flex-1 max-w-md">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Tìm theo tên, email, nội dung..."
                                        className="pl-10 h-10 rounded-none border-slate-200 focus-visible:ring-brand-primary"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-slate-400" />
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-10 w-[180px] rounded-none border-slate-200 focus:ring-brand-primary">
                                        <SelectValue placeholder="Tất cả trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-slate-200">
                                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                                        <SelectItem value="approved">Đã duyệt</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <div className="h-12 w-12 border-4 border-[#002d6b] border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">
                                    Đang tải dữ liệu...
                                </p>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <MessageSquare size={48} className="mb-4 opacity-20" />
                                <p className="font-bold italic">Không tìm thấy bình luận nào.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="p-6 hover:bg-slate-50/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-3">
                                                {/* Header: Guest Info & Product */}
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-8 rounded-full bg-[#002d6b]/10 flex items-center justify-center text-[#002d6b]">
                                                            <User size={16} />
                                                        </div>
                                                        <span className="text-sm font-black text-slate-900">
                                                            {comment.guest_name}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        {comment.guest_email}
                                                    </span>
                                                    <div className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase tracking-tighter flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {format(
                                                            new Date(comment.created_at),
                                                            'HH:mm dd/MM/yyyy',
                                                            { locale: vi },
                                                        )}
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            comment.is_approved
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className="rounded-none text-[9px] uppercase tracking-widest font-black py-0.5 h-auto border-none"
                                                        style={{
                                                            backgroundColor: comment.is_approved
                                                                ? '#10b981'
                                                                : '#f59e0b',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {comment.is_approved
                                                            ? 'Đã duyệt'
                                                            : 'Chờ duyệt'}
                                                    </Badge>
                                                    <a
                                                        href={`/san-pham/${comment.product_slug}`}
                                                        target="_blank"
                                                        className="text-[10px] font-black uppercase text-[#002d6b] hover:underline flex items-center gap-1"
                                                    >
                                                        SP: {comment.product_name}{' '}
                                                        <ExternalLink size={10} />
                                                    </a>
                                                </div>

                                                {/* Content */}
                                                <div className="bg-white border border-slate-100 p-4 text-sm text-slate-700 border-l-2 border-l-blue-800 leading-relaxed">
                                                    {comment.content}
                                                </div>

                                                {/* Reply */}
                                                {comment.reply_content && (
                                                    <div className="pl-6 border-l-2 border-[#fbbf24] mt-2 space-y-1">
                                                        <div className="text-[10px] font-black uppercase text-[#fbbf24] tracking-widest italic flex items-center gap-2">
                                                            <CheckCircle2 size={12} /> SÀI GÒN VALVE
                                                            PHẢN HỒI:
                                                        </div>
                                                        <p className="text-sm text-slate-500 italic leading-relaxed">
                                                            {comment.reply_content}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 rounded-none gap-2 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                                                    onClick={() => {
                                                        setReplyingTo(comment);
                                                        setReplyContent(
                                                            comment.reply_content || '',
                                                        );
                                                    }}
                                                >
                                                    <Reply size={14} /> Phản hồi
                                                </Button>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-slate-100 rounded-none"
                                                        >
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="rounded-none border-slate-200"
                                                    >
                                                        <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                                                            Thao tác khác
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-xs font-bold cursor-pointer gap-2"
                                                            onSelect={() =>
                                                                handleApprove(
                                                                    comment.id,
                                                                    comment.is_approved,
                                                                )
                                                            }
                                                        >
                                                            {comment.is_approved ? (
                                                                <>
                                                                    <XCircle
                                                                        size={14}
                                                                        className="text-amber-500"
                                                                    />{' '}
                                                                    Ẩn bình luận
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle2
                                                                        size={14}
                                                                        className="text-emerald-500"
                                                                    />{' '}
                                                                    Duyệt bình luận
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-xs font-bold cursor-pointer gap-2 text-rose-500 focus:text-rose-500"
                                                            onSelect={() =>
                                                                handleDelete(comment.id)
                                                            }
                                                        >
                                                            <Trash2 size={14} /> Xóa vĩnh viễn
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {total > 10 && (
                    <div className="flex items-center justify-between px-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Hiển thị {comments.length} / {total} bình luận
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <div className="h-8 min-w-[32px] flex items-center justify-center text-[10px] font-black border border-slate-200 px-2">
                                TRANG {page}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => setPage(page + 1)}
                                disabled={page * 10 >= total}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Reply Dialog */}
            <Dialog open={!!replyingTo} onOpenChange={() => setReplyingTo(null)}>
                <DialogContent className="max-w-2xl rounded-none border-none p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-[#002d6b] text-white space-y-2">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight italic flex items-center gap-4">
                            <Reply size={24} className="text-[#fbbf24]" />
                            Phản hồi bình luận
                        </DialogTitle>
                        <DialogDescription className="text-white/60 font-medium italic">
                            Câu trả lời của bạn sẽ được hiển thị công khai dưới bình luận của khách
                            hàng.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Câu hỏi của {replyingTo?.guest_name}:
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-sm text-slate-600 italic">
                                "{replyingTo?.content}"
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#002d6b]">
                                Nội dung phản hồi của bạn:
                            </div>
                            <Textarea
                                placeholder="Nhập nội dung phản hồi tại đây..."
                                className="min-h-[150px] rounded-none border-slate-200 focus-visible:ring-brand-primary text-sm leading-relaxed"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-slate-50/50 flex sm:justify-between items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => setReplyingTo(null)}
                            className="rounded-none text-[10px] font-black uppercase tracking-widest h-12"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            className="bg-[#002d6b] hover:bg-[#003d8b] text-white rounded-none h-12 px-8 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#002d6b]/20"
                            onClick={handleReplySubmit}
                            disabled={isSubmittingReply || !replyContent.trim()}
                        >
                            {isSubmittingReply ? 'Đang gửi...' : 'Gửi phản hồi & Công khai'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <SimpleConfirmDialog
                open={!!commentToDelete}
                onOpenChange={(open) => !open && setCommentToDelete(null)}
                onConfirm={confirmDeleteComment}
                title="Xác nhận xóa bình luận?"
                description="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
                confirmText="Xác nhận xóa"
                variant="destructive"
            />
        </div>
    );
}
