"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_ROUTES } from "@/constants/routes";

const SOLUTIONS = [
  {
    id: "water",
    brand: "SEVAL WATER",
    title: "QUẢN LÝ CẤP NƯỚC THÔNG MINH",
    subtitle: "Smart Water Management Systems",
    image: "/images/hero/hero-iot-1.png",
    href: SITE_ROUTES.SOLUTIONS.WATER_MANAGEMENT
  },
  {
    id: "farm",
    brand: "SEVAL FARM",
    title: "NÔNG NGHIỆP CHÍNH XÁC",
    subtitle: "Precision Agriculture IoT",
    image: "/images/hero/hero-iot-2.png",
    href: SITE_ROUTES.SOLUTIONS.AGRICULTURE
  },
  {
    id: "aqua",
    brand: "SEVAL AQUA",
    title: "QUAN TRẮC VÀ NUÔI TRỒNG THỦY SẢN",
    subtitle: "Aquaculture Monitoring",
    image: "/images/hero/hero-iot-3.png",
    href: SITE_ROUTES.SOLUTIONS.AQUACULTURE
  },
  {
    id: "hydro",
    brand: "SEVAL HYDRO",
    title: "QUẢN LÝ THỦY LỢI THÔNG MINH",
    subtitle: "Smart Irrigation & Hydrology",
    image: "/images/banners/news-banner.png",
    href: "#"
  },
  {
    id: "building",
    brand: "SEVAL BUILDING",
    title: "QUẢN LÝ TÒA NHÀ & HẠ TẦNG ĐÔ THỊ",
    subtitle: "Smart Building & Infrastructure",
    image: "/images/banners/recruitment-banner.png",
    href: "#"
  }
];

export default function Solutions() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SOLUTIONS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="bg-[#001d4a] overflow-hidden">
      {/* Header Area */}
      <div className="pt-24 pb-12 text-center relative z-20">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-black text-white tracking-[0.2em] mb-4"
        >
          GIẢI PHÁP
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest"
        >
          <span>Trang chủ</span>
          <span>/</span>
          <span className="text-white">Giải pháp</span>
        </motion.div>
      </div>

      {/* Interactive Strips */}
      <div className="flex flex-col lg:flex-row h-[700px] w-full border-t border-white/10 items-stretch">
        {SOLUTIONS.map((item, idx) => (
          <motion.div
            key={item.id}
            onMouseEnter={() => {
              setActiveIndex(idx);
              setIsPaused(true);
            }}
            onMouseLeave={() => setIsPaused(false)}
            animate={{ 
              flex: activeIndex === idx ? 3.5 : 1,
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1],
              layout: { duration: 0.8 }
            }}
            className={cn(
              "relative overflow-hidden group cursor-pointer border-r border-white/5 last:border-0 h-[700px]",
              activeIndex === idx ? "z-10" : "z-0"
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={item.image}
                alt={item.brand}
                fill
                className={cn(
                  "object-cover transition-transform duration-1000",
                  activeIndex === idx ? "scale-110" : "scale-100"
                )}
              />
            </div>

            {/* Hover Overlay (Card revealing from top) */}
            <AnimatePresence mode="wait">
              {activeIndex === idx && (
                <motion.div
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12 text-center bg-[#001d4a]/95 backdrop-blur-sm"
                >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mb-12 relative group/logo"
                    >
                      {/* Premium Logo Container */}
                      <div className="relative h-24 w-64 p-6 bg-white rounded-sm shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-4 flex items-center justify-center">
                        <Image
                          src="https://saigonvalve.vn/uploads/files/2024/08/05/NH-_PH-N_PH-I_-C_QUY-N__25_-removebg-preview.png"
                          alt="Sài Gòn Valve Logo"
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-brand-accent"></div>
                        <div className="size-1 rounded-full bg-brand-accent"></div>
                        <div className="h-px w-8 bg-brand-accent"></div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.5em]">
                          {item.subtitle}
                        </h3>
                        <p className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                          {item.brand} <br />
                          <span className="text-brand-accent">{item.title}</span>
                        </p>
                      </div>
                      
                      <div className="pt-10">
                        <Link 
                          href={item.href}
                          className="group/btn relative inline-flex items-center gap-4 px-12 py-4 bg-white text-[#001d4a] font-black text-[10px] tracking-[0.2em] uppercase transition-all hover:bg-brand-primary hover:text-white shadow-2xl overflow-hidden"
                        >
                          <span className="relative z-10">XEM CHI TIẾT</span>
                          <ChevronRight size={14} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Default Caption (Stays at the bottom or rotates) */}
            <div className={cn(
              "absolute inset-x-0 bottom-0 p-8 pt-20 transition-opacity duration-500 bg-linear-to-t from-slate-950/80 to-transparent",
              activeIndex === idx ? "opacity-0" : "opacity-100"
            )}>
              <div className="lg:-rotate-90 lg:origin-left lg:absolute lg:left-8 lg:bottom-12 lg:whitespace-nowrap lg:transform lg:translate-y-full">
                <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] mb-4">
                  {item.brand}
                </p>
                <div className="flex items-center gap-3">
                   <div className="w-1 h-3 bg-brand-accent"></div>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest text-shadow">
                     {item.title}
                   </h4>
                </div>
              </div>
            </div>
            
            {/* Border Accent */}
            <div className={cn(
              "absolute top-0 left-0 w-full h-1 bg-brand-accent transition-transform duration-700 origin-left",
              activeIndex === idx ? "scale-x-100" : "scale-x-0"
            )} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
