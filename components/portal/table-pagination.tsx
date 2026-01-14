"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of items */
  totalItems: number;
  /** Number of items per page */
  pageSize: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange: (size: number) => void;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Show "Showing X of Y" text */
  showItemCount?: boolean;
  /** Label for items (e.g., "bài viết", "sản phẩm") */
  itemLabel?: string;
  /** Additional className */
  className?: string;
}

/**
 * Reusable table pagination using shadcn/ui components.
 * 
 * @example
 * ```tsx
 * <TablePagination
 *   currentPage={page}
 *   totalItems={100}
 *   pageSize={10}
 *   onPageChange={setPage}
 *   onPageSizeChange={setPageSize}
 *   itemLabel="bài viết"
 * />
 * ```
 */
export function TablePagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showItemCount = true,
  itemLabel = "mục",
  className,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      if (totalPages > 1) pages.push(totalPages);
    }
    return pages;
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(page);
  };

  if (totalPages === 0) return null;

  return (
    <div className={cn(
      "p-6 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4",
      className
    )}>
      {/* Left side - Item count & page size selector */}
      <div className="flex items-center gap-6">
        {showItemCount && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Hiển thị <span className="text-slate-600">{startItem}-{endItem}</span> trong{" "}
            <span className="text-slate-600">{totalItems}</span> {itemLabel}
          </p>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hiện</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-9 w-20 rounded-none border-slate-100 bg-white text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-slate-100">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)} className="text-xs font-bold rounded-none">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">/ trang</span>
        </div>
      </div>

      {/* Right side - shadcn Pagination */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#"
              onClick={handlePrev}
              className={cn(
                "rounded-none text-xs",
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={handlePageClick(page)}
                  isActive={currentPage === page}
                  className={cn(
                    "rounded-none text-xs font-bold",
                    currentPage === page && "bg-brand-primary text-white hover:bg-brand-primary border-brand-primary"
                  )}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              href="#"
              onClick={handleNext}
              className={cn(
                "rounded-none text-xs",
                currentPage === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
