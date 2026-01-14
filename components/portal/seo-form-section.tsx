"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface SEOFormSectionProps {
  metaTitle: string;
  metaDescription: string;
  onChange: (field: "metaTitle" | "metaDescription", value: string) => void;
  helperText?: string;
}

export function SEOFormSection({
  metaTitle,
  metaDescription,
  onChange,
  helperText,
}: SEOFormSectionProps) {
  return (
    <section className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
      <div className="flex items-center gap-3 border-l-4 border-brand-accent pl-4 mb-2">
        <Search size={18} className="text-brand-accent" />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Tối ưu SEO (Tìm kiếm)</h3>
      </div>
      
      {helperText && <p className="text-[10px] text-slate-400 font-medium italic">{helperText}</p>}

      <div className="space-y-3">
        <Label htmlFor="metaTitle" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Meta Title</Label>
        <Input 
          id="metaTitle" 
          className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none focus-visible:ring-brand-primary/20" 
          value={metaTitle} 
          onChange={(e) => onChange("metaTitle", e.target.value)} 
          placeholder="Tiêu đề hiển thị trên Google"
        />
        <div className="flex justify-between">
          <p className="text-[9px] text-slate-400 font-medium italic">Tiêu đề này nên chứa từ khóa chính.</p>
          <p className={cn("text-[10px] font-bold", metaTitle.length > 60 ? "text-rose-500" : "text-emerald-500")}>
            {metaTitle.length}/60
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="metaDescription" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Meta Description</Label>
        <Textarea 
          id="metaDescription" 
          className="min-h-[100px] bg-slate-50 border-none text-sm font-medium rounded-none focus-visible:ring-brand-primary/20 resize-none" 
          value={metaDescription} 
          onChange={(e) => onChange("metaDescription", e.target.value)} 
          placeholder="Mô tả sẽ hiển thị dưới kết quả tìm kiếm..."
        />
        <div className="flex justify-between">
          <p className="text-[9px] text-slate-400 font-medium italic">Nên giữ độ dài khoảng 150-160 ký tự.</p>
          <p className={cn("text-[10px] font-bold", metaDescription.length > 160 ? "text-rose-500" : "text-emerald-500")}>
            {metaDescription.length}/160
          </p>
        </div>
      </div>
    </section>
  );
}
