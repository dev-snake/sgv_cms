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
import { Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
              <div id="apply-form" className="bg-slate-950 p-8 text-white space-y-6 sticky top-32">
                <h3 className="text-lg font-black uppercase tracking-tight">Ứng tuyển ngay</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Để lại thông tin và hồ sơ (CV) của bạn, chúng tôi sẽ liên hệ sớm nhất.
                </p>
                
                <ApplyForm jobId={job.id} jobTitle={job.title} />
                
                <p className="text-[10px] text-slate-500 text-center">
                  Cần hỗ trợ? Liên hệ hr@saigonvalve.vn
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

function ApplyForm({ jobId, jobTitle }: { jobId: string, jobTitle: string }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    full_name: "",
    email: "",
    phone: "",
    cv_url: "",
    cover_letter: "",
  });
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File quá lớn. Tối đa 5MB");
        return;
      }
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowed.includes(file.type)) {
        toast.error("Chỉ chấp nhận file PDF, DOC, DOCX");
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.phone || !cvFile) {
      toast.error("Vui lòng điền đủ thông tin và đính kèm CV");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload CV
      const uploadData = new FormData();
      uploadData.append("file", cvFile);
      
      const uploadRes = await api.post("/api/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!uploadRes.data.success) throw new Error("Upload failed");
      const cvUrl = uploadRes.data.data.url;

      // 2. Submit Application
      const applicationRes = await api.post("/api/applications", {
        ...formData,
        job_id: jobId,
        cv_url: cvUrl,
      });

      if (applicationRes.data.success) {
        toast.success("Nộp hồ sơ thành công! Chúng tôi sẽ liên hệ sớm.");
        setFormData({ full_name: "", email: "", phone: "", cv_url: "", cover_letter: "" });
        setCvFile(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gặp lỗi khi nộp hồ sơ. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-slate-400">Họ và tên *</Label>
        <Input 
          required
          value={formData.full_name}
          onChange={e => setFormData({ ...formData, full_name: e.target.value })}
          className="bg-white/5 border-white/10 text-white rounded-none h-12 focus:ring-brand-primary placeholder:text-slate-600"
          placeholder="NGUYỄN VĂN A"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400">Email *</Label>
          <Input 
            required
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="bg-white/5 border-white/10 text-white rounded-none h-12 focus:ring-brand-primary placeholder:text-slate-600"
            placeholder="example@mail.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400">Số điện thoại *</Label>
          <Input 
            required
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="bg-white/5 border-white/10 text-white rounded-none h-12 focus:ring-brand-primary placeholder:text-slate-600"
            placeholder="09xx xxx xxx"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-slate-400">Lời nhắn</Label>
        <Textarea 
          value={formData.cover_letter}
          onChange={e => setFormData({ ...formData, cover_letter: e.target.value })}
          className="bg-white/5 border-white/10 text-white rounded-none min-h-[80px] focus:ring-brand-primary placeholder:text-slate-600"
          placeholder="Tóm tắt ngắn gọn kinh nghiệm..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-slate-400">Hồ sơ (CV) *</Label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-white/10 p-4 text-center cursor-pointer transition-colors group h-24 flex flex-col items-center justify-center",
            cvFile ? "bg-brand-primary/10 border-brand-primary" : "hover:border-white/20 hover:bg-white/5"
          )}
        >
          {cvFile ? (
            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary truncate max-w-full">
              <CheckCircle size={14} /> {cvFile.name}
            </div>
          ) : (
            <>
              <Upload className="size-5 mb-2 text-slate-500 group-hover:text-brand-primary transition-colors" />
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300">Tải lên CV (PDF, DOCX)</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </div>
      </div>

      <Button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-primary hover:bg-brand-secondary text-white h-14 rounded-none text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" /> Đang gửi...
          </>
        ) : (
          <>
            Nộp hồ sơ ngay <Send size={16} className="ml-2" />
          </>
        )}
      </Button>
    </form>
  )
}
