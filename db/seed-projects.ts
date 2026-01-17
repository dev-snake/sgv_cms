import 'dotenv/config';
import { db } from './index';
import { categories, projects, categoryTypes } from './schema';
import { eq } from 'drizzle-orm';

const SAMPLE_PROJECTS = [
    {
        name: 'DỰ ÁN CẤP NƯỚC SẠCH TP. THỦ ĐỨC - GIAI ĐOẠN 2',
        slug: 'nha-may-nuoc-thu-duc-giai-doan-2',
        description:
            'Cung cấp hệ thống van bướm OKM đường kính lên tới DN1200 và bộ điều khiển điện thông minh NOAH phục vụ mở rộng công suất nhà máy nhằm đáp ứng nhu cầu nước sạch cho 1 triệu dân.',
        client_name: 'SAWACO (Tổng Công ty Cấp nước Sài Gòn)',
        category_name: 'Hệ Thống Cấp Nước',
        image_url:
            'https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/z6809258125215_0bfd24b1d2a12247ce2fe99f8bc81598-306x234-5.jpg',
        status: 'completed' as const,
        start_date: '2024-01-15',
        end_date: '2024-12-20',
    },
    {
        name: 'Hệ thống SCADA Giám sát mạng lưới An Giang',
        slug: 'he-thong-scada-cap-nuoc-an-giang',
        description:
            'Xây dựng trung tâm điều hành tập trung (NOC) và lắp đặt các trạm Datalogger SV1-DAQ để giám sát áp lực, lưu lượng và chất lượng nước trên toàn mạng lưới cấp nước tỉnh An Giang.',
        client_name: 'BIWASE An Giang',
        category_name: 'Tự động hóa',
        image_url:
            'https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/-i-u-khi-n-gi-m-s-t-306x234-5.png',
        status: 'ongoing' as const,
        start_date: '2025-02-01',
    },
    {
        name: 'Cung cấp van cho Trạm bơm tăng áp Quận 9',
        slug: 'tram-bom-tang-ap-quan-9',
        description:
            'Lắp đặt các dòng van giảm áp lực Arita và van bi điều khiển điện giúp ổn định áp suất mạng lưới, giảm thiểu nguy cơ bục vỡ đường ống truyền tải chính.',
        client_name: 'Công ty Cấp nước Thủ Đức',
        category_name: 'Hệ Thống Cấp Nước',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/T-QUAN-TR-C-.png',
        status: 'completed' as const,
        start_date: '2023-06-01',
        end_date: '2024-03-15',
    },
    {
        name: 'Xử lý nước thải tập trung KCN Bình Hưng',
        slug: 'nha-may-xu-ly-nuoc-thai-binh-hung',
        description:
            'Giải pháp trọn gói thiết bị cơ điện cho hệ thống xử lý nước thải sinh hoạt và công nghiệp, bao gồm van một chiều cánh lật OKM và cảm biến nồng độ bùn TSS.',
        client_name: 'BQL Hạ tầng Đô thị TP.HCM',
        category_name: 'Xử Lý Nước Thải',
        image_url:
            'https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg',
        status: 'completed' as const,
        start_date: '2022-08-01',
        end_date: '2024-06-30',
    },
    {
        name: 'Quan trắc nước mặt tự động sông Đồng Nai',
        slug: 'he-thong-quan-trac-chat-luong-nuoc-dong-nai',
        description:
            'Thiết lập các trạm nổi tích hợp cảm biến đo Online: Độ đục, pH, Clo dư và Datalogger truyền dữ liệu 1 phút/lần về sở TN&MT tỉnh Đồng Nai.',
        client_name: 'Sở Tài nguyên và Môi trường Đồng Nai',
        category_name: 'Tự động hóa',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
        status: 'ongoing' as const,
        start_date: '2025-01-10',
    },
    {
        name: 'Hạ tầng cấp nước KCN VSIP III Bình Dương',
        slug: 'khu-cong-nghiep-vsip-binh-duong',
        description:
            'Cung cấp hàng nghìn van cổng và trụ cấp nước PCCC cho khu công nghiệp cao công nghệ VSIP III, đảm bảo hạ tầng kết nối cho các doanh nghiệp FDI.',
        client_name: 'BECAMEX IDC',
        category_name: 'Hệ Thống Cấp Nước',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
        status: 'completed' as const,
        start_date: '2023-03-01',
        end_date: '2023-12-15',
    },
    {
        name: 'Dự án thông minh hóa mạng lưới nước Cần Thơ',
        slug: 'he-thong-iot-giam-sat-ap-suat-can-tho',
        description:
            'Ứng dụng công nghệ Internet of Things (IoT) để quản lý vùng áp lực DMA, giúp tiết kiệm chi phí nhân công đọc số và phát hiện rò rỉ sớm tới 90%.',
        client_name: 'Công ty Cấp nước CanthoWaco',
        category_name: 'Tự động hóa',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
        status: 'ongoing' as const,
        start_date: '2024-11-01',
    },
    {
        name: 'Nâng cấp Nhà máy nước Tân Hiệp',
        slug: 'nha-may-nuoc-tan-hiep-hoc-mon',
        description:
            'Hiện đại hóa hệ thống điều khiển và bảo vệ bằng van xả khí kép Arita, ngăn ngừa búa nước gây vỡ ống truyền tải nước thô.',
        client_name: 'SAWACO',
        category_name: 'Hệ Thống Cấp Nước',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/04/17/thumbs/IOT-306x234-5.png',
        status: 'completed' as const,
        start_date: '2022-01-01',
        end_date: '2023-06-30',
    },
    {
        name: 'Quan trắc nước thải đầu ra KCN Long Thành',
        slug: 'tram-xu-ly-nuoc-thai-kcn-long-thanh',
        description:
            'Lắp đặt máy đo COD Online quang học và lưu lượng kênh hở siêu âm cho khu công nghiệp lớn tại Đồng Nai, truyền dữ liệu trực tiếp về tổng cục môi trường.',
        client_name: 'Donacoop',
        category_name: 'Xử Lý Nước Thải',
        image_url:
            'https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-306x234-5.png',
        status: 'completed' as const,
        start_date: '2024-02-01',
        end_date: '2024-08-30',
    },
    {
        name: 'Smart Water cho Đô thị Vinhomes Grand Park',
        slug: 'he-thong-cap-nuoc-vinhomes-grand-park',
        description:
            'Giải pháp van điều khiển điện cho hệ thống tưới cây tự động và cấp nước sinh hoạt cho đại đô thị thông minh tại TP. Thủ Đức.',
        client_name: 'Tập đoàn Vingroup',
        category_name: 'Hệ Thống Cấp Nước',
        image_url:
            'https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/-i-u-khi-n-gi-m-s-t-306x234-5.png',
        status: 'completed' as const,
        start_date: '2021-06-01',
        end_date: '2023-03-30',
    },
    {
        name: 'Phòng cháy chữa cháy Nhà máy lọc dầu Nghi Sơn',
        slug: 'pccc-loc-dau-nghi-son',
        description:
            'Cung cấp van cổng đạt chuẩn UL/FM và van báo động cho hệ thống phòng cháy chữa cháy cực kỳ nghiêm ngặt tại khu kinh tế Nghi Sơn.',
        client_name: 'NSRP LLC',
        category_name: 'Hệ Thống Cấp Nước',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
        status: 'completed' as const,
        start_date: '2022-05-15',
        end_date: '2023-10-30',
    },
    {
        name: 'Giám sát xâm nhập mặn Đồng bằng sông Cửu Long',
        slug: 'giam-sat-man-dbscl',
        description:
            'Dự án cấp bách lắp đặt 30 trạm đo độ mặn (EC) kết nối 4G để hỗ trợ nông dân chủ động trong sản xuất nông nghiệp.',
        client_name: 'Sở Nông nghiệp và PTNT tỉnh Tiền Giang',
        category_name: 'Tự động hóa',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
        status: 'ongoing' as const,
        start_date: '2024-12-01',
    },
];

