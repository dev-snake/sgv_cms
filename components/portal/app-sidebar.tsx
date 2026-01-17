"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Settings,
  FileText,
  Briefcase,
  Box,
  ChevronRight,
  User,
  LogOut,
  Lock,
  Mail,
  Users,
  Images,
  UserRoundSearch,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import api from "@/services/axios";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

import { cn } from "@/lib/utils";
import { PORTAL_ROUTES } from "@/constants/routes";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: PORTAL_ROUTES.dashboard,
      icon: LayoutDashboard,
    },
    {
       title: "Quản lý Tin tức",
       url: PORTAL_ROUTES.cms.news.list,
       icon: FileText,
       requiredPermission: "news:read",
    },
    {
       title: "Quản lý Dự án",
       url: PORTAL_ROUTES.cms.projects.list,
       icon: Briefcase,
       requiredPermission: "projects:read",
    },
    {
       title: "Quản lý Sản phẩm",
       url: PORTAL_ROUTES.cms.products.list,
       icon: Box,
       requiredPermission: "products:read",
    },
    {
       title: "Thư viện Media",
       url: PORTAL_ROUTES.cms.media,
       icon: Images,
       requiredPermission: "media:read",
    },
    {
      title: "Cài đặt hệ thống",
      url: PORTAL_ROUTES.settings,
      icon: Settings,
      requiredPermission: "system:manage",
    },
    {
       title: "Quản lý Liên hệ",
       url: PORTAL_ROUTES.contacts,
       icon: Mail,
       requiredPermission: "contacts:read",
    },
    {
      title: "Quản lý Tuyển dụng",
      url: PORTAL_ROUTES.cms.jobs.list,
      icon: UserRoundSearch,
      requiredPermission: "jobs:read",
    },
    {
       title: "Danh sách Ứng viên",
       url: PORTAL_ROUTES.cms.applications.list,
       icon: ClipboardList,
       requiredPermission: "applications:read",
    },
    {
      title: "Tài khoản Admin",
      url: PORTAL_ROUTES.users.list,
      icon: ShieldCheck,
      requiredPermission: "users:read",
    },
    {
      title: "Phân quyền & Vai trò",
      url: PORTAL_ROUTES.users.roles.list,
      icon: Lock,
      requiredPermission: "rbac:manage",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hasPermission, isAdmin } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);

  // Prevent hydration mismatch with Radix UI DropdownMenu
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      // LocalStorage cleanup is now optional as we use cookies, 
      // but let's keep it clean if anything was left.
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success("Đã đăng xuất");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Lỗi khi đăng xuất");
    }
  };

  return (
    <Sidebar 
      collapsible="icon" 
      {...props} 
      className="border-none bg-[#002d6b]"
      style={{
        "--sidebar-background": "#002d6b",
        "--sidebar-foreground": "white",
        "--sidebar-primary": "white",
        "--sidebar-primary-foreground": "#002d6b",
        "--sidebar-accent": "rgba(255, 255, 255, 0.08)",
        "--sidebar-accent-foreground": "white",
        "--sidebar-border": "rgba(255, 255, 255, 0.05)",
        "--sidebar-ring": "#fbbf24",
      } as React.CSSProperties}
    >
      <SidebarHeader className="border-b border-white/5 flex items-center justify-start px-4 bg-[#002d6b] shrink-0 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
        <Link href={PORTAL_ROUTES.dashboard} className="flex items-center gap-3 group/logo relative w-full h-full justify-center px-1">
           <div className="relative flex items-center gap-3 group-data-[collapsible=icon]:hidden w-full px-1">
                 <div className="bg-white p-1 rounded-none flex items-center justify-center h-8 w-8 shrink-0">
                    <Image
                      src="/images/logo/logo.png"
                      alt="Logo"
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                 </div>
                 <span className="text-[11px] font-black tracking-tighter leading-none text-white whitespace-nowrap uppercase">SÀI GÒN VALVE</span>
           </div>
           <div className="hidden group-data-[collapsible=icon]:flex h-8 w-8 items-center justify-center rounded-none bg-white p-1 shrink-0">
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={20}
                height={20}
                className="object-contain"
              />
           </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="scrollbar-hide bg-[#002d6b] py-2 overflow-x-hidden">
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-0 group-data-[collapsible=icon]:items-center">
            {data.navMain.map((item: any) => {
              if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
                return null;
              }
              // Special handling to prevent /portal/users and /portal/users/roles from both being active
              const isActive = (() => {
                if (item.url === PORTAL_ROUTES.dashboard) {
                  return pathname === PORTAL_ROUTES.dashboard;
                }
                // For users list, exclude /portal/users/roles paths
                if (item.url === PORTAL_ROUTES.users.list) {
                  return pathname === PORTAL_ROUTES.users.list || 
                         (pathname.startsWith(PORTAL_ROUTES.users.list) && !pathname.startsWith(PORTAL_ROUTES.users.roles.list));
                }
                return pathname.startsWith(item.url);
              })();

              return (
                <SidebarMenuItem key={item.title} className="w-full flex justify-center">
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title} 
                    className={cn(
                      "text-[10px] font-black  px-4 transition-colors duration-200 uppercase tracking-widest rounded-none h-auto group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center",
                      isActive 
                        ? "bg-white text-[#002d6b] hover:bg-white hover:text-[#002d6b]" 
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
                      <div className="flex items-center justify-center shrink-0 size-5">
                        {item.icon && <item.icon className={cn("size-4", isActive ? "text-[#002d6b]" : "text-[#fbbf24]")} />}
                      </div>
                      <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-0 bg-[#002d6b] gap-0 border-t border-white/5 shrink-0 overflow-hidden flex flex-col group-data-[collapsible=icon]:items-center">
        {!isMounted || !user ? (
          // Skeleton loading state
          <div className="w-full h-14 flex items-center gap-3 px-4 bg-[#001d4a] text-white group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-none bg-white/20 animate-pulse shrink-0" />
            <div className="flex flex-col items-start leading-none group-data-[collapsible=icon]:hidden overflow-hidden ms-1 gap-1.5">
              <div className="h-2.5 w-20 bg-white/20 rounded animate-pulse" />
              <div className="h-2 w-28 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full h-14 items-center gap-3 px-4 bg-[#001d4a] hover:bg-[#001d4a] text-white rounded-none group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#fbbf24] text-[10px] font-black text-[#002d6b] shrink-0">
                  {(user.full_name || user.username || "?").substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col items-start leading-none group-data-[collapsible=icon]:hidden overflow-hidden ms-1">
                  <span className="text-[10px] font-black uppercase tracking-tight truncate w-full">{user.full_name || user.username}</span>
                  <span className="text-[8px] font-medium text-white/30 lowercase mt-0.5 truncate w-full">{user.username}@saigonvalve.vn</span>
                </div>
                <ChevronRight className="ml-auto size-3 text-white/20 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="end"
              className="w-52 p-0 rounded-none border-none bg-[#011c42] text-white shadow-2xl ml-2"
            >
              <DropdownMenuLabel className="px-5 py-3 bg-[#001d4a]/80">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Tài khoản</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 m-0" />
              <DropdownMenuItem className="px-5 py-3 focus:bg-white/10 focus:text-white cursor-pointer rounded-none group border-none outline-none">
                <User className="size-4 text-[#fbbf24] mr-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5 m-0" />
              <DropdownMenuItem 
                onSelect={handleLogout}
                className="px-5 py-3 focus:bg-rose-500/10 focus:text-rose-500 text-rose-500 cursor-pointer rounded-none group border-none outline-none"
              >
                <LogOut className="size-4 mr-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>

    </Sidebar>
  );
}





// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const pathname = usePathname();
//   const router = useRouter();
//     const handleLogout = async () => {
//     try {
//       await api.post("/api/auth/logout");
//       // LocalStorage cleanup is now optional as we use cookies, 
//       // but let's keep it clean if anything was left.
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       toast.success("Đã đăng xuất");
//       router.push("/login");
//       router.refresh();
//     } catch (error) {
//       console.error("Logout failed", error);
//       toast.error("Lỗi khi đăng xuất");
//     }
//   };
//   return (
//     <Sidebar collapsible="icon" {...props} >
//       <SidebarHeader className="border-none bg-[#002d6b]">
//         <SidebarHeader className="border-b border-white/5 flex items-center justify-start px-4 bg-[#002d6b] shrink-0 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
//          <Link href={PORTAL_ROUTES.dashboard} className="flex items-center gap-3 group/logo relative w-full h-full justify-center px-1">
//             <div className="relative flex items-center gap-3 group-data-[collapsible=icon]:hidden w-full px-1">
//                   <div className="bg-white p-1 rounded-none flex items-center justify-center h-8 w-8 shrink-0">
//                      <Image
//                       src="/images/logo/logo.png"
//                       alt="Logo"
//                       width={22}
//                       height={22}
//                       className="object-contain"
//                     />
//                  </div>
//                  <span className="text-[11px] font-black tracking-tighter leading-none text-white whitespace-nowrap uppercase">SÀI GÒN VALVE</span>
//            </div>
//            <div className="hidden group-data-[collapsible=icon]:flex h-8 w-8 items-center justify-center rounded-none bg-white p-1 shrink-0">
//               <Image
//                 src="/images/logo/logo.png"
//                 alt="Logo"
//                 width={20}
//                 height={20}
//                 className="object-contain"
//               />
//            </div>
//         </Link>
//       </SidebarHeader>
//       </SidebarHeader>
//        <SidebarContent className="scrollbar-hide bg-[#002d6b] py-2 overflow-x-hidden">
//       <SidebarGroup className="p-0">         <SidebarMenu className="gap-0 group-data-[collapsible=icon]:items-center">
//            {data.navMain.map((item) => {
//               const isActive = item.url === PORTAL_ROUTES.dashboard ? pathname === PORTAL_ROUTES.dashboard : pathname.startsWith(item.url);
//               return (
//                 <SidebarMenuItem key={item.title} className="w-full flex justify-center">
//                   <SidebarMenuButton 
//                     asChild 
//                     tooltip={item.title} 
//                     className={cn(
//                       "text-[10px] font-black  px-4 transition-colors duration-200 uppercase tracking-widest rounded-none h-auto group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center",
//                       isActive 
//                         ? "bg-white text-[#002d6b] hover:bg-white hover:text-[#002d6b]" 
//                         : "text-white/70 hover:bg-white/5 hover:text-white"
//                     )}
//                   >
//                     <Link href={item.url} className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
//                       <div className="flex items-center justify-center shrink-0 size-5">
//                         {item.icon && <item.icon className={cn("size-4", isActive ? "text-[#002d6b]" : "text-[#fbbf24]")} />}
//                       </div>
//                       <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               );
//             })}
//           </SidebarMenu>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter className="p-0 bg-[#002d6b] gap-0 border-t border-white/5 shrink-0 overflow-hidden flex flex-col group-data-[collapsible=icon]:items-center">
//          <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                <SidebarMenuButton
//                  size="lg"
//                  className="w-full h-14 items-center gap-3 px-4 bg-[#001d4a] hover:bg-[#001d4a] text-white rounded-none group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center cursor-pointer"
//                >
//                  <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#fbbf24] text-[10px] font-black text-[#002d6b] shrink-0">
//                    {data.user.avatar}
//                  </div>
//                  <div className="flex flex-col items-start leading-none group-data-[collapsible=icon]:hidden overflow-hidden ms-1">
//                    <span className="text-[10px] font-black uppercase tracking-tight truncate w-full">{data.user.name}</span>
//                    <span className="text-[8px] font-medium text-white/30 lowercase mt-0.5 truncate w-full">{data.user.email}</span>
//                  </div>
//                  <ChevronRight className="ml-auto size-3 text-white/20 group-data-[collapsible=icon]:hidden" />
//                </SidebarMenuButton>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               side="right"
//               align="end"
//               className="w-52 p-0 rounded-none border-none bg-[#011c42] text-white shadow-2xl ml-2"
//             >
//                <DropdownMenuLabel className="px-5 py-3 bg-[#001d4a]/80">
//                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Tài khoản</p>
//                </DropdownMenuLabel>
//                <DropdownMenuSeparator className="bg-white/5 m-0" />
//                <DropdownMenuItem className="px-5 py-3 focus:bg-white/10 focus:text-white cursor-pointer rounded-none group border-none outline-none">
//                  <User className="size-4 text-[#fbbf24] mr-3" />
//                  <span className="text-[10px] font-black uppercase tracking-widest">Hồ sơ</span>
//                </DropdownMenuItem>
//                <DropdownMenuSeparator className="bg-white/5 m-0" />
//                <DropdownMenuItem 
//                  onSelect={handleLogout}
//                  className="px-5 py-3 focus:bg-rose-500/10 focus:text-rose-500 text-rose-500 cursor-pointer rounded-none group border-none outline-none"
//                >
//                  <LogOut className="size-4 mr-3" />
//                  <span className="text-[10px] font-black uppercase tracking-widest">Đăng xuất</span>
//                </DropdownMenuItem>
//             </DropdownMenuContent>
//          </DropdownMenu>
//       </SidebarFooter>
//     </Sidebar>
//   )
// }
