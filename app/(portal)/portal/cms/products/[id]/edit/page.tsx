"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Save, ImagePlus, Package } from "lucide-react";
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
import { PRODUCTS } from "@/data/products";
import { PORTAL_ROUTES } from "@/constants/routes";
import { StatusFormSection } from "@/components/portal/status-form-section";

const PRODUCT_CATEGORIES = [
  "Van bướm",
  "Van cổng",
  "Van cầu",
  "Van điều khiển",
  "Van một chiều",
  "Thiết bị IoT",
  "Phụ kiện",
];

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const existingProduct = PRODUCTS.find((p) => p.id === productId);

  const [formData, setFormData] = React.useState({
    name: existingProduct?.name || "",
    slug: existingProduct?.name?.toLowerCase().replace(/\s+/g, "-") || "",
    sku: existingProduct?.sku || "",
    description: "",
    price: existingProduct?.price || "0",
    stock: existingProduct?.stock || "0",
    category_id: existingProduct?.category_id || "1",
    status: (existingProduct?.status as any) || "active",
    image: existingProduct?.image || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating:", formData);
  };

  if (!existingProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-slate-500 font-medium">Không tìm thấy sản phẩm.</p>
        <Link href={PORTAL_ROUTES.cms.products.list}>
          <Button variant="outline" className="rounded-none">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/portal/cms/products">
            <Button variant="outline" className="h-14 w-14 p-0 border-slate-100 rounded-none hover:bg-slate-50">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Chỉnh sửa sản phẩm</h1>
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Cập nhật thông tin sản phẩm và chuẩn hóa dữ liệu.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tên sản phẩm *</Label>
                <Input id="name" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-3">
                <Label htmlFor="sku" className="text-[10px] font-black uppercase tracking-widest text-slate-500"><Package size={12} className="inline mr-1" /> Mã SKU *</Label>
                <Input id="sku" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Giá bán (VNĐ) *</Label>
                <Input id="price" type="number" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none focus:ring-1 focus:ring-brand-primary/20" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div className="space-y-3">
                <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Số lượng tồn kho *</Label>
                <Input id="stock" type="number" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none focus:ring-1 focus:ring-brand-primary/20" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mô tả sản phẩm</Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content: string) => setFormData({ ...formData, description: content })}
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <StatusFormSection 
            isActive={formData.status === "active"}
            onActiveChange={(isActive) => setFormData({ ...formData, status: isActive ? "active" : "inactive" })}
            label="Trạng thái kinh doanh"
            description="Cho phép sản phẩm hiển thị trên các danh mục bán hàng."
          />

          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-primary pl-4">Phân loại sản phẩm</h3>
            <div className="space-y-3">
              <Label htmlFor="category_id" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Danh mục *</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-none text-sm font-bold shadow-none focus:ring-1 focus:ring-brand-primary/20"><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                <SelectContent className="rounded-none border-slate-100">
                  <SelectItem value="1" className="text-sm font-bold rounded-none">Van Công Nghiệp</SelectItem>
                  <SelectItem value="2" className="text-sm font-bold rounded-none">Thiết Bị Đo Lường</SelectItem>
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
              Thông tin sản phẩm được đồng bộ với database CMS Sài Gòn Valve.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

