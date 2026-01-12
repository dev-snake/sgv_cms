"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MoveRight, MapPin } from "lucide-react";

const PROJECTS = [
  {
    id: "1",
    title: "Messer Thái Nguyên & Dung Quất",
    location: "Thái Nguyên / Quảng Ngãi",
    desc: "Cung cấp khớp nối cao su Toaflex (Nhật Bản) và giải pháp van điều khiển cho hệ thống khí nén.",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
  },
  {
    id: "2",
    title: "Formosa Hà Tĩnh Steel Corporation",
    location: "Hà Tĩnh, Việt Nam",
    desc: "Cung cấp khớp xoay Niigata (Nhật Bản) và thiết bị van chịu nhiệt độ cao cho nhà máy thép.",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
  },
  {
    id: "3",
    title: "Dự Án LNG Thị Vải - PV Gas",
    location: "Bà Rịa - Vũng Tàu",
    desc: "Cung cấp van an toàn FUKUI và van bi LCM đạt tiêu chuẩn khắt khe cho khí LNG.",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
  },
  {
    id: "4",
    title: "Nhà Máy Lọc Hóa Dầu Nghi Sơn",
    location: "Thanh Hóa, Việt Nam",
    desc: "Cung cấp hệ thống van an toàn, khớp nối mềm và bộ trao đổi nhiệt cho dây chuyền sản xuất.",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20 px-4 border-l-4 border-brand-primary pl-8">
           <div className="space-y-4 text-left">
              <h2 className="text-4xl sm:text-5xl font-bold text-brand-secondary tracking-tight uppercase leading-none">
                Dự án <br />
                <span className="text-brand-primary">Tiêu biểu</span>
              </h2>
              <p className="max-w-xl text-muted-foreground font-medium">
                Những công trình trọng điểm khẳng định uy tín và năng lực kỹ thuật của Sài Gòn Valve.
              </p>
           </div>
           
           <Link
             href="/du-an"
             className="hidden md:flex items-center gap-3 text-xs font-black uppercase tracking-widest text-brand-primary group transition-all"
           >
              XEM TẤT CẢ DỰ ÁN <MoveRight size={20} className="transition-transform group-hover:translate-x-2" />
           </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[450px] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/95 via-slate-900/10 to-transparent"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-accent tracking-widest bg-slate-900 w-max px-2 py-1">
                    <MapPin size={12} />
                    {project.location}
                 </div>
                 <h4 className="text-lg font-bold text-white leading-snug uppercase group-hover:text-brand-accent transition-colors">
                    {project.title}
                 </h4>
                 <p className="text-xs font-medium text-slate-300 line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {project.desc}
                 </p>
              </div>

              <Link href={`/du-an/${project.id}`} className="absolute inset-0 z-10" />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-16 text-center md:hidden">
           <Link
             href="/du-an"
             className="inline-flex items-center gap-4 btn-corporate"
           >
              Tất cả dự án
              <MoveRight size={20} />
           </Link>
        </div>
      </div>
    </section>
  );
}
