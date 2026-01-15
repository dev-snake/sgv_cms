"use client";

import { Contact } from "@/types";
import api from "@/services/axios";
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
  Archive,
  Calendar as CalendarIcon,
  X
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
import { TablePagination } from "@/components/portal/table-pagination";
import { DeleteConfirmationDialog } from "@/components/portal/delete-confirmation-dialog";
import { API_ROUTES } from "@/constants/routes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export default function ContactsManagementPage() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);

  // Date Filter state
  const [date, setDate] = React.useState<DateRange | undefined>();

  // Detail Sheet state
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchContacts = async (page: number, limit: number, search: string, dateRange?: DateRange) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append("search", search);
      if (dateRange?.from) params.append("startDate", dateRange.from.toISOString());
      if (dateRange?.to) params.append("endDate", dateRange.to.toISOString());

      const res = await api.get(`${API_ROUTES.CONTACTS}?${params.toString()}`);
      setContacts(res.data.data || []);
      if (res.data.meta) {
        setTotalItems(res.data.meta.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách liên hệ");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchContacts(currentPage, pageSize, debouncedSearch, date);
  }, [currentPage, pageSize, debouncedSearch, date]);

  const handleViewDetail = async (contact: Contact) => {
    setSelectedContact(contact);
    setIsSheetOpen(true);

    // Mark as read if status is "new"
    if (contact.status === "new") {
      try {
        await api.patch(`${API_ROUTES.CONTACTS}/${contact.id}`, { status: "read" });
        // Update local state
        setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: "read" } : c));
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setItemToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`${API_ROUTES.CONTACTS}/${itemToDelete.id}`);
      toast.success("Đã xóa liên hệ thành công");
      fetchContacts(currentPage, pageSize, debouncedSearch, date);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa liên hệ");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

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
        <div className="p-8 border-b border-slate-50 flex flex-col xl:flex-row gap-6 items-center justify-between bg-white">
          <div className="relative w-full xl:w-1/2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
            <input 
              placeholder="TÌM KIẾM THEO TÊN, EMAIL HOẶC ĐỊA CHỈ..." 
              className="w-full pl-12 bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20 h-14 rounded-none outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
             {/* Date Range Picker */}
             <div className="grid gap-2 w-full sm:w-[300px]">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-bold text-[10px] uppercase tracking-widest h-14 border-slate-100 rounded-none bg-slate-50/50",
                        !date && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "dd/MM/yy")} -{" "}
                            {format(date.to, "dd/MM/yy")}
                          </>
                        ) : (
                          format(date.from, "dd/MM/yy")
                        )
                      ) : (
                        <span>Lọc theo ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-none border border-slate-100 shadow-xl" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      className="rounded-none bg-white"
                    />
                    {date && (
                      <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50"
                          onClick={() => setDate(undefined)}
                        >
                          <X className="mr-2 size-3" /> Xóa lọc
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
             </div>

             <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6 h-14 border-slate-100 rounded-none hover:bg-slate-50 w-full sm:w-auto">
                <ArrowUpDown className="mr-2 size-4 text-slate-400" /> Sắp xếp
             </Button>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 size={40} className="animate-spin text-brand-primary opacity-20" />
          </div>
        ) : contacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Khách hàng</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Địa chỉ / Yêu cầu</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Trạng thái</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Ngày gửi</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{contact.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium lowercase">{contact.email}</span>
                        {contact.phone && <span className="text-[10px] text-slate-400 font-medium">{contact.phone}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-[450px]">
                        <div className="text-[11px] font-black text-slate-700 uppercase tracking-tight line-clamp-1">{contact.address}</div>
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
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-none border border-slate-100 bg-white shadow-2xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-3">Tùy chọn liên hệ</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem 
                            className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group"
                            onClick={() => handleViewDetail(contact)}
                          >
                             <Eye size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                             <span className="text-xs font-bold uppercase tracking-tight">Xem chi tiết</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group">
                             <Mail size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                             <span className="text-xs font-bold uppercase tracking-tight">Phản hồi Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem 
                            className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-rose-50 group"
                            onClick={() => handleDeleteClick(contact)}
                          >
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
        {!isLoading && totalItems > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            itemLabel="liên hệ"
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa liên hệ"
        description="Thông tin liên hệ này sẽ bị xóa vĩnh viễn khỏi hệ thống. Hành động này không thể hoàn tác."
        itemName={itemToDelete?.name}
        itemLabel="Liên hệ"
        loading={isDeleting}
      />

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl p-0 border-l border-slate-100 bg-white">
          <SheetHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center gap-4 mb-4">
              {selectedContact?.status && getStatusBadge(selectedContact.status)}
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                {selectedContact && format(new Date(selectedContact.created_at), "dd MMMM yyyy HH:mm", { locale: vi })}
              </span>
            </div>
            <SheetTitle className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Chi tiết liên hệ</SheetTitle>
            <SheetDescription className="text-slate-500 font-medium italic mt-2">Thông tin đầy đủ từ yêu cầu của khách hàng.</SheetDescription>
          </SheetHeader>

          <div className="p-12 space-y-12 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Customer Info Card */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 border-b border-slate-50 pb-4">Thông tin khách hàng</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ tên</p>
                    <p className="text-base font-black text-slate-900 uppercase">{selectedContact?.name}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</p>
                    <p className="text-base font-black text-slate-900">{selectedContact?.phone || "Chưa cung cấp"}</p>
                 </div>
                 <div className="space-y-1 sm:col-span-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-base font-black text-brand-primary lowercase underline">{selectedContact?.email}</p>
                 </div>
                 <div className="space-y-1 sm:col-span-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ</p>
                    <p className="text-base font-bold text-slate-700 uppercase leading-snug">{selectedContact?.address}</p>
                 </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 border-b border-slate-50 pb-4">Nội dung yêu cầu</h4>
              <div className="bg-slate-50 p-8 border-l-4 border-brand-accent">
                 <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {selectedContact?.message}
                 </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
               <Button className="flex-1 bg-brand-primary hover:bg-brand-secondary h-14 text-[10px] font-black uppercase tracking-widest rounded-none">
                  <Mail className="mr-2 size-4" /> Phản hồi Email
               </Button>
               <Button variant="outline" className="flex-1 h-14 text-[10px] font-black uppercase tracking-widest rounded-none border-slate-100">
                  Đánh dấu đã phản hồi
               </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
