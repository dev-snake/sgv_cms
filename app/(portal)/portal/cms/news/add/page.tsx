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
import { ImageUploader } from "@/components/portal/ImageUploader";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function AddNewsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category_id: "",
    author_id: "",
    status: "draft" as "draft" | "published",
    image_url: "",
    gallery: [] as string[],
    published_at: undefined as Date | undefined,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, authorsRes] = await Promise.all([
          api.get(`${API_ROUTES.CATEGORIES}?type=news`),
          api.get(API_ROUTES.AUTHORS)
        ]);
        
        setCategories(catsRes.data.data || []);
        const authorsData = authorsRes.data.data || [];
        if (authorsData.length > 0) {
          setFormData(prev => ({ ...prev, author_id: authorsData[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch form data", error);
        toast.error("Không thể tải danh mục hoặc tác giả");
      }
    };
    
    fetchData();
  }, []);

  const handleTitleChange = (title: string) => {
    const slug = title
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
      title, 
      slug: prev.slug === "" || prev.slug === prev.title.toLowerCase().replace(/\s+/g, "-") ? slug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id || !formData.author_id) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        published_at: formData.published_at ? formData.published_at.toISOString() : null,
      };
      await api.post(API_ROUTES.NEWS, submissionData);

      toast.success("Đã tạo bài viết thành công!");
      router.push(PORTAL_ROUTES.cms.news.list);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error || error.message || "Lỗi khi tạo bài viết";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Tạo bài viết tin tức mới với chuẩn dữ liệu chuyên nghiệp.</p>
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
            Xuất bản bài viết
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
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
                onChange={(e) => handleTitleChange(e.target.value)}
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
              <Label htmlFor="summary" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Mô tả ngắn *
              </Label>
              <Textarea
                id="summary"
                placeholder="Nhập mô tả ngắn cho bài viết (hiển thị trên danh sách)..."
                className="min-h-[100px] bg-slate-50 border-none text-sm font-medium rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Nội dung bài viết *
              </Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content: string) => setFormData({ ...formData, content })}
                placeholder="Nhập nội dung chi tiết của bài viết..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <StatusFormSection 
            isActive={formData.status === "published"}
            onActiveChange={(isActive) => setFormData({ ...formData, status: isActive ? "published" : "draft" })}
            label="Trạng thái xuất bản"
            description="Cho phép bài viết hiển thị công khai trên website."
          />

          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">
              Phân loại & Thời gian
            </h3>

            <div className="space-y-3">
              <Label htmlFor="category_id" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Danh mục *
              </Label>
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

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Ngày xuất bản
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "h-14 w-full justify-start text-left font-bold bg-slate-50 border-none rounded-none shadow-none focus:ring-1 focus:ring-brand-primary/20",
                      !formData.published_at && "text-slate-300"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.published_at ? format(formData.published_at, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-none border-slate-100" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.published_at}
                    onSelect={(date) => setFormData({ ...formData, published_at: date })}
                    initialFocus
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">
              Hình ảnh bài viết
            </h3>
            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              gallery={formData.gallery}
              onGalleryChange={(urls) => setFormData({ ...formData, gallery: urls })}
            />
          </div>

          <div className="p-6 bg-brand-primary/5 border border-brand-primary/10">
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              Dữ liệu được chuẩn hóa theo cấu trúc database CMS. Tác giả được tự động gán là quản trị viên.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
