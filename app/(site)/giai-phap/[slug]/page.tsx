"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "motion/react";
import { 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  BarChart3,
  Waves,
  Sprout,
  Fish,
  CheckCircle2,
  Clock,
  Layers,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_ROUTES } from "@/constants/routes";

const SOLUTIONS_DATA: Record<string, any> = {
  "quan-ly-nuoc-thong-minh": {
    title: "Quản lý nước thông minh",
    subtitle: "Giải pháp giám sát và điều khiển mạng lưới cấp nước tự động",
    banner: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=2000",
    icon: <Waves className="size-6" />,
    description: "Hệ thống quản lý nước thông minh của Sài Gòn Valve kết hợp công nghệ IoT tiên tiến với các thiết bị đo lường chính xác cao, giúp các đơn vị vận hành quản lý mạng lưới cấp nước một cách toàn diện, giảm thiểu thất thoát và tối ưu hóa chi phí vận hành.",
    features: [
      {
        title: "Giám sát thời gian thực",
        desc: "Theo dõi lưu lượng, áp lực và chất lượng nước 24/7 qua nền tảng Cloud.",
        icon: <Activity className="size-5" />
      },
      {
        title: "Cảnh báo rò rỉ sớm",
        desc: "Thuật toán AI phát hiện bất thường và cảnh báo điểm rò rỉ ngay lập tức.",
        icon: <ShieldCheck className="size-5" />
      },
      {
        title: "Điều khiển từ xa",
        desc: "Đóng/mở van và điều chỉnh áp suất mạng lưới trực tiếp từ trung tâm điều hành.",
        icon: <Zap className="size-5" />
      },
      {
        title: "Phân tích dữ liệu",
        desc: "Báo cáo chi tiết về xu hướng tiêu thụ và hiệu suất mạng lưới theo kỳ.",
        icon: <BarChart3 className="size-5" />
      }
    ],
    technical_specs: [
      "Hỗ trợ kết nối NB-IoT, LoRaWAN, 4G/5G",
      "Tích hợp chuẩn truyền thông công nghiệp Modbus, BACnet",
      "Pin dung lượng cao, tuổi thọ lên đến 5-10 năm",
      "Tiêu chuẩn chống nước IP68 cho thiết bị đầu cuối",
      "Nền tảng phần mềm SaaS bảo mật cao"
    ],
    benefits: [
      "Giảm tỷ lệ thất thoát nước (NRW) đáng kể",
      "Tối ưu hóa áp lực mạng lưới, giảm vỡ ống",
      "Cắt giảm chi phí nhân sự kiểm tra thủ công",
      "Nâng cao độ tin cậy của dịch vụ cấp nước"
    ]
  },
  "nong-nghiep-chinh-xac": {
    title: "Nông nghiệp chính xác",
    subtitle: "Ứng dụng IoT trong quản lý tưới tiêu và dinh dưỡng thông minh",
    banner: "https://images.unsplash.com/photo-1558444479-c8f010b91939?auto=format&fit=crop&q=80&w=2000",
    icon: <Sprout className="size-6" />,
    description: "Giải pháp nông nghiệp chính xác giúp người nông dân và các trang trại quy mô lớn tự động hóa quy trình chăm sóc cây trồng dựa trên dữ liệu thực tế từ đất và môi trường, đảm bảo cây trồng phát triển tối ưu với mức tiêu thụ tài nguyên thấp nhất.",
    features: [
      {
        title: "Quan trắc độ ẩm đất",
        desc: "Cảm biến đa điểm đo chính xác độ ẩm, nhiệt độ và EC trong đất.",
        icon: <Layers className="size-5" />
      },
      {
        title: "Tưới tiêu tự động",
        desc: "Lập lịch và kích hoạt tưới dựa trên ngưỡng độ ẩm thực tế của cây trồng.",
        icon: <Cpu className="size-5" />
      },
      {
        title: "Dự báo thời tiết chuyên sâu",
        desc: "Tích hợp dữ liệu khí tượng cục bộ để điều chỉnh kế hoạch sản xuất.",
        icon: <Clock className="size-5" />
      },
      {
        title: "Châm phân thông minh",
        desc: "Điều khiển chính xác tỷ lệ phân bón hòa tan theo từng giai đoạn phát triển.",
        icon: <CheckCircle2 className="size-5" />
      }
    ],
    technical_specs: [
      "Cảm biến độ ẩm đất FDR/TDR độ chính xác cao",
      "Kết nối không dây tầm xa LoRaWAN lên đến 10km",
      "Sử dụng năng lượng mặt trời (Solar Powered)",
      "Ứng dụng di động (iOS/Android) quản lý mọi lúc mọi nơi",
      "Khả năng mở rộng quy mô linh hoạt"
    ],
    benefits: [
      "Tiết kiệm 30-50% lượng nước tưới và phân bón",
      "Tăng năng suất và chất lượng nông sản",
      "Giảm thiểu rủi ro từ thời tiết và dịch bệnh",
      "Xây dựng mô hình nông nghiệp bền vững"
    ]
  },
  "quan-trac-nuoi-trong-thuy-san": {
    title: "Quan trắc nuôi trồng thủy sản",
    subtitle: "Hệ thống kiểm soát chất lượng môi trường nước 24/7",
    banner: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?auto=format&fit=crop&q=80&w=2000",
    icon: <Fish className="size-6" />,
    description: "Trong nuôi trồng thủy sản, chất lượng nước là yếu tố sống còn. Giải pháp quan trắc của chúng tôi cung cấp hệ thống giám sát liên tục các chỉ số quan trọng, tự động kích hoạt thiết bị hỗ trợ để đảm bảo môi trường sống tốt nhất cho vật nuôi.",
    features: [
      {
        title: "Giám sát Oxy hòa tan (DO)",
        desc: "Duy trì ngưỡng Oxy tối ưu, tự động bật máy quạt nước khi cần thiết.",
        icon: <Zap className="size-5" />
      },
      {
        title: "Đo lường pH và Salinity",
        desc: "Theo dõi biến động độ mặn và pH để xử lý kịp thời các tình huống sốc nước.",
        icon: <Activity className="size-5" />
      },
      {
        title: "Cảnh báo khẩn cấp",
        desc: "Gửi thông báo tức thì qua cuộc gọi hoặc SMS khi chỉ số vượt ngưỡng an toàn.",
        icon: <ShieldCheck className="size-5" />
      },
      {
        title: "Lịch sử môi trường",
        desc: "Lưu trữ dữ liệu phục vụ truy xuất nguồn gốc và phân tích dịch bệnh.",
        icon: <BarChart3 className="size-5" />
      }
    ],
    technical_specs: [
      "Cảm biến DO quang học không cần bảo trì thường xuyên",
      "Thiết bị phao nổi thông minh tích hợp trạm truyền tin",
      "Vật liệu chống ăn mòn trong môi trường nước mặn",
      "Tích hợp điều khiển tủ điện quạt nước/máy sục khí",
      "Thiết kế Plug-and-Play dễ dàng lắp đặt"
    ],
    benefits: [
      "Giảm tỷ lệ hao hụt vật nuôi đáng kể",
      "Giảm chi phí điện năng vận hành máy quạt nước",
      "Yên tâm quản lý trang trại từ xa",
      "Đáp ứng tiêu chuẩn nuôi trồng quốc tế (VietGAP, GlobalGAP)"
    ]
  }
};

