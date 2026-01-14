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
    name: "CG336 PORTABLE CUT GROOVING TOOL",
    desc: "Precision grooving for industrial piping systems.",
    image: "https://www.victaulic.com/wp-content/uploads/2021/03/CG336_Portable_Cut_Grooving_Tool_Hero.png", // Example URL, should be replaced with real assets
    link: "/san-pham/cg336",
  },
  {
    id: 2,
    name: "FIRELOCK™ INSTALLATION-READY™ STYLE 009V RIGID COUPLING",
    desc: "Speed and reliability for fire protection systems.",
    image: "https://www.victaulic.com/wp-content/uploads/2016/09/Style-009H-Installation-Ready-Coupling.png",
    link: "/san-pham/firelock-009v",
  },
  {
    id: 3,
    name: "SERIES 725T DIVERTER VALVE",
    desc: "Efficient flow control for diverse industrial applications.",
    image: "https://www.victaulic.com/wp-content/uploads/2016/09/Series-725T-Diverter-Valve.png",
    link: "/san-pham/series-725t",
  },
  {
    id: 4,
    name: "VIC-300 MASTERSEAL™ BUTTERFLY VALVE",
    desc: "High-performance sealing for general service piping.",
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
          PRODUCT SPOTLIGHT
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
                      VIEW PRODUCT
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
