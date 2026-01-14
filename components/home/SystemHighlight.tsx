"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const BANNERS = [
  {
    tag: "FEATURED SYSTEM",
    title: "THE QUICKVIC™ SYSTEM",
    desc: "Featuring the first and only coupling designed for high-performance impact guns.",
    btnText: "Discover More",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?auto=format&fit=crop&q=80&w=2000",
    url: "/he-thong-quickvic",
  },
  {
    tag: "FEATURED PLAYLIST",
    title: "INSTALLATION INSTRUCTIONS",
    desc: "Learn how to install Victaulic products or set up and operate Victaulic tools with easy to follow installation instructions videos.",
    btnText: "View Playlist",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000",
    url: "/huong-dan-lap-dat",
  },
];

export default function SystemHighlight() {
  return (
    <section className="bg-white py-12 space-y-8">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        {BANNERS.map((banner, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative h-[400px] overflow-hidden bg-slate-900"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 container mx-auto px-12 py-16 flex flex-col justify-center space-y-6">
              <div className="space-y-4 max-w-xl">
                <p className="text-[10px] font-black tracking-[0.2em] text-[#ff8200] uppercase">
                  {banner.tag}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  {banner.title}
                </h2>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  {banner.desc}
                </p>
              </div>
              
              <div className="pt-4">
                <Link
                  href={banner.url}
                  className="inline-flex items-center px-8 py-3 bg-[#4c92b1] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#3d768f] transition-colors"
                >
                  {banner.btnText}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
