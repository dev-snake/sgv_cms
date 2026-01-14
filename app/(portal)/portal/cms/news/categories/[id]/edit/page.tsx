"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PORTAL_ROUTES } from "@/constants/routes";
import { CategoryForm, CategoryFormData } from "@/components/portal/category-form";

// Mock data - replace with API call
const NEWS_CATEGORIES = [
  { id: "cat-1", name: "Tin tức", slug: "tin-tuc", description: "Các tin tức mới nhất", parentId: "none", isActive: true, orderIndex: 0, metaTitle: "Tin tức Sài Gòn Valve", metaDescription: "Tin tức mới nhất từ công ty", imageUrl: "" },
  { id: "cat-2", name: "Sự kiện", slug: "su-kien", description: "Các sự kiện nổi bật", parentId: "none", isActive: true, orderIndex: 1, metaTitle: "Sự kiện Sài Gòn Valve", metaDescription: "Sự kiện sắp diễn ra", imageUrl: "" },
  { id: "cat-3", name: "Kiến thức kỹ thuật", slug: "kien-thuc-ky-thuat", description: "Kiến thức chuyên môn về van vòi", parentId: "none", isActive: true, orderIndex: 2, metaTitle: "Kiến thức kỹ thuật", metaDescription: "Chuyên mục chia sẻ kinh nghiệm kỹ thuật", imageUrl: "" },
  { id: "cat-4", name: "Thông báo", slug: "thong-bao", description: "Các thông báo quan trọng", parentId: "none", isActive: true, orderIndex: 3, metaTitle: "Thông báo quan trọng", metaDescription: "Thông báo từ ban quản trị", imageUrl: "" },
  { id: "cat-5", name: "Khuyến mãi", slug: "khuyen-mai", description: "Chương trình khuyến mãi hấp dẫn", parentId: "none", isActive: true, orderIndex: 4, metaTitle: "Khuyến mãi đặc biệt", metaDescription: "Tổng hợp các chương trình ưu đãi", imageUrl: "" },
];

export default function EditNewsCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const existingCategory = NEWS_CATEGORIES.find(c => c.id === categoryId);

  const handleFormSubmit = (data: CategoryFormData) => {
    console.log("Updating News Category:", categoryId, data);
    // TODO: Connect to actual backend API
  };

  if (!existingCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-slate-500 font-medium">Không tìm thấy danh mục.</p>
        <Link href={PORTAL_ROUTES.cms.news.categories.list}>
          <Button variant="outline" className="rounded-none">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href={PORTAL_ROUTES.cms.news.categories.list}>
            <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Sửa danh mục tin tức</h1>
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Chỉnh sửa thông tin danh mục và cấu hình SEO.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <CategoryForm 
          type="news" 
          isEditing={true}
          initialData={existingCategory}
          onSubmit={handleFormSubmit} 
          backUrl={PORTAL_ROUTES.cms.news.categories.list} 
        />
      </div>
    </div>
  );
}
