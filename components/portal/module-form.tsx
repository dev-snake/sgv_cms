'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import $api from '@/utils/axios';
import { ArrowLeft, Save, Settings, Loader2, Layout, ExternalLink, SortAsc } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PORTAL_ROUTES, API_ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface ModuleFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export function ModuleForm({ initialData, isEditing = false }: ModuleFormProps) {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        code: initialData?.code || '',
        icon: initialData?.icon || '',
        route: initialData?.route || '',
        order: initialData?.order || 0,
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.code) {
            toast.error('Vui lòng nhập đầy đủ tên và mã module');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditing && initialData) {
                await $api.patch(`${API_ROUTES.MODULES}/${initialData.id}`, {
                    ...formData,
                    route: formData.route.trim(),
                });
                toast.success('Cập nhật module thành công');
            } else {
                await $api.post(API_ROUTES.MODULES, {
                    ...formData,
                    route: formData.route.trim(),
                });
                toast.success('Tạo module mới thành công');
            }

            // Refresh user profile để cập nhật sidebar modules
            await refreshUser();

            router.push(PORTAL_ROUTES.users.modules.list);
            router.refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error || 'Lỗi khi lưu module';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={PORTAL_ROUTES.users.modules.list}>
                        <Button
                            variant="ghost"
                            className="h-10 w-10 p-0 rounded-full hover:bg-slate-100 transition-all active:scale-95"
                        >
                            <ArrowLeft size={18} className="text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
                            {isEditing ? 'Cấu hình Module' : 'Thêm Module mới'}
                        </h1>
                        <p className="text-slate-500 font-medium italic mt-2 text-xs">
                            {isEditing
                                ? `Chỉnh sửa module: ${initialData?.name}`
                                : 'Định nghĩa phân hệ mới của hệ thống.'}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    className="bg-brand-primary hover:bg-[#002d6b] text-[10px] font-black uppercase tracking-[0.2em] px-8 py-6 h-auto shadow-lg transition-all rounded-none hover:-translate-y-1 active:scale-95 border-b-4 border-b-brand-secondary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 size-4" />
                    )}
                    {isEditing ? 'Lưu thay đổi' : 'Tạo Module'}
                </Button>
            </div>

            <div className="max-w-4xl">
                <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-sm">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary mb-10 flex items-center gap-2">
                        <Settings size={14} /> Thông tin Module chi tiết
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Tên Module <span className="text-rose-500">*</span>
                                </Label>
                                <div className="relative group">
                                    <Input
                                        placeholder="VD: Quản lý Tuyển dụng"
                                        className="h-12 bg-slate-50 border-slate-100 text-sm font-semibold focus:ring-1 focus:ring-brand-primary/20 rounded-none transition-all group-hover:bg-white group-hover:border-slate-200"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <Layout
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors"
                                        size={16}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Mã định danh (Identifier){' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    placeholder="VD: RECRUITMENT"
                                    className="h-12 bg-slate-50 border-slate-100 text-sm font-mono focus:ring-1 focus:ring-brand-primary/20 rounded-none uppercase transition-all"
                                    value={formData.code}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            code: e.target.value
                                                .toUpperCase()
                                                .replace(/\s+/g, '_')
                                                .replace(/[^A-Z0-9_]/g, ''),
                                        })
                                    }
                                    disabled={isSubmitting || isEditing}
                                />
                                <p className="text-[9px] text-slate-400 italic">
                                    Dùng để phân quyền trong code. Không thể thay đổi sau khi tạo.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Tên Icon (Lucide)
                                </Label>
                                <div className="relative group">
                                    <Input
                                        placeholder="VD: Briefcase, Users, Settings..."
                                        className="h-12 bg-slate-50 border-slate-100 text-sm font-medium focus:ring-1 focus:ring-brand-primary/20 rounded-none group-hover:bg-white group-hover:border-slate-200 transition-all"
                                        value={formData.icon}
                                        onChange={(e) =>
                                            setFormData({ ...formData, icon: e.target.value })
                                        }
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Đường dẫn (Route)
                                </Label>
                                <div className="relative group">
                                    <Input
                                        placeholder="VD: /portal/recruitment"
                                        className="h-12 bg-slate-50 border-slate-100 text-sm font-medium focus:ring-1 focus:ring-brand-primary/20 rounded-none group-hover:bg-white group-hover:border-slate-200 transition-all"
                                        value={formData.route}
                                        onChange={(e) =>
                                            setFormData({ ...formData, route: e.target.value })
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <ExternalLink
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                                        size={16}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Thứ tự hiển thị
                                </Label>
                                <div className="relative group">
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="h-12 bg-slate-50 border-slate-100 text-sm font-bold focus:ring-1 focus:ring-brand-primary/20 rounded-none group-hover:bg-white group-hover:border-slate-200 transition-all"
                                        value={formData.order}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                order: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <SortAsc
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                                        size={16}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
