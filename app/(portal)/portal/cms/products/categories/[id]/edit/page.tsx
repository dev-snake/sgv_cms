"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PORTAL_ROUTES } from "@/constants/routes";
import { CategoryForm, CategoryFormData } from "@/components/portal/category-form";

// Mock data
const PRODUCT_CATEGORIES = [
  { id: "cat-1", name: "Van bướm", slug: "van-buom", description: "Các loại van bướm công nghiệp", parentId: "none", isActive: true, orderIndex: 0, metaTitle: "Van bướm Sài Gòn Valve", metaDescription: "Cung cấp van bướm chất lượng cao", imageUrl: "" },
  { id: "cat-2", name: "Van cổng", slug: "van-cong", description: "Các loại van cổng chịu áp lực", parentId: "none", isActive: true, orderIndex: 1, metaTitle: "Van cổng công nghiệp", metaDescription: "Van cổng cho hệ thống nước", imageUrl: "" },
  { id: "cat-3", name: "Van cầu", slug: "van-cau", description: "Van cầu điều tiết lưu lượng", parentId: "none", isActive: true, orderIndex: 2, metaTitle: "Van cầu hơi nóng", metaDescription: "Van cầu cho lò hơi và nhiệt", imageUrl: "" },
  { id: "cat-4", name: "Van điều khiển", slug: "van-dieu-khien", description: "Van điều khiển điện và khí nén", parentId: "none", isActive: true, orderIndex: 3, metaTitle: "Van điều khiển tự động", metaDescription: "Giải pháp van thông minh", imageUrl: "" },
  { id: "cat-5", name: "Van một chiều", slug: "van-mot-chieu", description: "Van ngăn dòng chảy ngược", parentId: "none", isActive: true, orderIndex: 4, metaTitle: "Van một chiều lá lật", metaDescription: "Van một chiều các loại", imageUrl: "" },
  { id: "cat-6", name: "Thiết bị IoT", slug: "thiet-bi-iot", description: "Cảm biến và thiết bị kết nối", parentId: "none", isActive: true, orderIndex: 5, metaTitle: "Thiết bị IoT ngành nước", metaDescription: "Giám sát hệ thống qua IoT", imageUrl: "" },
  { id: "cat-7", name: "Phụ kiện", slug: "phu-kien", description: "Mặt bích, bù lông, khớp nối", parentId: "none", isActive: true, orderIndex: 6, metaTitle: "Phụ kiện đường ống", metaDescription: "Đầy đủ phụ kiện van vòi", imageUrl: "" },
];

export default function EditProductCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const existingCategory = PRODUCT_CATEGORIES.find(c => c.id === categoryId);

  const handleFormSubmit = (data: CategoryFormData) => {
    console.log("Updating Product Category:", categoryId, data);
    // TODO: Connect to actual backend API
  };

  if (!existingCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-slate-500 font-medium">Không tìm thấy danh mục.</p>
        <Link href={PORTAL_ROUTES.cms.products.categories.list}>
          <Button variant="outline" className="rounded-none">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href={PORTAL_ROUTES.cms.products.categories.list}>
            <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Sửa danh mục sản phẩm</h1>
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Chỉnh sửa thông tin danh mục và tối ưu SEO catalog.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <CategoryForm 
          type="product" 
          isEditing={true}
          initialData={existingCategory}
          onSubmit={handleFormSubmit} 
          backUrl={PORTAL_ROUTES.cms.products.categories.list} 
        />
      </div>
    </div>
  );
}
