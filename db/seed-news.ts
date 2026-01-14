import 'dotenv/config';
import { db } from './index';
import { categories, authors, newsArticles, categoryTypes } from './schema';
import { eq } from 'drizzle-orm';

const SAMPLE_NEWS = [
  {
    title: 'Sài Gòn Valve cung cấp van cho dự án Nhà máy nước Thủ Đức',
    slug: 'sai-gon-valve-cung-cap-van-cho-du-an-nha-may-nuoc-thu-duc',
    summary: 'Hoàn thành bàn giao hệ thống van OKM và actuator NOAH cho dự án mở rộng công suất nhà máy nước Thủ Đức.',
    content: 'Sài Gòn Valve vừa hoàn thành bàn giao lô hàng van bướm OKM series 612X và bộ điều khiển điện NOAH cho dự án mở rộng công suất Nhà máy nước Thủ Đức lên 300.000 m³/ngày.\n\nDự án được triển khai từ đầu năm 2024 với tổng giá trị thiết bị hơn 5 tỷ đồng, bao gồm van bướm các kích thước từ DN200 đến DN800.',
    category_name: 'Tin tức chung',
    status: 'published' as const,
  },
  {
    title: 'Ra mắt cảm biến đo độ đục thế hệ mới SGVT420',
    slug: 'ra-mat-cam-bien-do-do-duc-the-he-moi-sgvt420',
    summary: 'Cảm biến độ đục SGVT420 với bàn chải tự làm sạch, độ chính xác cao và khả năng chống nhiễu tốt.',
    content: 'Sài Gòn Valve chính thức ra mắt dòng cảm biến đo độ đục thế hệ mới SGVT420, được thiết kế với công nghệ tán xạ ánh sáng 90° và bàn chải tự làm sạch.\n\nSản phẩm đáp ứng tiêu chuẩn IP68, phù hợp cho các ứng dụng đo trực tuyến trong môi trường khắc nghiệt.',
    category_name: 'Kiến thức kỹ thuật',
    status: 'published' as const,
  },
  {
    title: 'Hội thảo giới thiệu giải pháp IoT cho ngành nước',
    slug: 'hoi-thao-gioi-thieu-giai-phap-iot-cho-nganh-nuoc',
    summary: 'Sài Gòn Valve tổ chức hội thảo giới thiệu các giải pháp IoT và tự động hóa cho ngành cấp thoát nước.',
    content: 'Ngày 15/3/2025, Sài Gòn Valve đã tổ chức thành công hội thảo "Giải pháp IoT thông minh cho ngành nước" tại TP.HCM với sự tham gia của hơn 100 đại biểu từ các công ty cấp nước trên toàn quốc.\n\nHội thảo giới thiệu các giải pháp Datalogger, SCADA và hệ thống quan trắc chất lượng nước.',
    category_name: 'Sự kiện công ty',
    status: 'published' as const,
  },
  {
    title: 'Hướng dẫn bảo trì van bướm công nghiệp',
    slug: 'huong-dan-bao-tri-van-buom-cong-nghiep',
    summary: 'Tổng hợp các bước bảo trì định kỳ và xử lý sự cố thường gặp với van bướm công nghiệp.',
    content: 'Van bướm là thiết bị quan trọng trong hệ thống đường ống công nghiệp. Việc bảo trì định kỳ giúp kéo dài tuổi thọ và đảm bảo vận hành ổn định.\n\n1. Kiểm tra gioăng làm kín mỗi 6 tháng\n2. Bôi trơn trục van định kỳ\n3. Kiểm tra actuator và tín hiệu điều khiển',
    category_name: 'Kiến thức kỹ thuật',
    status: 'published' as const,
  },
  {
    title: 'Sài Gòn Valve được vinh danh Top 10 nhà cung cấp thiết bị nước',
    slug: 'sai-gon-valve-duoc-vinh-danh-top-10-nha-cung-cap-thiet-bi-nuoc',
    summary: 'Công ty được vinh danh trong danh sách Top 10 nhà cung cấp thiết bị ngành nước uy tín nhất Việt Nam năm 2024.',
    content: 'Tại lễ trao giải thường niên của Hội Cấp thoát nước Việt Nam, Sài Gòn Valve vinh dự được xướng tên trong danh sách Top 10 nhà cung cấp thiết bị ngành nước uy tín nhất năm 2024.\n\nĐây là năm thứ 3 liên tiếp công ty nhận được danh hiệu này.',
    category_name: 'Sự kiện công ty',
    status: 'published' as const,
  },
  {
    title: 'So sánh van cổng và van bướm: Lựa chọn nào phù hợp?',
    slug: 'so-sanh-van-cong-va-van-buom-lua-chon-nao-phu-hop',
    summary: 'Phân tích ưu nhược điểm của van cổng và van bướm để giúp bạn đưa ra lựa chọn đúng đắn.',
    content: 'Van cổng và van bướm đều được sử dụng phổ biến trong hệ thống đường ống. Tuy nhiên, mỗi loại có những ưu điểm riêng phù hợp với các ứng dụng khác nhau.\n\nVan cổng: Độ kín cao, tổn thất áp suất thấp, phù hợp đóng/mở hoàn toàn.\nVan bướm: Gọn nhẹ, giá thành thấp, thao tác nhanh, phù hợp điều tiết lưu lượng.',
    category_name: 'Kiến thức kỹ thuật',
    status: 'published' as const,
  },
  {
    title: 'Triển khai hệ thống SCADA cho Cấp nước Đồng Nai',
    slug: 'trien-khai-he-thong-scada-cho-cap-nuoc-dong-nai',
    summary: 'Hoàn thành lắp đặt 20 trạm quan trắc và hệ thống SCADA giám sát toàn mạng lưới.',
    content: 'Sài Gòn Valve vừa hoàn thành triển khai hệ thống SCADA giám sát mạng lưới cấp nước cho Công ty CP Cấp nước Đồng Nai.\n\nHệ thống bao gồm 20 trạm quan trắc tự động với các cảm biến đo áp suất, lưu lượng và chất lượng nước.',
    category_name: 'Tin tức chung',
    status: 'published' as const,
  },
  {
    title: 'Thông số kỹ thuật Datalogger SV1-DAQ',
    slug: 'thong-so-ky-thuat-datalogger-sv1-daq',
    summary: 'Chi tiết thông số kỹ thuật và hướng dẫn cấu hình Datalogger SV1-DAQ.',
    content: 'Datalogger SV1-DAQ là thiết bị thu thập và truyền dữ liệu thông minh được phát triển bởi Sài Gòn Valve.\n\nThông số chính:\n- Kết nối: 4G/LTE/NBIoT\n- Giao thức: MQTT, Modbus RTU\n- Số kênh analog: 4 kênh 4-20mA\n- Nguồn: Pin lithium hoặc 12V DC',
    category_name: 'Kiến thức kỹ thuật',
    status: 'published' as const,
  },
  {
    title: 'Chương trình khuyến mãi cuối năm 2024',
    slug: 'chuong-trinh-khuyen-mai-cuoi-nam-2024',
    summary: 'Ưu đãi đặc biệt dành cho khách hàng mua sắm thiết bị trong tháng 12/2024.',
    content: 'Nhân dịp cuối năm, Sài Gòn Valve triển khai chương trình khuyến mãi đặc biệt:\n\n- Giảm 10% cho đơn hàng van OKM từ 50 triệu\n- Tặng 1 năm bảo hành mở rộng cho actuator NOAH\n- Miễn phí vận chuyển toàn quốc',
    category_name: 'Sự kiện công ty',
    status: 'published' as const,
  },
  {
    title: 'Tiêu chuẩn chọn van cho hệ thống PCCC',
    slug: 'tieu-chuan-chon-van-cho-he-thong-pccc',
    summary: 'Các tiêu chuẩn quan trọng khi lựa chọn van cho hệ thống phòng cháy chữa cháy.',
    content: 'Hệ thống PCCC đòi hỏi các thiết bị có độ tin cậy cao và đáp ứng các tiêu chuẩn nghiêm ngặt.\n\nCác tiêu chuẩn cần lưu ý:\n- Chứng nhận FM hoặc UL\n- Áp lực làm việc tối thiểu PN16\n- Vật liệu chống ăn mòn\n- Thời gian đáp ứng nhanh',
    category_name: 'Kiến thức kỹ thuật',
    status: 'published' as const,
  },
];

