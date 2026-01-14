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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

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
          role: user.role,
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
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-6">
        <Link href="/portal/users">
          <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Sửa tài khoản</h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Cập nhật thông tin định danh và phân quyền tài khoản.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-none overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <UserIcon size={12} className="text-brand-primary" /> Username <span className="text-rose-500">*</span>
              </Label>
              <Input 
                placeholder="VD: NGUYENVANA"
                className="h-14 bg-slate-50 border-none text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-brand-primary/20 rounded-none"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toUpperCase() })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Lock size={12} className="text-brand-primary" /> Mật khẩu mới
              </Label>
              <Input 
                type="password"
                placeholder="ĐỂ TRỐNG NẾU KHÔNG MUỐN ĐỔI"
                className="h-14 bg-slate-50 border-none text-xs font-bold rounded-none focus:ring-1 focus:ring-brand-primary/20 placeholder:text-[9px]"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isSubmitting}
              />
              <div className="flex items-center gap-2 text-[9px] text-slate-400 italic">
                <AlertCircle size={10} />
                Chỉ nhập nếu bạn muốn thay đổi mật khẩu hiện tại.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Họ và tên</Label>
              <Input 
                placeholder="VD: NGUYỄN VĂN A"
                className="h-14 bg-slate-50 border-none text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-brand-primary/20 rounded-none"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Shield size={12} className="text-brand-primary" /> Vai trò
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({ ...formData, role: val })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-14 bg-slate-50 border-none text-xs font-bold uppercase tracking-widest rounded-none focus:ring-1 focus:ring-brand-primary/20">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-slate-100">
                  <SelectItem value="admin" className="text-xs font-bold uppercase tracking-tight focus:bg-brand-primary/5 focus:text-brand-primary rounded-none">Admin (Toàn quyền)</SelectItem>
                  <SelectItem value="editor" className="text-xs font-bold uppercase tracking-tight focus:bg-brand-primary/5 focus:text-brand-primary rounded-none">Editor (Chỉnh sửa nội dung)</SelectItem>
                  <SelectItem value="viewer" className="text-xs font-bold uppercase tracking-tight focus:bg-brand-primary/5 focus:text-brand-primary rounded-none">Viewer (Chỉ xem)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button 
            type="submit" 
            className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-12 py-6 h-auto shadow-xl shadow-brand-primary/20 transition-all rounded-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
}
