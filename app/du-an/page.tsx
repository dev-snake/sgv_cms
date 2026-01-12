"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, CalendarDays, ExternalLink, MoveRight, Layers } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "Messer Thái Nguyên & Dung Quất",
    location: "Thái Nguyên / Quảng Ngãi",
    date: "2024",
    category: "Lắp đặt thiết bị",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
  },
  {
    id: 2,
    title: "Formosa Hà Tĩnh Steel Corporation",
    location: "Hà Tĩnh, Việt Nam",
    date: "2023",
    category: "Cung cấp vật tư",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
  },
  {
    id: 3,
    title: "Dự Án LNG Thị Vải - PV Gas",
    location: "Bà Rịa - Vũng Tàu",
    date: "2024",
    category: "Giải pháp IoT",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
  },
  {
    id: 4,
    title: "Nhà Máy Lọc Hóa Dầu Nghi Sơn",
    location: "Thanh Hóa, Việt Nam",
    date: "2022",
    category: "Tư vấn kỹ thuật",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 sm:py-32 relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center sm:text-left">
          <div className="max-w-4xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent"
            >
               DỰ ÁN TIÊU BIỂU
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl font-bold text-white tracking-tighter uppercase leading-none"
            >
              KHẲNG ĐỊNH <br />
              <span className="text-brand-primary">NĂNG LỰC DỰ ÁN</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-100">
             {PROJECTS.map((project, i) => (
                <motion.div
                   key={project.id}
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   viewport={{ once: true }}
                   className="group relative bg-white overflow-hidden p-8 sm:p-12 space-y-8 flex flex-col justify-between hover:z-10 transition-all duration-500 hover:shadow-2xl"
                >
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">{project.category}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{project.date}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 uppercase tracking-tight group-hover:text-brand-primary transition-colors leading-tight">
                         {project.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                         <MapPin size={16} className="text-brand-accent" />
                         {project.location}
                      </div>
                   </div>

                   <div className="relative aspect-video w-full overflow-hidden transition-all duration-700">
                      <Image
                         src={project.image}
                         alt={project.title}
                         fill
                         className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                   </div>

                   <div className="pt-4">
                      <Link 
                        href={`/du-an/${project.id}`}
                        className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-secondary transition-colors"
                      >
                         CHI TIẾT DỰ ÁN <ExternalLink size={14} />
                      </Link>
                   </div>
                </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Newsletter / Contact CTA */}
      <section className="py-24 bg-brand-primary text-white text-center">
        <div className="container mx-auto px-4 lg:px-8 space-y-8">
           <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight">HỢP TÁC CÙNG SGV</h2>
           <p className="max-w-xl mx-auto text-white/70 font-medium">Bạn có dự án mới cần tư vấn về thiết bị và giải pháp công nghệ? Liên hệ ngay với đội ngũ chuyên gia của chúng tôi.</p>
           <div className="flex justify-center">
              <Link href="/lien-he" className="inline-flex items-center gap-3 px-12 py-5 bg-white text-brand-primary font-black uppercase tracking-widest hover:bg-brand-accent hover:text-slate-900 transition-all">
                LIÊN HỆ CHUYÊN GIA <MoveRight size={20} />
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
