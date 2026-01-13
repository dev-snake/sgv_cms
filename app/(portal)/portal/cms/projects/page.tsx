"use client";

import { PROJECTS, Project } from "@/lib/projects";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2, 
  Filter,
  ArrowUpDown,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Layout
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/portal/delete-confirmation-dialog";
import { PORTAL_ROUTES } from "@/lib/portal-routes";

export default function ProjectsManagementPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<Project | null>(null);
  
  const filteredProjects = PROJECTS.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (project: Project) => {
    setItemToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      console.log("Deleting:", itemToDelete.id);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-none flex items-center gap-2">
            <CheckCircle size={10} /> Đã hoàn thành
          </Badge>
        );
      case "ongoing":
        return (
          <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-none flex items-center gap-2">
            <Clock size={10} /> Đang triển khai
          </Badge>
        );
      case "planning":
        return (
          <Badge className="bg-slate-50 text-slate-500 border-slate-100 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-none flex items-center gap-2">
            <Layout size={10} /> Đang lập kế hoạch
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Quản lý dự án</h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Danh sách các dự án và công trình trọng điểm đã thực hiện.</p>
        </div>
        <Link href={PORTAL_ROUTES.cms.projects.add}>
          <Button className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-none">
            <Plus className="mr-2 size-4" /> Thêm dự án mới
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-none border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-white">
          <div className="relative w-full md:w-1/2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
            <Input 
              placeholder="TÌM KIẾM THEO TÊN DỰ ÁN, ĐỊA ĐIỂM HOẶC LOẠI HÌNH..." 
              className="pl-12 bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20 h-14 rounded-none"
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Dự án</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Địa điểm</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Thời gian</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Trạng thái</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                       <div className="relative h-16 w-24 rounded-none overflow-hidden shrink-0 border border-slate-100 transition-transform group-hover:scale-105">
                          <Image src={project.image} alt={project.name} fill className="object-cover" />
                       </div>
                       <div className="max-w-[400px]">
                          <div className="text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1 uppercase tracking-tight mb-1">{project.name}</div>
                          <Badge variant="outline" className="text-[9px] font-bold text-slate-400 border-slate-200 uppercase tracking-widest px-2 py-0 rounded-none">
                             {project.category}
                          </Badge>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-600 uppercase tracking-tight">
                       <MapPin size={14} className="text-brand-primary/40" />
                       {project.location}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2 text-[11px] font-black text-slate-600 uppercase tracking-tight">
                        <Calendar size={14} className="text-brand-primary/40" />
                        Năm {project.year}
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-12 w-12 p-0 hover:bg-white hover:text-brand-primary border border-transparent hover:border-slate-100 rounded-none transition-all">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 p-2 rounded-none border border-slate-100 bg-white">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-3">Tùy chọn dự án</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group">
                           <Eye size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                           <span className="text-xs font-bold uppercase tracking-tight">Hồ sơ dự án</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={PORTAL_ROUTES.cms.projects.edit(project.id)} className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group">
                              <Edit2 size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                              <span className="text-xs font-bold uppercase tracking-tight text-slate-900">Sửa thông tin</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem 
                          className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-rose-50 group"
                          onClick={() => handleDeleteClick(project)}
                        >
                           <Trash2 size={16} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                           <span className="text-xs font-bold uppercase tracking-tight text-rose-600">Xóa dự án</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50/20 border-t border-slate-50 flex items-center justify-between">
           <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Đang hiển thị {filteredProjects.length} dự án trên tổng số {PROJECTS.length}</p>
           <div className="flex items-center gap-3">
              <Button disabled variant="outline" className="text-[10px] font-black uppercase tracking-widest px-8 h-12 border-slate-100 bg-white opacity-50 rounded-none">Trước</Button>
              <Button disabled variant="outline" className="text-[10px] font-black uppercase tracking-widest px-8 h-12 border-slate-100 bg-white opacity-50 rounded-none">Sau</Button>
           </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa dự án"
        description="Dự án sẽ bị xóa vĩnh viễn khỏi hệ thống. Hành động này không thể hoàn tác."
        itemName={itemToDelete?.name}
      />
    </div>
  );
}
