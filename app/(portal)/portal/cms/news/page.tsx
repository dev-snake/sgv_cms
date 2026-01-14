"use client";

import { NewsArticle } from "@/types";
import api from "@/services/axios";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2, 
  Filter,
  ArrowUpDown,
  Loader2,
  Newspaper
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
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/portal/delete-confirmation-dialog";
import { TablePagination } from "@/components/portal/table-pagination";
import { PORTAL_ROUTES } from "@/constants/routes";
import { toast } from "sonner";

export default function NewsManagementPage() {
  const [newsList, setNewsList] = React.useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<NewsArticle | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);

  const fetchNews = async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      const res = await api.get(`/api/news?${params.toString()}`);
      setNewsList(res.data.data || []);
      if (res.data.meta) {
        setTotalItems(res.data.meta.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách tin tức");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNews(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const filteredNews = newsList.filter(news => 
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (news.category?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleDeleteClick = (news: NewsArticle) => {
    setItemToDelete(news);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/api/news/${itemToDelete.id}`);
      toast.success("Đã xóa bài viết thành công");
      fetchNews(currentPage, pageSize);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa bài viết");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Quản lý tin tức</h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Cập nhật tin tức, sự kiện và kiến thức kỹ thuật của Sài Gòn Valve.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={PORTAL_ROUTES.cms.news.categories.list}>
            <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6 py-6 h-auto border-slate-100 bg-white rounded-none">
              Danh mục
            </Button>
          </Link>
          <Link href={PORTAL_ROUTES.cms.news.add}>
            <Button className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-none">
              <Plus className="mr-2 size-4" /> Viết bài mới
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-none border border-slate-100 overflow-hidden min-h-[500px]">
        {/* Table Filters */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-white">
          <div className="relative w-full md:w-1/2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
            <input 
              placeholder="TÌM KIẾM BÀI VIẾT THEO TIÊU ĐỀ HOẶC DANH MỤC..." 
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
        ) : filteredNews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Bài viết</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Danh mục</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Ngày đăng</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Tác giả</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredNews.map((news) => (
                  <tr key={news.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="relative h-16 w-24 rounded-none overflow-hidden shrink-0 border border-slate-100 transition-transform group-hover:scale-105 bg-slate-100">
                           {news.image ? (
                             <Image src={news.image} alt={news.title} fill className="object-cover" />
                           ) : (
                             <div className="flex items-center justify-center h-full w-full text-slate-300">
                               <Newspaper size={20} />
                             </div>
                           )}
                        </div>
                        <div className="max-w-[450px]">
                           <div className="text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1 uppercase tracking-tight mb-1">{news.title}</div>
                           <div className="text-[10px] text-slate-400 font-medium line-clamp-1 italic">{news.summary}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="secondary" className="bg-brand-primary/5 text-brand-primary border-brand-primary/10 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none">
                         {news.category || "General"}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                        {news.published_at ? new Date(news.published_at).toLocaleDateString("vi-VN") : "Chưa đăng"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className="h-6 w-6 rounded-none bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500">{news.author?.substring(0,2).toUpperCase() || "AD"}</div>
                         <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{news.author || "Admin"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-12 w-12 p-0 hover:bg-white hover:text-brand-primary border border-transparent hover:border-slate-100 rounded-none transition-all">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-none border border-slate-100 bg-white">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-3">Tùy chọn bài viết</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group">
                             <Eye size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                             <span className="text-xs font-bold uppercase tracking-tight">Xem chi tiết</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                             <Link href={PORTAL_ROUTES.cms.news.edit(news.id)} className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group">
                                <Edit2 size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                                <span className="text-xs font-bold uppercase tracking-tight text-slate-900">Sửa nội dung</span>
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem 
                            className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-rose-50 group"
                            onClick={() => handleDeleteClick(news)}
                          >
                             <Trash2 size={16} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                             <span className="text-xs font-bold uppercase tracking-tight text-rose-600">Xóa bài viết</span>
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
            <Newspaper size={64} className="text-slate-100 mb-6" />
            <p className="text-slate-400 font-medium tracking-tight uppercase text-[10px] tracking-[0.2em]">Không tìm thấy bài viết nào phù hợp.</p>
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
            itemLabel="bài viết"
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa bài viết"
        description="Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống. Hành động này không thể hoàn tác."
        itemName={itemToDelete?.title}
        itemLabel="Bài viết"
        loading={isDeleting}
      />
    </div>
  );
}
