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
import { Trash2, AlertTriangle, Loader2, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogVariant = "danger" | "warning";

interface ConfirmationDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when user confirms the action */
  onConfirm: () => void | Promise<void>;
  /** Dialog title */
  title?: string;
  /** Dialog description */
  description?: string;
  /** Name of the item being affected (shown in highlighted box) */
  itemName?: string;
  /** Label for item type (e.g., "Dự án", "Sản phẩm") */
  itemLabel?: string;
  /** Text for confirm button */
  confirmText?: string;
  /** Text for cancel button */
  cancelText?: string;
  /** Visual variant of the dialog */
  variant?: DialogVariant;
  /** Whether the action is in progress */
  loading?: boolean;
  /** Custom icon to display */
  icon?: LucideIcon;
}

const variantConfig: Record<DialogVariant, {
  iconBg: string;
  iconColor: string;
  buttonBg: string;
  buttonHover: string;
  accentColor: string;
}> = {
  danger: {
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    buttonBg: "bg-rose-600",
    buttonHover: "hover:bg-rose-700",
    accentColor: "border-rose-200",
  },
  warning: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    buttonBg: "bg-amber-600",
    buttonHover: "hover:bg-amber-700",
    accentColor: "border-amber-200",
  },
};

/**
 * Reusable confirmation dialog for destructive actions.
 * Use this component across the portal for delete, remove, or other dangerous operations.
 * 
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   open={showDelete}
 *   onOpenChange={setShowDelete}
 *   onConfirm={handleDelete}
 *   itemName="Dự án A"
 *   itemLabel="Dự án"
 *   loading={deleting}
 * />
 * ```
 */
export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Xác nhận xóa",
  description = "Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.",
  itemName,
  itemLabel = "Mục",
  confirmText = "Xóa vĩnh viễn",
  cancelText = "Hủy bỏ",
  variant = "danger",
  loading = false,
  icon: CustomIcon,
}: ConfirmationDialogProps) {
  const config = variantConfig[variant];
  const Icon = CustomIcon || (variant === "danger" ? Trash2 : AlertTriangle);

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-none border-none bg-white p-0 overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => !loading && onOpenChange(false)}
          className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <X size={16} />
        </button>

        <div className="p-8 space-y-6">
          {/* Header with icon */}
          <div className="flex items-start gap-4">
            <div className={cn(
              "h-14 w-14 flex items-center justify-center shrink-0",
              config.iconBg,
              config.iconColor
            )}>
              <Icon size={28} strokeWidth={1.5} />
            </div>
            <AlertDialogHeader className="text-left space-y-2 pt-1">
              <AlertDialogTitle className="text-xl font-black uppercase tracking-tight text-slate-900">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-slate-500 leading-relaxed">
                {description}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          {/* Item preview box */}
          {itemName && (
            <div className={cn(
              "bg-slate-50 p-5 border-l-4",
              config.accentColor
            )}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                {itemLabel} sẽ bị xóa:
              </p>
              <p className="text-sm font-black text-slate-900 tracking-tight line-clamp-2">
                {itemName}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <AlertDialogFooter className="flex-row gap-0 p-0 border-t border-slate-100">
          <AlertDialogCancel 
            disabled={loading}
            className="flex-1 m-0 h-14 rounded-none border-0 border-r border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "flex-1 m-0 h-14 rounded-none border-0 text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-70",
              config.buttonBg,
              config.buttonHover
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Đang xử lý...
              </span>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Re-export with old name for backwards compatibility
export const DeleteConfirmationDialog = ConfirmationDialog;

