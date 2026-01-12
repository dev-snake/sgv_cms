"use client";

import { Phone, Mail, Clock, Facebook, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="hidden lg:block bg-brand-secondary py-2 border-b border-white/5">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between text-white/70">
          
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest leading-none">
              <Phone size={12} className="text-brand-accent" />
              <span>(028) 3535 8739</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest leading-none">
              <Mail size={12} className="text-brand-accent" />
              <span>INFO@SAIGONVALVE.VN</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest leading-none">
              <Clock size={12} className="text-brand-accent" />
              <span>THỨ 2 - THỨ 7: 08:00 - 17:30</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Follow us:</span>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-brand-accent transition-colors"><Facebook size={14} /></Link>
              <Link href="#" className="hover:text-brand-accent transition-colors"><Linkedin size={14} /></Link>
              <Link href="#" className="hover:text-brand-accent transition-colors"><Youtube size={14} /></Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
