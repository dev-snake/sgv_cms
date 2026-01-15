"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Activity, BarChart3, Gauge, LineChart, PieChart, TrendingUp, Droplets, Thermometer } from "lucide-react";

const DASHBOARD_WIDGETS = [
  { 
    id: 1, 
    type: "chart", 
    title: "Lưu lượng nước", 
    value: "2,450", 
    unit: "m³/h",
    change: "+12.5%",
    color: "cyan" 
  },
  { 
    id: 2, 
    type: "gauge", 
    title: "Áp suất đường ống", 
    value: "4.2", 
    unit: "bar",
    status: "normal",
    color: "emerald" 
  },
  { 
    id: 3, 
    type: "stat", 
    title: "Thiết bị online", 
    value: "487", 
    total: "500",
    color: "blue" 
  },
  { 
    id: 4, 
    type: "alert", 
    title: "Cảnh báo hôm nay", 
    value: "3", 
    status: "warning",
    color: "amber" 
  },
];

export default function DashboardPreview() {
  return (
    <section className="relative bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 py-24 sm:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-brand-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-brand-secondary/10 rounded-full blur-[150px]" />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <span className="inline-block text-xs font-semibold text-brand-primary tracking-[0.4em] uppercase">
            Real-time IoT Dashboards
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Giám sát{" "}
            <span className="bg-linear-to-r from-white via-white to-brand-primary bg-clip-text text-transparent">
              thời gian thực
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg">
            Dashboard trực quan với hơn 30+ widget được tùy chỉnh sẵn. 
            Theo dõi dữ liệu từ hàng ngàn thiết bị IoT trên một giao diện duy nhất.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Browser Frame */}
          <div className="relative mx-auto max-w-6xl">
            {/* Browser Top Bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 rounded-t-xl border-b border-slate-700/50">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900/80 rounded-md text-xs text-slate-400">
                  <span className="text-green-400">🔒</span>
                  <span>dashboard.saigonvalve.vn/scada</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-b-xl border border-slate-700/50 border-t-0 p-6 sm:p-8">
              {/* Dashboard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center border border-white/10">
                    <Activity size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Trạm cấp nước Thủ Đức</h3>
                    <p className="text-xs text-slate-400">Cập nhật: 2 giây trước</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Đang hoạt động
                  </span>
                </div>
              </div>

              {/* Widgets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {DASHBOARD_WIDGETS.map((widget, i) => (
                  <motion.div
                    key={widget.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="relative group"
                  >
                    <div className="p-4 rounded-xl bg-slate-900/50 border h-full border-white/5 hover:border-brand-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-slate-400 font-medium">{widget.title}</span>
                        {widget.type === "chart" && <LineChart size={16} className="text-brand-primary" />}
                        {widget.type === "gauge" && <Gauge size={16} className="text-brand-primary/70" />}
                        {widget.type === "stat" && <BarChart3 size={16} className="text-brand-primary" />}
                        {widget.type === "alert" && <Activity size={16} className="text-brand-primary/60" />}
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-white">{widget.value}</span>
                        {widget.unit && <span className="text-sm text-slate-400 mb-1">{widget.unit}</span>}
                        {widget.total && <span className="text-sm text-slate-400 mb-1">/ {widget.total}</span>}
                      </div>
                      {widget.change && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                          <TrendingUp size={12} />
                          <span>{widget.change} so với hôm qua</span>
                        </div>
                      )}
                      {widget.status === "normal" && (
                        <div className="mt-2 text-xs text-emerald-400">Trong ngưỡng bình thường</div>
                      )}
                      {widget.status === "warning" && (
                        <div className="mt-2 text-xs text-amber-400">Cần xem xét</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chart Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Chart */}
                <div className="lg:col-span-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-white">Biểu đồ lưu lượng 24h</h4>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs">Lưu lượng</span>
                      <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">Áp suất</span>
                    </div>
                  </div>
                  {/* Chart Visualization */}
                  <div className="relative h-48 flex items-end gap-1.5">
                    {[40, 55, 35, 60, 45, 70, 55, 80, 65, 75, 50, 85, 70, 60, 75, 55, 65, 80, 70, 85, 75, 90, 80, 70].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.03, duration: 0.5 }}
                        className="flex-1 rounded-t bg-linear-to-t from-brand-primary/60 to-brand-cyan/80 relative group"
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap">
                          {Math.round(height * 30)} m³/h
                        </div>
                      </motion.div>
                    ))}
                    {/* Overlay line chart */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 1.5 }}
                        d="M 0 140 Q 50 120, 100 100 T 200 80 T 300 60 T 400 50 T 500 40 T 600 45"
                        fill="none"
                        stroke="rgb(52, 211, 153)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="opacity-60"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] text-slate-500">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>Hiện tại</span>
                  </div>
                </div>

                {/* Side Stats */}
                <div className="space-y-4">
                  {/* Map/Location widget */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Droplets size={16} className="text-brand-primary" />
                      Điểm đo nước
                    </h4>
                    <div className="relative h-24 bg-brand-primary/5 rounded-lg overflow-hidden border border-brand-primary/10">
                      {/* Simple map visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {/* Connection lines */}
                          <svg className="absolute inset-0 w-40 h-20" viewBox="0 0 160 80">
                            <line x1="20" y1="40" x2="80" y2="20" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
                            <line x1="20" y1="40" x2="80" y2="60" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
                            <line x1="80" y1="20" x2="140" y2="40" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
                            <line x1="80" y1="60" x2="140" y2="40" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
                          </svg>
                          {/* Nodes */}
                          <div className="flex items-center gap-12">
                            <div className="w-4 h-4 rounded-full bg-cyan-500 animate-pulse" />
                            <div className="flex flex-col gap-8">
                              <div className="w-3 h-3 rounded-full bg-emerald-500" />
                              <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            </div>
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <Activity size={10} className="text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">12 điểm đo</span>
                      <span className="text-emerald-400">100% online</span>
                    </div>
                  </div>

                  {/* Temperature widget */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Thermometer size={16} className="text-orange-400" />
                      Nhiệt độ môi trường
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-white">28.5</span>
                        <span className="text-slate-400 mb-1">°C</span>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-orange-500/30 flex items-center justify-center relative">
                        <div className="absolute inset-1 rounded-full border-4 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent rotate-45" />
                        <span className="text-xs text-orange-400 font-medium">Tốt</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating decoration elements */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-40 bg-linear-to-r from-brand-cyan/10 to-transparent blur-2xl" />
          <div className="absolute -right-10 top-1/3 w-20 h-40 bg-linear-to-l from-brand-primary/10 to-transparent blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
