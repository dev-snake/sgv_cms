"use client";

import api from "@/services/axios";
import { 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Loader2,
  Users,
  FileDown,
  Mail,
  Phone,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
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
import { DeleteConfirmationDialog } from "@/components/portal/delete-confirmation-dialog";
import { TablePagination } from "@/components/portal/table-pagination";
import { API_ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface JobApplication {
  id: string;
  job_id: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  cv_url: string;
  cover_letter: string | null;
  status: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Chờ duyệt", color: "bg-amber-500/10 text-amber-600", icon: Clock },
  reviewed: { label: "Đã xem", color: "bg-blue-500/10 text-blue-600", icon: Eye },
  interviewed: { label: "Phỏng vấn", color: "bg-purple-500/10 text-purple-600", icon: Users },
  rejected: { label: "Từ chối", color: "bg-rose-500/10 text-rose-600", icon: XCircle },
  accepted: { label: "Trúng tuyển", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
};

export default function ApplicationsManagementPage() {
  const [applications, setApplications] = React.useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchApplications = async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit) 
      });
      
      if (search) params.append("search", search);

      const res = await api.get(`${API_ROUTES.APPLICATIONS}?${params.toString()}`);
      setApplications(res.data.data || []);
      if (res.data.meta) {
        setTotalItems(res.data.meta.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách ứng viên");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApplications(currentPage, pageSize, debouncedSearch);
  }, [currentPage, pageSize, debouncedSearch]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`${API_ROUTES.APPLICATIONS}/${itemToDelete.id}`);
      toast.success("Đã xóa hồ sơ ứng viên");
      fetchApplications(currentPage, pageSize, debouncedSearch);
    } catch {
      toast.error("Không thể xóa hồ sơ ứng viên");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`${API_ROUTES.APPLICATIONS}/${id}`, { status });
      toast.success("Đã cập nhật trạng thái hồ sơ");
      fetchApplications(currentPage, pageSize, debouncedSearch);
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || { label: status, color: "bg-slate-500/10 text-slate-500", icon: AlertCircle };
    const Icon = config.icon;
    return (
      <Badge className={cn("border-none text-[9px] font-black uppercase tracking-widest gap-1.5 py-1", config.color)}>
        <Icon size={10} />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Quản lý Ứng viên</h1>
          <p className="text-sm text-muted-foreground font-medium">Theo dõi và xử lý hồ sơ ứng tuyển từ người lao động.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm ứng viên theo tên, email, sđt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-primary/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Users size={48} className="mb-4" />
            <p className="text-sm font-bold">Chưa có ứng viên nào ứng tuyển</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Ứng viên</th>
                  <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Vị trí ứng tuyển</th>
                  <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Thông tin liên hệ</th>
                  <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Ngày nộp</th>
                  <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                  <th className="text-right p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{app.full_name}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-brand-primary uppercase truncate max-w-[200px]">{app.job_title}</p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                          <Mail size={12} className="text-slate-300" />
                          {app.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                          <Phone size={12} className="text-slate-300" />
                          {app.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-slate-500 italic">
                        {format(new Date(app.created_at), "HH:mm, dd/MM/yyyy", { locale: vi })}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(app.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* CV Download Button */}
                        <a 
                          href={app.cv_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Tải CV / Xem hồ sơ"
                          className="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-brand-primary hover:text-white text-slate-400 transition-colors"
                        >
                          <FileDown size={14} />
                        </a>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-none w-48">
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cập nhật trạng thái</DropdownMenuLabel>
                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                <DropdownMenuItem 
                                  key={key}
                                  onClick={() => handleUpdateStatus(app.id, key)}
                                  className="text-xs font-bold flex items-center gap-2"
                                >
                                  <config.icon size={14} className={cn(config.color.split(' ')[1])} />
                                  {config.label}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setItemToDelete(app);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600 flex items-center gap-2 text-xs font-bold"
                            >
                              <Trash2 size={14} /> Xóa hồ sơ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        loading={isDeleting}
        itemName={itemToDelete?.full_name || ""}
      />
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
