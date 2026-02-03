'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'motion/react';

const SOLUTIONS_DATA: Record<string, any> = {
    'quan-ly-nuoc-thong-minh': {
        brand: 'SÀI GÒN VALVE WATER',
        title: 'QUẢN LÝ CẤP NƯỚC THÔNG MINH',
        headerTitle: 'SÀI GÒN VALVE WATER - QUẢN LÝ CẤP NƯỚC THÔNG MINH',
        description:
            'Ngành cấp nước Việt Nam đang đứng trước những thách thức lớn. Tỷ lệ thất thoát nước sạch trên 20% mỗi năm không chỉ gây lãng phí hàng nghìn tỷ đồng mà còn ảnh hưởng trực tiếp đến hiệu quả kinh doanh của các đơn vị cấp nước. Bên cạnh đó, việc quản lý và vận hành mạng lưới đường ống theo phương pháp thủ công, thiếu chính xác và tốn nhiều nhân lực đã trở thành "nỗi đau" dai dẳng mà công nghệ cần phải giải quyết triệt để.',
        intro: 'Để đáp ứng nhu cầu cấp thiết này, SÀI GÒN VALVE đã phát triển giải pháp SÀI GÒN VALVE WATER - Chuyển đổi số ngành cấp nước, một nền tảng quản lý thông minh mang tính đột phá. Giải pháp này không chỉ giải quyết các vấn đề hiện hữu mà còn kiến tạo một tương lai nơi mọi nguồn lực được quản lý một cách thông minh và hiệu quả hơn.',
        banner: '/uploads/images/2026/02/02/1770024627773-di5jqj.png',
        image1: '/uploads/images/2026/02/02/1770024627773-di5jqj.png',
        image2: '/uploads/images/2026/02/02/1770024641404-d0g5xi.png',
        core: {
            title: 'THÀNH PHẦN CỐT LÕI',
            intro: 'Giải pháp SÀI GÒN VALVE WATER là sự kết hợp nhuần nhuyễn giữa các công nghệ lõi tiên tiến, tạo nên một hệ thống quản lý toàn diện:',
            items: [
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
        },
        benefits: {
            title: 'GIÁ TRỊ SÀI GÒN VALVE MANG LẠI',
            intro: 'SÀI GÒN VALVE WATER không chỉ là một giải pháp công nghệ, mà còn là một khoản đầu tư mang lại lợi ích kinh tế và vận hành vượt trội:',
            items: [
                {
                    title: 'Giảm thất thoát nước đáng kể',
                    desc: 'Giải pháp giúp giảm tỷ lệ thất thoát nước sạch trên 15%.',
                },
                {
                    title: 'Tiết kiệm chi phí vận hành',
                    desc: 'Việc tối ưu hóa quy trình quản lý và vận hành giúp tiết kiệm chi phí lên đến hơn 20%.',
                },
                {
                    title: 'Tăng tốc độ xử lý sự cố',
                    desc: 'Khả năng phát hiện và cảnh báo sớm giúp tăng tốc độ xử lý sự cố gấp 2-3 lần.',
                },
                {
                    title: 'Hỗ trợ ra quyết định thông minh',
                    desc: 'Dashboard thống kê thông minh cung cấp các số liệu quan trọng, giúp lãnh đạo đưa ra các quyết định chính xác và kịp thời.',
                },
            ],
            outro: 'Với những ưu điểm trên, SÀI GÒN VALVE WATER là giải pháp toàn diện và tối ưu, giúp các doanh nghiệp ngành nước giải quyết các thách thức, nâng cao hiệu quả hoạt động và hướng đến mục tiêu phát triển bền vững.',
        },
    },
};

export default function SolutionDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const data = SOLUTIONS_DATA[slug];

    if (!data) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-900 antialiased">
            {/* Header / Hero Strip */}
            <header className="bg-brand-secondary pt-32 pb-16 text-center text-white relative">
                <div className="container mx-auto px-4 space-y-4">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-[0.1em] leading-tight">
                        {data.headerTitle}
                    </h1>
                    <nav className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                        <Link href="/" className="hover:text-brand-accent transition-colors">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <span className="text-brand-accent font-black">Giải pháp</span>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto max-w-4xl px-4 sm:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
                {/* 1. Overview Section */}
                <article className="space-y-10">
                    {/* Brand Heading with Gold Bar */}
                    <div className="flex gap-4 sm:gap-6 border-l-[6px] border-brand-accent pl-6 py-1">
                        <div className="space-y-1">
                            <h2 className="text-2xl sm:text-3xl font-black text-brand-primary uppercase tracking-tight leading-none">
                                {data.brand}
                            </h2>
                            <h3 className="text-xl sm:text-2xl font-black text-brand-secondary uppercase tracking-tight">
                                {data.title}
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-medium">
                            {data.description}
                        </p>

                        <div className="relative aspect-video w-full overflow-hidden shadow-2xl ring-1 ring-slate-100 rounded-sm">
                            <Image
                                src={data.image1}
                                alt={data.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-medium">
                            {data.intro}
                        </p>
                    </div>
                </article>

                {/* 2. Core Components Section */}
                <section className="space-y-10 sm:space-y-12">
                    <div className="text-center">
                        <h4 className="text-xl sm:text-2xl font-black text-brand-accent uppercase tracking-[0.25em]">
                            {data.core.title}
                        </h4>
                    </div>

                    <div className="space-y-8">
                        <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-medium">
                            {data.core.intro}
                        </p>

                        <div className="space-y-6">
                            {data.core.items.map((item: any, idx: number) => (
                                <div key={idx} className="space-y-2">
                                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-medium">
                                        <strong className="font-extrabold text-slate-900 uppercase tracking-tight">
                                            {item.title}:
                                        </strong>{' '}
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full mt-10 overflow-hidden shadow-2xl rounded-sm">
                        <Image
                            src={data.image2}
                            alt="Deployment Visual"
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* 3. Value Proposition Section */}
                <section className="space-y-10 sm:space-y-12 pb-20">
                    <div className="text-center">
                        <h4 className="text-xl sm:text-2xl font-black text-brand-accent uppercase tracking-[0.25em]">
                            {data.benefits.title}
                        </h4>
                    </div>

                    <div className="space-y-8">
                        <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-medium">
                            {data.benefits.intro}
                        </p>

                        <div className="space-y-6">
                            {data.benefits.items.map((item: any, idx: number) => (
                                <div key={idx} className="space-y-1">
                                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-medium">
                                        <strong className="font-extrabold text-slate-900 uppercase tracking-tight">
                                            {item.title}:
                                        </strong>{' '}
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-medium pt-12">
                            {data.benefits.outro}
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
