"use client";

import React from "react";
import { useRouter } from "next/navigation";
import api from "@/services/axios";
import { 
  ArrowLeft, 
  Save, 
  Settings, 
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PORTAL_ROUTES, API_ROUTES } from "@/constants/routes";
import { toast } from "sonner";

interface ModuleFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ModuleForm({ initialData, isEditing = false }: ModuleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      toast.error("Vui lòng nhập đầy đủ tên và mã module");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && initialData) {
        await api.patch(`${API_ROUTES.MODULES}/${initialData.id}`, formData);
        toast.success("Cập nhật module thành công");
      } else {
        await api.post(API_ROUTES.MODULES, formData);
        toast.success("Tạo module mới thành công");
      }
      
      router.push(PORTAL_ROUTES.users.modules.list);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error || "Lỗi khi lưu module";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={PORTAL_ROUTES.users.modules.list}>
            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-slate-100 transition-all active:scale-95">
              <ArrowLeft size={18} className="text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
              {isEditing ? "Cấu hình Module" : "Thêm Module mới"}
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-xs">
              {isEditing ? `Chỉnh sửa module: ${initialData?.name}` : "Định nghĩa phân hệ mới của hệ thống."}
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          className="bg-brand-primary hover:bg-[#002d6b] text-[10px] font-black uppercase tracking-[0.2em] px-8 py-6 h-auto shadow-lg transition-all rounded-none hover:-translate-y-0.5 active:scale-95 border-b-4 border-b-brand-secondary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          {isEditing ? "Lưu thay đổi" : "Tạo Module"}
        </Button>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-sm">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary mb-8 flex items-center gap-2">
            <Settings size={14} /> Thông tin Module
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tên Module <span className="text-rose-500">*</span></Label>
                <Input 
                  placeholder="VD: Quản lý News"
                  className="h-12 bg-slate-50 border-slate-100 text-sm font-semibold focus:ring-1 focus:ring-brand-primary/20 rounded-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mã module (Duy nhất) <span className="text-rose-500">*</span></Label>
                <Input 
                  placeholder="VD: BLOG_MANAGEMENT"
                  className="h-12 bg-slate-50 border-slate-100 text-sm font-mono focus:ring-1 focus:ring-brand-primary/20 rounded-none uppercase"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                  disabled={isSubmitting || isEditing}
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic">Lưu ý: Mã module sẽ được dùng trong code để phân quyền, không nên thay đổi sau khi tạo.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
