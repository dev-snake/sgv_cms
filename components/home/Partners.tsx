"use client";

import { motion } from "motion/react";
import Image from "next/image";

const PARTNERS = [
  { name: "OKM Japan", logo: "https://saigonvalve.vn/uploads/files/2024/09/27/OKM-PNG.png" },
  { name: "Noah Korea", logo: "https://saigonvalve.vn/uploads/files/2024/09/27/NOAH-PNG.png" },
  { name: "Niigata Japan", logo: "https://saigonvalve.vn/uploads/files/2024/09/27/NIIGATA-ROTARY-JOINT-PNG.png" },
  { name: "Toaflex Japan", logo: "https://saigonvalve.vn/uploads/files/2024/09/27/TOAFLEX-PNG-1.png" },
  { name: "Arita", logo: "https://saigonvalve.vn/uploads/files/2024/09/27/unnamed-png.png" },
];

export default function Partners() {
  return (
    <section className="bg-white py-16 sm:py-24 border-y border-slate-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-around gap-12 lg:gap-20">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative h-12 w-32 opacity-60 hover:opacity-100 transition-all duration-500"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
