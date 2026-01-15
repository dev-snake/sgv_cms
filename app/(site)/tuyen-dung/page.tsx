"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, Briefcase, Clock, DollarSign, ChevronRight, MoveRight, Users } from "lucide-react";
import { SITE_ROUTES } from "@/constants/routes";
import api from "@/services/axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface JobPosting {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  employment_type: string;
  salary_range: string | null;
  experience_level: string | null;
  department: string | null;
  status: "open" | "closed";
  deadline: string | null;
  created_at: string;
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Toàn thời gian",
  part_time: "Bán thời gian",
  contract: "Hợp đồng",
  internship: "Thực tập",
};

export default function RecruitmentPage() {
  const [jobs, setJobs] = React.useState<JobPosting[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/api/jobs?status=open");
        if (response.data.success) {
          setJobs(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="bg-slate-950 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/banners/recruitment-banner.png"
            alt="Recruitment Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/40 to-slate-50/0"></div>
        </div>
        <div className="absolute inset-0 bg-carbon opacity-20 z-0"></div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="max-w-4xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary"
            >
               <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>
               CƠ HỘI NGHỀ NGHIỆP
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-[1.1]"
            >
              GIA NHẬP <br />
              <span className="text-brand-primary">ĐỘI NGŨ SGV</span>
            </motion.h1>
            <p className="text-slate-400 font-medium text-lg max-w-xl">
              Khám phá cơ hội nghề nghiệp tại Sài Gòn Valve - Nơi bạn có thể phát triển sự nghiệp cùng đội ngũ chuyên gia hàng đầu trong lĩnh vực công nghệ ngành nước.
            </p>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Vị trí đang tuyển</h2>
              <p className="text-sm text-muted-foreground font-medium">{jobs.length} vị trí đang mở</p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-20">
              <Users size={64} className="mx-auto mb-6 text-slate-300" />
              <h3 className="text-xl font-black text-slate-900 mb-2">Hiện chưa có vị trí nào</h3>
              <p className="text-sm text-slate-500">Vui lòng quay lại sau hoặc gửi CV tự ứng tuyển qua email.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={`/tuyen-dung/${job.slug}`}
                    className="group block bg-white border border-slate-100 p-8 hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1.5">
                            {job.department || "Tổng hợp"}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-brand-primary transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-2">
                            <MapPin size={14} className="text-brand-primary" />
                            {job.location || "Việt Nam"}
                          </span>
                          {job.salary_range && (
                            <span className="flex items-center gap-2">
                              <DollarSign size={14} className="text-brand-primary" />
                              {job.salary_range}
                            </span>
                          )}
                          {job.experience_level && (
                            <span className="flex items-center gap-2">
                              <Briefcase size={14} className="text-brand-primary" />
                              {job.experience_level}
                            </span>
                          )}
                          {job.deadline && (
                            <span className="flex items-center gap-2">
                              <Clock size={14} className="text-brand-primary" />
                              Hạn: {format(new Date(job.deadline), "dd/MM/yyyy", { locale: vi })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-primary transition-colors flex items-center gap-2">
                          Xem chi tiết <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-carbon opacity-10"></div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center sm:text-left">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="space-y-4 max-w-2xl">
                 <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">KHÔNG TÌM THẤY VỊ TRÍ PHÙ HỢP?</h2>
                 <p className="text-slate-400 font-medium leading-relaxed">Gửi CV của bạn đến chúng tôi. Sài Gòn Valve luôn chào đón những ứng viên tài năng và sẵn sàng liên hệ khi có vị trí phù hợp.</p>
              </div>
              <Link href={SITE_ROUTES.CONTACT} className="shrink-0 inline-flex items-center gap-4 px-12 py-5 bg-white text-slate-950 font-black uppercase tracking-[0.2em] hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1">
                GỬI CV NGAY <MoveRight size={20} />
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