export default function SolutionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = SOLUTIONS_DATA[slug];

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src={data.banner}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/40 to-slate-950/80"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="max-w-4xl">
            <motion.nav 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-widest mb-8"
            >
              <Link href="/" className="hover:text-brand-primary transition-colors">TRANG CHỦ</Link>
              <ChevronRight size={10} />
              <span className="text-brand-primary">GIẢI PHÁP</span>
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 bg-brand-primary/20 border border-brand-primary/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-md">
                {data.icon}
                <span className="ml-1">Solution Vertical</span>
              </div>
              <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight uppercase leading-[1.1]">
                {data.title.split(' ').slice(0, -2).join(' ')} <br />
                <span className="text-brand-primary">
                  {data.title.split(' ').slice(-2).join(' ')}
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/70 font-medium max-w-2xl leading-relaxed">
                {data.subtitle}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent"></div>
      </section>

      {/* Main Content */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left: Description & Features */}
            <div className="space-y-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">TỔNG QUAN GIẢI PHÁP</h2>
                <div className="h-1.5 w-20 bg-brand-primary"></div>
                <p className="text-xl text-slate-600 leading-relaxed font-medium capitalize">
                  {data.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {data.features.map((feature: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group"
                  >
                    <div className="size-12 bg-white flex items-center justify-center text-brand-primary shadow-sm mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-3">{feature.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Technical Specs & Benefits */}
            <div className="space-y-12 lg:sticky lg:top-44">
              <div className="bg-slate-900 text-white p-10 sm:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 size-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-10 flex items-center gap-4">
                  <Cpu className="text-brand-primary" /> THÔNG SỐ KỸ THUẬT
                </h3>
                <ul className="space-y-6">
                  {data.technical_specs.map((spec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-1.5 size-1.5 rounded-full bg-brand-primary shrink-0"></div>
                      <span className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-tight">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-10 sm:p-12 border-2 border-slate-100 bg-white shadow-sm">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-10">LỢI ÍCH KHÁCH HÀNG</h3>
                <div className="space-y-6">
                  {data.benefits.map((benefit: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="size-6 bg-slate-50 flex items-center justify-center rounded-full group-hover:bg-green-50 transition-colors">
                        <CheckCircle2 className="size-4 text-slate-300 group-hover:text-green-500 transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 uppercase">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5"></div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">SẴN SÀNG ĐỂ CHUYỂN ĐỔI SỐ?</h2>
              <p className="text-xl text-white/60 font-medium">Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn khảo sát và thiết kế giải pháp tối ưu nhất cho nhu cầu của bạn.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href={SITE_ROUTES.CONTACT} 
                className="group relative flex items-center justify-center gap-4 px-12 py-5 bg-white text-slate-950 font-black uppercase tracking-[0.2em] transform transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
              >
                <span className="relative z-10">NHẬN TƯ VẤN NGAY</span>
                <ArrowRight size={20} className="relative z-10 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link 
                href={SITE_ROUTES.PROJECTS} 
                className="px-12 py-5 border border-white/20 text-white font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
              >
                XEM THỰC TẾ DỰ ÁN
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
