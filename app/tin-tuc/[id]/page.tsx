"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { 
  CalendarDays, 
  User, 
  Clock, 
  Share2, 
  ChevronRight, 
  ArrowLeft,
  Facebook,
  Linkedin,
  Twitter,
  MoveRight,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";

const NEWS_LIST = [
  {
    id: "1",
    title: "Thiết bị thu nhận và truyền dữ liệu DATALOGGER SV1-DAQ",
    desc: "SV1-DAQ là thiết bị thu nhận và truyền dữ liệu thông minh, được thiết kế đặc biệt cho các hệ thống giám sát môi trường, ngành nước và hạ tầng kỹ thuật, ứng dụng mạng 4G/LTE.",
    date: "24/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-636x417-5.png",
    category: "CÔNG NGHỆ",
    author: "Admin",
    readTime: "5 phút",
  },
  {
    id: "2",
    title: "HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TỰ ĐỘNG",
    desc: "Giải pháp tích hợp các thiết bị đo lường, truyền thông và phần mềm điều khiển nhằm giám sát liên tục và tự động các chỉ số nước tại hiện trường một cách chính xác nhất.",
    date: "24/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg",
    category: "DỰ ÁN",
    author: "Kỹ sư SGV",
    readTime: "8 phút",
  },
];

export default function NewsDetailPage() {
  const params = useParams();
  const article = NEWS_LIST.find(n => n.id === params.id) || NEWS_LIST[0];

  return (
    <div className="flex flex-col min-h-screen bg-white pt-24">
      {/* Article Header */}
      <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="space-y-8">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
                 <span className="bg-brand-primary text-white px-3 py-1 shadow-lg">{article.category}</span>
                 <div className="flex items-center gap-2 text-muted-foreground"><CalendarDays size={14} className="text-brand-primary" /> {article.date}</div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">{article.title}</h1>
              <div className="flex items-center gap-6 text-[11px] font-bold text-muted-foreground border-l-4 border-brand-primary pl-6">
                 <div className="flex items-center gap-2 uppercase tracking-widest"><User size={14} className="text-brand-primary" /> {article.author}</div>
                 <div className="flex items-center gap-2 uppercase tracking-widest"><Clock size={14} className="text-brand-primary" /> {article.readTime} đọc</div>
              </div>
           </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="relative aspect-video w-full overflow-hidden shadow-2xl mb-16 transition-all duration-1000 group">
              <Image
                 src={article.image}
                 alt={article.title}
                 fill
                 className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-brand-primary/10 opacity-30"></div>
           </div>

           <div className="space-y-10">
              <p className="text-2xl text-slate-900 font-bold leading-relaxed border-l-8 border-slate-100 pl-10 italic">
                 {article.desc}
              </p>

              <div className="prose prose-lg max-w-none text-muted-foreground font-medium leading-loose space-y-8">
                 <p>Trong bối cảnh đô thị hóa và nhu cầu quản lý tài nguyên nước ngày càng cấp thiết, việc ứng dụng các công nghệ thu nhận dữ liệu hiện đại là yếu tố then chốt. Sài Gòn Valve tự hào mang đến giải pháp DATALOGGER SV1-DAQ – một đột phá trong ngành nước thông minh.</p>
                 
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic pt-6 border-b border-slate-100 pb-4">Công nghệ truyền tin đa phương thức</h3>
                 <p>Thiết bị hỗ trợ đa dạng mạng viễn thông từ 2G, 3G đến 4G/LTE và các mạng IoT chuyên dụng như NBIoT, LoRaWAN. Điều này đảm bảo tính liên tục của dữ liệu ngay cả ở những khu vực hẻo lánh hoặc tín hiệu yếu.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16 bg-slate-50 p-10 border-t-4 border-brand-primary">
                    <div className="space-y-4">
                       <h4 className="text-sm font-black text-brand-secondary uppercase tracking-widest">Tính năng kỹ thuật</h4>
                       <ul className="space-y-2 text-xs font-bold uppercase tracking-tight">
                          <li>• 8 Ngõ vào Analog 4-20mA / 0-10V</li>
                          <li>• 4 Ngõ vào Digital (Đếm xung)</li>
                          <li>• Cổng RS485 Modbus RTU / TCP</li>
                          <li>• Chống nước tiêu chuẩn IP68</li>
                       </ul>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-sm font-black text-brand-secondary uppercase tracking-widest">Ứng dụng chính</h4>
                       <ul className="space-y-2 text-xs font-bold uppercase tracking-tight">
                          <li>• Giám sát áp lực mạng lưới</li>
                          <li>• Theo dõi lưu lượng tổng</li>
                          <li>• Quan trắc chất lượng nước</li>
                          <li>• Quản lý thất thoát (NRW)</li>
                       </ul>
                    </div>
                 </div>

                 <p>Sài Gòn Valve cam kết đồng hành cùng khách hàng trong suốt quá trình triển khai hệ thống, từ khâu lắp đặt thiết bị đến tích hợp lên phần mềm quản trị tập trung SCADA.</p>
              </div>

              {/* Share & Tags */}
              <div className="pt-16 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                 <div className="flex gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Chia sẻ bài viết</span>
                    <div className="flex gap-3">
                       {[Facebook, Linkedin, Twitter].map((Icon, i) => (
                          <button key={i} className="h-8 w-8 flex items-center justify-center border border-slate-100 text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                             <Icon size={14} />
                          </button>
                       ))}
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary px-4 py-2 hover:bg-brand-primary hover:text-white transition-all">
                       <Bookmark size={14} /> Lưu bài viết
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand-primary transition-colors">
                       <Share2 size={14} /> Phản hồi
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Relate News */}
      <section className="py-24 bg-slate-50">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-16 flex items-center justify-between">
               <h2 className="text-2xl font-black uppercase tracking-tight text-brand-secondary">BÀI VIẾT LIÊN QUAN</h2>
               <Link href="/tin-tuc" className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:translate-x-2 transition-transform inline-flex items-center gap-2">TẤT CẢ TIN TỨC <MoveRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {NEWS_LIST.map((news) => (
                  <Link key={news.id} href={`/tin-tuc/${news.id}`} className="group bg-white p-6 space-y-6 shadow-sm hover:shadow-2xl transition-all">
                     <div className="relative aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <Image src={news.image} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                     </div>
                     <div className="space-y-3">
                        <div className="text-[9px] font-black text-brand-primary uppercase tracking-widest">{news.category}</div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors uppercase line-clamp-2 leading-tight">{news.title}</h4>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
