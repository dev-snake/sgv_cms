import 'dotenv/config';
import { db } from './index';
import { categories, products, categoryTypes } from './schema';
import { eq } from 'drizzle-orm';

const SAMPLE_PRODUCTS = [
  {
    name: 'VAN BƯỚM OKM SERIES 612X',
    slug: 'van-buom-okm-series-612x',
    description: 'Van bướm chịu áp cao dùng cho hệ thống nước sạch và xử lý nước thải.',
    sku: 'OKM-612X-01',
    category_name: 'Van Công Nghiệp',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
    tech_summary: 'Sử dụng cho hệ thống nước sạch và xử lý nước thải, tiêu chuẩn Nhật Bản.',
    is_featured: true,
    warranty: '24 tháng',
    origin: 'OKM Japan',
  },
  {
    name: 'ACTUATOR ĐIỆN NOAH SERIES NA',
    slug: 'actuator-dien-noah-series-na',
    description: 'Bộ điều khiển điện tiêu chuẩn IP67/IP68 cho van công nghiệp.',
    sku: 'NOAH-NA-01',
    category_name: 'Bộ Điều Khiển',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/04/17/thumbs/IOT-306x234-5.png',
    tech_summary: 'Bộ điều khiển điện tiêu chuẩn IP67/IP68, tương thích SCADA.',
    is_featured: true,
    warranty: '24 tháng',
    origin: 'NOAH Korea',
  },
  {
    name: 'CẢM BIẾN ĐỘ ĐỤC SGVT420',
    slug: 'cam-bien-do-duc-sgvt420',
    description: 'Cảm biến đo độ đục trực tuyến độ chính xác cao với bàn chải tự làm sạch.',
    sku: 'SGVT-420',
    category_name: 'Thiết Bị Đo',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
    tech_summary: 'Cảm biến đo độ đục trực tuyến độ chính xác cao, IP68.',
    is_featured: true,
    warranty: '12 tháng',
    origin: 'SGV Solution',
  },
  {
    name: 'DATALOGGER SV1-DAQ',
    slug: 'datalogger-sv1-daq',
    description: 'Thiết bị thu nhận và truyền dữ liệu thông minh qua mạng 4G/LTE/NBIoT.',
    sku: 'SV1-DAQ-01',
    category_name: 'Phụ kiện IoT',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
    tech_summary: 'Truyền dữ liệu qua mạng 4G/LTE/NBIoT, tích hợp SCADA.',
    is_featured: true,
    warranty: '12 tháng',
    origin: 'SGV Solution',
  },
  {
    name: 'VAN BI ĐIỀU KHIỂN ĐIỆN NOAH',
    slug: 'van-bi-dieu-khien-dien-noah',
    description: 'Giải pháp đóng mở tự động cho đường ống cỡ nhỏ đến trung bình.',
    sku: 'NOAH-BV-01',
    category_name: 'Van Công Nghiệp',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/T-QUAN-TR-C-.png',
    tech_summary: 'Giải pháp đóng mở tự động cho đường ống cỡ nhỏ.',
    is_featured: false,
    warranty: '24 tháng',
    origin: 'NOAH Korea',
  },
  {
    name: 'HỆ THỐNG SCADA GIÁM SÁT',
    slug: 'he-thong-scada-giam-sat',
    description: 'Phần mềm quản lý mạng lưới nước tập trung, giám sát 24/7.',
    sku: 'SGV-SCADA-01',
    category_name: 'Phụ kiện IoT',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png',
    tech_summary: 'Phần mềm quản lý mạng lưới nước tập trung.',
    is_featured: true,
    warranty: '12 tháng',
    origin: 'SGV Solution',
  },
  {
    name: 'VAN CỔNG TY CHÌM ARITA',
    slug: 'van-cong-ty-chim-arita',
    description: 'Van cổng tiêu chuẩn BS5163 dùng trong PCCC & Cấp nước.',
    sku: 'ARITA-GV-01',
    category_name: 'Van Công Nghiệp',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
    tech_summary: 'Tiêu chuẩn BS5163 dùng trong PCCC & Cấp nước.',
    is_featured: false,
    warranty: '24 tháng',
    origin: 'Arita Taiwan',
  },
  {
    name: 'CẢM BIẾN ÁP SUẤT SGV-P10',
    slug: 'cam-bien-ap-suat-sgv-p10',
    description: 'Đo áp suất mạng lưới, tích hợp ngõ ra 4-20mA và RS485.',
    sku: 'SGV-P10',
    category_name: 'Thiết Bị Đo',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
    tech_summary: 'Đo áp suất mạng lưới, tích hợp ngõ ra 4-20mA.',
    is_featured: false,
    warranty: '12 tháng',
    origin: 'SGV Solution',
  },
  {
    name: 'VAN MỘT CHIỀU CÁNH LẬT OKM',
    slug: 'van-mot-chieu-canh-lat-okm',
    description: 'Ngăn dòng chảy ngược, thiết kế tối ưu hóa lưu lượng.',
    sku: 'OKM-CV-01',
    category_name: 'Van Công Nghiệp',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
    tech_summary: 'Ngăn dòng chảy ngược, thiết kế tối ưu hóa lưu lượng.',
    is_featured: false,
    warranty: '24 tháng',
    origin: 'OKM Japan',
  },
  {
    name: 'BỘ ĐIỀU KHIỂN KHÍ NÉN NOAH',
    slug: 'bo-dieu-khien-khi-nen-noah',
    description: 'Pneumatic Actuator cho các ứng dụng công nghiệp nặng.',
    sku: 'NOAH-PA-01',
    category_name: 'Bộ Điều Khiển',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/04/17/thumbs/IOT-306x234-5.png',
    tech_summary: 'Pneumatic Actuator cho các ứng dụng công nghiệp nặng.',
    is_featured: false,
    warranty: '24 tháng',
    origin: 'NOAH Korea',
  },
  {
    name: 'ĐỒNG HỒ ĐO LƯU LƯỢNG ĐIỆN TỪ',
    slug: 'dong-ho-do-luu-luong-dien-tu',
    description: 'Đo lưu lượng nước thải và nước cấp độ chính xác cao.',
    sku: 'SGV-EMF-01',
    category_name: 'Thiết Bị Đo',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
    tech_summary: 'Đo lưu lượng nước thải và nước cấp độ chính xác cao.',
    is_featured: true,
    warranty: '18 tháng',
    origin: 'SGV Solution',
  },
  {
    name: 'VAN GIẢM ÁP ARITA',
    slug: 'van-giam-ap-arita',
    description: 'Ổn định áp suất đường ống trong hệ thống cấp nước.',
    sku: 'ARITA-PRV-01',
    category_name: 'Van Công Nghiệp',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
    tech_summary: 'Ổn định áp suất đường ống trong hệ thống cấp nước.',
    is_featured: false,
    warranty: '24 tháng',
    origin: 'Arita Taiwan',
  },
  {
    name: 'CÔNG TẮC ÁP SUẤT NOAH',
    slug: 'cong-tac-ap-suat-noah',
    description: 'Giám sát ngưỡng áp suất cho bơm và bình tích áp.',
    sku: 'NOAH-PS-01',
    category_name: 'Thiết Bị Đo',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
    tech_summary: 'Giám sát ngưỡng áp suất cho bơm và bình tích áp.',
    is_featured: false,
    warranty: '12 tháng',
    origin: 'NOAH Korea',
  },
  {
    name: 'MODULE TRUYỀN TIN SV1-MOD',
    slug: 'module-truyen-tin-sv1-mod',
    description: 'Chuyển đổi các tín hiệu Modbus RTU sang MQTT/Cloud.',
    sku: 'SV1-MOD-01',
    category_name: 'Phụ kiện IoT',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
    tech_summary: 'Chuyển đổi các tín hiệu Modbus RTU sang MQTT/Cloud.',
    is_featured: false,
    warranty: '12 tháng',
    origin: 'SGV Solution',
  },
  {
    name: 'CẢM BIẾN CLO DƯ SGVC100',
    slug: 'cam-bien-clo-du-sgvc100',
    description: 'Đo nồng độ Clo dư trong nước cấp, độ chính xác cao.',
    sku: 'SGVC-100',
    category_name: 'Thiết Bị Đo',
    image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
    tech_summary: 'Đo nồng độ Clo dư trong nước cấp, độ chính xác cao.',
    is_featured: true,
    warranty: '12 tháng',
    origin: 'SGV Solution',
  },
  {
    name: 'VAN ĐIỆN TỪ SOLENOID',
    slug: 'van-dien-tu-solenoid',
    description: 'Van điện từ đóng mở nhanh cho các hệ thống tự động hóa.',
    sku: 'SGV-SOL-01',
    category_name: 'Van Công Nghiệp',
    image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
    tech_summary: 'Van điện từ đóng mở nhanh cho các hệ thống tự động hóa.',
    is_featured: false,
    warranty: '12 tháng',
    origin: 'SGV Solution',
  },
];

