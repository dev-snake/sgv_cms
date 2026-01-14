"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const ITEMS = [
  {
    title: "SUSTAINABILITY",
    desc: "Driving sustainability in our value chain, enabling circularity in construction.",
    linkText: "LEARN MORE",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    url: "/ben-vung",
  },
  {
    title: "PROJECT PARTNERSHIPS",
    desc: "Every day, on every project, we work for you. Your success is our mission.",
    linkText: "EXPLORE OUR PARTNERSHIPS",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
    url: "/hop-tac",
  },
  {
    title: "SUBMITTAL PACKAGE ENGINE",
    desc: "Now anyone can build a submittal package delivered as a single combined PDF file.",
    linkText: "CREATE A PACKAGE",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1200",
    url: "/cong-cu",
  },
  {
    title: "SPRINKLER CATALOG",
    desc: "Easily filter our industry-leading sprinkler offering to suit your project needs.",
    linkText: "EXPLORE OUR OFFERING",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecb?auto=format&fit=crop&q=80&w=1200",
    url: "/san-pham/sprinkler",
  },
  {
    title: "SYSTEM DESIGN",
    desc: "Find the right Victaulic products or platforms for your project and build packages.",
    linkText: "VIEW PRODUCT GUIDE",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200",
    url: "/thiet-ke",
  },
  {
    title: "CAREERS",
    desc: "We have what you are looking for - opportunity, growth and a collaborative work environment.",
    linkText: "VIEW CURRENT OPENINGS",
    image: "https://images.unsplash.com/photo-1522071823995-578fb4836486?auto=format&fit=crop&q=80&w=1200",
    url: "/tuyen-dung",
  },
  {
    title: "VICTAULIC MOBILE",
    desc: "Visit the all-new victaulicmobile.com app suite to access a whole world of mobile experiences.",
    linkText: "VIEW VICTAULIC MOBILE",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200",
    url: "/mobile-app",
  },
  {
    title: "SYSTEM SOLUTIONS",
    desc: "Our individual products blend seamlessly into application-based systems, enabling you to construct.",
    linkText: "LEARN MORE",
    image: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&q=80&w=1200",
    url: "/giai-phap",
  },
];

export default function FeaturedGrid() {
  return (
    <section className="bg-slate-50 py-12 sm:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative h-[320px] overflow-hidden bg-slate-900"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-start space-y-4">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 font-medium leading-relaxed max-w-[240px]">
                  {item.desc}
                </p>
                <Link 
                  href={item.url}
                  className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#00b2e3] hover:text-white transition-colors"
                >
                  {item.linkText}
                </Link>
              </div>

              <Link href={item.url} className="absolute inset-0 z-10">
                <span className="sr-only">Go to {item.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
