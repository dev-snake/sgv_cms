"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { 
  CalendarDays, 
  User, 
  Clock, 
  Share2, 
  ArrowLeft,
  Facebook,
  Linkedin,
  Twitter,
  MoveRight,
  Bookmark,
  Printer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NEWS_LIST } from "@/data/news";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import api from "@/services/axios";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [relatedArticles, setRelatedArticles] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, relatedRes] = await Promise.all([
          api.get(`/api/news/${params.slug}`),
          api.get("/api/news?limit=3")
        ]);
        
        if (articleRes.data.success) {
          setArticle(articleRes.data.data);
        }
        if (relatedRes.data.success) {
          setRelatedArticles(relatedRes.data.data.filter((n: any) => n.slug !== params.slug).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching news detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!article) return <div className="pt-44 text-center">Không tìm thấy bài viết</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navigation & Breadcrumbs - Fixed pt-32 to avoid header overlap */}
      <section className="pt-44 pb-6 border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Trang chủ</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/tin-tuc">Tin tức</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[200px] truncate">{article.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <button 
              onClick={() => router.back()}
              className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-primary transition-colors"
            >
              <ArrowLeft size={14} /> Quay lại
            </button>
          </div>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-primary">
              {article.category}
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-4 gap-6 pt-4 border-t border-slate-100 social-meta text-slate-500">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tác giả</div>
                  <div className="text-xs font-bold text-slate-900">{article.author}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày đăng</div>
                  <div className="text-xs font-bold text-slate-900">{article.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thời gian đọc</div>
                  <div className="text-xs font-bold text-slate-900">{article.readTime} đọc</div>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button title="Chia sẻ" className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                  <Share2 size={16} />
                </button>
                <button title="In" className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                  <Printer size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="pb-16 sm:pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="bg-white">
            {/* Featured Image */}
            <div className="relative aspect-21/9 w-full overflow-hidden rounded-2xl mb-12 shadow-sm">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-8">
              <p className="text-xl sm:text-2xl text-slate-600 font-medium leading-relaxed italic border-l-4 border-brand-primary pl-8">
                {article.desc}
              </p>

              <div 
                className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-brand-primary hover:prose-a:text-brand-secondary prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: article.content || `<p>Nội dung chi tiết đang được cập nhật...</p>` }}
              />

              {/* Share & Actions */}
              <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chia sẻ:</span>
                  <div className="flex gap-2">
                    {[Facebook, Linkedin, Twitter].map((Icon, i) => (
                      <button key={i} className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-brand-primary hover:text-white transition-all">
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 px-5 py-2.5 rounded-full hover:bg-slate-200 transition-all">
                    <Bookmark size={14} /> Lưu bài viết
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-brand-primary px-5 py-2.5 rounded-full hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 transition-all">
                    Liên hệ tư vấn <MoveRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relate News */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">BÀI VIẾT LIÊN QUAN</h2>
              <div className="h-1 w-20 bg-brand-primary mt-2"></div>
            </div>
            <Link href="/tin-tuc" className="text-[10px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary/20 pb-1 hover:border-brand-primary transition-all">TẤT CẢ TIN TỨC</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((news) => (
              <Link key={news.id} href={`/tin-tuc/${news.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image src={news.image} alt={news.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 text-[8px] font-black uppercase tracking-widest text-brand-primary rounded">
                    {news.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="text-[9px] font-bold text-slate-400 mb-2 flex items-center gap-2">
                    <CalendarDays size={10} /> {news.date}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors uppercase line-clamp-2 leading-tight mb-4 grow tracking-tight">
                    {news.title}
                  </h4>
                  <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-brand-primary gap-1 group-hover:gap-2 transition-all">
                    Xem chi tiết <MoveRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
