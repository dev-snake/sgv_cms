import 'dotenv/config';
import { db } from './index';
import { categories, projects, categoryTypes } from './schema';
import { eq } from 'drizzle-orm';

const SAMPLE_PROJECTS = [
  {
    name: 'Nhà máy nước Thủ Đức - Giai đoạn 2',
    slug: 'nha-may-nuoc-thu-duc-giai-doan-2',
    description: 'Cung cấp hệ thống van và thiết bị điều khiển cho dự án mở rộng công suất nhà máy nước Thủ Đức lên 300.000 m³/ngày.',
    client_name: 'SAWACO',
    category_name: 'Hệ Thống Cấp Nước',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/z6809258125215_0bfd24b1d2a12247ce2fe99f8bc81598-306x234-5.jpg',
    status: 'completed' as const,
    start_date: '2024-01-15',
    end_date: '2024-12-20',
  },
  {
    name: 'Hệ thống SCADA Cấp nước An Giang',
    slug: 'he-thong-scada-cap-nuoc-an-giang',
    description: 'Triển khai hệ thống SCADA giám sát và điều khiển từ xa cho mạng lưới cấp nước toàn tỉnh An Giang.',
    client_name: 'Công ty CP Cấp nước An Giang',
    category_name: 'Tự động hóa',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/-i-u-khi-n-gi-m-s-t-306x234-5.png',
    status: 'ongoing' as const,
    start_date: '2025-02-01',
  },
  {
    name: 'Trạm bơm tăng áp Quận 9',
    slug: 'tram-bom-tang-ap-quan-9',
    description: 'Lắp đặt van điều khiển và hệ thống giám sát cho trạm bơm tăng áp phục vụ 50.000 hộ dân.',
    client_name: 'SAWACO',
    category_name: 'Hệ Thống Cấp Nước',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/T-QUAN-TR-C-.png',
    status: 'completed' as const,
    start_date: '2023-06-01',
    end_date: '2024-03-15',
  },
  {
    name: 'Nhà máy xử lý nước thải Bình Hưng',
    slug: 'nha-may-xu-ly-nuoc-thai-binh-hung',
    description: 'Cung cấp van bướm OKM và actuator NOAH cho hệ thống xử lý nước thải công suất 141.000 m³/ngày.',
    client_name: 'BQL Dự án Xây dựng Hạ tầng Đô thị',
    category_name: 'Xử Lý Nước Thải',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg',
    status: 'completed' as const,
    start_date: '2022-08-01',
    end_date: '2024-06-30',
  },
  {
    name: 'Hệ thống quan trắc chất lượng nước Đồng Nai',
    slug: 'he-thong-quan-trac-chat-luong-nuoc-dong-nai',
    description: 'Triển khai 20 trạm quan trắc chất lượng nước tự động trên sông Đồng Nai với cảm biến đo pH, độ đục, Clo dư.',
    client_name: 'Cấp nước Đồng Nai',
    category_name: 'Tự động hóa',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
    status: 'ongoing' as const,
    start_date: '2025-01-10',
  },
  {
    name: 'Khu công nghiệp VSIP Bình Dương',
    slug: 'khu-cong-nghiep-vsip-binh-duong',
    description: 'Cung cấp thiết bị van và phụ kiện cho hệ thống cấp nước khu công nghiệp VSIP II.',
    client_name: 'VSIP Bình Dương',
    category_name: 'Hệ Thống Cấp Nước',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
    status: 'completed' as const,
    start_date: '2023-03-01',
    end_date: '2023-12-15',
  },
  {
    name: 'Nhà máy nước Tân Hiệp - Hóc Môn',
    slug: 'nha-may-nuoc-tan-hiep-hoc-mon',
    description: 'Lắp đặt hệ thống van an toàn và van giảm áp cho nhà máy nước công suất 300.000 m³/ngày.',
    client_name: 'SAWACO',
    category_name: 'Hệ Thống Cấp Nước',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/04/17/thumbs/IOT-306x234-5.png',
    status: 'completed' as const,
    start_date: '2022-01-01',
    end_date: '2023-06-30',
  },
  {
    name: 'Hệ thống IoT giám sát áp suất TP Cần Thơ',
    slug: 'he-thong-iot-giam-sat-ap-suat-can-tho',
    description: 'Triển khai 50 điểm đo áp suất trực tuyến với Datalogger SV1-DAQ truyền về trung tâm điều hành.',
    client_name: 'Công ty CP Cấp nước Cần Thơ',
    category_name: 'Tự động hóa',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
    status: 'ongoing' as const,
    start_date: '2024-11-01',
  },
  {
    name: 'Trạm xử lý nước thải KCN Long Thành',
    slug: 'tram-xu-ly-nuoc-thai-kcn-long-thanh',
    description: 'Cung cấp van và thiết bị đo lường cho trạm xử lý nước thải công suất 5.000 m³/ngày.',
    client_name: 'BQL KCN Long Thành',
    category_name: 'Xử Lý Nước Thải',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-306x234-5.png',
    status: 'completed' as const,
    start_date: '2024-02-01',
    end_date: '2024-08-30',
  },
  {
    name: 'Dự án chống thất thoát nước Bình Thuận',
    slug: 'du-an-chong-that-thoat-nuoc-binh-thuan',
    description: 'Lắp đặt 100 đồng hồ đo lưu lượng điện từ và hệ thống DMA để giảm thất thoát nước từ 35% xuống 18%.',
    client_name: 'Công ty CP Cấp nước Bình Thuận',
    category_name: 'Tự động hóa',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png',
    status: 'ongoing' as const,
    start_date: '2024-06-01',
  },
  {
    name: 'Nhà máy xử lý nước thải Thủ Dầu Một',
    slug: 'nha-may-xu-ly-nuoc-thai-thu-dau-mot',
    description: 'Cung cấp van cổng và van bướm cho nhà máy xử lý nước thải sinh hoạt công suất 17.000 m³/ngày.',
    client_name: 'UBND TP Thủ Dầu Một',
    category_name: 'Xử Lý Nước Thải',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/z6809258125215_0bfd24b1d2a12247ce2fe99f8bc81598-306x234-5.jpg',
    status: 'completed' as const,
    start_date: '2023-09-01',
    end_date: '2024-12-01',
  },
  {
    name: 'Hệ thống cấp nước khu đô thị Vinhomes Grand Park',
    slug: 'he-thong-cap-nuoc-vinhomes-grand-park',
    description: 'Cung cấp toàn bộ van và phụ kiện cho hệ thống cấp nước sinh hoạt khu đô thị 30.000 căn hộ.',
    client_name: 'Vinhomes',
    category_name: 'Hệ Thống Cấp Nước',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/-i-u-khi-n-gi-m-s-t-306x234-5.png',
    status: 'completed' as const,
    start_date: '2021-06-01',
    end_date: '2023-03-30',
  },
];

async function main() {
  console.log('Seeding projects...');

  // Get project type
  const projectType = await db.select().from(categoryTypes).where(eq(categoryTypes.name, 'project'));
  if (projectType.length === 0) {
    console.error('Project type not found. Run main seed first.');
    return;
  }

  // Get all categories
  const allCategories = await db.select().from(categories);
  
  // Create missing categories
  const neededCategories = ['Hệ Thống Cấp Nước', 'Xử Lý Nước Thải', 'Tự động hóa'];
  for (const catName of neededCategories) {
    const exists = allCategories.find(c => c.name === catName);
    if (!exists) {
      await db.insert(categories).values({ name: catName, category_type_id: projectType[0].id });
      console.log(`Created category: ${catName}`);
    }
  }
  
  // Refresh categories
  const updatedCategories = await db.select().from(categories);

  for (const project of SAMPLE_PROJECTS) {
    const category = updatedCategories.find(c => c.name === project.category_name);
    if (!category) {
      console.log(`Category not found for ${project.name}: ${project.category_name}`);
      continue;
    }

    // Check if project already exists
    const existing = await db.select().from(projects).where(eq(projects.slug, project.slug));
    if (existing.length > 0) {
      console.log(`Project already exists: ${project.name}`);
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
