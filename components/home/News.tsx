"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MoveRight, Plus } from "lucide-react";
import { motion } from "motion/react";

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Delta Group lập cú đúp danh hiệu 2025: Top 50 doanh nghiệp xuất sắc",
    date: "24/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-636x417-5.png",
    category: "CÔNG TY",
  },
  {
    id: 2,
    title: "Sài Gòn Valve đồng hành cùng thế hệ kỹ sư tương lai",
    date: "20/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg",
    category: "SỰ KIỆN",
  },
  {
    id: 3,
    title: "Giải pháp quan trắc nước thông minh ứng dụng công nghệ 4G/LTE",
    date: "15/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png",
    category: "CÔNG NGHỆ",
  },
];

export default function News() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="mb-20 text-center space-y-4">
          <h2 className="text-4xl font-bold text-brand-secondary tracking-tight uppercase">
            Tin tức
          </h2>
          <div className="mx-auto h-1 w-20 bg-brand-primary"></div>
          <p className="mx-auto max-w-2xl text-muted-foreground font-medium">
            Cập nhật những thông tin mới nhất về dự án, công nghệ và các hoạt động của Sài Gòn Valve.
          </p>
        </div>

        {/* News Grid - Delta style overlay */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_ITEMS.map((news, i) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[300px] overflow-hidden cursor-pointer"
            >
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-brand-accent">
                   {news.category}
                   <span className="h-1 w-1 rounded-full bg-white/40"></span>
                   {news.date}
                </div>
                <h3 className="text-[15px] font-bold text-white leading-tight transition-colors group-hover:text-brand-accent line-clamp-2 uppercase">
                   {news.title}
                </h3>
              </div>

              <Link href={`/tin-tuc/${news.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">Đọc tiếp {news.title}</span>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 text-center">
           <Link 
             href="/tin-tuc"
             className="inline-flex items-center gap-2 btn-corporate"
           >
              TẤT CẢ TIN TỨC
              <MoveRight size={18} />
           </Link>
        </div>
      </div>
    </section>
  );
}
