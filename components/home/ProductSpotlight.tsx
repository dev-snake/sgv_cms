"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "motion/react";

const PRODUCTS = [
  {
    id: 1,
    name: "MÁY TẠO RÃNH DI ĐỘNG CG336",
    desc: "Tạo rãnh chính xác cho hệ thống đường ống công nghiệp.",
    image: "https://www.victaulic.com/wp-content/uploads/2021/03/CG336_Portable_Cut_Grooving_Tool_Hero.png", // Example URL, should be replaced with real assets
    link: "/san-pham/cg336",
  },
  {
    id: 2,
    name: "KHỚP NỐI CỨNG FIRELOCK™ STYLE 009V",
    desc: "Tốc độ và độ tin cậy tối ưu cho hệ thống PCCC.",
    image: "https://www.victaulic.com/wp-content/uploads/2016/09/Style-009H-Installation-Ready-Coupling.png",
    link: "/san-pham/firelock-009v",
  },
  {
    id: 3,
    name: "VAN CHUYỂN HƯỚNG SERIES 725T",
    desc: "Kiểm soát dòng chảy hiệu quả cho các ứng dụng công nghiệp.",
    image: "https://www.victaulic.com/wp-content/uploads/2016/09/Series-725T-Diverter-Valve.png",
    link: "/san-pham/series-725t",
  },
  {
    id: 4,
    name: "VAN BƯỚM VIC-300 MASTERSEAL™",
    desc: "Làm kín hiệu suất cao cho hệ thống đường ống tổng quát.",
    image: "https://www.victaulic.com/wp-content/uploads/2016/09/Series-761-Vic-300-MasterSeal-Butterfly-Valve.png",
    link: "/san-pham/vic-300",
  },
];

export default function ProductSpotlight() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-4 lg:px-8 text-center sm:text-left">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-black text-brand-secondary uppercase tracking-wider mb-16"
        >
          SẢN PHẨM NỔI BẬT
        </motion.h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative px-12"
        >
          <CarouselContent>
            {PRODUCTS.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-4 flex flex-col items-center text-center space-y-6 group">
                  <div className="relative aspect-square w-full max-w-[300px] transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-tight min-h-[40px] flex items-center justify-center">
                      {product.name}
                    </h3>
                    <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hidden group-hover:block animate-in fade-in slide-in-from-top-1">
                      XEM CHI TIẾT
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4 size-14 border-none bg-transparent hover:bg-transparent text-brand-cyan [&_svg]:size-10" />
          <CarouselNext className="hidden sm:flex -right-4 size-14 border-none bg-transparent hover:bg-transparent text-brand-cyan [&_svg]:size-10" />
        </Carousel>
      </div>
    </section>
  );
}
