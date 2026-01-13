"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Save, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PORTAL_ROUTES } from "@/lib/portal-routes";

const NEWS_CATEGORIES = [
  "Tin tức",
  "Sự kiện",
  "Kiến thức kỹ thuật",
  "Thông báo",
  "Khuyến mãi",
];

export default function AddNewsPage() {
  const [formData, setFormData] = React.useState({
    title: "",
    desc: "",
    content: "",
    category: "",
    image: "",
    author: "Admin",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save news
    console.log("Submitting:", formData);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href={PORTAL_ROUTES.cms.news.list}>
            <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Thêm bài viết mới</h1>
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Tạo bài viết tin tức mới cho website Sài Gòn Valve.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6 py-6 h-auto border-slate-100 rounded-none">
            Lưu nháp
          </Button>
          <Button onClick={handleSubmit} className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-none">
            <Save className="mr-2 size-4" /> Xuất bản
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Tiêu đề bài viết *
              </Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề bài viết..."
                className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Mô tả ngắn *
              </Label>
              <Textarea
                id="desc"
                placeholder="Nhập mô tả ngắn cho bài viết (hiển thị trên danh sách)..."
                className="min-h-[100px] bg-slate-50 border-none text-sm font-medium rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20"
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Nội dung bài viết *
              </Label>
              <Textarea
                id="content"
                placeholder="Nhập nội dung chi tiết của bài viết..."
                className="min-h-[300px] bg-slate-50 border-none text-sm font-medium rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">
              Thông tin bài viết
            </h3>

            <div className="space-y-3">
              <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Danh mục *
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-none text-sm font-bold">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-slate-100">
                  {NEWS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-sm font-bold rounded-none">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="author" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Tác giả
              </Label>
              <Input
                id="author"
                className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">
              Ảnh đại diện
            </h3>

            <div className="space-y-3">
              <Label htmlFor="image" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                URL hình ảnh
              </Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            {formData.image ? (
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img src={formData.image} alt="Preview" className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-300">
                <ImagePlus size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">Chưa có ảnh</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
