"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { MapPin, Briefcase, Clock, DollarSign, ArrowLeft, Send, Building2, Users, CheckCircle } from "lucide-react";
import { SITE_ROUTES } from "@/constants/routes";
import api from "@/services/axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface JobPosting {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
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

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [job, setJob] = React.useState<JobPosting | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/api/jobs/${slug}`);
        if (response.data.success) {
          setJob(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchJob();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white pt-24">
        <h1 className="text-2xl font-black text-slate-900 mb-4">Không tìm thấy tin tuyển dụng</h1>
        <Link href={SITE_ROUTES.RECRUITMENT}>
          <Button>Quay lại trang tuyển dụng</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="bg-slate-950 py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-carbon opacity-30"></div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <Link 
            href={SITE_ROUTES.RECRUITMENT}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Quay lại danh sách
          </Link>
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-white bg-brand-primary px-3 py-1.5 shadow-lg shadow-brand-primary/20">
                {job.department || "Tổng hợp"}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/20 px-3 py-1.5">
                {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
              </span>
              {job.status === "closed" && (
                <span className="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-3 py-1.5">
                  Đã đóng
                </span>
              )}
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-tight"
            >
              {job.title}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400">
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-primary" />
                {job.location || "Việt Nam"}
              </span>
              {job.salary_range && (
                <span className="flex items-center gap-2">
                  <DollarSign size={16} className="text-brand-primary" />
                  {job.salary_range}
                </span>
              )}
              {job.experience_level && (
                <span className="flex items-center gap-2">
                  <Briefcase size={16} className="text-brand-primary" />
                  {job.experience_level}
                </span>
              )}
              {job.deadline && (
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-primary" />
                  Hạn: {format(new Date(job.deadline), "dd/MM/yyyy", { locale: vi })}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 border-l-4 border-brand-primary pl-4">
                  Mô tả công việc
                </h2>
                <div 
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 border-l-4 border-brand-primary pl-4">
                    Yêu cầu ứng viên
                  </h2>
                  <div 
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 border-l-4 border-brand-primary pl-4">
                    Quyền lợi
                  </h2>
                  <div 
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.benefits }}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Apply Card */}
              <div className="bg-slate-950 p-8 text-white space-y-6 sticky top-32">
                <h3 className="text-lg font-black uppercase tracking-tight">Ứng tuyển ngay</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Gửi CV và thư giới thiệu của bạn đến email tuyển dụng của chúng tôi.
                </p>
                <a 
                  href="mailto:hr@saigonvalve.vn?subject=Ứng tuyển: ${job.title}"
                  className="block w-full text-center px-8 py-4 bg-brand-primary text-white font-black uppercase tracking-widest text-xs hover:bg-brand-secondary transition-all"
                >
                  <Send size={16} className="inline mr-2" />
                  Gửi hồ sơ
                </a>
                <p className="text-[10px] text-slate-500 text-center">
                  hoặc gửi trực tiếp đến: hr@saigonvalve.vn
                </p>
              </div>

              {/* Company Info */}
              <div className="bg-slate-50 p-8 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Về Sài Gòn Valve</h3>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <Building2 size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>Công ty TNHH Giải Pháp Sài Gòn Valve</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>120 Nguyễn Thị Thập, Tân Phú, Quận 7, TP. Hồ Chí Minh</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>50-100 nhân viên</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
