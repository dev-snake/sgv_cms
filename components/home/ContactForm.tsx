"use client";

import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send, MessageSquare, Facebook, Linkedin, Youtube } from "lucide-react";

export default function ContactForm() {
  return (
    <section className="bg-slate-900 py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
          
          <div className="flex flex-col justify-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl sm:text-6xl font-bold text-white tracking-tighter uppercase leading-none">
                Kết nối với <br />
                <span className="text-brand-accent">Chuyên gia</span>
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg">
                Đội ngũ kỹ thuật của Sài Gòn Valve luôn sẵn sàng hỗ trợ tư vấn và 
                cung cấp giải pháp tối ưu cho mọi thách thức hạ tầng của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Phone, label: "HOTLINE", value: "(028) 3535 8739", sub: "Hỗ trợ 24/7" },
                { icon: Mail, label: "EMAIL", value: "info@saigonvalve.vn", sub: "Phản hồi trong 2h" },
                { icon: MapPin, label: "ĐỊA CHỈ", value: "TP. Thủ Đức, TP. HCM", sub: "Văn phòng chính" },
                { icon: MessageSquare, label: "ZALO / VIBER", value: "0901 234 567", sub: "Hỗ trợ kỹ thuật" },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3 text-brand-accent">
                    <item.icon size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-white">{item.value}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
               {[Facebook, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-brand-primary hover:border-brand-primary transition-all">
                    <Icon size={20} />
                  </a>
               ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-10 sm:p-16 shadow-2xl relative"
          >
             {/* Simple Border Accent */}
             <div className="absolute top-0 right-0 h-2 w-full bg-brand-primary"></div>
             
             <div className="space-y-10">
                <div className="space-y-2">
                   <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Yêu cầu báo giá</h3>
                   <p className="text-sm text-slate-500 font-medium">Chúng tôi sẽ liên hệ lại ngay trong vòng 2 giờ làm việc.</p>
                </div>

                <form className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Họ tên khách hàng</label>
                       <input type="text" className="w-full border-b-2 border-slate-100 py-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors" placeholder="Nguyễn Văn A" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số điện thoại</label>
                       <input type="tel" className="w-full border-b-2 border-slate-100 py-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors" placeholder="09xx xxx xxx" />
                    </div>
                  </div>
                  <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lĩnh vực quan tâm</label>
                       <select className="w-full border-b-2 border-slate-100 py-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors bg-white">
                          <option>Hệ thống Van OKM Japan</option>
                          <option>Thiết bị Actuator Noah</option>
                          <option>Giải pháp Quan trắc IoT</option>
                          <option>Bảo trì & Sửa chữa</option>
                       </select>
                  </div>
                  <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nội dung chi tiết</label>
                       <textarea rows={2} className="w-full border-b-2 border-slate-100 py-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors resize-none" placeholder="Vui lòng mô tả yêu cầu của bạn..."></textarea>
                  </div>
                  <button className="flex w-full items-center justify-center gap-4 bg-brand-primary py-6 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20">
                    GỬI YÊU CẦU NGAY <Send size={18} />
                  </button>
                </form>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
