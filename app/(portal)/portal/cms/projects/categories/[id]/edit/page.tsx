"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PORTAL_ROUTES } from "@/constants/routes";
import { CategoryForm, CategoryFormData } from "@/components/portal/category-form";

// Mock data
const PROJECT_CATEGORIES = [
  { id: "cat-1", name: "Hệ thống SCADA", slug: "he-thong-scada", description: "Hệ thống giám sát điều khiển", parentId: "none", isActive: true, orderIndex: 0, metaTitle: "SCADA cho dự án nước", metaDescription: "Giải pháp SCADA tiên tiến", imageUrl: "" },
  { id: "cat-2", name: "Trạm bơm", slug: "tram-bom", description: "Các loại trạm bơm chuyên dụng", parentId: "none", isActive: true, orderIndex: 1, metaTitle: "Thi công trạm bơm cao tầng", metaDescription: "Dịch vụ lắp đặt trạm bơm trọn gói", imageUrl: "" },
  { id: "cat-3", name: "Xử lý nước thải", slug: "xu-ly-nuoc-thai", description: "Hệ thống xử lý nước thải công nghiệp", parentId: "none", isActive: true, orderIndex: 2, metaTitle: "Xử lý nước thải chuẩn ISO", metaDescription: "Giải pháp môi trường thực tế", imageUrl: "" },
  { id: "cat-4", name: "Cấp nước đô thị", slug: "cap-nuoc-do-thi", description: "Hệ thống cấp nước sạch đô thị", parentId: "none", isActive: true, orderIndex: 3, metaTitle: "Cấp nước sạch thông minh", metaDescription: "Kỹ thuật cấp nước đô thị hiện đại", imageUrl: "" },
  { id: "cat-5", name: "Công nghiệp", slug: "cong-nghiep", description: "Dự án trong lĩnh vực công nghiệp", parentId: "none", isActive: true, orderIndex: 4, metaTitle: "Lắp đặt van công nghiệp", metaDescription: "Dự án cấp thoát nước công nghiệp", imageUrl: "" },
  { id: "cat-6", name: "Nông nghiệp", slug: "nong-nghiep", description: "Hệ thống tưới tiêu nông nghiệp", parentId: "none", isActive: true, orderIndex: 5, metaTitle: "Tưới tiêu tự động", metaDescription: "Dự án nông nghiệp thông minh", imageUrl: "" },
];

export default function EditProjectCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const existingCategory = PROJECT_CATEGORIES.find(c => c.id === categoryId);

  const handleFormSubmit = (data: CategoryFormData) => {
    console.log("Updating Project Category:", categoryId, data);
    // TODO: Connect to actual backend API
  };

  if (!existingCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-slate-500 font-medium">Không tìm thấy danh mục.</p>
        <Link href={PORTAL_ROUTES.cms.projects.categories.list}>
          <Button variant="outline" className="rounded-none">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href={PORTAL_ROUTES.cms.projects.categories.list}>
            <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Sửa danh mục dự án</h1>
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Chỉnh sửa thông tin danh mục và cấu hình hiển thị.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <CategoryForm 
          type="project" 
          isEditing={true}
          initialData={existingCategory}
          onSubmit={handleFormSubmit} 
          backUrl={PORTAL_ROUTES.cms.projects.categories.list} 
        />
      </div>
    </div>
  );
}
