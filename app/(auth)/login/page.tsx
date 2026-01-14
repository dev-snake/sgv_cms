"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/api/auth/login", formData);
      toast.success("Đăng nhập thành công! Đang chuyển hướng...");
      router.push("/portal/cms/news");
      router.refresh(); // Important for middleware to recognize the new cookie
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error || "Sai tài khoản hoặc mật khẩu";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 bg-white border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden relative z-10"
      >
        {/* Visual Brand Section */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
             <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-bl from-brand-primary via-transparent to-transparent opacity-50 rotate-12" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="h-12 w-12 bg-brand-primary flex items-center justify-center">
                <ShieldCheck className="text-white size-8" />
              </div>
              <span className="text-2xl font-black uppercase tracking-widest text-white leading-none">SG VALVE<br/><span className="text-xs text-brand-primary font-bold">MANAGEMENT SYSTEM</span></span>
            </div>
            
            <h2 className="text-5xl font-black leading-[1.1] uppercase tracking-tight mb-8">
              Xây dựng <br/><span className="text-brand-primary">giá trị</span> vững bền.
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              Hệ thống quản trị nội dung chuyên nghiệp dành cho đội ngũ vận hành Sài Gòn Valve. 
            </p>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Phiên bản hệ thống</p>
              <p className="text-sm font-bold text-white">v1.2.4 Standard Edition</p>
            </div>
            <div className="h-10 w-10 border border-white/10 flex items-center justify-center opacity-50">
               <ArrowRight size={16} />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-12 lg:p-24 flex flex-col justify-center">
          <div className="mb-12">
            <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-primary/20">Cổng truy cập an toàn</span>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">Đăng nhập tài khoản</h1>
            <p className="text-slate-400 font-medium italic text-sm">Vui lòng nhập thông tin xác thực để truy cập hệ thống.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Tên đăng nhập / Username</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
                  <Input 
                    type="text"
                    required
                    className="h-16 bg-slate-50 border-none pl-12 text-sm font-bold uppercase tracking-tight rounded-none focus-visible:ring-1 focus-visible:ring-brand-primary/20 transition-all"
                    placeholder="ADMIN"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Mật khẩu truy cập</Label>
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-brand-primary transition-colors">Quên mật khẩu?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
                  <Input 
                    type="password"
                    required
                    className="h-16 bg-slate-50 border-none pl-12 text-sm font-bold tracking-widest rounded-none focus-visible:ring-1 focus-visible:ring-brand-primary/20 transition-all font-mono"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-20 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-black uppercase tracking-[0.2em] rounded-none shadow-[0_12px_24px_-8px_rgba(244,63,94,0.3)] transition-all flex items-center justify-center group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-6 opacity-50" />
              ) : (
                <>
                  Bắt đầu phiên làm việc
                  <ArrowRight className="ml-3 size-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-16 pt-12 border-t border-slate-50 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-6">
                <div className="h-1 w-8 bg-slate-100" />
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Secured by SGV IT Team</span>
             </div>
             <div className="flex items-center gap-4">
               {/* Browser indicators or subtle signals */}
               <div className="size-1.5 rounded-full bg-emerald-500" />
               <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Network Secure</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Footer minimal info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-0 w-full text-center z-10"
      >
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Sài Gòn Valve Control System © 2026</p>
      </motion.div>
    </div>
  );
}
