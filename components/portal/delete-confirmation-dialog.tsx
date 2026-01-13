"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Xác nhận xóa",
  description = "Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.",
  itemName,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-none border-none bg-white p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center bg-rose-50 text-rose-600">
              <Trash2 size={24} />
            </div>
            <AlertDialogHeader className="text-left space-y-1">
              <AlertDialogTitle className="text-lg font-black uppercase tracking-tight text-slate-900">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-slate-500">
                {description}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          {itemName && (
            <div className="bg-slate-50 p-4 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mục sẽ bị xóa:</p>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{itemName}</p>
            </div>
          )}
        </div>
        <AlertDialogFooter className="flex-row gap-0 p-0 border-t border-slate-100">
          <AlertDialogCancel className="flex-1 m-0 h-14 rounded-none border-0 border-r border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 m-0 h-14 rounded-none border-0 bg-rose-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-rose-700"
          >
            Xóa vĩnh viễn
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
