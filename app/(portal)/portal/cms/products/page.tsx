"use client";

import { Product } from "@/types";
import api from "@/services/axios";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2, 
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Calendar as CalendarIcon,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/portal/delete-confirmation-dialog";
import { TablePagination } from "@/components/portal/table-pagination";
import { PORTAL_ROUTES, API_ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ProductsManagementPage() {
  const [productsList, setProductsList] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);

  // Date Filter state
  const [date, setDate] = React.useState<DateRange | undefined>();

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = async (page: number, limit: number, search: string, dateRange?: DateRange) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append("search", search);
      if (dateRange?.from) params.append("startDate", dateRange.from.toISOString());
      if (dateRange?.to) params.append("endDate", dateRange.to.toISOString());

      const res = await api.get(`${API_ROUTES.PRODUCTS}?${params.toString()}`);
      setProductsList(res.data.data || []);
      if (res.data.meta) {
        setTotalItems(res.data.meta.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts(currentPage, pageSize, debouncedSearch, date);
  }, [currentPage, pageSize, debouncedSearch, date]);

  const handleDeleteClick = (product: Product) => {
    setItemToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`${API_ROUTES.PRODUCTS}/${itemToDelete.id}`);
      toast.success("Đã xóa sản phẩm thành công");
      fetchProducts(currentPage, pageSize, debouncedSearch, date);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa sản phẩm");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-none flex items-center gap-1.5">
            <CheckCircle2 size={10} /> Đang bán
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-slate-50 text-slate-500 border-slate-100 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-none flex items-center gap-1.5">
            <XCircle size={10} /> Ngừng kinh doanh
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Quản lý sản phẩm</h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Danh mục van công nghiệp và thiết bị IoT của Sài Gòn Valve.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href={PORTAL_ROUTES.cms.products.categories.list}>
             <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6 py-4 hover:cursor-pointer h-auto border-slate-100 bg-white rounded-none">
               Danh mục
             </Button>
           </Link>
           <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6 py-4 hover:cursor-pointer h-auto border-slate-100 bg-white rounded-none">
              Xuất dữ liệu
           </Button>
           <Link href={PORTAL_ROUTES.cms.products.add}>
             <Button className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-4 hover:cursor-pointer h-auto transition-all rounded-none">
               <Plus className="mr-2 size-4" /> Thêm sản phẩm
             </Button>
           </Link>
        </div>
      </div>

      <div className="bg-white rounded-none border border-slate-100 overflow-hidden min-h-[500px]">
        {/* Table Filters */}
        <div className="p-8 border-b border-slate-50 flex flex-col xl:flex-row gap-6 items-center justify-between bg-white">
          <div className="relative w-full xl:w-1/2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
            <input 
              placeholder="TÌM KIẾM THEO TÊN, SKU HOẶC DANH MỤC..." 
              className="w-full pl-12 bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:ring-1 focus:ring-brand-primary/20 h-10 rounded-none outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
             {/* Date Range Picker */}
             <div className="grid gap-2 w-full sm:w-[300px] ">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-bold text-[10px] uppercase hover:cursor-pointer tracking-widest h-10 border-slate-100 rounded-none bg-slate-50/50",
                        !date && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "dd/MM/yy")} -{" "}
                            {format(date.to, "dd/MM/yy")}
                          </>
                        ) : (
                          format(date.from, "dd/MM/yy")
                        )
                      ) : (
                        <span>Lọc theo ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-none border border-slate-100 shadow-xl" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      className="rounded-none bg-white"
                    />
                    {date && (
                      <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50"
                          onClick={() => setDate(undefined)}
                        >
                          <X className="mr-2 size-3" /> Xóa lọc
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
             </div>


          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 size={40} className="animate-spin text-brand-primary opacity-20" />
          </div>
        ) : productsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Sản phẩm</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">SKU</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Giá / Tồn kho</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Danh mục</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Trạng thái</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {productsList.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                         <div className="relative h-16 w-24 rounded-none overflow-hidden shrink-0 border border-slate-100 transition-transform group-hover:scale-105 bg-slate-100">
                            {product.image_url ? (
                              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full text-slate-300">
                                <Package size={20} />
                              </div>
                            )}
                         </div>
                         <div className="max-w-[350px]">
                            <div className="text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1 uppercase tracking-tight mb-0.5">{product.name}</div>
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sài Gòn Valve Official</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[11px] font-black text-slate-600 bg-slate-50 px-2 py-1 border border-slate-100">{product.sku}</code>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kho: {product.stock}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{product.category || "Chưa phân loại"}</span>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-12 w-12 p-0 hover:bg-white hover:text-brand-primary border border-transparent hover:border-slate-100 rounded-none transition-all">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-none border border-slate-100 bg-white">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-3">Tùy chọn sản phẩm</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-50" />

                          <DropdownMenuItem asChild>
                             <Link href={PORTAL_ROUTES.cms.products.edit(product.id)} className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 group">
                                <Edit2 size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                                <span className="text-xs font-bold uppercase tracking-tight text-slate-900">Sửa thông tin</span>
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem 
                            className="rounded-none px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-rose-50 group"
                            onClick={() => handleDeleteClick(product)}
                          >
                             <Trash2 size={16} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                             <span className="text-xs font-bold uppercase tracking-tight text-rose-600">Xóa sản phẩm</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-24 text-center h-[500px] flex items-center justify-center flex-col">
            <Package size={64} className="text-slate-100 mb-6" />
            <p className="text-slate-400 font-medium uppercase text-[10px] tracking-[0.2em]">Không tìm thấy sản phẩm nào phù hợp.</p>
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && totalItems > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            itemLabel="sản phẩm"
          />
        )}
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa sản phẩm"
        description="Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống. Hành động này không thể hoàn tác."
        itemName={itemToDelete?.name}
        itemLabel="Sản phẩm"
        loading={isDeleting}
      />
    </div>
  );
}
