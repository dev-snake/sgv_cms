"use client";

import * as React from "react";
import { Layers } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface StatusFormSectionProps {
  isActive: boolean;
  orderIndex?: number;
  onActiveChange: (value: boolean) => void;
  onOrderChange?: (value: number) => void;
  label?: string;
  description?: string;
}

export function StatusFormSection({
  isActive,
  orderIndex,
  onActiveChange,
  onOrderChange,
  label = "Trạng thái kích hoạt",
  description = "Cho phép hiển thị ngoài website.",
}: StatusFormSectionProps) {
  return (
    <section className="bg-white rounded-none border border-slate-100 p-8 space-y-6">
      <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4 mb-2">
        <Layers size={18} className="text-emerald-500" />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Thiết lập hiển thị</h3>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-none">
        <div className="space-y-0.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900">{label}</Label>
          <p className="text-[9px] text-slate-400 font-medium italic">{description}</p>
        </div>
        <Switch 
          checked={isActive} 
          onCheckedChange={onActiveChange}
          className="data-[state=checked]:bg-emerald-500"
        />
      </div>

      {onOrderChange !== undefined && orderIndex !== undefined && (
        <div className="space-y-3">
          <Label htmlFor="orderIndex" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Thứ tự hiển thị</Label>
          <Input 
            id="orderIndex" 
            type="number"
            className="h-14 bg-slate-50 border-none text-sm font-bold rounded-none focus-visible:ring-brand-primary/20" 
            value={orderIndex} 
            onChange={(e) => onOrderChange(parseInt(e.target.value) || 0)} 
          />
          <p className="text-[9px] text-slate-400 font-medium italic">Thứ tự nhỏ hơn sẽ hiển thị trước.</p>
        </div>
      )}
    </section>
  );
}
