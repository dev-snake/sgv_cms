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

const PROJECTS = [
  {
    id: "1",
    title: "LẮP ĐẶT HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TẠI CẦN THƠ",
    location: "Cần Thơ, Việt Nam",
    owner: "Công ty Cấp nước Cần Thơ",
    operator: "Phòng Kỹ thuật CANTHOWASU",
    dateBuilt: "2024 - 2025",
    projectType: "Hạ tầng Nước Thông minh",
    desc: "Cần Thơ là đô thị trung tâm của vùng Đồng bằng sông Cửu Long, nơi nước sông đóng vai trò then chốt trong sinh hoạt và phát triển kinh tế.",
    image: "https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/z6809258125215_0bfd24b1d2a12247ce2fe99f8bc81598-306x234-5.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ecb?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000",
    ],
    solutions: [
      "Hệ thống cảm biến đo chất lượng nước",
      "Datalogger SV1-DAQ truyền dữ liệu 4G/LTE",
      "Phần mềm giám sát trực tuyến SCADA",
    ],
    content: `Dự án lắp đặt hệ thống quan TRẮC chất lượng nước tại Cần Thơ – bước tiến quan trọng trong giám sát nguồn nước bền vững.

Sài Gòn Valve tự hào là đơn vị cung cấp giải pháp toàn diện cho hệ thống quan trắc nước tại khu vực ĐBSCL. Với việc sử dụng các thiết bị tiên tiến, chúng tôi giúp khách hàng quản lý dữ liệu một cách trực quan và chính xác nhất.

Hệ thống bao gồm các cụm cảm biến đo đa chỉ tiêu như pH, Độ đục, Clo dư, và COD. Tất cả dữ liệu được tập trung về bộ điều khiển trung tâm và truyền tải lên đám mây thông qua giao thức bảo mật cao.`,
  },
  {
    id: "2",
    title: "DỰ ÁN LẮP ĐẶT HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TẠI HUẾ",
    location: "Thừa Thiên Huế, Việt Nam",
    owner: "Công ty Cổ phần Cấp nước Thừa Thiên Huế (HueWACO)",
    operator: "Ban Quản lý Dự án HueWACO",
    dateBuilt: "2023 - 2024",
    projectType: "Quan trắc Môi trường",
    desc: "SÀI GÒN VALVE triển khai dự án lắp đặt hệ thống quan trắc chất lượng nước tại Huế – thành phố du lịch nổi tiếng gắn liền với sông Hương và sông Bồ.",
    image: "https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/495000495_642796432091557_8112711184192443493_n-306x234-5.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&q=80&w=2000",
    ],
    solutions: [
      "Thiết bị đo pH, độ đục, Clo",
      "Hệ thống truyền dữ liệu IoT",
      "Phần mềm quản lý tập trung",
    ],
    content: `Bảo tồn vẻ đẹp của Sông Hương thông qua công nghệ giám sát hiện đại. Dự án này tập trung vào việc đảm bảo an toàn nguồn cấp nước cho khu vực nội đô và các khu di tích lịch sử.

Chúng tôi đã thiết kế các trạm quan trắc nhỏ gọn, tiết kiệm năng lượng nhưng vẫn đảm bảo độ bền trong điều kiện thời tiết khắc nghiệt của miền Trung.`,
  },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const currentIndex = PROJECTS.findIndex(p => p.id === id);
  const project = currentIndex !== -1 ? PROJECTS[currentIndex] : PROJECTS[0];

  const prevProject = PROJECTS[currentIndex - 1];
  const nextProject = PROJECTS[currentIndex + 1];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header & Breadcrumbs */}
      <section className="bg-slate-50 pt-32 pb-8 border-b border-slate-200">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-brand-primary transition-colors">TRANG CHỦ</Link>
            <ChevronRight size={10} />
            <Link href="/du-an" className="hover:text-brand-primary transition-colors">DỰ ÁN</Link>
            <ChevronRight size={10} />
            <span className="text-slate-600">{project.projectType}</span>
          </nav>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight max-w-5xl"
          >
            {project.title}
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
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
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
                <p className="text-sm font-bold uppercase">{project.projectType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">KHÁCH HÀNG</p>
                <p className="text-sm font-bold uppercase">{project.owner}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">VỊ TRÍ</p>
                <p className="text-sm font-bold uppercase">{project.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">ĐƠN VỊ VẬN HÀNH</p>
                <p className="text-sm font-bold uppercase">{project.operator}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">GIẢI PHÁP</p>
                <ul className="text-sm font-bold uppercase space-y-1">
                  {project.solutions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-2 bg-brand-cyan shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">THỜI GIAN THI CÔNG</p>
                <p className="text-sm font-bold uppercase">{project.dateBuilt}</p>
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
                {project.content}
              </div>
           </div>

           {/* Gallery Images */}
           <div className="grid grid-cols-1 gap-12 pt-12">
              {project.gallery.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative aspect-video w-full bg-slate-50"
                >
                   <Image
                    src={img}
                    alt={`Gallery ${i}`}
                    fill
                    className="object-cover"
                   />
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Project Navigation Footer */}
      <section className="border-t border-slate-200 mt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12 flex items-center justify-between">
           {prevProject ? (
             <Link 
              href={`/du-an/${prevProject.id}`}
              className="group flex items-center gap-6 text-slate-400 hover:text-brand-primary transition-colors"
             >
                <div className="size-12 border-2 border-slate-200 flex items-center justify-center group-hover:border-brand-primary transition-colors">
                  <ArrowLeft size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1">DỰ ÁN TRƯỚC</p>
                   <p className="text-sm font-bold text-slate-800 uppercase hidden sm:block">{prevProject.title}</p>
                </div>
             </Link>
           ) : <div />}

           {nextProject ? (
             <Link 
              href={`/du-an/${nextProject.id}`}
              className="group flex items-center gap-6 text-slate-400 text-right hover:text-brand-primary transition-colors"
             >
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1">DỰ ÁN TIẾP THEO</p>
                   <p className="text-sm font-bold text-slate-800 uppercase hidden sm:block">{nextProject.title}</p>
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
