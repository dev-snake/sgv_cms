"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, ExternalLink, MoveRight } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "LẮP ĐẶT HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TẠI CẦN THƠ",
    location: "Cần Thơ, Việt Nam",
    date: "16/07/2025",
    category: "Quan trắc nước",
    image: "https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/z6809258125215_0bfd24b1d2a12247ce2fe99f8bc81598-306x234-5.jpg",
    desc: "Cần Thơ là đô thị trung tâm của vùng Đồng bằng sông Cửu Long.",
  },
  {
    id: 2,
    title: "DỰ ÁN LẮP ĐẶT HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TẠI HUẾ",
    location: "Huế, Việt Nam",
    date: "16/07/2025",
    category: "Quan trắc nước",
    image: "https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/495000495_642796432091557_8112711184192443493_n-306x234-5.jpg",
    desc: "Triển khai hệ thống quan trắc nước tại thành phố Huế.",
  },
  {
    id: 3,
    title: "DỰ ÁN LẮP ĐẶT VAN GIẢM ÁP ĐA HẰNG SỐ TẠI TP. HỒ CHÍ MINH",
    location: "TP. Hồ Chí Minh, Việt Nam",
    date: "18/12/2024",
    category: "Van giảm áp",
    image: "https://saigonvalve.vn/uploads/files/2024/12/18/thumbs/z6137753576652_79e515094e627d29c077813506e5c349-306x234-5.jpg",
    desc: "Tối ưu hóa áp lực nước cho mạng lưới cấp nước Sawaco.",
  },
  {
    id: 4,
    title: "DỰ ÁN LẮP ĐẶT VAN GIẢM ÁP ĐA HẰNG SỐ SV3-PRV TẠI QUẢNG NINH",
    location: "Quảng Ninh, Việt Nam",
    date: "17/12/2024",
    category: "Van giảm áp",
    image: "https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/H-nh-nh-qu-ng-ninh-306x234-5.png",
    desc: "Ổn định áp lực nước cho cư dân tỉnh Quảng Ninh.",
  },
];

export default function ProjectsPage() {
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
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {PROJECTS.map((project, i) => (
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
                         src={project.image}
                         alt={project.title}
                         fill
                         className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>

                   <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                         <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-brand-primary">
                            <span>{project.category}</span>
                            <span className="text-muted-foreground">{project.date}</span>
                         </div>
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-snug line-clamp-2 group-hover:text-brand-cyan transition-colors">
                            {project.title}
                         </h3>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                            <MapPin size={12} className="text-brand-cyan" />
                            {project.location}
                         </div>
                      </div>

                      <Link 
                        href={`/du-an/${project.id}`}
                        className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-cyan transition-colors pt-2 border-t border-slate-50"
                      >
                         XEM CHI TIẾT <ExternalLink size={12} />
                      </Link>
                   </div>
                </motion.div>
             ))}
           </div>
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
              <Link href="/lien-he" className="shrink-0 inline-flex items-center gap-4 px-12 py-5 bg-brand-cyan text-slate-950 font-black uppercase tracking-[0.2em] hover:bg-white transition-all transform hover:-translate-y-1">
                LIÊN HỆ CHUYÊN GIA <MoveRight size={20} />
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
