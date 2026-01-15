"use client";

import React from "react";
import { useRouter } from "next/navigation";
import api from "@/services/axios";
import { 
  ArrowLeft, 
  Save, 
  UserPlus, 
  Shield, 
  Lock, 
  User as UserIcon,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PORTAL_ROUTES, API_ROUTES } from "@/constants/routes";
import { toast } from "sonner";

export default function AddUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    full_name: "",
    role: "admin", // Default to admin
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Vui lòng nhập đầy đủ Username và Mật khẩu");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(API_ROUTES.USERS, formData);
      toast.success("Tạo tài khoản thành công");
      router.push(PORTAL_ROUTES.users.list);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error || "Lỗi khi tạo tài khoản";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center gap-6">
        <Link href={PORTAL_ROUTES.users.list}>
          <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Cấp tài khoản mới</h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Khởi tạo định danh quản trị viên cho hệ thống Sài Gòn Valve.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white p-10 border-l-4 border-l-brand-primary shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.03)] space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/2 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="space-y-8 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <UserIcon size={12} className="text-brand-primary" /> Tên người dùng <span className="text-rose-500">*</span>
                  </Label>
                  <Input 
                    placeholder="VD: NGUYENVANA"
                    className="h-16 bg-slate-50 border-none text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-primary/10 rounded-none transition-all placeholder:font-normal placeholder:italic"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toUpperCase() })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Lock size={12} className="text-brand-primary" /> Mật khẩu ban đầu <span className="text-rose-500">*</span>
                  </Label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    className="h-16 bg-slate-50 border-none text-xs font-bold rounded-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Họ và tên đầy đủ</Label>
                <Input 
                  placeholder="VD: NGUYỄN VĂN A"
                  className="h-16 bg-slate-50 border-none text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-primary/10 rounded-none transition-all"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-6 border-t border-slate-50">
                 <div className="flex items-start gap-4 p-5 bg-brand-primary/5 border-l-2 border-l-brand-primary">
                    <Shield size={20} className="text-brand-primary shrink-0 mt-1" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Mặc định: Toàn quyền Admin</p>
                       <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">Tài khoản này sẽ có quyền truy cập và chỉnh sửa toàn bộ dữ liệu trên hệ thống Portal.</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-brand-primary hover:bg-[#002d6b] text-[10px] font-black uppercase tracking-[0.2em] px-16 py-8 h-auto shadow-2xl shadow-brand-primary/20 transition-all rounded-none hover:-translate-y-1 active:scale-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-3 size-5 animate-spin" />
                ) : (
                  <UserPlus className="mr-3 size-5" />
                )}
                Xác nhận tạo tài khoản
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="p-8 bg-slate-50 border border-slate-100 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-l-4 border-l-fbbf24 pl-4 font-outfit">Lưu ý bảo mật</h3>
              <ul className="space-y-4">
                 {[
                   "Username nên là viết tắt tên không dấu (VD: LAMNT).",
                   "Mật khẩu nên có tối thiểu 8 ký tự.",
                   "Tài khoản mới sẽ có hiệu lực ngay lập tức.",
                   "Có thể thay đổi thông tin bất cứ lúc nào sau khi tạo."
                 ].map((text, i) => (
                   <li key={i} className="flex gap-4 items-start group">
                      <div className="size-1.5 bg-fbbf24 rounded-full mt-1.5 group-hover:scale-150 transition-transform"></div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">{text}</p>
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
