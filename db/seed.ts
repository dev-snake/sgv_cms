import 'dotenv/config';
import { db } from './index';
import { categoryTypes, categories, authors, users, products, roles, modules, permissions, user_roles, newsArticles, projects } from './schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { AUTH, SEED_DEFAULTS, COMPANY } from '@/constants/app';

async function main() {
  console.log('Seeding database...');

  // 1. Seed Modules
  const appModules = [
    { code: 'BLOG', name: 'Blog Management' },
    { code: 'CMS', name: 'CMS Management' },
    { code: 'CONTACT', name: 'Contact Management' },
    { code: 'LOGS', name: 'Logs Management' },
    { code: 'MEDIA', name: 'Media Management' },
    { code: 'PROJECTS', name: 'Projects Management' },
    { code: 'ROLES', name: 'Roles Management' },
    { code: 'SERVICES', name: 'Services Management' },
    { code: 'USERS', name: 'Users Management' },
  ];

  for (const moduleData of appModules) {
    const existing = await db.select().from(modules).where(eq(modules.code, moduleData.code));
    if (existing.length === 0) {
      await db.insert(modules).values(moduleData);
      console.log(`Added module: ${moduleData.code}`);
    }
  }

  const allModules = await db.select().from(modules);

  // 2. Seed Roles
  const appRoles = [
    { code: 'SUPER_ADMIN', name: 'Super Administrator', description: 'System owner with full access' },
    { code: 'ADMIN', name: 'Administrator', description: 'Staff with management access' },
  ];

  for (const roleData of appRoles) {
    const existing = await db.select().from(roles).where(eq(roles.code, roleData.code));
    if (existing.length === 0) {
      await db.insert(roles).values(roleData);
      console.log(`Added role: ${roleData.code}`);
    }
  }

  const allRoles = await db.select().from(roles);
  const superAdminRole = allRoles.find(r => r.code === 'SUPER_ADMIN');

  // 3. Seed Permissions for SUPER_ADMIN
  if (superAdminRole) {
    for (const moduleItem of allModules) {
      const existing = await db.select()
        .from(permissions)
        .where(
          and(
            eq(permissions.role_id, superAdminRole.id),
            eq(permissions.module_id, moduleItem.id)
          )
        );
      
      if (existing.length === 0) {
        await db.insert(permissions).values({
          role_id: superAdminRole.id,
          module_id: moduleItem.id,
          can_view: true,
          can_create: true,
          can_update: true,
          can_delete: true,
        });
      }
    }
    console.log('Seeded permissions for SUPER_ADMIN');
  }

  // 4. Seed Category Types
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

  // 5. Seed Initial Categories
  const existingCats = await db.select().from(categories);
  if (existingCats.length === 0) {
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
    console.log('Seeded categories');
  }

  // 6. Seed Default Author
  const existingAuthor = await db.select().from(authors).where(eq(authors.name, 'Admin'));
  if (existingAuthor.length === 0) {
    await db.insert(authors).values({ name: 'Admin', role: 'Administrator' });
    console.log('Added default author: Admin');
  }
  
  // 7. Seed Default Users
  const usersToSeed = [
    {
      username: SEED_DEFAULTS.ADMIN_USERNAME,
      password: SEED_DEFAULTS.ADMIN_PASSWORD,
      fullName: 'Administrator',
      roleCode: 'ADMIN'
    },
    {
      username: SEED_DEFAULTS.SUPER_ADMIN_USERNAME,
      password: SEED_DEFAULTS.SUPER_ADMIN_PASSWORD,
      fullName: 'Super Administrator',
      roleCode: 'SUPER_ADMIN'
    }
  ];

  for (const userData of usersToSeed) {
    let userRecord = (await db.select().from(users).where(eq(users.username, userData.username)))[0];
    if (!userRecord) {
      const hashedPassword = await bcrypt.hash(userData.password, AUTH.BCRYPT_SALT_ROUNDS);
      const [inserted] = await db.insert(users).values({ 
        username: userData.username,
        email: userData.username === SEED_DEFAULTS.SUPER_ADMIN_USERNAME ? COMPANY.EMAIL : `${userData.username}@saigonvalve.vn`,
        password: hashedPassword,
        full_name: userData.fullName,
        is_active: true,
        is_locked: false,
      }).returning();
      userRecord = inserted;
      console.log(`Added user: ${userData.username} / ${userData.password}`);
    }

    // Link user to role
    const roleRecord = allRoles.find(r => r.code === userData.roleCode);
    if (userRecord && roleRecord) {
      const existingUserRole = await db.select()
        .from(user_roles)
        .where(
          and(
            eq(user_roles.user_id, userRecord.id),
            eq(user_roles.role_id, roleRecord.id)
          )
        );
      
      if (existingUserRole.length === 0) {
        await db.insert(user_roles).values({
          user_id: userRecord.id,
          role_id: roleRecord.id
        });
        console.log(`Linked ${userData.username} to ${userData.roleCode} role`);
      }
    }
  }


  // 8. Seed Detailed Products
  if (productType) {
    const allCats = await db.select().from(categories);
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
      }).onConflictDoNothing();
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
      }).onConflictDoNothing();
    }
  }

  // 9. Seed Detailed News
  if (newsType) {
    const allCats = await db.select().from(categories).where(eq(categories.category_type_id, newsType.id));
    const generalCat = allCats.find(c => c.name === 'Tin tức chung');
    const technicalCat = allCats.find(c => c.name === 'Kiến thức kỹ thuật');
    const author = (await db.select().from(authors).limit(1))[0];

    if (generalCat && author) {
      await db.insert(newsArticles).values({
        title: 'SÀI GÒN VALVE THAM GIA TRIỂN LÃM VIETWATER 2024',
        slug: 'sai-gon-valve-tham-gia-trien-lam-vietwater-2024',
        summary: 'Sài Gòn Valve tự hào giới thiệu các giải pháp van công nghiệp và thiết bị đo thông minh tại Vietwater 2024.',
        content: '<p>Vietwater là triển lãm lớn nhất ngành nước tại Việt Nam. Năm nay, Sài Gòn Valve mang đến các dòng van bướm OKM, van bi điều khiển điện và các cảm biến đo chất lượng nước IoT thế hệ mới.</p><p>Chúng tôi tập trung vào giải pháp tối ưu hóa vận hành và tiết kiệm năng lượng cho các nhà máy cấp thoát nước.</p>',
        category_id: generalCat.id,
        author_id: author.id,
        status: 'published',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/trien-lam.png',
        published_at: new Date(),
      }).onConflictDoNothing();
    }

    if (technicalCat && author) {
      await db.insert(newsArticles).values({
        title: 'HƯỚNG DẪN LỰA CHỌN VAN CÔNG NGHIỆP THEO TIÊU CHUẨN JIS VÀ ANSI',
        slug: 'huong-dan-lua-chon-van-cong-nghiep-jis-ansi',
        summary: 'Làm thế nào để phân biệt và lựa chọn đúng tiêu chuẩn mặt bích JIS và ANSI cho hệ thống đường ống?',
        content: '<p>Việc lựa chọn sai tiêu chuẩn mặt bích có thể dẫn đến rò rỉ và hỏng hóc hệ thống. Bài viết này sẽ giúp bạn hiểu rõ sự khác biệt giữa tiêu chuẩn JIS (Nhật Bản) và ANSI (Hoa Kỳ).</p><ul><li>Kích thước lỗ bu lông</li><li>Độ dày mặt bích</li><li>Áp suất định mức</li></ul>',
        category_id: technicalCat.id,
        author_id: author.id,
        status: 'published',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/ky-thuat.png',
        published_at: new Date(),
      }).onConflictDoNothing();
    }
  }

  // 10. Seed Detailed Projects
  if (projectType) {
    const allCats = await db.select().from(categories).where(eq(categories.category_type_id, projectType.id));
    const waterCat = allCats.find(c => c.name === 'Hệ Thống Cấp Nước');
    const autoCat = allCats.find(c => c.name === 'Tự động hóa');

    if (waterCat) {
      await db.insert(projects).values({
        name: 'DỰ ÁN NÂNG CẤP HỆ THỐNG CẤP NƯỚC SẠCH TP. THỦ ĐỨC',
        slug: 'nang-cap-cap-nuoc-thu-duc',
        description: 'Cung cấp và lắp đặt hệ thống van bướm điều khiển điện DN800 cho trạm bơm tăng áp.',
        client_name: 'SAWACO',
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-06-30'),
        category_id: waterCat.id,
        status: 'completed',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/du-an-cap-nuoc.png',
      }).onConflictDoNothing();
    }

    if (autoCat) {
      await db.insert(projects).values({
        name: 'TỰ ĐỘNG HÓA NHÀ MÁY XỬ LÝ NƯỚC THẢI KHU CÔNG NGHIỆP AMATA',
        slug: 'tu-dong-hoa-xu-ly-nuoc-thai-amata',
        description: 'Triển khai giải pháp giám sát Online các chỉ số pH, Độ đục, COD và điều khiển van tự động qua SCADA.',
        client_name: 'AMATA Corp',
        start_date: new Date('2024-05-20'),
        category_id: autoCat.id,
        status: 'ongoing',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/amata.png',
      }).onConflictDoNothing();
    }
  }

  console.log('Seeding completed!');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

