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

// Note: In a real app, this should come from CMS.
// Hardcoding the content for 'quan-ly-nuoc-thong-minh' (SEVAL WATER) to match the request exactly.

const SOLUTIONS_DATA: Record<string, any> = {
    'quan-ly-nuoc-thong-minh': {
        brand: 'SEVAL WATER',
        title: 'Quản lý cấp nước thông minh',
        fullTitle: 'SEVAL WATER - Quản lý cấp nước thông minh',
        description:
            'Ngành cấp nước Việt Nam đang đứng trước những thách thức lớn. Tỷ lệ thất thoát nước sạch trên 20% mỗi năm không chỉ gây lãng phí hàng nghìn tỷ đồng mà còn ảnh hưởng trực tiếp đến hiệu quả kinh doanh của các đơn vị cấp nước. Bên cạnh đó, việc quản lý và vận hành mạng lưới đường ống theo phương pháp thủ công, thiếu chính xác và tốn nhiều nhân lực đã trở thành "nỗi đau" dai dẳng mà công nghệ cần phải giải quyết triệt để.',
        intro: 'Để đáp ứng nhu cầu cấp thiết này, SEVAL đã phát triển giải pháp SEVAL WATER - Chuyển đổi số ngành cấp nước, một nền tảng quản lý thông minh mang tính đột phá. Giải pháp này không chỉ giải quyết các vấn đề hiện hữu mà còn kiến tạo một tương lai nơi mọi nguồn lực được quản lý một cách thông minh và hiệu quả hơn.',
        banner: '/uploads/images/2026/02/02/1770024627773-di5jqj.png',
        image1: '/uploads/images/2026/02/02/1770024627773-di5jqj.png',
        image2: '/uploads/images/2026/02/02/1770024641404-d0g5xi.png',
        core_title: 'THÀNH PHẦN CỐT LÕI',
        core_desc:
            'Giải pháp SEVAL WATER là sự kết hợp nhuần nhuyễn giữa các công nghệ lõi tiên tiến, tạo nên một hệ thống quản lý toàn diện:',
        cores: [
            {
                title: 'Nền tảng quản lý trên Bản đồ số (GIS)',
                desc: 'Toàn bộ mạng lưới hạ tầng cấp nước, bao gồm đường ống, van, đồng hồ, trạm bơm, được số hóa và trực quan hóa trên một bản đồ số 2D/3D duy nhất. Điều này giúp các nhà quản lý có cái nhìn tổng quan và chính xác về toàn bộ hệ thống, dễ dàng quản lý tài sản và theo dõi trạng thái vận hành của từng thiết bị.',
            },
            {
                title: 'Hệ thống cảm biến và Internet vạn vật (IoT)',
                desc: 'Các cảm biến IoT được lắp đặt tại các điểm quan trọng để thu thập dữ liệu về áp lực, lưu lượng nước theo thời gian thực. Dữ liệu này là "linh hồn" của hệ thống, cung cấp thông tin sống động về "dòng chảy Việt" cho các nhà quản lý.',
            },
            {
                title: 'Trí tuệ nhân tạo (AI) và Phân tích dữ liệu',
                desc: 'Dữ liệu thu thập từ các cảm biến IoT được AI phân tích để khoanh vùng và cảnh báo sớm các điểm rò rỉ, vỡ ống. Bên cạnh đó, AI còn giúp phân tích dữ liệu lịch sử để dự báo các khu vực có nguy cơ xảy ra sự cố cao, từ đó hỗ trợ công tác bảo trì dự báo một cách chủ động và hiệu quả.',
            },
        ],
        benefits_title: 'GIÁ TRỊ SEVAL MANG LẠI',
        benefits_intro:
            'SEVAL WATER không chỉ là một giải pháp công nghệ, mà còn là một khoản đầu tư mang lại lợi ích kinh tế và vận hành vượt trội:',
        benefits: [
            'Giảm thất thoát nước đáng kể: Giải pháp giúp giảm tỷ lệ thất thoát nước sạch trên 15%.',
            'Tiết kiệm chi phí vận hành: Việc tối ưu hóa quy trình quản lý và vận hành giúp tiết kiệm chi phí lên đến hơn 20%.',
            'Tăng tốc độ xử lý sự cố: Khả năng phát hiện và cảnh báo sớm giúp tăng tốc độ xử lý sự cố gấp 2-3 lần.',
            'Hỗ trợ ra quyết định thông minh: Dashboard thống kê thông minh cung cấp các số liệu quan trọng, giúp lãnh đạo đưa ra các quyết định chính xác và kịp thời.',
        ],
        outro: 'Với những ưu điểm trên, SEVAL WATER là giải pháp toàn diện và tối ưu, giúp các doanh nghiệp ngành nước giải quyết các thách thức, nâng cao hiệu quả hoạt động và hướng đến mục tiêu phát triển bền vững.',
    },
    'nong-nghiep-chinh-xac': {
        title: 'Nông nghiệp chính xác',
        subtitle: 'Ứng dụng IoT trong quản lý tưới tiêu và dinh dưỡng thông minh',
        banner: '/uploads/images/2026/02/02/1770024634433-tfvl2o.png',
        icon: <Sprout className="size-6" />,
        description:
            'Giải pháp nông nghiệp chính xác giúp người nông dân và các trang trại quy mô lớn tự động hóa quy trình chăm sóc cây trồng dựa trên dữ liệu thực tế từ đất và môi trường, đảm bảo cây trồng phát triển tối ưu với mức tiêu thụ tài nguyên thấp nhất.',
        features: [
            {
                title: 'Quan trắc độ ẩm đất',
                desc: 'Cảm biến đa điểm đo chính xác độ ẩm, nhiệt độ và EC trong đất.',
            },
            {
                title: 'Tưới tiêu tự động',
                desc: 'Lập lịch và kích hoạt tưới dựa trên ngưỡng độ ẩm thực tế của cây trồng.',
            },
        ],
        benefits: [
            'Tiết kiệm 30-50% lượng nước tưới và phân bón',
            'Tăng năng suất và chất lượng nông sản',
        ],
    },
    'quan-trac-nuoi-trong-thuy-san': {
        title: 'Quan trắc nuôi trồng thủy sản',
        subtitle: 'Hệ thống kiểm soát chất lượng môi trường nước 24/7',
        banner: '/uploads/images/2026/02/02/1770024641404-d0g5xi.png',
        icon: <Fish className="size-6" />,
        description:
            'Trong nuôi trồng thủy sản, chất lượng nước là yếu tố sống còn. Giải pháp quan trắc của chúng tôi cung cấp hệ thống giám sát liên tục các chỉ số quan trọng, tự động kích hoạt thiết bị hỗ trợ để đảm bảo môi trường sống tốt nhất cho vật nuôi.',
        features: [
            {
                title: 'Giám sát Oxy hòa tan (DO)',
                desc: 'Duy trì ngưỡng Oxy tối ưu, tự động bật máy quạt nước khi cần thiết.',
            },
        ],
        benefits: [
            'Giảm tỷ lệ hao hụt vật nuôi đáng kể',
            'Giảm chi phí điện năng vận hành máy quạt nước',
        ],
    },
};

