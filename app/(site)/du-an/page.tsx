"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, ExternalLink, MoveRight } from "lucide-react";
import { SITE_ROUTES } from "@/constants/routes";
import api from "@/services/axios";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Project {
  id: string;
  name: string;
  slug: string;
  category: string;
  image_url: string | null;
  start_date: string | null;
  client_name: string | null;
  status: string;
}

const ITEMS_PER_PAGE = 8;

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const fetchProjects = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
      });
      
      const response = await api.get(`/api/projects?${params.toString()}`);
      if (response.data.success) {
        setProjects(response.data.data || []);
        
        if (response.data.meta) {
          setTotalPages(response.data.meta.totalPages || 1);
          setTotal(response.data.meta.total || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="bg-slate-950 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-carbon opacity-30"></div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="max-w-4xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-brand-cyan"
            >
               <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan"></span>
               DỰ ÁN TIÊU BIỂU
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase leading-none"
            >
              KHẲNG ĐỊNH <br />
              <span className="text-brand-cyan">NĂNG LỰC DỰ ÁN</span>
            </motion.h1>
            <p className="text-slate-400 font-medium text-lg max-w-xl">
              Hơn {total > 0 ? total : 50}+ dự án đã triển khai thành công trên toàn quốc trong lĩnh vực cấp thoát nước và tự động hóa.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {projects.map((project, i) => (
                <motion.div
                   key={project.id}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.05 }}
                   className="group relative bg-white overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 border border-slate-100"
                >
                   <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                         src={project.image_url || "https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/z6809258125215_0bfd24b1d2a12247ce2fe99f8bc81598-306x234-5.jpg"}
                         alt={project.name}
                         fill
                         className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>

                   <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                         <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-brand-primary">
                            <span>{project.category || "CÔNG TRÌNH"}</span>
                            <span className="text-muted-foreground">{project.start_date ? new Date(project.start_date).toLocaleDateString('vi-VN') : ""}</span>
                         </div>
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-snug line-clamp-2 group-hover:text-brand-cyan transition-colors">
                            {project.name}
                         </h3>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                            <MapPin size={12} className="text-brand-cyan" />
                            {project.client_name || "Việt Nam"}
                         </div>
                      </div>

                      <Link 
                        href={`/du-an/${project.slug}`}
                        className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-cyan transition-colors pt-2 border-t border-slate-50"
                      >
                         XEM CHI TIẾT <ExternalLink size={12} />
                      </Link>
                   </div>
                </motion.div>
             ))}
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
                         if (currentPage > 1) handlePageChange(currentPage - 1);
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
                           handlePageChange(page);
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
                         if (currentPage < totalPages) handlePageChange(currentPage + 1);
                       }}
                       className={cn("text-[9px] font-black uppercase tracking-widest", currentPage === totalPages && "pointer-events-none opacity-50")}
                     />
                   </PaginationItem>
                 </PaginationContent>
               </Pagination>
             </div>
           )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-carbon opacity-10"></div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center sm:text-left">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="space-y-4 max-w-2xl">
                 <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">HỢP TÁC CÙNG SGV</h2>
                 <p className="text-slate-400 font-medium leading-relaxed">Bạn có dự án mới cần tư vấn về thiết bị và giải pháp công nghệ? Liên hệ ngay với đội ngũ chuyên gia của chúng tôi để được hỗ trợ tối ưu nhất.</p>
              </div>
              <Link href={SITE_ROUTES.CONTACT} className="shrink-0 inline-flex items-center gap-4 px-12 py-5 bg-brand-cyan text-slate-950 font-black uppercase tracking-[0.2em] hover:bg-white transition-all transform hover:-translate-y-1">
                LIÊN HỆ CHUYÊN GIA <MoveRight size={20} />
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
