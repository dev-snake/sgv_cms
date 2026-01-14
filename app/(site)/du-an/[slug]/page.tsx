"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

import api from "@/services/axios";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/api/projects/${params.slug}`);
        if (response.data.success) {
          setProject(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!project) return <div className="pt-44 text-center">Không tìm thấy dự án</div>;

  const prevProject: any = null;
  const nextProject: any = null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header & Breadcrumbs */}
      <section className="bg-slate-50 pt-44 pb-8 border-b border-slate-200">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-brand-primary transition-colors">TRANG CHỦ</Link>
            <ChevronRight size={10} />
            <Link href="/du-an" className="hover:text-brand-primary transition-colors">DỰ ÁN</Link>
            <ChevronRight size={10} />
            <span className="text-slate-600 uppercase tracking-tighter">{project.category || "CÔNG TRÌNH"}</span>
          </nav>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight max-w-5xl"
          >
            {project.name}
          </motion.h1>
        </div>
      </section>

      {/* Main Image */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-[50vh] min-h-[400px] w-full bg-slate-100 overflow-hidden"
        >
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-slate-100 text-slate-300 italic font-medium">Đang cập nhật hình ảnh...</div>
          )}
        </motion.div>
      </section>

      {/* Project at a Glance Box */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <div className="bg-[#416991] text-white overflow-hidden shadow-2xl">
          <div className="px-8 py-4 bg-[#2b4c6b] flex items-center justify-between border-b border-white/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Info size={14} /> SƠ LƯỢC DỰ ÁN
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest hover:text-brand-cyan transition-colors flex items-center gap-2">
              XEM TẤT CẢ <ExternalLink size={12} />
            </button>
          </div>
          
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16">
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">LOẠI DỰ ÁN</p>
                <p className="text-sm font-bold uppercase">{project.category || "Hạ tầng nước"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">KHÁCH HÀNG</p>
                <p className="text-sm font-bold uppercase">{project.client_name || "Đang cập nhật"}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">VỊ TRÍ</p>
                <p className="text-sm font-bold uppercase">{project.location || "Việt Nam"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">TRẠNG THÁI</p>
                <p className="text-sm font-bold uppercase">{project.status === "completed" ? "ĐÃ HOÀN THÀNH" : "ĐANG TRIỂN KHAI"}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">THỜI GIAN THI CÔNG</p>
                <p className="text-sm font-bold uppercase">
                  {project.start_date ? new Date(project.start_date).getFullYear() : "2024"} 
                  {project.end_date ? ` - ${new Date(project.end_date).getFullYear()}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="container mx-auto px-4 lg:px-8 py-4">
        <Link 
          href="/lien-he"
          className="group flex flex-col sm:flex-row items-center justify-between p-8 bg-[#4c92b1] hover:bg-[#3d768f] transition-all"
        >
          <div className="flex items-center gap-6">
             <div className="size-12 border-2 border-white flex items-center justify-center shrink-0">
                <ArrowRight className="text-white transform group-hover:translate-x-1 transition-transform" />
             </div>
             <div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight">HÃY ĐỂ CHÚNG TÔI HỖ TRỢ DỰ ÁN TIẾP THEO CỦA BẠN</h4>
                <p className="text-xs text-white/80 font-medium uppercase tracking-widest mt-1">GỬI YÊU CẦU TƯ VẤN NGAY HÔM NAY</p>
             </div>
          </div>
          <div className="mt-6 sm:mt-0 px-6 py-2 border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
             LIÊN HỆ
          </div>
        </Link>
      </section>

      {/* Project Content */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg prose-p:font-medium">
              <div className="whitespace-pre-line">
                {project.description}
              </div>
           </div>
        </div>
      </section>

      {/* Project Navigation Footer */}
      <section className="border-t border-slate-200 mt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12 flex items-center justify-between">
           {prevProject ? (
             <Link 
              href={`/du-an/${prevProject.slug}`}
              className="group flex items-center gap-6 text-slate-400 hover:text-brand-primary transition-colors"
             >
                <div className="size-12 border-2 border-slate-200 flex items-center justify-center group-hover:border-brand-primary transition-colors">
                  <ArrowLeft size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1">DỰ ÁN TRƯỚC</p>
                   <p className="text-sm font-bold text-slate-800 uppercase hidden sm:block">{prevProject.name}</p>
                </div>
             </Link>
           ) : <div />}

           {nextProject ? (
             <Link 
              href={`/du-an/${nextProject.slug}`}
              className="group flex items-center gap-6 text-slate-400 text-right hover:text-brand-primary transition-colors"
             >
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1">DỰ ÁN TIẾP THEO</p>
                   <p className="text-sm font-bold text-slate-800 uppercase hidden sm:block">{nextProject.name}</p>
                </div>
                <div className="size-12 border-2 border-slate-200 flex items-center justify-center group-hover:border-brand-primary transition-colors">
                  <ArrowRight size={20} />
                </div>
             </Link>
           ) : <div />}
        </div>
      </section>
    </div>
  );
}
