"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  MoveRight, 
  Calendar, 
  Building2, 
  Briefcase,
  ShieldCheck,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECTS = [
  {
    id: "1",
    title: "Messer Thái Nguyên & Dung Quất",
    location: "Thái Nguyên / Quảng Ngãi",
    desc: "Cung cấp khớp nối cao su Toaflex (Nhật Bản) và giải pháp van điều khiển cho hệ thống khí nén.",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
    client: "Tập Đoàn Messer",
    year: "2024",
    field: "Công nghiệp khí hiếm",
  },
  {
    id: "2",
    title: "Formosa Hà Tĩnh Steel Corporation",
    location: "Hà Tĩnh, Việt Nam",
    desc: "Cung cấp khớp xoay Niigata (Nhật Bản) và thiết bị van chịu nhiệt độ cao cho nhà máy thép.",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
    client: "FHS Steel",
    year: "2023",
    field: "Luyện kim",
  },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const project = PROJECTS.find(p => p.id === params.id) || PROJECTS[0];

  return (
    <div className="flex flex-col min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-slate-900 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/40 to-slate-900"></div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-4xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent bg-slate-900 px-4 py-2 border border-white/10"
            >
               <MapPin size={14} /> {project.location}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl font-bold text-white tracking-tighter uppercase leading-none"
            >
              DỰ ÁN: <br />
              <span className="text-brand-primary">{project.title}</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-24 border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
              
              <div className="lg:col-span-1 space-y-10">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-secondary border-b border-slate-100 pb-4">CHI TIẾT DỰ ÁN</h4>
                    <div className="space-y-6">
                       <div className="space-y-1">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">Khách hàng</div>
                          <div className="text-sm font-black text-slate-900 uppercase">{project.client}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">Năm thực hiện</div>
                          <div className="text-sm font-black text-slate-900 uppercase">{project.year}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">Lĩnh vực</div>
                          <div className="text-sm font-black text-slate-900 uppercase">{project.field}</div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 p-8 space-y-4 border-l-4 border-brand-primary shadow-sm">
                    <ShieldCheck size={32} className="text-brand-primary" />
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-relaxed">Đảm bảo chất lượng vận hành 100% sau bàn giao.</p>
                 </div>
              </div>

              <div className="lg:col-span-3 space-y-12">
                 <div className="prose prose-xl max-w-none text-slate-600 font-medium leading-relaxed italic border-l-8 border-slate-100 pl-10">
                    "{project.desc}"
                 </div>
                 
                 <div className="space-y-8 text-muted-foreground leading-loose font-medium">
                    <p>Trong dự án triển khai cho {project.client}, Sài Gòn Valve đã đóng vai trò là nhà thầu cung cấp thiết bị kỹ thuật chiến lược. Chúng tôi không chỉ cung cấp sản phẩm mà còn trực tiếp tham gia vào khâu tư vấn thiết kế và giám sát lắp đặt tại hiện trường.</p>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic pt-6 border-b border-slate-100 pb-4">Giải pháp kỹ thuật tiêu biểu</h3>
                    <p>Hệ thống van và khớp nối được lựa chọn dựa trên các tiêu chí khắt khe về áp suất, nhiệt độ và tính ăn mòn của môi trường khí hiếm/thép. Việc ứng dụng linh kiện chính hãng từ Nhật Bản giúp kéo dài tuổi thọ hệ thống lên đến 15 năm và giảm thiểu chi phí bảo trì định kỳ.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50 p-12 border-t-4 border-brand-secondary">
                       <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-brand-primary uppercase tracking-widest">Hạng mục cung cấp</h4>
                          <ul className="space-y-2 text-xs font-bold uppercase tracking-tight">
                             <li>• Khớp nối cao su Toaflex chống rung</li>
                             <li>• Van bi điều khiển khí nén Noah</li>
                             <li>• Hệ thống giám sát IoT tập trung</li>
                          </ul>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-brand-primary uppercase tracking-widest">Kết quả đạt được</h4>
                          <ul className="space-y-2 text-xs font-bold uppercase tracking-tight">
                             <li>• Hệ thống vận hành ổn định 24/7</li>
                             <li>• Giảm 20% rung chấn đường ống</li>
                             <li>• Tối ưu hóa giám sát từ xa</li>
                          </ul>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-24 bg-slate-50">
         <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-black uppercase tracking-tight text-brand-secondary mb-16">Hình ảnh thi công</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="relative aspect-video group overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-700">
                     <Image src={project.image} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                     <div className="absolute inset-0 bg-brand-primary/10 opacity-40 group-hover:opacity-0 transition-all"></div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Other Projects */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-16 flex items-center justify-between">
               <h2 className="text-2xl font-black uppercase tracking-tight text-brand-secondary">CÁC DỰ ÁN KHÁC</h2>
               <Link href="/du-an" className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:translate-x-2 transition-transform inline-flex items-center gap-2">XEM TẤT CẢ <MoveRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
               {PROJECTS.map((p) => (
                  <Link key={p.id} href={`/du-an/${p.id}`} className="group relative h-[350px] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500">
                     <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-linear-to-t from-slate-900/95 via-slate-900/10 to-transparent"></div>
                     <div className="absolute inset-0 flex flex-col justify-end p-10">
                        <div className="text-[9px] font-black text-brand-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                           <MapPin size={12} /> {p.location}
                        </div>
                        <h4 className="text-xl font-bold text-white uppercase group-hover:text-brand-accent transition-colors">
                           {p.title}
                        </h4>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
