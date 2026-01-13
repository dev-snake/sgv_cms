"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell, Shield, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Cài đặt hệ thống</h1>
        <p className="text-slate-500 font-medium italic mt-1 text-sm">Quản lý cấu hình tài khoản và hệ thống portal.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-12 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="profile" className="text-[10px] font-black uppercase tracking-widest rounded-lg transition-all data-[state=active]:bg-brand-primary data-[state=active]:text-white">
            <User className="mr-2 size-3" /> Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-[10px] font-black uppercase tracking-widest rounded-lg transition-all data-[state=active]:bg-brand-primary data-[state=active]:text-white">
            <Bell className="mr-2 size-3" /> Thông báo
          </TabsTrigger>
          <TabsTrigger value="security" className="text-[10px] font-black uppercase tracking-widest rounded-lg transition-all data-[state=active]:bg-brand-primary data-[state=active]:text-white">
            <Shield className="mr-2 size-3" /> Bảo mật
          </TabsTrigger>
          <TabsTrigger value="website" className="text-[10px] font-black uppercase tracking-widest rounded-lg transition-all data-[state=active]:bg-brand-primary data-[state=active]:text-white">
            <Globe className="mr-2 size-3" /> Website
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-8">
          <Card className="border-slate-100 rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-50">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Thông tin cá nhân</CardTitle>
              <CardDescription className="text-xs font-medium italic">Cập nhật thông tin định danh của bạn trên hệ thống.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Họ và tên</Label>
                  <Input defaultValue="Quản trị viên" className="h-12 border-slate-200 text-xs font-bold rounded-xl focus:ring-brand-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email liên hệ</Label>
                  <Input defaultValue="admin@saigonvalve.vn" className="h-12 border-slate-200 text-xs font-bold rounded-xl focus:ring-brand-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chức vụ</Label>
                <Input defaultValue="System Administrator" className="h-12 border-slate-200 text-xs font-bold rounded-xl focus:ring-brand-primary" />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/30 p-8 border-t border-slate-50 flex justify-end">
              <Button className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto transition-all rounded-xl">
                <Save className="mr-2 size-4" /> Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-8">
          <Card className="border-slate-100 rounded-2xl overflow-hidden">
             <CardHeader className="bg-slate-50/50 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Cấu hình thông báo</CardTitle>
                <CardDescription className="text-xs font-medium italic">Quản lý cách bạn nhận thông báo từ hệ thống.</CardDescription>
             </CardHeader>
             <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                <Bell size={48} className="text-slate-200 mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tính năng đang được cập nhật</p>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-8">
           <Card className="border-slate-100 rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-50">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Bảo mật tài khoản</CardTitle>
                 <CardDescription className="text-xs font-medium italic">Đổi mật khẩu và quản lý các thiết bị đăng nhập.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mật khẩu hiện tại</Label>
                    <Input type="password" placeholder="••••••••" className="h-12 border-slate-200 text-xs font-bold rounded-sm focus:ring-brand-primary" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mật khẩu mới</Label>
                       <Input type="password" placeholder="••••••••" className="h-12 border-slate-200 text-xs font-bold rounded-sm focus:ring-brand-primary" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Xác nhận mật khẩu</Label>
                       <Input type="password" placeholder="••••••••" className="h-12 border-slate-200 text-xs font-bold rounded-sm focus:ring-brand-primary" />
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="bg-slate-50/30 p-8 border-t border-slate-50 flex justify-end">
                 <Button className="bg-rose-600 hover:bg-rose-700 text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto shadow-xl shadow-rose-600/20 transition-all rounded-sm">
                    Đổi mật khẩu
                 </Button>
              </CardFooter>
           </Card>
        </TabsContent>
        
        <TabsContent value="website" className="mt-8">
           <Card className="border-slate-100 rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-50">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Cấu hình Website chính</CardTitle>
                 <CardDescription className="text-xs font-medium italic">Các cài đặt ảnh hưởng đến hiển thị bên ngoài website.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tiêu đề website (SEO)</Label>
                    <Input defaultValue="SÀI GÒN VALVE - Giải pháp công nghiệp hàng đầu" className="h-12 border-slate-200 text-xs font-bold rounded-sm focus:ring-brand-primary" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mô tả website</Label>
                    <textarea className="w-full p-4 border border-slate-200 text-xs font-bold rounded-sm focus:ring-brand-primary min-h-[100px]" defaultValue="Chuyên cung cấp các loại van công nghiệp, thiết bị IoT và giải pháp quan trắc chất lượng nước." />
                 </div>
              </CardContent>
              <CardFooter className="bg-slate-50/30 p-8 border-t border-slate-50 flex justify-end">
                 <Button className="bg-brand-primary hover:bg-brand-secondary text-[10px] font-black uppercase tracking-widest px-8 py-6 h-auto shadow-xl shadow-brand-primary/20 transition-all rounded-sm">
                   <Save className="mr-2 size-4" /> Cập nhật website
                 </Button>
              </CardFooter>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