async function main() {
  console.log('Seeding products...');

  // Get product type
  const productType = await db.select().from(categoryTypes).where(eq(categoryTypes.name, 'product'));
  if (productType.length === 0) {
    console.error('Product type not found. Run main seed first.');
    return;
  }

  // Get all categories
  const allCategories = await db.select().from(categories);
  
  // Create missing categories
  const neededCategories = ['Van Công Nghiệp', 'Bộ Điều Khiển', 'Thiết Bị Đo', 'Phụ kiện IoT'];
  for (const catName of neededCategories) {
    const exists = allCategories.find(c => c.name === catName);
    if (!exists) {
      await db.insert(categories).values({ name: catName, category_type_id: productType[0].id });
      console.log(`Created category: ${catName}`);
    }
  }
  
  // Refresh categories
  const updatedCategories = await db.select().from(categories);

  for (const product of SAMPLE_PRODUCTS) {
    const category = updatedCategories.find(c => c.name === product.category_name);
    if (!category) {
      console.log(`Category not found for ${product.name}: ${product.category_name}`);
      continue;
    }

    // Check if product already exists
    const existing = await db.select().from(products).where(eq(products.slug, product.slug));
    if (existing.length > 0) {
      console.log(`Product already exists: ${product.name}`);
      continue;
    }

    await db.insert(products).values({
      name: product.name,
      slug: product.slug,
      description: product.description,
      sku: product.sku,
      price: '0.00',
      stock: 50,
      category_id: category.id,
      image_url: product.image_url,
      tech_summary: product.tech_summary,
      is_featured: product.is_featured,
      warranty: product.warranty,
      origin: product.origin,
      availability: 'Sẵn hàng tại kho HCM',
      delivery_info: 'Toàn quốc (2-3 ngày)',
      status: 'active',
    });
    console.log(`Added product: ${product.name}`);
  }

  console.log('Products seeding completed!');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
