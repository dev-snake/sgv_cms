'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'motion/react';
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
    Zap,
    Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_ROUTES } from '@/constants/routes';
import Lightbox from '@/components/shared/Lightbox';

const SOLUTIONS_DATA: Record<string, any> = {
    'quan-ly-nuoc-thong-minh': {
        title: 'Quản lý nước thông minh',
        subtitle: 'Giải pháp giám sát và điều khiển mạng lưới cấp nước tự động',
        banner: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=2000',
        icon: <Waves className="size-6" />,
        description:
            'Hệ thống quản lý nước thông minh của Sài Gòn Valve kết hợp công nghệ IoT tiên tiến với các thiết bị đo lường chính xác cao, giúp các đơn vị vận hành quản lý mạng lưới cấp nước một cách toàn diện, giảm thiểu thất thoát và tối ưu hóa chi phí vận hành.',
        gallery: [
            'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1584433144859-1ff3ab9d3558?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1581093458391-9f42e5539c0c?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1617155093730-a8bf47be7921?auto=format&fit=crop&q=80&w=1200',
        ],
        features: [
            {
                title: 'Giám sát thời gian thực',
                desc: 'Theo dõi lưu lượng, áp lực và chất lượng nước 24/7 qua nền tảng Cloud.',
                icon: <Activity className="size-5" />,
            },
            {
                title: 'Cảnh báo rò rỉ sớm',
                desc: 'Thuật toán AI phát hiện bất thường và cảnh báo điểm rò rỉ ngay lập tức.',
                icon: <ShieldCheck className="size-5" />,
            },
            {
                title: 'Điều khiển từ xa',
                desc: 'Đóng/mở van và điều chỉnh áp suất mạng lưới trực tiếp từ trung tâm điều hành.',
                icon: <Zap className="size-5" />,
            },
            {
                title: 'Phân tích dữ liệu',
                desc: 'Báo cáo chi tiết về xu hướng tiêu thụ và hiệu suất mạng lưới theo kỳ.',
                icon: <BarChart3 className="size-5" />,
            },
        ],
        technical_specs: [
            'Hỗ trợ kết nối NB-IoT, LoRaWAN, 4G/5G',
            'Tích hợp chuẩn truyền thông công nghiệp Modbus, BACnet',
            'Pin dung lượng cao, tuổi thọ lên đến 5-10 năm',
            'Tiêu chuẩn chống nước IP68 cho thiết bị đầu cuối',
            'Nền tảng phần mềm SaaS bảo mật cao',
        ],
        benefits: [
            'Giảm tỷ lệ thất thoát nước (NRW) đáng kể',
            'Tối ưu hóa áp lực mạng lưới, giảm vỡ ống',
            'Cắt giảm chi phí nhân sự kiểm tra thủ công',
            'Nâng cao độ tin cậy của dịch vụ cấp nước',
        ],
    },
    'nong-nghiep-chinh-xac': {
        title: 'Nông nghiệp chính xác',
        subtitle: 'Ứng dụng IoT trong quản lý tưới tiêu và dinh dưỡng thông minh',
        banner: 'https://images.unsplash.com/photo-1558444479-c8f010b91939?auto=format&fit=crop&q=80&w=2000',
        icon: <Sprout className="size-6" />,
        description:
            'Giải pháp nông nghiệp chính xác giúp người nông dân và các trang trại quy mô lớn tự động hóa quy trình chăm sóc cây trồng dựa trên dữ liệu thực tế từ đất và môi trường, đảm bảo cây trồng phát triển tối ưu với mức tiêu thụ tài nguyên thấp nhất.',
        gallery: [
            'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1620200423727-8127f75d7f53?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        features: [
            {
                title: 'Quan trắc độ ẩm đất',
                desc: 'Cảm biến đa điểm đo chính xác độ ẩm, nhiệt độ và EC trong đất.',
                icon: <Layers className="size-5" />,
            },
            {
                title: 'Tưới tiêu tự động',
                desc: 'Lập lịch và kích hoạt tưới dựa trên ngưỡng độ ẩm thực tế của cây trồng.',
                icon: <Cpu className="size-5" />,
            },
            {
                title: 'Dự báo thời tiết chuyên sâu',
                desc: 'Tích hợp dữ liệu khí tượng cục bộ để điều chỉnh kế hoạch sản xuất.',
                icon: <Clock className="size-5" />,
            },
            {
                title: 'Châm phân thông minh',
                desc: 'Điều khiển chính xác tỷ lệ phân bón hòa tan theo từng giai đoạn phát triển.',
                icon: <CheckCircle2 className="size-5" />,
            },
        ],
        technical_specs: [
            'Cảm biến độ ẩm đất FDR/TDR độ chính xác cao',
            'Kết nối không dây tầm xa LoRaWAN lên đến 10km',
            'Sử dụng năng lượng mặt trời (Solar Powered)',
            'Ứng dụng di động (iOS/Android) quản lý mọi lúc mọi nơi',
            'Khả năng mở rộng quy mô linh hoạt',
        ],
        benefits: [
            'Tiết kiệm 30-50% lượng nước tưới và phân bón',
            'Tăng năng suất và chất lượng nông sản',
            'Giảm thiểu rủi ro từ thời tiết và dịch bệnh',
            'Xây dựng mô hình nông nghiệp bền vững',
        ],
    },
    'quan-trac-nuoi-trong-thuy-san': {
        title: 'Quan trắc nuôi trồng thủy sản',
        subtitle: 'Hệ thống kiểm soát chất lượng môi trường nước 24/7',
        banner: 'https://images.unsplash.com/photo-1544526226-d4568090ffb8?auto=format&fit=crop&q=80&w=2000',
        icon: <Fish className="size-6" />,
        description:
            'Trong nuôi trồng thủy sản, chất lượng nước là yếu tố sống còn. Giải pháp quan trắc của chúng tôi cung cấp hệ thống giám sát liên tục các chỉ số quan trọng, tự động kích hoạt thiết bị hỗ trợ để đảm bảo môi trường sống tốt nhất cho vật nuôi.',
        gallery: [
            'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1520116468409-94ee2953a99e?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1524311583144-d2393d9bb331?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1516466380602-53fde93a2e3f?auto=format&fit=crop&q=80&w=1200',
        ],
        features: [
            {
                title: 'Giám sát Oxy hòa tan (DO)',
                desc: 'Duy trì ngưỡng Oxy tối ưu, tự động bật máy quạt nước khi cần thiết.',
                icon: <Zap className="size-5" />,
            },
            {
                title: 'Đo lường pH và Salinity',
                desc: 'Theo dõi biến động độ mặn và pH để xử lý kịp thời các tình huống sốc nước.',
                icon: <Activity className="size-5" />,
            },
            {
                title: 'Cảnh báo khẩn cấp',
                desc: 'Gửi thông báo tức thì qua cuộc gọi hoặc SMS khi chỉ số vượt ngưỡng an toàn.',
                icon: <ShieldCheck className="size-5" />,
            },
            {
                title: 'Lịch sử môi trường',
                desc: 'Lưu trữ dữ liệu phục vụ truy xuất nguồn gốc và phân tích dịch bệnh.',
                icon: <BarChart3 className="size-5" />,
            },
        ],
        technical_specs: [
            'Cảm biến DO quang học không cần bảo trì thường xuyên',
            'Thiết bị phao nổi thông minh tích hợp trạm truyền tin',
            'Vật liệu chống ăn mòn trong môi trường nước mặn',
            'Tích hợp điều khiển tủ điện quạt nước/máy sục khí',
            'Thiết kế Plug-and-Play dễ dàng lắp đặt',
        ],
        benefits: [
            'Giảm tỷ lệ hao hụt vật nuôi đáng kể',
            'Giảm chi phí điện năng vận hành máy quạt nước',
            'Yên tâm quản lý trang trại từ xa',
            'Đáp ứng tiêu chuẩn nuôi trồng quốc tế (VietGAP, GlobalGAP)',
        ],
    },
};

