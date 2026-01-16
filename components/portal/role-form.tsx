"use client";

import React from "react";
import { useRouter } from "next/navigation";
import api from "@/services/axios";
import { 
  ArrowLeft, 
  Save, 
  Shield, 
  Loader2,
  CheckCircle2,
  Circle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PORTAL_ROUTES, API_ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { Permission, Role } from "@/types";
import { cn } from "@/lib/utils";
import { PROTECTED_ROLES } from "@/constants/rbac";

interface RoleFormProps {
  initialData?: Role;
  isEditing?: boolean;
}

export function RoleForm({ initialData, isEditing = false }: RoleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = React.useState(true);
  const [permissionsByModule, setPermissionsByModule] = React.useState<Record<string, Permission[]>>({});
  const [selectedPermissionIds, setSelectedPermissionIds] = React.useState<string[]>(
    initialData?.permissions?.map(p => p.id) || []
  );
  
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  const fetchPermissions = async () => {
    setIsLoadingPermissions(true);
    try {
      const res = await api.get(API_ROUTES.PERMISSIONS);
      setPermissionsByModule(res.data.data || {});
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách quyền");
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  React.useEffect(() => {
    fetchPermissions();
  }, []);

  const togglePermission = (id: string) => {
    setSelectedPermissionIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const toggleModule = (modulePerms: Permission[]) => {
    const moduleIds = modulePerms.map(p => p.id);
    const allSelected = moduleIds.every(id => selectedPermissionIds.includes(id));
    
    if (allSelected) {
      setSelectedPermissionIds(prev => prev.filter(id => !moduleIds.includes(id)));
    } else {
      setSelectedPermissionIds(prev => [...new Set([...prev, ...moduleIds])]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Vui lòng nhập tên vai trò");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        permissionIds: selectedPermissionIds
      };

      if (isEditing && initialData) {
        await api.patch(`${API_ROUTES.ROLES}/${initialData.id}`, payload);
        toast.success("Cập nhật vai trò thành công");
      } else {
        await api.post(API_ROUTES.ROLES, payload);
        toast.success("Tạo vai trò mới thành công");
      }
      
      router.push(PORTAL_ROUTES.users.roles.list);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error || "Lỗi khi lưu vai trò";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <Link href={PORTAL_ROUTES.users.roles.list}>
          <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">
            {isEditing ? "Cấu hình vai trò" : "Tạo vai trò mới"}
          </h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">
            {isEditing ? `Đang chỉnh sửa cài đặt cho vai trò: ${initialData?.name}` : "Định nghĩa nhóm quyền hạn mới cho hệ thống."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 pb-24">
        <div className="bg-white p-10 border-l-4 border-l-brand-primary shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.03)] space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Shield size={12} className="text-brand-primary" /> Tên vai trò <span className="text-rose-500">*</span>
              </Label>
              <Input 
                placeholder="VD: BIÊN TẬP VIÊN"
                className="h-16 bg-slate-50 border-none text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-primary/10 rounded-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                disabled={isSubmitting || (isEditing && PROTECTED_ROLES.includes(initialData?.name || ''))}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mô tả ngắn gọn</Label>
              <Input 
                placeholder="VD: Quản lý tin tức và dự án"
                className="h-16 bg-slate-50 border-none text-sm font-medium rounded-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Ma trận phân quyền</h2>
              <p className="text-slate-500 text-xs font-medium italic mt-1">Chọn các quyền hạn cụ thể cho vai trò này.</p>
            </div>
            {Object.keys(permissionsByModule).length > 0 && (
              <Button 
                type="button" 
                variant="ghost" 
                className="text-[10px] font-black uppercase tracking-widest p-0 h-auto hover:bg-transparent text-brand-primary"
                onClick={() => {
                  const allIds = Object.values(permissionsByModule).flat().map(p => p.id);
                  if (selectedPermissionIds.length === allIds.length) {
                    setSelectedPermissionIds([]);
                  } else {
                    setSelectedPermissionIds(allIds);
                  }
                }}
              >
                {selectedPermissionIds.length === Object.values(permissionsByModule).flat().length ? "Bỏ chọn tất cả" : "Chọn tất cả quyền"}
              </Button>
            )}
          </div>

          {isLoadingPermissions ? (
            <div className="flex items-center justify-center p-20 bg-white border border-slate-50">
              <Loader2 className="animate-spin text-brand-primary opacity-20" size={32} />
            </div>
          ) : (
            <div className="bg-white border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/70">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 border-b border-slate-100 w-40">Module</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 border-b border-slate-100">Quyền hạn</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 border-b border-slate-100 text-right w-32">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Object.entries(permissionsByModule).map(([module, perms]) => {
                    const moduleIds = perms.map(p => p.id);
                    const allModuleSelected = moduleIds.every(id => selectedPermissionIds.includes(id));
                    const selectedCount = moduleIds.filter(id => selectedPermissionIds.includes(id)).length;

                    return (
                      <tr key={module} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-col gap-2">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{module}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {selectedCount}/{perms.length} quyền
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {perms.map((perm) => {
                              const isSelected = selectedPermissionIds.includes(perm.id);
                              // Show resource:action format for clarity
                              const [resource, action] = perm.name.split(':');
                              const displayName = action ? `${resource} · ${action}` : perm.name;
                              
                              return (
                                <button
                                  key={perm.id}
                                  type="button"
                                  onClick={() => togglePermission(perm.id)}
                                  className={cn(
                                    "px-3 py-2 text-[10px] font-bold uppercase tracking-wide rounded-sm border transition-all flex items-center gap-2",
                                    isSelected 
                                      ? "bg-brand-primary text-white border-brand-primary shadow-sm" 
                                      : "bg-white text-slate-400 border-slate-200 hover:border-brand-primary hover:text-brand-primary"
                                  )}
                                  title={perm.description || perm.name}
                                >
                                  {isSelected ? (
                                    <CheckCircle2 size={12} />
                                  ) : (
                                    <Circle size={12} />
                                  )}
                                  {displayName}
                                </button>
                              );
                            })}
                          </div>

                        </td>
                        <td className="px-6 py-5 align-top text-right">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              "h-8 px-4 rounded-sm text-[9px] font-black uppercase tracking-wide transition-all",
                              allModuleSelected 
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                                : "bg-slate-50 text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary"
                            )}
                            onClick={() => toggleModule(perms)}
                          >
                            {allModuleSelected ? "✓ Đầy đủ" : "Chọn hết"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        <div className="fixed bottom-10 right-10 z-50">
          <Button 
            type="submit" 
            className="bg-brand-primary hover:bg-[#002d6b] text-[10px] font-black uppercase tracking-[0.2em] px-16 py-8 h-auto shadow-[0_20px_50px_-15px_rgba(0,45,107,0.3)] transition-all rounded-none hover:-translate-y-1 active:scale-95"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-3 size-5 animate-spin" />
            ) : (
              <Save className="mr-3 size-5" />
            )}
            Lưu cấu hình vai trò
          </Button>
        </div>
      </form>
    </div>
  );
}
