"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  CalendarDays, 
  User, 
  Clock, 
  Share2, 
  ArrowLeft,
  Facebook,
  Linkedin,
  Twitter,
  Search,
  MoveRight,
  Bookmark,
  Printer
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
  const [recentArticles, setRecentArticles] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, relatedRes, categoriesRes, recentRes] = await Promise.all([
          api.get(`/api/news/${params.slug}`),
          api.get("/api/news?limit=3"),
          api.get("/api/categories?type=news"),
          api.get("/api/news?limit=5")
        ]);
        
        if (articleRes.data.success) {
          setArticle(articleRes.data.data);
        }
        if (relatedRes.data.success) {
          setRelatedArticles(relatedRes.data.data.filter((n: any) => n.slug !== params.slug).slice(0, 3));
        }
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data);
        }
        if (recentRes.data.success) {
          setRecentArticles(recentRes.data.data);
        }
      } catch (error) {
        console.log("Error fetching news detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.slug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tin-tuc?search=${encodeURIComponent(searchQuery)}`);
    }
  };

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
            
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">
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
                  <div className="text-xs font-bold text-slate-900">
                    {article.published_at ? format(new Date(article.published_at), "dd/MM/yyyy", { locale: vi }) : "Đang cập nhật"}
                  </div>
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
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="space-y-8">
                <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed italic border-l-4 border-brand-primary pl-8">
                  {article.summary}
                </p>

                <div 
                  className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-brand-primary hover:prose-a:text-brand-secondary prose-img:rounded-xl"
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

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-10">
              
              {/* Search */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Tìm kiếm</h3>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập từ khóa..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-all">
                    <Search size={18} />
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-px bg-brand-primary"></span> Danh mục
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/tin-tuc?category=${encodeURIComponent(cat.name)}`}
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-sm"
                    >
                      <span className="font-bold text-slate-600 group-hover:text-brand-primary">{cat.name}</span>
                      <MoveRight size={14} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent News */}
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-px bg-brand-primary"></span> Tin mới nhất
                </h3>
                <div className="space-y-6">
                  {recentArticles.map((news) => (
                    <Link key={news.id} href={`/tin-tuc/${news.slug}`} className="group flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                        {news.image_url ? (
                          <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-300"><CalendarDays size={20} /></div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <div className="text-[10px] font-bold text-slate-400 capitalize">
                          {news.published_at ? format(new Date(news.published_at), "dd/MM/yyyy", { locale: vi }) : "Đang cập nhật"}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-2 leading-tight tracking-tight">
                          {news.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Box */}
              <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white group">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl group-hover:bg-brand-primary/30 transition-all duration-700"></div>
                <div className="relative z-10 space-y-6">
                  <div className="h-12 w-12 rounded-2xl bg-brand-primary flex items-center justify-center">
                    <Share2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black leading-tight uppercase mb-2">Bạn cần tư vấn giải pháp?</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
                  </div>
                  <Link href="/lien-he" className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary hover:text-white transition-all">
                    Liên hệ ngay <MoveRight size={14} />
                  </Link>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>

      {/* Relate News */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
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
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  {news.image_url ? (
                    <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300"><CalendarDays size={32} /></div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 text-[8px] font-black uppercase tracking-widest text-brand-primary rounded">
                    {news.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="text-[9px] font-bold text-slate-400 mb-2 flex items-center gap-2">
                    <CalendarDays size={10} /> {news.published_at ? format(new Date(news.published_at), "dd/MM/yy", { locale: vi }) : "Đang cập nhật"}
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
