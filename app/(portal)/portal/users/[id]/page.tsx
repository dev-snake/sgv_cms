"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/services/axios";
import { 
  ArrowLeft, 
  Save, 
  Shield, 
  Lock, 
  User as UserIcon,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: "",
    password: "", // Optional for edit
    full_name: "",
    role: "admin",
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/users/${userId}`);
        const user = res.data.data;
        setFormData({
          username: user.username,
          password: "",
          full_name: user.full_name || "",
          role: user.role || "admin",
        });
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin tài khoản");
        router.push("/portal/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username) {
      toast.error("Username không được để trống");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatePayload: any = { ...formData };
      if (!updatePayload.password) delete updatePayload.password;

      await api.patch(`/api/users/${userId}`, updatePayload);
      toast.success("Cập nhật tài khoản thành công");
      router.push("/portal/users");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error || "Lỗi khi cập nhật tài khoản";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
        <Loader2 size={48} className="animate-spin text-brand-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đang đồng bộ dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center gap-6">
        <Link href="/portal/users">
          <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Chỉnh sửa tài khoản</h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Cập nhật thông tin định danh và bảo mật cho quản trị viên.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white p-10 border-l-4 border-l-fbbf24 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.03)] space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fbbf24/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="space-y-8 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <UserIcon size={12} className="text-[#002d6b]" /> Username <span className="text-rose-500">*</span>
                  </Label>
                  <Input 
                    placeholder="VD: NGUYENVANA"
                    className="h-16 bg-slate-50 border-none text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-fbbf24/20 rounded-none transition-all"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toUpperCase() })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Lock size={12} className="text-[#002d6b]" /> Mật khẩu mới
                  </Label>
                  <Input 
                    type="password"
                    placeholder="ĐỂ TRỐNG NẾU KHÔNG ĐỔI"
                    className="h-16 bg-slate-50 border-none text-xs font-bold rounded-none focus:ring-2 focus:ring-fbbf24/20 transition-all placeholder:text-[9px] placeholder:italic"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Họ và tên hiển thị</Label>
                <Input 
                  placeholder="VD: NGUYỄN VĂN A"
                  className="h-16 bg-slate-50 border-none text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-fbbf24/20 rounded-none transition-all"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-6 border-t border-slate-50">
                 <div className="flex items-start gap-4 p-5 bg-fbbf24/5 border-l-2 border-l-fbbf24">
                    <Shield size={20} className="text-[#002d6b] shrink-0 mt-1" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#002d6b]">Cấp độ: Toàn quyền hệ thống</p>
                       <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">Tài khoản này được định danh là Admin cấp cao nhất.</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-[#002d6b] hover:bg-brand-primary text-[10px] font-black uppercase tracking-[0.2em] px-16 py-8 h-auto shadow-2xl shadow-brand-primary/20 transition-all rounded-none hover:-translate-y-1 active:scale-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-3 size-5 animate-spin" />
                ) : (
                  <Save className="mr-3 size-5" />
                )}
                Lưu mọi thay đổi
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="p-8 bg-slate-50 border border-slate-100 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-l-4 border-l-brand-primary pl-4">Thông tin bổ sung</h3>
              <div className="space-y-4">
                 {[
                   { label: "Trạng thái", value: "Đang hoạt động", color: "text-emerald-600" },
                   { label: "Cấp độ", value: "Root Administrator", color: "text-brand-primary" },
                   { label: "Hệ thống", value: "Sài Gòn Valve CMS", color: "text-slate-400" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between py-3 border-b border-slate-200/50 last:border-none">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.value}</span>
                   </div>
                 ))}
              </div>
              <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed pt-4 border-t border-slate-200/50">
                 * Việc thay đổi mật khẩu sẽ có hiệu lực ngay trong lần đăng nhập kế tiếp của người dùng này.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
