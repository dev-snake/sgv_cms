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
    title: "LẮP ĐẶT HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TẠI CẦN THƠ",
    location: "Cần Thơ, Việt Nam",
    desc: "Cần Thơ là đô thị trung tâm của vùng Đồng bằng sông Cửu Long, nơi nước sông đóng vai trò then chốt trong sinh hoạt và phát triển kinh tế.",
    image: "https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/z6809258125215_0bfd24b1d2a12247ce2fe99f8bc81598-306x234-5.jpg",
    client: "Cấp nước Cần Thơ",
    year: "2025",
    field: "Quan trắc nước",
    content: `Dự án lắp đặt hệ thống quan trắc chất lượng nước tại Cần Thơ – bước tiến quan trọng trong giám sát nguồn nước bền vững.`,
    solutions: [
      "Hệ thống cảm biến đo chất lượng nước",
      "Datalogger SV1-DAQ truyền dữ liệu 4G/LTE",
      "Phần mềm giám sát trực tuyến SCADA",
    ],
    results: [
      "Giám sát liên tục 24/7",
      "Cảnh báo sớm ô nhiễm nguồn nước",
      "Quản lý từ xa hiệu quả",
    ],
  },
  {
    id: "2",
    title: "DỰ ÁN LẮP ĐẶT HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TẠI HUẾ",
    location: "Huế, Việt Nam",
    desc: "SÀI GÒN VALVE triển khai dự án lắp đặt hệ thống quan trắc chất lượng nước tại Huế – thành phố du lịch nổi tiếng gắn liền với sông Hương và sông Bồ.",
    image: "https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/495000495_642796432091557_8112711184192443493_n-306x234-5.jpg",
    client: "Cấp nước Huế",
    year: "2025",
    field: "Quan trắc nước",
    content: `Dự án lắp đặt hệ thống quan trắc chất lượng nước tại Huế – giải pháp bảo vệ nguồn nước bền vững.`,
    solutions: [
      "Thiết bị đo pH, độ đục, Clo",
      "Hệ thống truyền dữ liệu IoT",
      "Phần mềm quản lý tập trung",
    ],
    results: [
      "Đảm bảo chất lượng nước đầu vào",
      "Phát hiện sớm sự cố nguồn nước",
      "Tiết kiệm chi phí vận hành",
    ],
  },
  {
    id: "3",
    title: "DỰ ÁN LẮP ĐẶT VAN GIẢM ÁP ĐA HẰNG SỐ TẠI TP. HỒ CHÍ MINH",
    location: "TP. Hồ Chí Minh, Việt Nam",
    desc: "Thành phố Hồ Chí Minh là thành phố lớn nhất Việt Nam về quy mô dân số và là trung tâm kinh tế, giải trí, một trong hai trung tâm văn hóa và giáo dục quan trọng tại Việt Nam.",
    image: "https://saigonvalve.vn/uploads/files/2024/12/18/thumbs/z6137753576652_79e515094e627d29c077813506e5c349-306x234-5.jpg",
    client: "Sawaco TP.HCM",
    year: "2024",
    field: "Van giảm áp",
    content: `Thành phố Hồ Chí Minh có diện tích khoảng 2.095 km², là trung tâm kinh tế, văn hóa và công nghiệp lớn nhất Việt Nam. Với hơn 10 triệu người (bao gồm dân cư chính thức và tạm trú), nhu cầu sử dụng nước sạch tại TP.HCM ngày càng gia tăng mạnh mẽ.

Hiện Trạng Hệ Thống Cấp Nước Tại TP.HCM:
- Áp lực nước không đồng đều tại các khu vực khác nhau.
- Rò rỉ nước do áp lực vượt mức trong đường ống, gây thất thoát nguồn tài nguyên quan trọng.
- Nhu cầu đảm bảo sự ổn định áp lực nước để phục vụ cư dân trong giờ cao điểm.

Dự án lắp đặt van giảm áp SV3-PRV giúp tối ưu hóa áp lực nước để áp lực nước luôn duy trì ổn định trong mạng lưới cấp nước, giảm thiểu sự dao động áp suất. Bên cạnh đó giảm thất thoát nước, giảm áp lực dư thừa làm hạn chế rò rỉ và vỡ đường ống. Ngoài ra còn giúp nâng cao hiệu suất cấp nước, đảm bảo nguồn cấp nước sạch được phân phối hiệu quả, đặc biệt ở các khu vực xa trung tâm.`,
    solutions: [
      "Van giảm áp đa hằng số SV3-PRV",
      "Hệ thống giám sát áp lực từ xa",
      "Phần mềm theo dõi van giảm áp",
    ],
    results: [
      "Duy trì áp lực ổn định trong mạng lưới",
      "Giảm thất thoát nước đáng kể",
      "Tăng tuổi thọ đường ống và thiết bị",
    ],
  },
  {
    id: "4",
    title: "DỰ ÁN LẮP ĐẶT VAN GIẢM ÁP ĐA HẰNG SỐ SV3-PRV TẠI QUẢNG NINH",
    location: "Quảng Ninh, Việt Nam",
    desc: "Là một trong những tỉnh thành phát triển có diện tích lớn và quy mô dân số cao, vấn đề đặt ra cho doanh nghiệp cấp nước làm sao để nguồn nước của người dân luôn ổn định.",
    image: "https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/H-nh-nh-qu-ng-ninh-306x234-5.png",
    client: "Cấp nước Quảng Ninh",
    year: "2024",
    field: "Van giảm áp",
    content: `Dự án lắp đặt van giảm áp đa hằng số SV3-PRV tại Quảng Ninh giúp ổn định áp lực nước cho người dân.`,
    solutions: [
      "Van giảm áp đa hằng số SV3-PRV",
      "Hệ thống cảm biến áp suất",
      "Phần mềm giám sát trực tuyến",
    ],
    results: [
      "Áp lực nước ổn định 24/7",
      "Giảm rò rỉ đường ống",
      "Nâng cao chất lượng cấp nước",
    ],
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
                    <div className="whitespace-pre-line">{project.content}</div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic pt-6 border-b border-slate-100 pb-4">Giải pháp kỹ thuật</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50 p-12 border-t-4 border-brand-secondary">
                       <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-brand-primary uppercase tracking-widest">Hạng mục cung cấp</h4>
                          <ul className="space-y-2 text-xs font-bold uppercase tracking-tight">
                             {project.solutions.map((item, i) => (
                               <li key={i}>• {item}</li>
                             ))}
                          </ul>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-brand-primary uppercase tracking-widest">Kết quả đạt được</h4>
                          <ul className="space-y-2 text-xs font-bold uppercase tracking-tight">
                             {project.results.map((item, i) => (
                               <li key={i}>• {item}</li>
                             ))}
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
