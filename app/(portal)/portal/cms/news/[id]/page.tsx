"use client";

import { NEWS_LIST, NewsArticle } from "@/lib/news";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Trash2, 
  Image as ImageIcon,
  Clock,
  User,
  Tags,
  FileText
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function NewsFormPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  
  const article = NEWS_LIST.find(n => n.id === params.id) || {
    title: "",
    desc: "",
    category: "CÔNG NGHỆ",
    author: "Admin",
    readTime: "5 phút",
    image: "",
    content: "",
    date: new Date().toLocaleDateString('vi-VN')
  };

  const [formData, setFormData] = React.useState(article);

  const handleSave = () => {
    toast.success("Đã lưu bài viết thành công!");
    router.push("/portal/cms/news");
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Form Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
        <div className="space-y-2">
          <Link 
            href="/portal/cms/news" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {isNew ? "Viết bài mới" : "Chỉnh sửa bài viết"}
          </h1>
          <p className="text-slate-500 font-medium italic text-sm">
            {isNew ? "Tạo nội dung mới cho trang tin tức." : `Đang chỉnh sửa bài: ${article.title}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto border-slate-200 rounded-sm">
              <Eye className="mr-2 size-4" /> Xem trước
           </Button>
           <Button onClick={handleSave} className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-10 py-6 h-auto shadow-xl shadow-brand-primary/20 transition-all rounded-sm">
              <Save className="mr-2 size-4" /> Xuất bản bài viết
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-xl border border-slate-100 shadow-sm space-y-8">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <FileText size={14} className="text-brand-primary" /> Tiêu đề bài viết
                </label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="NHẬP TIÊU ĐỀ BÀI VIẾT TẠI ĐÂY..." 
                  className="h-16 text-xl font-black uppercase tracking-tight border-slate-200 focus:ring-brand-primary rounded-sm placeholder:text-slate-200"
                />
             </div>

             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <FileText size={14} className="text-brand-primary" /> Mô tả ngắn (Abstract)
                </label>
                <textarea 
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full min-h-[120px] p-6 text-sm font-medium italic text-slate-600 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all rounded-sm placeholder:text-slate-300 leading-relaxed"
                  placeholder="NHẬP MÔ TẢ NGẮN GỌN VỀ BÀI VIẾT..."
                />
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <FileText size={14} className="text-brand-primary" /> Nội dung bài viết (HTML)
                   </label>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-primary">Mã nguồn</Button>
                      <Button variant="ghost" size="sm" className="h-8 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-primary">Trực quan</Button>
                   </div>
                </div>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full min-h-[500px] p-8 text-sm font-medium text-slate-900 bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all rounded-sm font-mono leading-relaxed"
                  placeholder="<p>BẮT ĐẦU VIẾT NỘI DUNG TẠI ĐÂY...</p>"
                />
             </div>
          </div>
        </div>

        {/* Sidebar Metadata */}
        <div className="space-y-10">
          {/* Metadata Card */}
          <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm space-y-8">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">Thông tin bổ sung</h3>
             
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Tags size={12} className="text-brand-primary" /> Danh mục
                   </label>
                   <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full h-12 px-4 text-[10px] font-black bg-slate-50 border border-slate-100 uppercase tracking-widest rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                   >
                      <option>CÔNG NGHỆ</option>
                      <option>DỰ ÁN</option>
                      <option>SẢN PHẨM</option>
                      <option>HỢP TÁC</option>
                      <option>SỰ KIỆN</option>
                   </select>
                </div>

                <div className="space-y-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <User size={12} className="text-brand-primary" /> Tác giả
                   </label>
                   <Input 
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      className="h-12 bg-slate-50 border-slate-100 text-[10px] font-bold uppercase tracking-widest rounded-sm placeholder:text-slate-300"
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Clock size={12} className="text-brand-primary" /> Thời gian đọc
                   </label>
                   <Input 
                      value={formData.readTime}
                      onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                      className="h-12 bg-slate-50 border-slate-100 text-[10px] font-bold uppercase tracking-widest rounded-sm placeholder:text-slate-300"
                   />
                </div>
             </div>
          </div>

          {/* Featured Image Card */}
          <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">Hình ảnh đại diện</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-600">
                   <Trash2 size={14} />
                </Button>
             </div>
             
             {formData.image ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-100 shadow-sm group">
                   <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" className="text-[9px] font-black uppercase tracking-widest h-9">Thay đổi ảnh</Button>
                   </div>
                </div>
             ) : (
                <div className="aspect-video rounded-lg border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-3 bg-slate-50/50 group hover:bg-slate-50 transition-all cursor-pointer">
                   <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-sm">
                      <ImageIcon size={24} />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">Chọn hình ảnh</span>
                </div>
             )}
             <Input 
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="NHẬP URL HÌNH ẢNH..." 
                className="h-10 text-[9px] font-bold bg-slate-50 border-slate-100 uppercase tracking-widest rounded-sm placeholder:text-slate-200"
             />
          </div>

          <div className="bg-slate-900 p-8 rounded-xl text-white space-y-6 shadow-xl shadow-slate-900/10">
             <h3 className="text-xs font-black uppercase tracking-widest text-brand-accent">Hành động nhanh</h3>
             <div className="space-y-4">
                <Button className="w-full bg-brand-accent hover:bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest py-6 h-auto transition-all shadow-lg shadow-brand-accent/20">
                   Lưu bản nháp
                </Button>
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white text-[10px] font-black uppercase tracking-widest py-6 h-auto">
                   Đặt lịch đăng bài
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