async function main() {
  console.log('Seeding news articles...');

  // Get news type
  const newsType = await db.select().from(categoryTypes).where(eq(categoryTypes.name, 'news'));
  if (newsType.length === 0) {
    console.error('News type not found. Run main seed first.');
    return;
  }

  // Get or create categories
  const allCategories = await db.select().from(categories);
  const neededCategories = ['Tin tức chung', 'Sự kiện công ty', 'Kiến thức kỹ thuật'];
  
  for (const catName of neededCategories) {
    const exists = allCategories.find(c => c.name === catName);
    if (!exists) {
      await db.insert(categories).values({ name: catName, category_type_id: newsType[0].id });
      console.log(`Created category: ${catName}`);
    }
  }
  
  // Refresh categories
  const updatedCategories = await db.select().from(categories);

  // Get default author
  const allAuthors = await db.select().from(authors);
  let defaultAuthor = allAuthors[0];
  
  if (!defaultAuthor) {
    const [newAuthor] = await db.insert(authors).values({ 
      name: 'SGV Admin', 
      role: 'Content Manager' 
    }).returning();
    defaultAuthor = newAuthor;
    console.log('Created default author: SGV Admin');
  }

  for (const news of SAMPLE_NEWS) {
    const category = updatedCategories.find(c => c.name === news.category_name);
    if (!category) {
      console.log(`Category not found for ${news.title}: ${news.category_name}`);
      continue;
    }

    // Check if news already exists
    const existing = await db.select().from(newsArticles).where(eq(newsArticles.slug, news.slug));
    if (existing.length > 0) {
      console.log(`News already exists: ${news.title}`);
      continue;
    }

    await db.insert(newsArticles).values({
      title: news.title,
      slug: news.slug,
      summary: news.summary,
      content: news.content,
      category_id: category.id,
      author_id: defaultAuthor.id,
      status: news.status,
      published_at: new Date(),
    });
    console.log(`Added news: ${news.title}`);
  }

  console.log('News seeding completed!');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
