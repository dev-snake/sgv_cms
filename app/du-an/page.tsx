"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, CalendarDays, ExternalLink, MoveRight, Layers } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "LẮP ĐẶT HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TẠI CẦN THƠ",
    location: "Cần Thơ, Việt Nam",
    date: "16/07/2025",
    category: "Quan trắc nước",
    image: "https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/z6809258125215_0bfd24b1d2a12247ce2fe99f8bc81598-306x234-5.jpg",
    desc: "Cần Thơ là đô thị trung tâm của vùng Đồng bằng sông Cửu Long, nơi nước sông đóng vai trò then chốt trong sinh hoạt và phát triển kinh tế.",
  },
  {
    id: 2,
    title: "DỰ ÁN LẮP ĐẶT HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TẠI HUẾ",
    location: "Huế, Việt Nam",
    date: "16/07/2025",
    category: "Quan trắc nước",
    image: "https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/495000495_642796432091557_8112711184192443493_n-306x234-5.jpg",
    desc: "SÀI GÒN VALVE triển khai dự án lắp đặt hệ thống quan trắc chất lượng nước tại Huế – thành phố du lịch nổi tiếng gắn liền với sông Hương và sông Bồ.",
  },
  {
    id: 3,
    title: "DỰ ÁN LẮP ĐẶT VAN GIẢM ÁP ĐA HẰNG SỐ TẠI TP. HỒ CHÍ MINH",
    location: "TP. Hồ Chí Minh, Việt Nam",
    date: "18/12/2024",
    category: "Van giảm áp",
    image: "https://saigonvalve.vn/uploads/files/2024/12/18/thumbs/z6137753576652_79e515094e627d29c077813506e5c349-306x234-5.jpg",
    desc: "Dự án lắp đặt van giảm áp SV3-PRV giúp tối ưu hóa áp lực nước để áp lực nước luôn duy trì ổn định trong mạng lưới cấp nước.",
  },
  {
    id: 4,
    title: "DỰ ÁN LẮP ĐẶT VAN GIẢM ÁP ĐA HẰNG SỐ SV3-PRV TẠI QUẢNG NINH",
    location: "Quảng Ninh, Việt Nam",
    date: "17/12/2024",
    category: "Van giảm áp",
    image: "https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/H-nh-nh-qu-ng-ninh-306x234-5.png",
    desc: "Là một trong những tỉnh thành phát triển có diện tích lớn và quy mô dân số cao, vấn đề đặt ra cho doanh nghiệp cấp nước làm sao để nguồn nước của người dân luôn ổn định.",
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
