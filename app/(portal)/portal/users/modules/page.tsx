'use client';

import React from 'react';
import Link from 'next/link';
import {
    Plus,
    Settings,
    Trash2,
    Search,
    Settings2,
    MoreVertical,
    LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/axios';
import { PORTAL_ROUTES, API_ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import { PROTECTED_MODULES } from '@/constants/rbac';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

export default function ModulesPage() {
    const [modules, setModules] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const fetchModules = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(API_ROUTES.MODULES);
            setModules(res.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải danh sách module');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchModules();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await api.delete(`${API_ROUTES.MODULES}/${deleteId}`);
            toast.success('Xóa module thành công');
            fetchModules();
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error || 'Lỗi khi xóa module';
            toast.error(message);
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const filteredModules = modules.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
                        Quản lý Module
                    </h1>
                    <p className="text-slate-500 font-medium italic mt-2 text-xs">
                        Quản lý các phân hệ chức năng của hệ thống và mã định danh.
                    </p>
                </div>
                <Link href={PORTAL_ROUTES.users.modules.add}>
                    <Button className="bg-brand-primary hover:bg-[#002d6b] text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 hover:cursor-pointer h-auto shadow-lg transition-all rounded-none hover:-translate-y-1 active:scale-95 border-b-4 border-b-brand-secondary">
                        <Plus className="mr-2 size-4" /> Thêm Module mới
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-slate-100 shadow-sm rounded-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                        />
                        <Input
                            placeholder="Tìm kiếm tên hoặc mã module..."
                            className="pl-11 h-12 bg-white border-slate-200 text-sm font-medium focus:ring-1 focus:ring-brand-primary/20 rounded-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-none border-slate-200"
                            onClick={fetchModules}
                        >
                            <Loader2 className={isLoading ? 'animate-spin' : ''} size={18} />
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Phân hệ
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Đường dẫn / STT
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Ngày tạo
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6">
                                            <div className="h-4 bg-slate-100 w-48 rounded"></div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="h-4 bg-slate-100 w-32 rounded"></div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="h-4 bg-slate-100 w-24 rounded"></div>
                                        </td>
                                        <td className="px-8 py-6 flex justify-end">
                                            <div className="h-4 bg-slate-100 w-16 rounded"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredModules.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <LayoutDashboard size={48} />
                                            <p className="text-sm font-bold uppercase tracking-widest">
                                                Không có module nào
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredModules.map((item) => {
                                    const isProtected = PROTECTED_MODULES.includes(item.code);
                                    return (
                                        <tr
                                            key={item.id}
                                            className="group hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/5 group-hover:text-brand-primary transition-colors">
                                                        <Settings2 size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                                                {item.name}
                                                            </p>
                                                            {isProtected && (
                                                                <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">
                                                                    Hệ thống
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                            {item.code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 w-max">
                                                        {item.route || 'N/A'}
                                                    </p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        Thứ tự: {item.order || 0}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-medium text-slate-500">
                                                    {new Date(item.created_at).toLocaleDateString(
                                                        'vi-VN',
                                                    )}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 p-0 rounded-none hover:bg-slate-100"
                                                        >
                                                            <MoreVertical
                                                                size={16}
                                                                className="text-slate-400"
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-48 rounded-none border-slate-100 p-1"
                                                    >
                                                        <DropdownMenuItem
                                                            asChild
                                                            className="rounded-none cursor-pointer focus:bg-slate-50"
                                                        >
                                                            <Link
                                                                href={PORTAL_ROUTES.users.modules.edit(
                                                                    item.id,
                                                                )}
                                                                className="flex items-center w-full px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-600"
                                                            >
                                                                <Settings
                                                                    size={14}
                                                                    className="mr-3"
                                                                />{' '}
                                                                Chỉnh sửa
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={cn(
                                                                'rounded-none cursor-pointer font-bold px-3 py-2 text-xs uppercase tracking-widest',
                                                                isProtected
                                                                    ? 'opacity-30 cursor-not-allowed text-slate-400'
                                                                    : 'focus:bg-rose-50 text-rose-500',
                                                            )}
                                                            onSelect={() =>
                                                                !isProtected && setDeleteId(item.id)
                                                            }
                                                            disabled={isProtected}
                                                        >
                                                            <Trash2 size={14} className="mr-3" />{' '}
                                                            Xóa Module
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-none border-slate-100 max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase tracking-tight text-slate-900">
                            Xác nhận xóa Module?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 font-medium italic text-sm">
                            Hành động này không thể hoàn tác. Các quyền hạn gắn với module này sẽ bị
                            ảnh hưởng.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3">
                        <AlertDialogCancel className="h-12 px-8 rounded-none border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Hủy bỏ
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="h-12 px-8 rounded-none bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <Loader2 className="animate-spin size-4" />
                            ) : (
                                'Xác nhận xóa'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
