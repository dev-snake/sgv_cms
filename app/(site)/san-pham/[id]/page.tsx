"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Settings, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  Globe2, 
  FileText,
  Warehouse,
  Truck,
  Headphones
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: "1", name: "VAN BƯỚM OKM SERIES 612X", category: "Van OKM Japan", image: "https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png", desc: "Sử dụng cho hệ thống nước sạch và xử lý nước thải." },
  { id: "2", name: "ACTUATOR NOAH SERIES NA", category: "Thiết bị Noah Korea", image: "https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png", desc: "Bộ điều khiển điện tiêu chuẩn IP67/IP68." },
  { id: "3", name: "THIẾT BỊ ĐO ĐỘ ĐỤC SGVT420", category: "IoT Ngành Nước", image: "https://saigonvalve.vn/uploads/files/2024/11/14/-c.png", desc: "Cảm biến đo độ đục trực tuyến độ chính xác cao." },
  { id: "4", name: "DATALOGGER SV1-DAQ", category: "IoT Ngành Nước", image: "https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png", desc: "Truyền dữ liệu qua mạng 4G/LTE/NBIoT." },
];

export default function ProductDetailPage() {
  const params = useParams();
  const product = PRODUCTS.find(p => p.id === params.id) || PRODUCTS[0];

  return (
    <div className="flex flex-col min-h-screen bg-white pt-40">
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-100 py-4">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Link href="/" className="hover:text-brand-primary">Trang chủ</Link>
              <ChevronRight size={14} />
              <Link href="/san-pham" className="hover:text-brand-primary">Sản phẩm</Link>
              <ChevronRight size={14} />
              <span className="text-brand-primary">{product.name}</span>
           </div>
        </div>
      </div>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              
              {/* Product Visual */}
              <div className="space-y-8">
                 <div className="relative aspect-square bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-12 group">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-20 transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-8 left-8">
                       <span className="bg-brand-primary px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">CHÍNH HÃNG</span>
                    </div>
                 </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                       <div key={i} className="aspect-square bg-slate-50 border border-slate-100 p-4 opacity-70 hover:opacity-100 transition-all cursor-pointer">
                          <Image src={product.image} alt="Thumb" width={100} height={100} className="object-contain border-0" />
                       </div>
                    ))}
                  </div>
              </div>

              {/* Product Info */}
              <div className="space-y-12">
                 <div className="space-y-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">{product.category}</div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tighter uppercase leading-none">{product.name}</h1>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-slate-100 pl-8">{product.desc}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-y border-slate-100">
                    <div className="flex items-start gap-4">
                       <Warehouse className="text-brand-primary shrink-0" size={24} />
                       <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Tình trạng</div>
                          <div className="text-sm font-bold text-slate-900 uppercase">Sẵn hàng tại kho HCM</div>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <Truck className="text-brand-primary shrink-0" size={24} />
                       <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Giao hàng</div>
                          <div className="text-sm font-bold text-slate-900 uppercase">Toàn quốc (2-3 ngày)</div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-secondary border-b border-slate-100 pb-4">ĐẶC ĐIỂM NỔI BẬT</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         "Tiêu chuẩn Nhật Bản / Hàn Quốc",
                         "Vật liệu chịu lực cao (Inox/Thép)",
                         "Độ bền vận hành vượt trội",
                         "Tương thích hệ thống SCADA/IoT",
                         "Bảo trì dễ dàng, linh kiện sẵn có",
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <CheckCircle2 size={16} className="text-brand-primary shrink-0" />
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-6 pt-6">
                    <Link href="/lien-he" className="flex-1 inline-flex items-center justify-center gap-4 bg-brand-primary py-5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-brand-secondary transition-all">
                       NHẬN BÁO GIÁ CHI TIẾT
                    </Link>
                    <button className="flex-1 inline-flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-5 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:border-brand-primary transition-all">
                       TẢI CATALOGUE (PDF) <Download size={16} />
                    </button>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* Detailed Specs */}
      <section className="py-24 bg-slate-50">
         <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
               <div className="lg:col-span-2 space-y-12">
                  <div className="space-y-6">
                     <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">THÔNG SỐ KỸ THUẬT</h2>
                     <div className="h-1 w-20 bg-brand-primary"></div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse bg-white shadow-sm ring-1 ring-slate-200">
                        <tbody>
                           {[
                             { label: "Thương hiệu", value: "OKM Japan / NOAH Korea" },
                             { label: "Kích thước (Size)", value: "DN50 - DN1200" },
                             { label: "Áp lực làm việc", value: "PN10, PN16, PN25" },
                             { label: "Nhiệt độ", value: "-10°C đến 250°C" },
                             { label: "Kết nối", value: "Wafer / Flange (JIS, ANSI, DIN)" },
                             { label: "Thân van", value: "Cast Iron, Ductile Iron, SS304/316" },
                             { label: "Điều khiển", value: "Tay gạt, Vô lăng, Điện, Khí nén" },
                           ].map((spec, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                 <td className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-1/3 bg-slate-50/50">{spec.label}</td>
                                 <td className="px-8 py-6 text-sm font-bold text-slate-900">{spec.value}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               <div className="space-y-12">
                  <div className="bg-slate-900 p-12 text-white space-y-8 relative overflow-hidden">
                     <Globe2 size={120} className="absolute -bottom-10 -right-10 text-white/5" />
                     <h4 className="text-xl font-bold uppercase leading-tight italic text-brand-accent">Hỗ trợ dự án</h4>
                     <p className="text-xs font-medium text-slate-400 leading-relaxed">Sài Gòn Valve cung cấp đầy đủ chứng chỉ CO/CQ và hỗ trợ kỹ thuật tận nơi cho các dự án trọng điểm.</p>
                     <div className="space-y-6 pt-6 pt-b">
                        <div className="flex items-center gap-4">
                           <ShieldCheck className="text-brand-primary" size={24} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Bảo hành 24 tháng</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <FileText className="text-brand-primary" size={24} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Đầy đủ CO/CQ chính hãng</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 text-center space-y-10">
           <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">BẠN CẦN TƯ VẤN THÊM?</h2>
           <p className="max-w-xl mx-auto text-muted-foreground font-medium italic">"Để lại thông tin hoặc gọi hotline để được tư vấn giải pháp tối ưu cho hệ thống của bạn."</p>
           <div className="flex justify-center flex-col sm:flex-row gap-6">
              <Link href="/lien-he" className="px-12 py-5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-brand-secondary transition-all">GỬI YÊU CẦU NGAY</Link>
              <a href="tel:02835358739" className="px-12 py-5 bg-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">GỌI HOTLINE</a>
           </div>
        </div>
      </section>
    </div>
  );
}
