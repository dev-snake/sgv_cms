import 'dotenv/config';
import { db } from './index';
import { categoryTypes, categories, authors, users, products } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // 1. Seed Category Types
  const types = ['news', 'product', 'project'];
  for (const typeName of types) {
    const existing = await db.select().from(categoryTypes).where(eq(categoryTypes.name, typeName));
    if (existing.length === 0) {
      await db.insert(categoryTypes).values({ name: typeName });
      console.log(`Added category type: ${typeName}`);
    }
  }

  // Get types for reference
  const allTypes = await db.select().from(categoryTypes);
  const newsType = allTypes.find(t => t.name === 'news');
  const productType = allTypes.find(t => t.name === 'product');
  const projectType = allTypes.find(t => t.name === 'project');

  // Get all categories for reference
  const allCats = await db.select().from(categories);

  // 2. Seed Initial Categories
  if (newsType) {
    const newsCats = ['Tin tức chung', 'Sự kiện công ty', 'Kiến thức kỹ thuật'];
    for (const catName of newsCats) {
      await db.insert(categories).values({ name: catName, category_type_id: newsType.id });
    }
  }

  if (productType) {
    const productCats = ['Van Công Nghiệp', 'Thiết Bị Đo', 'Phụ kiện IoT'];
    for (const catName of productCats) {
      await db.insert(categories).values({ name: catName, category_type_id: productType.id });
    }
  }

  if (projectType) {
    const projectCats = ['Hệ Thống Cấp Nước', 'Xử Lý Nước Thải', 'Tự động hóa'];
    for (const catName of projectCats) {
      await db.insert(categories).values({ name: catName, category_type_id: projectType.id });
    }
  }

  // 3. Seed Default Author
  const existingAuthor = await db.select().from(authors).where(eq(authors.name, 'Admin'));
  if (existingAuthor.length === 0) {
    await db.insert(authors).values({ name: 'Admin', role: 'Administrator' });
    console.log('Added default author: Admin');
  }
  
  // 4. Seed Default User
  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existingUser = await db.select().from(users).where(eq(users.username, adminUsername));
  if (existingUser.length === 0) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await db.insert(users).values({ 
      username: adminUsername, 
      password: hashedPassword,
      full_name: 'Administrator',
      role: 'admin'
    });
    console.log(`Added default user: ${adminUsername} / ${adminPassword}`);
  }

  // 5. Seed Detailed Products
  if (productType) {
    const vanCat = allCats.find(c => c.name === 'Van Công Nghiệp');
    const sensorCat = allCats.find(c => c.name === 'Thiết Bị Đo');

    if (vanCat) {
      await db.insert(products).values({
        name: 'VAN BƯỚM OKM SERIES 612X',
        slug: 'van-buom-okm-series-612x',
        description: 'Sử dụng cho hệ thống nước sạch và xử lý nước thải.',
        sku: 'OKM-612X',
        price: '0.00',
        stock: 50,
        category_id: vanCat.id,
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
        is_featured: true,
        warranty: '24 tháng',
        origin: 'OKM Japan / NOAH Korea',
        availability: 'Sẵn hàng tại kho HCM',
        delivery_info: 'Toàn quốc (2-3 ngày)',
        features: [
          'Tiêu chuẩn Nhật Bản / Hàn Quốc',
          'Vật liệu chịu lực cao (Inox/Thép)',
          'Độ bền vận hành vượt trội',
          'Tương thích hệ thống SCADA/IoT',
          'Bảo trì dễ dàng, linh kiện sẵn có'
        ],
        tech_specs: {
          "Thương hiệu": "OKM Japan / NOAH Korea",
          "Kích thước (Size)": "DN50 - DN1200",
          "Áp lực làm việc": "PN10, PN16, PN25",
          "Nhiệt độ": "-10°C đến 250°C",
          "Kết nối": "Wafer / Flange (JIS, ANSI, DIN)",
          "Thân van": "Cast Iron, Ductile Iron, SS304/316",
          "Điều khiển": "Tay gạt, Vô lăng, Điện, Khí nén"
        },
        tech_summary: 'Sài Gòn Valve cung cấp đầy đủ chứng chỉ CO/CQ và hỗ trợ kỹ thuật tận nơi cho các dự án trọng điểm.'
      }).onConflictDoUpdate({
        target: products.slug,
        set: {
          description: 'Sử dụng cho hệ thống nước sạch và xử lý nước thải.',
          warranty: '24 tháng',
          origin: 'OKM Japan / NOAH Korea',
          availability: 'Sẵn hàng tại kho HCM',
          features: [
            'Tiêu chuẩn Nhật Bản / Hàn Quốc',
            'Vật liệu chịu lực cao (Inox/Thép)',
            'Độ bền vận hành vượt trội',
            'Tương thích hệ thống SCADA/IoT',
            'Bảo trì dễ dàng, linh kiện sẵn có'
          ],
          tech_specs: {
            "Thương hiệu": "OKM Japan / NOAH Korea",
            "Kích thước (Size)": "DN50 - DN1200",
            "Áp lực làm việc": "PN10, PN16, PN25",
            "Nhiệt độ": "-10°C đến 250°C",
            "Kết nối": "Wafer / Flange (JIS, ANSI, DIN)",
            "Thân van": "Cast Iron, Ductile Iron, SS304/316",
            "Điều khiển": "Tay gạt, Vô lăng, Điện, Khí nén"
          },
        }
      });
      console.log('Added detailed product: VAN BƯỚM OKM SERIES 612X');
    }

    if (sensorCat) {
      await db.insert(products).values({
        name: 'CẢM BIẾN ĐỘ ĐỤC SGVT410/420',
        slug: 'cam-bien-do-duc-sgvt410-420',
        description: 'Cảm biến độ đục áp dụng công nghệ sợi quang và nguyên lý tán xạ ánh sáng của góc phát hiện 90° để có dữ liệu ổn định hơn.',
        sku: 'SGVT-400-SERIES',
        price: '0.00',
        stock: 20,
        category_id: sensorCat.id,
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
        is_featured: true,
        warranty: '12 tháng',
        origin: 'SGV Solution',
        availability: 'Đặt hàng (7-10 ngày)',
        features: [
          'Cảm biến kỹ thuật số, đầu ra RS485, hỗ trợ MODBUS',
          'Với bàn chải làm sạch tự động để ngăn ngừa bẩn cảm biến và loại bỏ bọt khí',
          'Khả năng chống nhiễu mạnh, không bị ảnh hưởng bởi ánh sáng xung quanh',
          'Nguyên lý đo tán xạ ánh sáng 90°, và dùng sợi quang để phát hiện tốt hơn'
        ],
        tech_specs: [
          { "Thông số": "Sản phẩm", "Model SGVT410": "Cảm biến độ đục sợi quang", "Model SGVT420": "Cảm biến độ đục tự làm sạch" },
          { "Thông số": "Model", "Model SGVT410": "SGVT410", "Model SGVT420": "SGVT420" },
          { "Thông số": "Phương pháp đo", "Model SGVT410": "Tán xạ ánh sáng 90°", "Model SGVT420": "Tán xạ ánh sáng 90°" },
          { "Thông số": "Phạm vi đo", "Model SGVT410": "0〜1000 NTU", "Model SGVT420": "0〜1000 NTU" },
          { "Thông số": "Độ chính xác", "Model SGVT410": "3%-5%", "Model SGVT420": "3%-5%" },
          { "Thông số": "Độ phân giải", "Model SGVT410": "0.01", "Model SGVT420": "0.01" },
          { "Thông số": "Cấp độ bảo vệ", "Model SGVT410": "IP68", "Model SGVT420": "IP68" },
          { "Thông số": "Giao diện", "Model SGVT410": "RS485, Modbus", "Model SGVT420": "RS485, Modbus" },
          { "Thông số": "Lắp đặt", "Model SGVT410": "Gắn và trong", "Model SGVT420": "Gắn và trong" },
          { "Thông số": "Nguồn điện", "Model SGVT410": "DC 6〜12V, <50mA", "Model SGVT420": "DC 6〜12V, <50mA" },
          { "Thông số": "Kích cỡ", "Model SGVT410": "Φ32*152.5mm", "Model SGVT420": "Φ32*169.5mm" },
          { "Thông số": "Chiều dài cáp", "Model SGVT410": "5m (tùy chỉnh)", "Model SGVT420": "5m (tùy chỉnh)" },
          { "Thông số": "Chất liệu vỏ", "Model SGVT410": "POM", "Model SGVT420": "POM" },
          { "Thông số": "Đầu dò quang", "Model SGVT410": "Sợi quang", "Model SGVT420": "Sợi quang" },
          { "Thông số": "Bàn chải tự làm sạch", "Model SGVT410": "Không", "Model SGVT420": "Có" }
        ],
        tech_summary: 'Cảm biến kỹ thuật số thế hệ mới, tích hợp RS485 và bàn chải tự làm sạch giúp duy trì độ chính xác cao trong môi trường nước khắc nghiệt.'
      }).onConflictDoUpdate({
        target: products.slug,
        set: {
          features: [
            'Cảm biến kỹ thuật số, đầu ra RS485, hỗ trợ MODBUS',
            'Với bàn chải làm sạch tự động để ngăn ngừa bẩn cảm biến và loại bỏ bọt khí',
            'Khả năng chống nhiễu mạnh, không bị ảnh hưởng bởi ánh sáng xung quanh',
            'Nguyên lý đo tán xạ ánh sáng 90°, và dùng sợi quang để phát hiện tốt hơn'
          ],
          tech_specs: [
            { "Thông số": "Sản phẩm", "Model SGVT410": "Cảm biến độ đục sợi quang", "Model SGVT420": "Cảm biến độ đục tự làm sạch" },
            { "Thông số": "Model", "Model SGVT410": "SGVT410", "Model SGVT420": "SGVT420" },
            { "Thông số": "Phương pháp đo", "Model SGVT410": "Tán xạ ánh sáng 90°", "Model SGVT420": "Tán xạ ánh sáng 90°" },
            { "Thông số": "Phạm vi đo", "Model SGVT410": "0〜1000 NTU", "Model SGVT420": "0〜1000 NTU" },
            { "Thông số": "Độ chính xác", "Model SGVT410": "3%-5%", "Model SGVT420": "3%-5%" },
            { "Thông số": "Độ phân giải", "Model SGVT410": "0.01", "Model SGVT420": "0.01" },
            { "Thông số": "Cấp độ bảo vệ", "Model SGVT410": "IP68", "Model SGVT420": "IP68" },
            { "Thông số": "Giao diện", "Model SGVT410": "RS485, Modbus", "Model SGVT420": "RS485, Modbus" },
            { "Thông số": "Lắp đặt", "Model SGVT410": "Gắn và trong", "Model SGVT420": "Gắn và trong" },
            { "Thông số": "Nguồn điện", "Model SGVT410": "DC 6〜12V, <50mA", "Model SGVT420": "DC 6〜12V, <50mA" },
            { "Thông số": "Kích cỡ", "Model SGVT410": "Φ32*152.5mm", "Model SGVT420": "Φ32*169.5mm" },
            { "Thông số": "Chiều dài cáp", "Model SGVT410": "5m (tùy chỉnh)", "Model SGVT420": "5m (tùy chỉnh)" },
            { "Thông số": "Chất liệu vỏ", "Model SGVT410": "POM", "Model SGVT420": "POM" },
            { "Thông số": "Đầu dò quang", "Model SGVT410": "Sợi quang", "Model SGVT420": "Sợi quang" },
            { "Thông số": "Bàn chải tự làm sạch", "Model SGVT410": "Không", "Model SGVT420": "Có" }
          ],
          tech_summary: 'Cảm biến kỹ thuật số thế hệ mới, tích hợp RS485 và bàn chải tự làm sạch giúp duy trì độ chính xác cao trong môi trường nước khắc nghiệt.'
        }
      });
      console.log('Added detailed product: CẢM BIẾN ĐỘ ĐỤC SGVT410/420');
    }
  }

  console.log('Seeding completed!');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
