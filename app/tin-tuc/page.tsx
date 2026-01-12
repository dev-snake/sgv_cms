"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { 
  CalendarDays, 
  ArrowRight, 
  Clock, 
  User, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Search, 
  Share2, 
  TrendingUp,
  Tag,
  ChevronRight
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const NEWS_LIST = [
  {
    id: 1,
    title: "Thiết bị thu nhận và truyền dữ liệu DATALOGGER SV1-DAQ",
    desc: "SV1-DAQ là thiết bị thu nhận và truyền dữ liệu thông minh, được thiết kế đặc biệt cho các hệ thống giám sát môi trường, ngành nước và hạ tầng kỹ thuật, ứng dụng mạng 4G/LTE.",
    date: "24/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-636x417-5.png",
    category: "CÔNG NGHỆ",
    author: "Admin",
    readTime: "5 phút",
    featured: true,
  },
  {
    id: 2,
    title: "HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TỰ ĐỘNG",
    desc: "Giải pháp tích hợp các thiết bị đo lường, truyền thông và phần mềm điều khiển nhằm giám sát liên tục và tự động các chỉ số nước tại hiện trường một cách chính xác nhất.",
    date: "24/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg",
    category: "DỰ ÁN",
    author: "Kỹ sư SGV",
    readTime: "8 phút",
  },
  {
    id: 3,
    title: "Delta Group lập cú đúp danh hiệu 2025: Top 50 doanh nghiệp xuất sắc",
    desc: "Khẳng định vị thế dẫn đầu trong lĩnh vực xây dựng và hạ tầng tại Việt Nam với những dự án trọng điểm quốc gia.",
    date: "20/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
    category: "CÔNG TY",
    author: "Ban Truyền Thông",
    readTime: "3 phút",
  },
  {
    id: 4,
    title: "Xu hướng tự động hóa trong ngành nước năm 2025",
    desc: "Tìm hiểu về các công nghệ mới nhất đang thay đổi cách chúng ta quản lý tài nguyên nước bền vững.",
    date: "15/06/2025",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    category: "CÔNG NGHỆ",
    author: "Admin",
    readTime: "6 phút",
  },
  {
    id: 5,
    title: "SGV ký kết hợp tác chiến lược với đối tác Nhật Bản",
    desc: "Mở rộng mạng lưới phân phối và chuyển giao công nghệ van bướm cao cấp đạt chuẩn quốc tế.",
    date: "10/06/2025",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
    category: "HỢP TÁC",
    author: "Ban Lãnh Đạo",
    readTime: "4 phút",
  },
  {
    id: 6,
    title: "Hướng dẫn bảo trì van công nghiệp định kỳ",
    desc: "Quy trình chuẩn giúp kéo dài tuổi thọ thiết bị và đảm bảo an toàn vận hành hệ thống.",
    date: "05/06/2025",
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=800",
    category: "KỸ THUẬT",
    author: "Kỹ sư SGV",
    readTime: "10 phút",
  },
  {
    id: 7,
    title: "Cảm biến áp suất SV-Press: Độ chính xác vượt trội",
    desc: "Thế hệ cảm biến mới tích hợp công nghệ bù nhiệt giúp đo lường ổn định trong mọi môi trường.",
    date: "01/06/2025",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800",
    category: "SẢN PHẨM",
    author: "Phòng R&D",
    readTime: "5 phút",
  },
  {
    id: 8,
    title: "SGV tham gia triển lãm VietWater 2025",
    desc: "Giới thiệu bộ giải pháp trọn gói từ thiết bị đến phần mềm quản lý mạng lưới cấp nước thông minh.",
    date: "28/05/2025",
    image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800",
    category: "SỰ KIỆN",
    author: "Phòng Marketing",
    readTime: "2 phút",
  },
];

