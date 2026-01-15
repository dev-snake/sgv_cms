"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { 
  CalendarDays, 
  ArrowRight, 
  Clock, 
  User, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Search, 
  Share2, 
  TrendingUp,
  Tag,
  ChevronRight
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { SITE_ROUTES } from "@/constants/routes";
import api from "@/services/axios";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  category: string;
  author: string;
  published_at: string | null;
  created_at: string;
  readTime: string;
  image: string;
}

const ITEMS_PER_PAGE = 6;

// Helper to format date in Vietnamese
function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day} THÁNG ${month}, ${year}`;
}

export default function NewsPage() {
  const [news, setNews] = React.useState<NewsArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const fetchNews = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: 'published',
        page: String(page),
        limit: String(ITEMS_PER_PAGE + 1), // +1 for featured
      });
      const response = await api.get(`/api/news?${params.toString()}`);
      if (response.data.success) {
        setNews(response.data.data || []);
        if (response.data.meta) {
          setTotalPages(response.data.meta.totalPages || 1);
          setTotal(response.data.meta.total || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  if (loading && news.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }
  
  const featuredNews = news[0];
  const otherNews = news.slice(1);


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Header */}
      <section className="relative pt-40 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000"
            alt="News Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
           <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-3 bg-brand-primary/20 border border-brand-primary/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary backdrop-blur-md">
                 Truyền thông & Tin tức
              </div>
              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight uppercase leading-[0.9]">
                TRUNG TÂM <br /> 
                <span className="text-brand-accent">TIÊU ĐIỂM</span>
              </h1>
              <p className="text-xl text-slate-400 font-medium max-w-xl">
                Cập nhật những tin tức mới nhất về công nghệ, dự án và xu hướng trong ngành nước và hạ tầng công nghiệp.
              </p>
           </div>
        </div>
      </section>



      {/* News Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20">
            
            <div className="w-full space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {otherNews.map((article) => (
                    <motion.div
                      key={article.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative bg-white overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 border border-slate-100"
                    >
                      <div className="relative aspect-4/3 w-full overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      
                      <div className="p-6 grow flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-brand-primary">
                            <span>{article.category || "TIN TỨC"}</span>
                            <span className="text-muted-foreground">{formatDate(article.published_at)}</span>
                          </div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                            <Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link>
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                            <User size={12} className="text-brand-primary" />
                            {article.author || "SGV Admin"}
                          </div>
                        </div>

                        <Link 
                          href={`/tin-tuc/${article.slug}`}
                          className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-primary transition-colors pt-2 border-t border-slate-50"
                        >
                          XEM CHI TIẾT <ChevronRight size={14} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-16 border-t border-slate-100">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            href="#" 
                            isActive={currentPage === i + 1}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>


          </div>
        </div>
      </section>
    </div>
  );
}
