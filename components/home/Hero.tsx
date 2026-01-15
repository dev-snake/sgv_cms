"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    image: "https://saigonvalve.vn/uploads/files/2024/07/23/NH-PH-N-PH-I-C-QUY-N-22-.png",
    fallback: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000",
    title: "KIẾN TẠO",
    highlight: "HẠ TẦNG NƯỚC",
    titleSuffix: "THÔNG MINH",
    desc: "Sài Gòn Valve đồng hành cùng doanh nghiệp Việt trong việc tối ưu hóa mạng lưới cấp thoát nước bằng công nghệ IoT và van công nghiệp chất lượng cao.",
    accent: "Giải pháp Công nghiệp Hàng đầu"
  },
  {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000",
    fallback: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000",
    title: "GIẢI PHÁP",
    highlight: "CÔNG NGHỆ IOT",
    titleSuffix: "TIÊN PHONG",
    desc: "Số hóa hạ tầng kỹ thuật với hệ thống Datalogger và phần mềm giám sát thông minh, giúp quản lý dữ liệu thời gian thực và vận hành hiệu quả.",
    accent: "Quản lý Nước Thông minh"
  },
  {
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000",
    fallback: "https://images.unsplash.com/photo-1516937941184-75140537280d?auto=format&fit=crop&q=80&w=2000",
    title: "THIẾT BỊ",
    highlight: "CHUẨN QUỐC TẾ",
    titleSuffix: "CHÍNH HÃNG",
    desc: "Phân phối độc quyền các thương hiệu van và thiết bị điều khiển hàng đầu từ Nhật Bản, Hàn Quốc và EU, đảm bảo bền bỉ trong mọi điều kiện.",
    accent: "Tiêu chuẩn Chất lượng Toàn cầu"
  }
];

export default function Hero() {
  const [current, setCurrent] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[800px] w-full overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={SLIDES[current].image}
            alt="Sài Gòn Valve Industry"
            fill
            className="object-cover opacity-50"
            priority
            onError={(e: any) => {
              e.target.src = SLIDES[current].fallback;
            }}
          />
          <div className="absolute inset-0 bg-carbon mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-transparent to-slate-950/95"></div>
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-10 mx-auto h-full px-4 lg:px-8">
        <div className="flex h-full flex-col justify-center pt-24">
          
          <div className="max-w-5xl space-y-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-brand-cyan backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
                  {SLIDES[current].accent}
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight uppercase">
                  {SLIDES[current].title} <br />
                  <span className="text-brand-cyan drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">{SLIDES[current].highlight}</span> <br />
                  <span className="text-white/90">{SLIDES[current].titleSuffix}</span>
                </h1>

                <p className="max-w-2xl text-xl text-slate-300 font-medium leading-relaxed border-l-8 border-brand-cyan pl-10">
                  {SLIDES[current].desc}
                </p>

                <div className="flex flex-col sm:flex-row gap-8 pt-8">
                  <Link 
                    href="/san-pham" 
                    className="relative group overflow-hidden inline-flex items-center justify-center gap-6 px-14 py-6 bg-brand-cyan text-slate-950 text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                  >
                    <span className="relative z-10">KHÁM PHÁ GIẢI PHÁP</span>
                    <MoveRight size={20} className="relative z-10 transition-transform group-hover:translate-x-2" />
                    <div className="absolute bottom-0 left-0 h-0 w-full bg-white transition-all duration-300 group-hover:h-full"></div>
                  </Link>
                  <Link 
                    href="/gioi-thieu" 
                    className="inline-flex items-center justify-center gap-6 px-14 py-6 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] border border-white/20 hover:bg-white hover:text-slate-950 transition-all backdrop-blur-sm"
                  >
                    VỀ CHÚNG TÔI
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="flex items-center gap-6 pt-16">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={cn(
                    "h-1.5 transition-all duration-500 rounded-full",
                    current === i ? "w-20 bg-brand-cyan" : "w-10 bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 text-white/40"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ height: ["20%", "60%", "20%"] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 bg-white/40 rounded-full"
          />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.5em]">CUỘN XUỐNG</span>
      </motion.div>
    </section>
  );
}
