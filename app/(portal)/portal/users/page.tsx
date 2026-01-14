"use client";

import { User } from "@/types";
import api from "@/services/axios";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  User as UserIcon, 
  Edit2, 
  Trash2, 
  ShieldCheck,
  Loader2,
} from "lucide-react";
import * as React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/portal/delete-confirmation-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function UsersManagementPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/users");
      setUsers(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (user: User) => {
    setItemToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/api/users/${itemToDelete.id}`);
      toast.success("Đã xóa tài khoản thành công");
      setUsers(users.filter(u => u.id !== itemToDelete.id));
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa tài khoản");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Quản lý tài khoản</h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Quản lý danh sách quản trị viên và phân quyền truy cập hệ thống.</p>
        </div>
        <Link href="/portal/users/add">
          <Button className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-none">
            <Plus className="mr-2 size-4" /> Tạo tài khoản mới
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-none border border-slate-100 overflow-hidden min-h-[500px]">
        {/* Table Filters */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-white">
          <div className="relative w-full md:w-1/2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
            <input 
              placeholder="TÌM KIẾM THEO TÊN HOẶC USERNAME..." 
              className="w-full pl-12 bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20 h-14 rounded-none outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 size={40} className="animate-spin text-brand-primary opacity-20" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Username</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Họ và tên</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Vai trò</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Ngày tạo</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-slate-100 flex items-center justify-center">
                          <UserIcon size={14} className="text-slate-400" />
                        </div>
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-600">{user.full_name || "---"}</span>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none">
                         <ShieldCheck className="mr-1 size-3" /> {user.role}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                        {user.created_at ? format(new Date(user.created_at), "dd/MM/yyyy", { locale: vi }) : "---"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-12 w-12 p-0 hover:bg-white hover:text-brand-primary border border-transparent hover:border-slate-100 rounded-none transition-all">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-none border border-slate-100 bg-white">
                          <DropdownMenuItem asChild className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group">
                             <Link href={`/portal/users/${user.id}`} className="flex items-center gap-3 w-full">
                               <Edit2 size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                               <span className="text-xs font-bold uppercase tracking-tight">Sửa thông tin</span>
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem 
                            className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-rose-50 group"
                            onClick={() => handleDeleteClick(user)}
                          >
                             <Trash2 size={16} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                             <span className="text-xs font-bold uppercase tracking-tight text-rose-600">Xóa tài khoản</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-24 text-center h-[500px] flex items-center justify-center flex-col">
            <UserIcon size={64} className="text-slate-100 mb-6" />
            <p className="text-slate-400 font-medium tracking-tight uppercase text-[10px] tracking-[0.2em]">Không tìm thấy tài khoản nào.</p>
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa tài khoản"
        description="Tài khoản này sẽ bị xóa vĩnh viễn và không thể truy cập vào hệ thống nữa."
        itemName={itemToDelete?.username}
      />
    </div>
  );
}
