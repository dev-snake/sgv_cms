"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Save, ImagePlus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/portal/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECTS } from "@/data/projects";
import { PORTAL_ROUTES } from "@/constants/routes";
import { StatusFormSection } from "@/components/portal/status-form-section";

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const existingProject = PROJECTS.find((p) => p.id === projectId);

  const [formData, setFormData] = React.useState({
    name: existingProject?.name || "",
    slug: existingProject?.name?.toLowerCase().replace(/\s+/g, "-") || "",
    description: "",
    client_name: existingProject?.client_name || "",
    start_date: existingProject?.start_date || "",
    end_date: existingProject?.end_date || "",
    category_id: existingProject?.category_id || "1",
    status: existingProject?.status || "ongoing",
    image: existingProject?.image || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating:", formData);
  };

  if (!existingProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-slate-500 font-medium">Không tìm thấy dự án.</p>
        <Link href={PORTAL_ROUTES.cms.projects.list}>
          <Button variant="outline" className="rounded-none">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/portal/cms/projects">
            <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Chỉnh sửa dự án</h1>
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Cập nhật thông tin dự án và chuẩn hóa dữ liệu.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6 py-6 h-auto border-slate-100 rounded-none text-slate-500">
            Hủy thay đổi
          </Button>
          <Button onClick={handleSubmit} className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-none">
            <Save className="mr-2 size-4" /> Lưu thay đổi
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tên dự án *</Label>
              <Input id="name" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="space-y-3">
              <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Slug (URL) *</Label>
              <Input id="slug" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mô tả dự án *</Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content: string) => setFormData({ ...formData, description: content })}
                placeholder="Mô tả chi tiết về dự án, phạm vi công việc..."
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="client_name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tên khách hàng / Chủ đầu tư</Label>
              <Input id="client_name" placeholder="Ví dụ: Tập đoàn ABC" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20" value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="start_date" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ngày bắt đầu</Label>
                <Input id="start_date" type="date" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none focus:ring-1 focus:ring-brand-primary/20" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
              </div>
              <div className="space-y-3">
                <Label htmlFor="end_date" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ngày kết thúc (Dự kiến)</Label>
                <Input id="end_date" type="date" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none focus:ring-1 focus:ring-brand-primary/20" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <StatusFormSection 
            isActive={formData.status === "completed"}
            onActiveChange={(isActive) => setFormData({ ...formData, status: isActive ? "completed" : "ongoing" })}
            label="Trạng thái hoàn thành"
            description="Đánh dấu dự án đã hoàn thành và bàn giao."
          />

          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">Phân loại dự án</h3>
            <div className="space-y-3">
              <Label htmlFor="category_id" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Danh mục *</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-none text-sm font-bold shadow-none focus:ring-1 focus:ring-brand-primary/20"><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                <SelectContent className="rounded-none border-slate-100">
                  <SelectItem value="1" className="text-sm font-bold rounded-none">Hệ Thống Cấp Nước</SelectItem>
                  <SelectItem value="2" className="text-sm font-bold rounded-none">Xử Lý Nước Thải</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">Hình ảnh</h3>
            <div className="space-y-3">
              <Label htmlFor="image" className="text-[10px] font-black uppercase tracking-widest text-slate-500">URL hình ảnh</Label>
              <Input id="image" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            </div>
          </div>

          <div className="p-6 bg-brand-primary/5 border border-brand-primary/10">
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              Thông tin dự án được chuẩn hóa theo cấu trúc database CMS.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

