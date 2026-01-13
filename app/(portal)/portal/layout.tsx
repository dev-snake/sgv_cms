import { AppSidebar } from "@/components/portal/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search, Bell, HelpCircle } from "lucide-react";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50 overflow-auto">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-8 sticky top-0 z-10 transition-all">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2 text-slate-500 hover:text-brand-primary transition-all hover:bg-slate-50 rounded-none size-10" />
            <Separator orientation="vertical" className="h-6 bg-slate-200" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/portal" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors">
                    Hệ thống
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-300" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Bảng điều khiển</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                <input 
                   placeholder="Tìm kiếm nhanh..." 
                   className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-none text-xs font-bold text-slate-900 w-64 focus:ring-1 focus:ring-brand-primary/20 transition-all"
                />
             </div>
             <div className="flex items-center gap-2 border-l border-slate-100 pl-6 ml-2">
                <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-none transition-all relative">
                   <Bell size={18} />
                   <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-rose-500 rounded-none border border-white"></span>
                </button>
                <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-none transition-all">
                   <HelpCircle size={18} />
                </button>
             </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-8 bg-slate-50/50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