async function main() {
    console.log('Seeding projects...');

    // Get project type
    const projectType = await db
        .select()
        .from(categoryTypes)
        .where(eq(categoryTypes.name, 'project'));
    if (projectType.length === 0) {
        console.error('Project type not found. Run main seed first.');
        return;
    }

    // Get all categories
    const allCategories = await db.select().from(categories);

    // Create missing categories
    const neededCategories = ['Hệ Thống Cấp Nước', 'Xử Lý Nước Thải', 'Tự động hóa'];
    for (const catName of neededCategories) {
        const exists = allCategories.find((c) => c.name === catName);
        if (!exists) {
            await db
                .insert(categories)
                .values({ name: catName, category_type_id: projectType[0].id });
            console.log(`Created category: ${catName}`);
        }
    }

    // Refresh categories
    const updatedCategories = await db.select().from(categories);

    for (const project of SAMPLE_PROJECTS) {
        const category = updatedCategories.find((c) => c.name === project.category_name);
        if (!category) {
            console.log(`Category not found for ${project.name}: ${project.category_name}`);
            continue;
        }

        // Check if project already exists
        const existing = await db.select().from(projects).where(eq(projects.slug, project.slug));
        if (existing.length > 0) {
            console.log(`Project already exists (skipping): ${project.name}`);
            continue;
        }

        await db.insert(projects).values({
            name: project.name,
            slug: project.slug,
            description: project.description,
            client_name: project.client_name,
            category_id: category.id,
            image_url: project.image_url,
            status: project.status,
            start_date: project.start_date ? new Date(project.start_date) : null,
            end_date: project.end_date ? new Date(project.end_date) : null,
        });
        console.log(`Added project: ${project.name}`);
    }

    console.log('Projects seeding completed!');
}

main().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
