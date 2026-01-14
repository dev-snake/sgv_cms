"use client";

import { Contact } from "@/types";
import api from "@/lib/axios";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  Filter,
  ArrowUpDown,
  Loader2,
  Mail,
  CheckCircle2,
  Clock,
  Archive
} from "lucide-react";
import * as React from "react";
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
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function ContactsManagementPage() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/contacts");
      setContacts(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách liên hệ");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const getStatusBadge = (status: Contact["status"]) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-blue-500 text-white border-blue-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none">
            <Clock className="mr-1 size-3" /> Mới
          </Badge>
        );
      case "read":
        return (
          <Badge variant="secondary" className="bg-slate-200 text-slate-700 border-slate-300 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none">
            <Eye className="mr-1 size-3" /> Đã xem
          </Badge>
        );
      case "replied":
        return (
          <Badge className="bg-green-500 text-white border-green-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none">
            <CheckCircle2 className="mr-1 size-3" /> Phản hồi
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="outline" className="text-slate-400 border-slate-200 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none">
            <Archive className="mr-1 size-3" /> Lưu trữ
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Quản lý liên hệ</h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Xem và quản lý các tin nhắn từ khách hàng qua website.</p>
        </div>
      </div>

      <div className="bg-white rounded-none border border-slate-100 overflow-hidden min-h-[500px]">
        {/* Table Filters */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-white">
          <div className="relative w-full md:w-1/2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
            <input 
              placeholder="TÌM KIẾM THEO TÊN, EMAIL HOẶC TIÊU ĐỀ..." 
              className="w-full pl-12 bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20 h-14 rounded-none outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6 h-14 border-slate-100 rounded-none hover:bg-slate-50">
                <Filter className="mr-2 size-4 text-slate-400" /> Bộ lọc
             </Button>
             <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6 h-14 border-slate-100 rounded-none hover:bg-slate-50">
                <ArrowUpDown className="mr-2 size-4 text-slate-400" /> Sắp xếp
             </Button>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 size={40} className="animate-spin text-brand-primary opacity-20" />
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Khách hàng</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Ghi chú / Tiêu đề</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Trạng thái</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Ngày gửi</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{contact.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium lowercase">{contact.email}</span>
                        {contact.phone && <span className="text-[10px] text-slate-400 font-medium">{contact.phone}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-[350px]">
                        <div className="text-[11px] font-black text-slate-700 uppercase tracking-tight line-clamp-1">{contact.subject || "Không có tiêu đề"}</div>
                        <div className="text-[10px] text-slate-400 font-medium line-clamp-1 italic">{contact.message}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                        {format(new Date(contact.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
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
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-3">Tùy chọn liên hệ</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group">
                             <Eye size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                             <span className="text-xs font-bold uppercase tracking-tight">Xem chi tiết</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group">
                             <Mail size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                             <span className="text-xs font-bold uppercase tracking-tight">Phản hồi Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-rose-50 group">
                             <Trash2 size={16} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                             <span className="text-xs font-bold uppercase tracking-tight text-rose-600">Xóa liên hệ</span>
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
            <Mail size={64} className="text-slate-100 mb-6" />
            <p className="text-slate-400 font-medium tracking-tight uppercase text-[10px] tracking-[0.2em]">Không tìm thấy liên hệ nào phù hợp.</p>
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && contacts.length > 0 && (
          <div className="p-8 bg-slate-50/20 border-t border-slate-50 flex items-center justify-between">
             <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Đang hiển thị {filteredContacts.length} liên hệ trên tổng số {contacts.length}</p>
             <div className="flex items-center gap-3">
                <Button disabled variant="outline" className="text-[10px] font-black uppercase tracking-widest px-8 h-12 border-slate-100 bg-white opacity-50 rounded-none">Trước</Button>
                <Button disabled variant="outline" className="text-[10px] font-black uppercase tracking-widest px-8 h-12 border-slate-100 bg-white opacity-50 rounded-none">Sau</Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
