"use client";

import { NEWS_LIST, NewsArticle } from "@/lib/news";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2, 
  Filter,
  ArrowUpDown
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

export default function NewsManagementPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<NewsArticle | null>(null);
  
  const filteredNews = NEWS_LIST.filter(news => 
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (news: NewsArticle) => {
    setItemToDelete(news);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      // TODO: Implement API call to delete news
      console.log("Deleting:", itemToDelete.id);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Quản lý tin tức</h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Cập nhật tin tức, sự kiện và kiến thức kỹ thuật của Sài Gòn Valve.</p>
        </div>
        <Link href={PORTAL_ROUTES.cms.news.add}>
          <Button className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-none">
            <Plus className="mr-2 size-4" /> Viết bài mới
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-none border border-slate-100 overflow-hidden">
        {/* Table Filters */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-white">
          <div className="relative w-full md:w-1/2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
            <Input 
              placeholder="TÌM KIẾM BÀI VIẾT THEO TIÊU ĐỀ HOẶC DANH MỤC..." 
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

        {/* Table Content */}
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
                       <div className="relative h-16 w-24 rounded-none overflow-hidden shrink-0 border border-slate-100 transition-transform group-hover:scale-105">
                          <Image src={news.image} alt={news.title} fill className="object-cover" />
                       </div>
                       <div className="max-w-[450px]">
                          <div className="text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1 uppercase tracking-tight mb-1">{news.title}</div>
                          <div className="text-[10px] text-slate-400 font-medium line-clamp-1 italic">{news.desc}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="secondary" className="bg-brand-primary/5 text-brand-primary border-brand-primary/10 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none">
                       {news.category}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{news.date}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <div className="h-6 w-6 rounded-none bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500">{news.author.substring(0,2).toUpperCase()}</div>
                       <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{news.author}</span>
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

        {/* Pagination Footer */}
        <div className="p-8 bg-slate-50/20 border-t border-slate-50 flex items-center justify-between">
           <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Đang hiển thị {filteredNews.length} bài viết trên tổng số {NEWS_LIST.length}</p>
           <div className="flex items-center gap-3">
              <Button disabled variant="outline" className="text-[10px] font-black uppercase tracking-widest px-8 h-12 border-slate-100 bg-white opacity-50 rounded-none">Trước</Button>
              <Button disabled variant="outline" className="text-[10px] font-black uppercase tracking-widest px-8 h-12 border-slate-100 bg-white opacity-50 rounded-none">Sau</Button>
           </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa bài viết"
        description="Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống. Hành động này không thể hoàn tác."
        itemName={itemToDelete?.title}
      />
    </div>
  );
}