const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const featuredNews = NEWS_LIST.find(n => n.featured) || NEWS_LIST[0];
  const otherNews = NEWS_LIST.filter(n => n.id !== featuredNews.id);
  
  const totalPages = Math.ceil(otherNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNews = otherNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Header */}
      <section className="relative pt-40 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000"
            alt="News Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
           <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-3 bg-brand-primary/20 border border-brand-primary/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary backdrop-blur-md">
                 Truyền thông & Tin tức
              </div>
              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight uppercase leading-[0.9]">
                TRUNG TÂM <br /> 
                <span className="text-brand-accent">TIÊU ĐIỂM</span>
              </h1>
              <p className="text-xl text-slate-400 font-medium max-w-xl">
                Cập nhật những tin tức mới nhất về công nghệ, dự án và xu hướng trong ngành nước và hạ tầng công nghiệp.
              </p>
           </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-white shadow-2xl rounded-sm border border-slate-100 group"
          >
            <div className="relative aspect-video lg:aspect-auto h-full overflow-hidden">
              <Image
                src={featuredNews.image}
                alt={featuredNews.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute top-8 left-8">
                <span className="bg-brand-primary px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl backdrop-blur-sm bg-opacity-90">
                  {featuredNews.category}
                </span>
              </div>
            </div>
            <div className="p-12 lg:p-20 flex flex-col justify-center space-y-8 bg-white relative">
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
                <span className="flex items-center gap-2"><CalendarDays size={14} /> {featuredNews.date}</span>
                <span className="flex items-center gap-2"><User size={14} /> {featuredNews.author}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase leading-tight group-hover:text-brand-primary transition-colors">
                <Link href={`/tin-tuc/${featuredNews.id}`}>{featuredNews.title}</Link>
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-8 border-brand-primary/20 pl-8">
                {featuredNews.desc}
              </p>
              <div className="pt-6">
                <Link 
                  href={`/tin-tuc/${featuredNews.id}`}
                  className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 group/btn"
                >
                  ĐỌC CHI TIẾT <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-3 text-brand-primary" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20">
            
            <div className="lg:w-2/3 space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <AnimatePresence mode="popLayout">
                  {currentNews.map((news) => (
                    <motion.article 
                      key={news.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col space-y-6 group"
                    >
                      <div className="relative aspect-4/3 overflow-hidden shadow-lg border border-slate-100">
                        <Image
                          src={news.image}
                          alt={news.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/95 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand-primary shadow-sm">
                            {news.category}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          <span className="flex items-center gap-1.5"><CalendarDays size={12} className="text-brand-primary" /> {news.date}</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-brand-primary" /> {news.readTime}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-primary transition-colors tracking-tight uppercase leading-tight min-h-12">
                          <Link href={`/tin-tuc/${news.id}`}>{news.title}</Link>
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-medium">
                          {news.desc}
                        </p>
                        <Link 
                          href={`/tin-tuc/${news.id}`}
                          className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-secondary border-b border-brand-secondary/20 pb-1 hover:text-brand-primary hover:border-brand-primary transition-all"
                        >
                          XEM THÊM <ChevronRight size={14} />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-16 border-t border-slate-100">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            href="#" 
                            isActive={currentPage === i + 1}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/3 space-y-16">
              <div className="space-y-12 sticky top-32">
                
                {/* Search */}
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="TÌM KIẾM TIN TỨC..." 
                    className="w-full bg-slate-50 px-6 py-5 pr-14 text-[10px] font-black uppercase tracking-widest border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                  />
                  <Search size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                </div>

                {/* Event Timeline */}
                <div className="bg-white p-10 space-y-8 border shadow-sm rounded-sm overflow-hidden relative">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary"></div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-100 pb-5 mb-8 flex items-center gap-3">
                     <TrendingUp size={16} className="text-brand-primary" /> DÒNG SỰ KIỆN
                   </h4>
                   <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                      {[
                        { date: "THÁNG 06, 2025", title: "Hội thảo Tech-Water 2025: Giải pháp quản lý thông minh" },
                        { date: "THÁNG 05, 2025", title: "SGV chính thức phân phối dòng van an toàn màng PTFE cao cấp" },
                        { date: "THÁNG 04, 2025", title: "Triển khai dự án Scada cho mạng lưới cấp nước Thủ Đức" },
                      ].map((item, i) => (
                        <div key={i} className="relative pl-10 group">
                           <div className="absolute left-0 top-1.5 h-[24px] w-[24px] rounded-full bg-white border-2 border-slate-200 flex items-center justify-center transition-all group-hover:border-brand-primary">
                              <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-brand-primary transition-all"></div>
                           </div>
                           <div className="text-[8px] font-black text-brand-primary uppercase tracking-widest mb-1">{item.date}</div>
                           <Link href="#" className="block font-black text-slate-900 group-hover:text-brand-primary transition-colors uppercase leading-[1.3] text-xs tracking-tight">{item.title}</Link>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Newsletter */}
                <div className="bg-slate-900 p-12 text-white space-y-8 relative overflow-hidden group rounded-sm">
                   <div className="absolute top-0 right-0 h-full w-2 bg-brand-accent transition-all group-hover:w-4"></div>
                   <h4 className="text-2xl font-black uppercase leading-tight tracking-tighter">
                     ĐĂNG KÝ BẢN TIN <br />
                     <span className="text-brand-accent">KỸ THUẬT</span>
                   </h4>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                     Nhận ngay các tài liệu catalogue và hướng dẫn vận hành mới nhất.
                   </p>
                   <div className="space-y-4">
                      <input 
                        type="email" 
                        placeholder="EMAIL@CUA-BAN.COM" 
                        className="w-full bg-white/5 px-6 py-5 text-[10px] font-black uppercase tracking-widest placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all border border-white/10" 
                      />
                      <button className="w-full bg-brand-accent py-5 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-white transition-all shadow-xl shadow-brand-accent/20">
                        Đăng ký ngay
                      </button>
                   </div>
                </div>

                {/* Footer Social */}
                <div className="pt-10 flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mr-4">FOLLOW SGV</span>
                   <div className="flex gap-3">
                      {[Facebook, Linkedin, Youtube].map((Icon, i) => (
                         <a key={i} href="#" className="h-10 w-10 flex items-center justify-center border border-slate-100 text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all rounded-sm bg-white shadow-sm">
                            <Icon size={16} />
                         </a>
                      ))}
                   </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </div>
  );
}
