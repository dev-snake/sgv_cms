"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight, Download, ShieldCheck, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-secondary pt-24 pb-12 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-20 border-b border-white/5">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="relative block h-16 w-56 group">
              <Image
                src="https://saigonvalve.vn/uploads/files/2024/08/05/NH-_PH-N_PH-I_-C_QUY-N__25_-removebg-preview.png"
                alt="Sài Gòn Valve Logo"
                fill
                className="object-contain brightness-0 invert group-hover:scale-105 transition-transform"
                onError={(e: any) => {
                  e.target.src = "https://via.placeholder.com/200x60?text=SAI+GON+VALVE";
                }}
              />
            </Link>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Nhà phân phối độc quyền thiết bị ngành nước và giải pháp quan trắc thông minh 
              từ Nhật Bản & Hàn Quốc tại thị trường Việt Nam.
            </p>
            <div className="flex gap-4">
              {[Facebook, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-brand-primary hover:border-brand-primary transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent border-b border-white/10 pb-4">Menu điều hướng</h4>
            <ul className="space-y-4">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Giới thiệu", href: "/gioi-thieu" },
                { label: "Sản phẩm", href: "/san-pham" },
                { label: "Dự án tiêu biểu", href: "/du-an" },
                { label: "Tin tức & Sự kiện", href: "/tin-tuc" },
                { label: "Liên hệ", href: "/lien-he" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:translate-x-2 transition-all inline-flex items-center gap-2 group">
                    <ArrowRight size={12} className="text-brand-primary group-hover:text-brand-accent transition-colors" /> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent border-b border-white/10 pb-4">Thông tin liên hệ</h4>
            <ul className="space-y-6">
              <li className="flex gap-4 group">
                <MapPin className="text-brand-primary shrink-0 group-hover:text-brand-accent transition-colors" size={20} />
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                  Số 124/16-18 Võ Văn Hát, Long Trường, TP. Thủ Đức, TP. Hồ Chí Minh.
                </span>
              </li>
              <li className="flex gap-4 items-center group">
                <Phone className="text-brand-primary shrink-0 group-hover:text-brand-accent transition-colors" size={20} />
                <span className="text-[11px] text-slate-400 font-black tracking-widest">(028) 3535 8739</span>
              </li>
              <li className="flex gap-4 items-center group">
                <Mail className="text-brand-primary shrink-0 group-hover:text-brand-accent transition-colors" size={20} />
                <span className="text-[11px] text-slate-400 font-black tracking-widest uppercase">info@saigonvalve.vn</span>
              </li>
            </ul>
          </div>

          {/* CTA / Apps */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent border-b border-white/10 pb-4">Hồ sơ năng lực</h4>
            <div className="bg-white/5 p-6 border border-white/10 space-y-6">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic">
                 "Tải về trọn bộ Catalogue và Hồ sơ năng lực (Profile) mới nhất của Sài Gòn Valve."
               </p>
               <button className="w-full py-4 bg-brand-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20">
                 TẢI PROFILE (PDF) <Download size={14} />
               </button>
            </div>
          </div>
        </div>

        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-2">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
               © 2025 SÀI GÒN VALVE. BẢO LƯU TẤT CẢ QUYỀN.
             </p>
             <div className="flex items-center gap-2 justify-center md:justify-start text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                <ShieldCheck size={12} className="text-brand-primary" /> Bảo mật thông tin dự án tuyệt đối
             </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Điều khoản</Link>
            <Link href="#" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Bảo mật</Link>
            <Link href="#" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Sơ đồ trang</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
