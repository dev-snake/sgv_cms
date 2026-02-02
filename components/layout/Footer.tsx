'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Facebook,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Download,
    ShieldCheck,
    Globe,
} from 'lucide-react';
import { COMPANY_INFO } from '@/constants/site-info';

export default function Footer() {
    return (
        <footer className="bg-brand-primary pt-24 pb-12 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-white/10"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-20 border-b border-white/5">
                    {/* Brand Column */}
                    <div className="space-y-8">
                        <Link href="/" className="relative block h-16 w-56 group">
                            <Image
                                src="/images/logo/logo.png"
                                alt="Sài Gòn Valve Logo"
                                fill
                                className="object-contain brightness-0 invert group-hover:scale-105 transition-transform"
                                priority
                            />
                        </Link>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            {COMPANY_INFO.slogan}
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Linkedin, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-brand-primary hover:border-brand-primary transition-all"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent border-b border-white/10 pb-4">
                            Menu điều hướng
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Trang chủ', href: '/' },
                                { label: 'Giới thiệu', href: '/gioi-thieu' },
                                { label: 'Sản phẩm', href: '/san-pham' },
                                { label: 'Dự án tiêu biểu', href: '/du-an' },
                                { label: 'Tin tức & Sự kiện', href: '/tin-tuc' },
                                { label: 'Liên hệ', href: '/lien-he' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:translate-x-2 transition-all inline-flex items-center gap-2 group"
                                    >
                                        <ArrowRight
                                            size={12}
                                            className="text-white group-hover:text-brand-accent transition-colors"
                                        />{' '}
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent border-b border-white/10 pb-4">
                            Thông tin liên hệ
                        </h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4 group">
                                <MapPin
                                    className="text-white shrink-0 group-hover:text-brand-accent transition-colors"
                                    size={20}
                                />
                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                    {COMPANY_INFO.address}
                                </span>
                            </li>
                            <li className="flex gap-4 items-center group">
                                <Phone
                                    className="text-white shrink-0 group-hover:text-brand-accent transition-colors"
                                    size={20}
                                />
                                <a
                                    href={`tel:${COMPANY_INFO.phoneRaw}`}
                                    className="text-[11px] text-slate-400 font-black tracking-widest hover:text-white transition-colors"
                                >
                                    {COMPANY_INFO.phone}
                                </a>
                            </li>
                            <li className="flex gap-4 items-center group">
                                <Mail
                                    className="text-white shrink-0 group-hover:text-brand-accent transition-colors"
                                    size={20}
                                />
                                <a
                                    href={`mailto:${COMPANY_INFO.email}`}
                                    className="text-[11px] text-slate-400 font-black tracking-widest uppercase hover:text-white transition-colors"
                                >
                                    {COMPANY_INFO.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            {COMPANY_INFO.copyright}
                        </p>
                        <div className="flex items-center gap-2 justify-center md:justify-start text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                            <ShieldCheck size={12} className="text-brand-primary" /> Bảo mật thông
                            tin dự án tuyệt đối
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        <Link
                            href="#"
                            className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                        >
                            Điều khoản
                        </Link>
                        <Link
                            href="#"
                            className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                        >
                            Bảo mật
                        </Link>
                        <Link
                            href="#"
                            className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                        >
                            Sơ đồ trang
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