export default function SolutionDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const data = SOLUTIONS_DATA[slug];

    const [lightboxOpen, setLightboxOpen] = React.useState(false);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    if (!data) {
        notFound();
    }

    const allImages = [data.banner, ...(data.gallery || [])];

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary">
                <div
                    className="absolute inset-0 z-0 opacity-40 cursor-zoom-in group"
                    onClick={() => openLightbox(0)}
                >
                    <Image
                        src={data.banner}
                        alt={data.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/70 via-brand-secondary/40 to-brand-primary/80"></div>

                    {/* Zoom Hint */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                            <Maximize2 className="text-white size-8" />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl"></div>

                <div className="container relative z-10 mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl pt-20">
                        <motion.nav
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-widest mb-8"
                        >
                            <Link href="/" className="hover:text-brand-accent transition-colors">
                                TRANG CHỦ
                            </Link>
                            <ChevronRight size={10} />
                            <span className="text-brand-accent">GIẢI PHÁP</span>
                        </motion.nav>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-3 bg-brand-accent/20 border border-brand-accent/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent backdrop-blur-md">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse"></span>
                                {data.icon}
                                <span className="ml-1">Solution Vertical</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.1] drop-shadow-lg">
                                {data.title.split(' ').slice(0, -2).join(' ')} <br />
                                <span className="text-brand-accent">
                                    {data.title.split(' ').slice(-2).join(' ')}
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed">
                                {data.subtitle}
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Main Content */}
            <section className="py-24 sm:py-32">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        {/* Left: Description & Features */}
                        <div className="space-y-16">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                                    TỔNG QUAN GIẢI PHÁP
                                </h2>
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
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Technical Specs & Benefits */}
                        <div className="space-y-12 lg:sticky lg:top-44">
                            <div className="bg-brand-primary text-white p-10 sm:p-12 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 size-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                <h3 className="text-lg font-black uppercase tracking-widest mb-10 flex items-center gap-4">
                                    <Cpu className="text-white" /> THÔNG SỐ KỸ THUẬT
                                </h3>
                                <ul className="space-y-6">
                                    {data.technical_specs.map((spec: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="mt-1.5 size-1.5 rounded-full bg-white shrink-0"></div>
                                            <span className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-tight">
                                                {spec}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-10 sm:p-12 border-2 border-slate-100 bg-white shadow-sm">
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-10">
                                    LỢI ÍCH KHÁCH HÀNG
                                </h3>
                                <div className="space-y-6">
                                    {data.benefits.map((benefit: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            <div className="size-6 bg-slate-50 flex items-center justify-center rounded-full group-hover:bg-green-50 transition-colors">
                                                <CheckCircle2 className="size-4 text-slate-300 group-hover:text-green-500 transition-colors" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 uppercase">
                                                {benefit}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            {data.gallery && data.gallery.length > 0 && (
                <section className="py-24 bg-slate-50 border-y border-slate-100">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex items-end justify-between mb-16 px-4">
                            <div className="space-y-4">
                                <h2 className="text-sm font-black text-brand-primary uppercase tracking-[0.4em]">
                                    Bộ sưu tập giải pháp
                                </h2>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                                    HÌNH ẢNH THỰC TẾ
                                </h3>
                            </div>
                            <div className="hidden sm:block text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                Technical Insights & Deployment
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                            {data.gallery.map((img: string, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative aspect-square cursor-zoom-in group overflow-hidden"
                                    onClick={() => openLightbox(idx + 1)}
                                >
                                    <Image
                                        src={img}
                                        alt={`${data.title} gallery ${idx + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-brand-primary/20 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full text-slate-900 shadow-xl">
                                            <Maximize2 size={20} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* Lightbox Integration */}
            <Lightbox
                images={allImages}
                currentIndex={currentImageIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNavigate={(index) => setCurrentImageIndex(index)}
            />
        </div>
    );
}
