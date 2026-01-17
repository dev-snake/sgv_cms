"use client";

import api from "@/services/axios";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Loader2,
  Briefcase,
  MapPin,
  Clock
} from "lucide-react";
import Link from "next/link";
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
import { PORTAL_ROUTES, API_ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";
import { PERMISSIONS } from "@/constants/rbac";

interface JobPosting {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  employment_type: string;
  salary_range: string | null;
  experience_level: string | null;
  department: string | null;
  status: "open" | "closed";
  deadline: string | null;
  created_at: string;
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Toàn thời gian",
  part_time: "Bán thời gian",
  contract: "Hợp đồng",
  internship: "Thực tập",
};

export default function JobsManagementPage() {
  const { hasPermission } = useAuth();
  const [jobs, setJobs] = React.useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<JobPosting | null>(null);
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

  const fetchJobs = async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit) 
      });
      
      if (search) params.append("search", search);

      const res = await api.get(`${API_ROUTES.JOBS}?${params.toString()}`);
      setJobs(res.data.data || []);
      if (res.data.meta) {
        setTotalItems(res.data.meta.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách tuyển dụng");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobs(currentPage, pageSize, debouncedSearch);
  }, [currentPage, pageSize, debouncedSearch]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`${API_ROUTES.JOBS}/${itemToDelete.id}`);
      toast.success("Đã xóa tin tuyển dụng");
      fetchJobs(currentPage, pageSize, debouncedSearch);
    } catch {
      toast.error("Không thể xóa tin tuyển dụng");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "open") {
      return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none text-[9px] font-black uppercase tracking-widest">Đang tuyển</Badge>;
    }
    return <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-none text-[9px] font-black uppercase tracking-widest">Đã đóng</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Quản lý Tuyển dụng</h1>
          <p className="text-sm text-muted-foreground font-medium">Quản lý các tin tuyển dụng của công ty.</p>
        </div>
        {hasPermission(PERMISSIONS.RECRUITMENT_CREATE) && (
          <Link href={PORTAL_ROUTES.cms.jobs.add}>
            <Button className="h-14 px-8 bg-brand-primary hover:bg-brand-secondary text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-lg">
              <Plus size={18} className="mr-3" /> Thêm tin tuyển dụng
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
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
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Briefcase size={48} className="mb-4" />
            <p className="text-sm font-bold">Chưa có tin tuyển dụng nào</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Vị trí</th>
                <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Địa điểm</th>
                <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Loại hình</th>
                <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="text-left p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Hạn nộp</th>
                <th className="text-right p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-1">{job.title}</p>
                      {job.department && (
                        <p className="text-[10px] font-bold text-brand-primary uppercase">{job.department}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <MapPin size={12} className="text-brand-primary" />
                      {job.location || "Chưa xác định"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-slate-600">
                      {EMPLOYMENT_TYPE_LABELS[job.employment_type] || job.employment_type}
                    </span>
                  </td>
                  <td className="p-4">{getStatusBadge(job.status)}</td>
                  <td className="p-4">
                    {job.deadline ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Clock size={12} />
                        {format(new Date(job.deadline), "dd/MM/yyyy", { locale: vi })}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none">
                        <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest">Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {hasPermission(PERMISSIONS.RECRUITMENT_UPDATE) && (
                          <DropdownMenuItem asChild>
                            <Link href={PORTAL_ROUTES.cms.jobs.edit(job.id)} className="flex items-center gap-2 text-xs font-bold">
                              <Edit2 size={14} /> Chỉnh sửa
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {hasPermission(PERMISSIONS.RECRUITMENT_DELETE) && (
                          <DropdownMenuItem
                            onClick={() => {
                              setItemToDelete(job);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600 flex items-center gap-2 text-xs font-bold"
                          >
                            <Trash2 size={14} /> Xóa
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        itemName={itemToDelete?.title || ""}
      />
    </div>
  );
}
