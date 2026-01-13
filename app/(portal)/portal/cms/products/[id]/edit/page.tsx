"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Save, ImagePlus, Package } from "lucide-react";
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
import { PRODUCTS } from "@/lib/products";
import { PORTAL_ROUTES } from "@/lib/portal-routes";

const PRODUCT_CATEGORIES = [
  "Van bướm",
  "Van cổng",
  "Van cầu",
  "Van điều khiển",
  "Van một chiều",
  "Thiết bị IoT",
  "Phụ kiện",
];

const PRODUCT_STATUSES = [
  { value: "available", label: "Sẵn có" },
  { value: "out_of_stock", label: "Hết hàng" },
  { value: "discontinued", label: "Ngừng kinh doanh" },
];

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const existingProduct = PRODUCTS.find((p) => p.id === productId);

  const [formData, setFormData] = React.useState({
    name: existingProduct?.name || "",
    sku: existingProduct?.sku || "",
    description: "",
    category: existingProduct?.category || "",
    status: existingProduct?.status || "available",
    image: existingProduct?.image || "",
    specifications: "",
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
            <p className="text-slate-500 font-medium italic mt-2 text-sm">Cập nhật thông tin sản phẩm.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-none">
          <Save className="mr-2 size-4" /> Lưu thay đổi
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tên sản phẩm *</Label>
                <Input id="name" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-3">
                <Label htmlFor="sku" className="text-[10px] font-black uppercase tracking-widest text-slate-500"><Package size={12} className="inline mr-1" /> Mã SKU *</Label>
                <Input id="sku" className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mô tả sản phẩm</Label>
              <Textarea id="description" className="min-h-[150px] bg-slate-50 border-none text-sm font-medium rounded-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="space-y-3">
              <Label htmlFor="specifications" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Thông số kỹ thuật</Label>
              <Textarea id="specifications" className="min-h-[150px] bg-slate-50 border-none text-sm font-medium rounded-none" value={formData.specifications} onChange={(e) => setFormData({ ...formData, specifications: e.target.value })} />
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
                  {PRODUCT_CATEGORIES.map((cat) => (<SelectItem key={cat} value={cat} className="text-sm font-bold rounded-none">{cat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "available" | "out_of_stock" | "discontinued" })}>
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-none text-sm font-bold"><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                <SelectContent className="rounded-none border-slate-100">
                  {PRODUCT_STATUSES.map((s) => (<SelectItem key={s.value} value={s.value} className="text-sm font-bold rounded-none">{s.label}</SelectItem>))}
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