export default function SolutionDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const data = SOLUTIONS_DATA[slug];

    if (!data) {
        notFound();
    }

    // Default values for standard layout if some fields are missing
    const description = data.description || '';
    const intro = data.intro || '';
    const cores = data.cores || [];
    const benefits = data.benefits || [];
    const image1 = data.image1 || data.banner;
    const image2 = data.image2 || data.banner;

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-slate-800">
            {/* Dark Header / Hero */}
            <section className="bg-slate-950 pt-32 pb-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-widest mb-6">
                        {data.fullTitle || data.title}
                    </h1>

                    <nav className="flex items-center justify-center gap-2 text-[11px] font-bold text-white uppercase tracking-[0.2em]">
                        <Link href="/" className="text-white/50 hover:text-white transition-colors">
                            Trang chủ
                        </Link>
                        <span className="text-white/30">/</span>
                        <span className="text-white">Giải pháp</span>
                    </nav>
                </div>
            </section>

            {/* Main Content Layout */}
            <div className="container mx-auto px-4 lg:px-24 py-16 sm:py-24 space-y-24">
                {/* Introduction Section */}
                <section className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-12 lg:gap-20">
                    <div className="relative">
                        <div className="lg:sticky lg:top-32 space-y-4">
                            <div className="h-20 sm:h-24 w-1.5 bg-brand-primary"></div>
                            <h2 className="text-3xl sm:text-4xl font-black text-brand-primary leading-tight uppercase max-w-[250px]">
                                {data.brand} <br />
                                <span className="text-slate-900">{data.title}</span>
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <p className="text-lg sm:text-xl text-slate-600 leading-[1.8] text-justify font-medium">
                            {description}
                        </p>

                        <div className="relative aspect-video lg:aspect-[16/9] w-full overflow-hidden rounded-sm shadow-2xl">
                            <Image
                                src={image1}
                                alt={data.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <p className="text-lg sm:text-xl text-slate-600 leading-[1.8] text-justify font-medium">
                            {intro}
                        </p>
                    </div>
                </section>

                {/* Core Components Section */}
                <section className="space-y-12">
                    <div className="text-center space-y-6 max-w-4xl mx-auto">
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-widest relative inline-block">
                            {data.core_title || 'THÀNH PHẦN CỐT LÕI'}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-primary"></div>
                        </h3>
                        <p className="text-lg text-slate-500 font-medium">{data.core_desc}</p>
                    </div>

                    <div className="space-y-10 pt-8">
                        {cores.map((core: any, idx: number) => (
                            <div key={idx} className="space-y-4">
                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    <span className="text-brand-primary">{core.title}</span>
                                </h4>
                                <p className="text-lg text-slate-600 leading-relaxed text-justify">
                                    {core.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="relative aspect-video lg:aspect-[21/9] w-full mt-12 overflow-hidden rounded-sm shadow-2xl">
                        <Image
                            src={image2}
                            alt="Core Components Insight"
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="space-y-12">
                    <div className="text-center space-y-6 max-w-4xl mx-auto">
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-widest relative inline-block">
                            {data.benefits_title || 'GIÁ TRỊ SEVAL MANG LẠI'}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-primary"></div>
                        </h3>
                        <p className="text-lg text-slate-500 font-medium">{data.benefits_intro}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-8">
                        {benefits.map((benefit: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="mt-1.5 size-2 bg-brand-primary shrink-0 rotate-45"></div>
                                <p className="text-lg font-bold text-slate-700 leading-snug">
                                    {benefit}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-slate-100 italic">
                        <p className="text-lg sm:text-xl text-slate-500 leading-relaxed text-center font-medium max-w-5xl mx-auto">
                            {data.outro}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
