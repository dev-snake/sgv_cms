"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/axios";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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
import { PORTAL_ROUTES, API_ROUTES } from "@/constants/routes";
import { StatusFormSection } from "@/components/portal/status-form-section";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

export default function AddProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    description: "",
    client_name: "",
    start_date: "",
    end_date: "",
    category_id: "",
    status: "ongoing" as "ongoing" | "completed",
    image: "",
  });

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`${API_ROUTES.CATEGORIES}?type=project`);
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast.error("Không thể tải danh mục dự án");
      }
    };
    
    fetchCategories();
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    
    setFormData((prev) => ({ 
      ...prev, 
      name, 
      slug: prev.slug === "" || prev.slug === prev.name.toLowerCase().replace(/\s+/g, "-") ? slug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(API_ROUTES.PROJECTS, formData);

      toast.success("Đã tạo dự án thành công");
      router.push(PORTAL_ROUTES.cms.projects.list);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error || error.message || "Lỗi khi tạo dự án";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href={PORTAL_ROUTES.cms.projects.list}>
            <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Thêm dự án mới</h1>
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Thêm dự án mới với đầy đủ thông tin kỹ thuật và chuẩn dữ liệu database.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="text-[10px] font-black uppercase tracking-widest px-6 py-6 h-auto border-slate-100 rounded-none text-slate-500"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-none">
            {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />} 
            Lưu dự án
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Tên dự án *
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên dự án..."
                className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Slug (URL) *</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm font-medium">/</span>
                <Input 
                  id="slug" 
                  className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none pl-6 focus-visible:ring-brand-primary/20" 
                  value={formData.slug} 
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Mô tả dự án *
              </Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content: string) => setFormData({ ...formData, description: content })}
                placeholder="Mô tả chi tiết về dự án, phạm vi công việc..."
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="client_name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Tên khách hàng / Chủ đầu tư
              </Label>
              <Input
                id="client_name"
                placeholder="Ví dụ: Tập đoàn ABC"
                className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="start_date" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Ngày bắt đầu
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none focus:ring-1 focus:ring-brand-primary/20"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="end_date" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Ngày kết thúc (Dự kiến)
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none focus:ring-1 focus:ring-brand-primary/20"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
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
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">
              Phân loại dự án
            </h3>
            <div className="space-y-3">
              <Label htmlFor="category_id" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Danh mục *</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-none text-sm font-bold shadow-none focus:ring-1 focus:ring-brand-primary/20">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-slate-100">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-sm font-bold rounded-none">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">
              Hình ảnh dự án
            </h3>
            <div className="space-y-3">
              <Label htmlFor="image" className="text-[10px] font-black uppercase tracking-widest text-slate-500">URL hình ảnh đại diện</Label>
              <Input
                id="image"
                placeholder="https://example.com/project.jpg"
                className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
