"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  SlidersHorizontal, 
  ArrowRight, 
  X, 
  Shield, 
  Settings, 
  Info,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/services/axios";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  image_url: string | null;
  tech_summary: string | null;
  price: string;
  status: string;
}

const ITEMS_PER_PAGE = 6;

export default function ProductArchive() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tất cả"]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products?status=active");
        if (response.data.success) {
          const data = response.data.data || [];
          setProducts(data);
          
          // Extract unique categories from products
          const uniqueCategories = ["Tất cả", ...new Set(data.map((p: Product) => p.category).filter(Boolean))];
          setCategories(uniqueCategories as string[]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    (selectedCategory === "Tất cả" || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };


  return (
    <div className="flex flex-col min-h-screen bg-white pt-24">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-carbon opacity-30"></div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div className="space-y-6 max-w-2xl">
                 <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-accent"></span>
                    Sản phẩm & Giải pháp
                 </div>
                 <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                   THIẾT BỊ <br /> 
                   <span className="text-brand-accent">CHUYÊN DỤNG</span>
                 </h1>
                 <p className="text-slate-400 font-medium text-lg max-w-xl">
                   Van công nghiệp, thiết bị đo lường và giải pháp IoT tiêu chuẩn Nhật Bản & Hàn Quốc cho ngành nước và hạ tầng kỹ thuật.
                 </p>
              </div>
              
              <div className="relative w-full max-w-md">
                 <input
                   type="text"
                   placeholder="Tìm kiếm sản phẩm..."
                   value={searchQuery}
                   onChange={(e) => handleSearchChange(e.target.value)}
                   className="w-full bg-white/5 backdrop-blur-md px-6 py-5 pl-14 text-sm font-bold border border-white/10 focus:outline-none focus:border-brand-accent text-white placeholder:text-white/30 transition-all"
                 />
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              </div>
           </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Sidebar Filters */}
              <aside className="lg:w-64 shrink-0">
                 <div className="sticky top-32 space-y-12">
                    <div className="space-y-6">
                       <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-brand-secondary border-b border-slate-100 pb-4">
                         CHUYÊN MỤC
                       </h4>
                       <div className="flex flex-wrap gap-2 lg:flex-col">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => handleCategoryChange(cat)}
                              className={cn(
                                "px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all",
                                selectedCategory === cat
                                  ? "bg-brand-primary text-white shadow-xl"
                                  : "bg-white text-muted-foreground hover:bg-slate-50 hover:text-brand-primary"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="bg-slate-900 p-8 text-white space-y-6">
                       <h4 className="text-lg font-bold uppercase leading-tight italic text-brand-accent">Nhận báo giá ngay?</h4>
                       <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Phản hồi trong 2 giờ làm việc.</p>
                       <Link href="/lien-he" className="flex items-center justify-between group py-4 border-t border-white/10 hover:text-brand-accent transition-all text-xs font-black uppercase tracking-widest">
                          Liên hệ
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                       </Link>
                    </div>
                 </div>
              </aside>

              {/* Grid */}
              <div className="flex-1 space-y-10">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
                      Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} trong {filteredProducts.length} kết quả
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="flex border border-slate-100">
                          <button className="p-2 bg-slate-100 text-brand-primary"><LayoutGrid size={16} /></button>
                          <button className="p-2 text-slate-300 hover:text-brand-primary"><List size={16} /></button>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-slate-100 border border-slate-100">
                    <AnimatePresence mode="popLayout">
                       {paginatedProducts.map((product) => (
                        <motion.div
                          layout
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group bg-white p-8 space-y-8 flex flex-col justify-between hover:z-10 hover:shadow-2xl transition-all h-full"
                        >
                           <div className="relative aspect-square w-full overflow-hidden transition-all duration-500">
                              <Image
                                src={product.image_url || "https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png"}
                                alt={product.name}
                                fill
                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-1000"
                              />
                           </div>
                           <div className="space-y-4">
                              <div className="text-[9px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2">
                                <Shield size={10} /> {product.category}
                              </div>
                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-2 uppercase min-h-10">
                                 {product.name}
                              </h3>
                              <p className="text-[11px] text-muted-foreground font-medium line-clamp-2">{product.tech_summary || "Thiết bị chuyên dụng ngành nước và công nghiệp."}</p>
                              <Link 
                                 href={`/san-pham/${product.slug}`}
                                 className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-secondary transition-colors pt-4 border-t border-slate-50 w-full"
                              >
                                 CHI TIẾT SẢN PHẨM <ArrowRight size={12} className="ml-auto" />
                              </Link>
                           </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                 </div>
                 
                 {/* Pagination */}
                 {totalPages > 1 && (
                   <div className="pt-12">
                     <Pagination>
                       <PaginationContent>
                         <PaginationItem>
                           <PaginationPrevious 
                             href="#" 
                             onClick={(e) => {
                               e.preventDefault();
                               if (currentPage > 1) setCurrentPage(currentPage - 1);
                             }}
                             className={cn("text-[9px] font-black uppercase tracking-widest", currentPage === 1 && "pointer-events-none opacity-50")}
                           />
                         </PaginationItem>
                         
                         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                           <PaginationItem key={page}>
                             <PaginationLink 
                               href="#" 
                               onClick={(e) => {
                                 e.preventDefault();
                                 setCurrentPage(page);
                               }}
                               isActive={currentPage === page}
                               className="text-[11px] font-black"
                             >
                               {page}
                             </PaginationLink>
                           </PaginationItem>
                         ))}

                         <PaginationItem>
                           <PaginationNext 
                             href="#" 
                             onClick={(e) => {
                               e.preventDefault();
                               if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                             }}
                             className={cn("text-[9px] font-black uppercase tracking-widest", currentPage === totalPages && "pointer-events-none opacity-50")}
                           />
                         </PaginationItem>
                       </PaginationContent>
                     </Pagination>
                   </div>
                 )}

                 {filteredProducts.length === 0 && (
                   <div className="py-20 text-center space-y-4">
                      <Info className="mx-auto text-slate-200" size={64} />
                      <p className="text-muted-foreground font-bold uppercase tracking-widest">Không tìm thấy sản phẩm nào.</p>
                   </div>
                 )}
              </div>

           </div>
        </div>
      </section>

      {/* Tech Support Banner */}
      <section className="bg-brand-secondary py-16 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 -skew-x-12 translate-x-20"></div>
         <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
               <div className="space-y-4 text-center lg:text-left">
                  <h4 className="text-2xl font-bold uppercase tracking-tight">Cần tài liệu kỹ thuật Catalogue?</h4>
                  <p className="text-white/60 text-sm font-medium">Nhận ngay bộ tài liệu đầy đủ thông số kỹ thuật của chúng tôi qua Email.</p>
               </div>
               <div className="flex w-full max-w-md bg-white p-2">
                  <input type="email" placeholder="Email của bạn..." className="flex-1 px-4 text-slate-900 font-bold text-sm focus:outline-none" />
                  <button className="bg-brand-primary px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brand-secondary transition-all">Gửi</button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
