"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Save, ImagePlus, MapPin } from "lucide-react";
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
import { PROJECTS } from "@/lib/projects";
import { PORTAL_ROUTES } from "@/lib/portal-routes";

const PROJECT_CATEGORIES = [
  "Hệ thống SCADA",
  "Trạm bơm",
  "Xử lý nước thải",
  "Cấp nước đô thị",
  "Công nghiệp",
  "Nông nghiệp",
];

const PROJECT_STATUSES = [
  { value: "completed", label: "Đã hoàn thành" },
  { value: "ongoing", label: "Đang triển khai" },
  { value: "planning", label: "Đang lập kế hoạch" },
];

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const existingProject = PROJECTS.find((p) => p.id === projectId);

  const [formData, setFormData] = React.useState({
    name: existingProject?.name || "",
    description: "",
    location: existingProject?.location || "",
    year: existingProject?.year?.toString() || new Date().getFullYear().toString(),
    category: existingProject?.category || "",
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
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Cập nhật thông tin dự án.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-none">
          <Save className="mr-2 size-4" /> Lưu thay đổi
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tên dự án *</Label>
              <Input id="name" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-3">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mô tả dự án</Label>
              <Textarea id="description" className="min-h-[200px] bg-slate-50 border-none text-sm font-medium rounded-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-slate-500"><MapPin size={12} className="inline mr-1" /> Địa điểm *</Label>
                <Input id="location" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
              </div>
              <div className="space-y-3">
                <Label htmlFor="year" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Năm thực hiện *</Label>
                <Input id="year" type="number" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">Phân loại</h3>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Danh mục *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-none text-sm font-bold"><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                <SelectContent className="rounded-none border-slate-100">
                  {PROJECT_CATEGORIES.map((cat) => (<SelectItem key={cat} value={cat} className="text-sm font-bold rounded-none">{cat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "completed" | "ongoing" | "planning" })}>
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-none text-sm font-bold"><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                <SelectContent className="rounded-none border-slate-100">
                  {PROJECT_STATUSES.map((s) => (<SelectItem key={s.value} value={s.value} className="text-sm font-bold rounded-none">{s.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">Hình ảnh</h3>
            <div className="space-y-3">
              <Label htmlFor="image" className="text-[10px] font-black uppercase tracking-widest text-slate-500">URL hình ảnh</Label>
              <Input id="image" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            </div>
            {formData.image ? (
              <div className="relative aspect-video bg-slate-100 overflow-hidden"><img src={formData.image} alt="Preview" className="object-cover w-full h-full" /></div>
            ) : (
              <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-300"><ImagePlus size={32} /><span className="text-[10px] font-black uppercase tracking-widest">Chưa có ảnh</span></div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
