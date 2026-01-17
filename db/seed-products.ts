import 'dotenv/config';
import { db } from './index';
import { categories, products, categoryTypes } from './schema';
import { eq } from 'drizzle-orm';

const SAMPLE_PRODUCTS = [
    {
        name: 'VAN BƯỚM OKM SERIES 612X',
        slug: 'van-buom-okm-series-612x',
        description:
            'Van bướm chịu áp cao dùng cho hệ thống nước sạch và xử lý nước thải. Thiết kế thân gọn nhẹ, dễ dàng lắp đặt giữa hai mặt bích.',
        sku: 'OKM-612X-01',
        category_name: 'Van Công Nghiệp',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
        tech_summary:
            'Sử dụng cho hệ thống nước sạch và xử lý nước thải, tiêu chuẩn Nhật Bản (JIS). Vật liệu thân gang dẻo, đĩa inox 304/316.',
        is_featured: true,
        warranty: '24 tháng',
        origin: 'OKM Japan',
        features: [
            'Vận hành nhẹ nhàng',
            'Độ bền trên 100.000 lần đóng mở',
            'Dễ dàng thay thế gioăng',
        ],
        tech_specs: {
            'Kích thước': 'DN50 - DN1200',
            'Áp lực': 'PN10/PN16',
            'Mặt bích': 'JIS 10K/20K',
        },
    },
    {
        name: 'ACTUATOR ĐIỆN NOAH SERIES NA',
        slug: 'actuator-dien-noah-series-na',
        description:
            'Bộ điều khiển điện mạnh mẽ cho van công nghiệp. Tích hợp màn hình LCD hiển thị trạng thái và nút bấm cơ bản.',
        sku: 'NOAH-NA-01',
        category_name: 'Bộ Điều Khiển',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/04/17/thumbs/IOT-306x234-5.png',
        tech_summary:
            'Bộ điều khiển điện tiêu chuẩn IP67/IP68, tương thích SCADA, momen xoắn lên tới 2500Nm.',
        is_featured: true,
        warranty: '24 tháng',
        origin: 'NOAH Korea',
        features: ['Tự động ngắt khi quá tải', 'Chế độ chỉnh tay khẩn cấp', 'Kết nối RS485'],
        tech_specs: {
            'Nguồn điện': '220V AC / 24V DC',
            'Tiêu chuẩn': 'IP68',
            'Thời gian hành trình': '15-30 giây',
        },
    },
    {
        name: 'CẢM BIẾN ĐỘ ĐỤC SGVT420',
        slug: 'cam-bien-do-duc-sgvt420',
        description:
            'Cảm biến đo độ đục trực tuyến áp dụng công nghệ quang học tiên tiến nhất hiện nay.',
        sku: 'SGVT-420',
        category_name: 'Thiết Bị Đo',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
        tech_summary: 'Đo độ đục trực tuyến, IP68, tích hợp bàn chải tự làm sạch định kỳ.',
        is_featured: true,
        warranty: '12 tháng',
        origin: 'SGV Solution',
        features: [
            'Không cần bảo trì thường xuyên',
            'Đo chính xác ngay cả khi nước đục cao',
            'Dễ dàng cấu hình qua phần mềm',
        ],
        tech_specs: { 'Dải đo': '0-1000 NTU', 'Độ chính xác': '±2%', 'Ngõ ra': '4-20mA / Modbus' },
    },
    {
        name: 'DATALOGGER SV1-DAQ',
        slug: 'datalogger-sv1-daq',
        description:
            'Trái tim của hệ thống Smart Water, giúp thu thập và truyền dữ liệu mọi lúc mọi nơi.',
        sku: 'SV1-DAQ-01',
        category_name: 'Phụ kiện IoT',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
        tech_summary: 'Truyền dữ liệu qua mạng 4G/LTE/NBIoT, tích hợp giao thức MQTT an mật.',
        is_featured: true,
        warranty: '12 tháng',
        origin: 'SGV Solution',
        features: [
            'Pin hoạt động 5 năm',
            'Chống nước IP68',
            'Hỗ trợ nhiều loại cảm biến analog/digital',
        ],
        tech_specs: { 'Kết nối': '4G / LTE-M', 'Số kênh': '8 kênh', 'Bộ nhớ': '128MB' },
    },
    {
        name: 'VAN BI ĐIỀU KHIỂN ĐIỆN NOAH',
        slug: 'van-bi-dieu-khien-dien-noah',
        description:
            'Sự kết hợp hoàn hảo giữa van bi inox và actuator điện NOAH cho các ứng dụng tự động hóa chính xác.',
        sku: 'NOAH-BV-01',
        category_name: 'Van Công Nghiệp',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/T-QUAN-TR-C-.png',
        tech_summary: 'Bộ van bi inox 316 chịu được hóa chất và nhiệt độ cao.',
        is_featured: false,
        warranty: '24 tháng',
        origin: 'NOAH Korea',
        features: ['Lưu lượng đi qua tối đa', 'Đóng kín 100%', 'Chống ăn mòn hóa chất'],
        tech_specs: { 'Vật liệu': 'Inox 316', 'Áp lực': 'PN40', 'Nhiệt độ': '-20 đến 180°C' },
    },
    {
        name: 'CẢM BIẾN ÁP SUẤT SGV-P10',
        slug: 'cam-bien-ap-suat-sgv-p10',
        description: 'Thiết bị đo áp lực tin cậy cho mạng lưới cấp nước và trạm bơm.',
        sku: 'SGV-P10',
        category_name: 'Thiết Bị Đo',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
        tech_summary: 'Dải đo áp suất linh hoạt, ngõ ra 4-20mA ổn định.',
        is_featured: false,
        warranty: '12 tháng',
        origin: 'SGV Solution',
        features: [
            'Màng cảm biến gốm sứ siêu bền',
            'Thiết kế chống sốc điện',
            'Kích thước nhỏ gọn',
        ],
        tech_specs: { 'Dải đo': '0-10 bar / 0-16 bar', 'Độ sai số': '0.5%', 'Kết nối ren': 'G1/4' },
    },
    {
        name: 'VAN CỔNG TY CHÌM ARITA',
        slug: 'van-cong-ty-chim-arita',
        description:
            'Van cổng thiết kế bền bỉ, được tin dùng trong các hệ thống phòng cháy chữa cháy công nghiệp.',
        sku: 'ARITA-GV-01',
        category_name: 'Van Công Nghiệp',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
        tech_summary: 'Thân gang dẻo sơn epoxy tĩnh điện chống rỉ sét môi trường ngoài trời.',
        is_featured: false,
        warranty: '24 tháng',
        origin: 'Arita Taiwan',
        features: ['Cánh van bọc cao su chịu lực', 'Tiêu chuẩn BS 5163', 'Vận hành nhẹ nhàng'],
        tech_specs: { 'Tiêu chuẩn': 'BS 5163', 'Áp lực': 'PN16', 'Kết nối': 'Mặt bích' },
    },
    {
        name: 'ĐỒNG HỒ ĐO LƯU LƯỢNG ĐIỆN TỪ MC',
        slug: 'dong-ho-do-luu-luong-dien-tu-mc',
        description: 'Đồng hồ nước điện từ thế hệ mới, không có bộ phận chuyển động, độ bền cao.',
        sku: 'SGV-EMF-01',
        category_name: 'Thiết Bị Đo',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
        tech_summary: 'Sử dụng nguyên lý Faraday để đo lưu lượng chất lỏng có độ dẫn điện.',
        is_featured: true,
        warranty: '18 tháng',
        origin: 'SGV Solution',
        features: [
            'Sai số siêu thấp ±0.5%',
            'Có khả năng đo dòng chảy hai chiều',
            'Không gây tổn thất áp suất',
        ],
        tech_specs: {
            'Lớp lót': 'Hard Rubber / PTFE',
            'Điện cực': 'SS316L / Hastelloy',
            Nguồn: 'Pin hoặc 220V',
        },
    },
    {
        name: 'CẢM BIẾN pH SMART SGV-PH100',
        slug: 'cam-bien-ph-smart-sgv-ph100',
        description: 'Đo nồng độ pH Online cho các hệ thống xử lý nước và hóa chất.',
        sku: 'SGV-PH100',
        category_name: 'Thiết Bị Đo',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
        tech_summary:
            'Cảm biến pH kỹ thuật số, đầu ra Modbus, lắp đặt ngâm chìm hoặc vào đường ống.',
        is_featured: false,
        warranty: '12 tháng',
        origin: 'SGV Solution',
        features: [
            'Tự động bù trừ nhiệt độ',
            'Đầu đo có thể thay thế rời',
            'Kết nối trực tiếp PLC',
        ],
        tech_specs: { 'Dải đo': '0-14 pH', 'Nhiệt độ': '0-60°C', 'Áp lực': 'max 6 bar' },
    },
    {
        name: 'VAN MỘT CHIỀU CÁNH LẬT OKM',
        slug: 'van-mot-chieu-canh-lat-okm',
        description: 'Ngăn dòng chảy ngược hiệu quả, bảo vệ máy bơm khỏi tình trạng búa nước.',
        sku: 'OKM-CV-01',
        category_name: 'Van Công Nghiệp',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
        tech_summary: 'Cấu tạo đơn giản, tin cậy, làm việc ổn định trong thời gian dài.',
        is_featured: false,
        warranty: '24 tháng',
        origin: 'OKM Japan',
        features: [
            'Mặt đế làm kín cao su EPDM',
            'Thân gang phủ sơn Epoxy',
            'Hoạt động tự động theo áp suất dòng',
        ],
        tech_specs: {
            'Kiểu lắp': 'Mặt bích',
            'Tiêu chuẩn': 'JIS/ANSI',
            'Áp lực': '10 bar / 16 bar',
        },
    },
    {
        name: 'BỘ ĐIỀU KHIỂN KHÍ NÉN NOAH SERIES NP',
        slug: 'bo-dieu-khien-khi-nen-noah-np',
        description:
            'Giải pháp đóng mở van bằng khí nén cực nhanh, phù hợp cho phòng cháy và hệ thống công nghiệp.',
        sku: 'NOAH-PA-01',
        category_name: 'Bộ Điều Khiển',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/04/17/thumbs/IOT-306x234-5.png',
        tech_summary: 'Pneumatic Actuator kiểu Rack & Pinion, thân nhôm anodized chống ăn mòn.',
        is_featured: false,
        warranty: '24 tháng',
        origin: 'NOAH Korea',
        features: [
            'Thời gian đóng mở <1 giây',
            'Có tùy chọn Single Acting (Spring Return)',
            'Tích hợp giới hạn hành trình',
        ],
        tech_specs: { 'Áp lực khí nén': '5-8 bar', 'Góc quay': '90 độ', Thân: 'Hợp kim nhôm' },
    },
    {
        name: 'CẢM BIẾN COD ONLINE SGV-COD-200',
        slug: 'cam-bien-cod-online-sgv-cod-200',
        description: 'Máy đo COD quang học trực tiếp, không sử dụng hóa chất độc hại.',
        sku: 'SGV-COD-200',
        category_name: 'Thiết Bị Đo',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
        tech_summary: 'Sử dụng tia cực tím UV để xác định nồng độ chất hữu cơ trong nước thải.',
        is_featured: true,
        warranty: '12 tháng',
        origin: 'SGV Solution',
        features: ['Không tiêu tốn hóa chất', 'Kết quả tức thời', 'Hệ thống tự làm sạch thấu kính'],
        tech_specs: { 'Dải đo': '0-1000 mg/L', 'Nguyên lý': 'Hấp thụ UV254', 'Cấp bảo vệ': 'IP68' },
    },
    {
        name: 'VAN Y-STRAINER ARITA GANG',
        slug: 'van-y-strainer-arita-gang',
        description:
            'Lọc rác và tạp chất bảo vệ các thiết bị nhạy cảm như đồng hồ và van điều khiển.',
        sku: 'ARITA-YS-01',
        category_name: 'Van Công Nghiệp',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
        tech_summary: 'Lưới lọc inox lỗ nhỏ, dễ dàng tháo vệ sinh lưới lọc.',
        is_featured: false,
        warranty: '12 tháng',
        origin: 'Arita Taiwan',
        features: [
            'Vật liệu gang dẻo chịu nhiệt',
            'Mặt bích tiêu chuẩn quốc tế',
            'Lưới lọc thép không gỉ',
        ],
        tech_specs: { 'Kiểu dáng': 'Chữ Y', 'Mặt bích': 'DIN/BS', 'Áp lực': 'PN16' },
    },
    {
        name: 'BỘ GIÁM SÁT KÊNH HỞ SGV-ULM-50',
        slug: 'bo-giam-sat-kenh-ho-sgv-ulm-50',
        description: 'Hệ thống đo lưu lượng kênh hở sử dụng cảm biến siêu âm không tiếp xúc.',
        sku: 'SGV-ULM-50',
        category_name: 'Thiết Bị Đo',
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
        tech_summary:
            'Tính toán lưu lượng dựa trên mức nước qua máng đo tiêu chuẩn Parshall/V-notch.',
        is_featured: false,
        warranty: '12 tháng',
        origin: 'SGV Solution',
        features: [
            'Không tiếp xúc tránh ăn mòn',
            'Màn hình hiển thị tại chỗ',
            'Tích hợp Datalogger lưu trữ dữ liệu',
        ],
        tech_specs: { 'Công nghệ': 'Siêu âm', 'Dải đo m': '0-4m', 'Sai số': '0.3%' },
    },
    {
        name: 'VAN XẢ KHÍ ĐƠN/ĐÔI ARITA',
        slug: 'van-xa-khi-arita',
        description:
            'Loại bỏ túi khí trong đường ống để tránh hiện tượng búa nước và tắc nghẽn lưu lượng.',
        sku: 'ARITA-AV-01',
        category_name: 'Van Công Nghiệp',
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
        tech_summary: 'Thiết bị bảo vệ quan trọng cho các tuyến đường ống cấp nước đi xa.',
        is_featured: false,
        warranty: '12 tháng',
        origin: 'Arita Taiwan',
        features: ['Phao bọc nhựa cao cấp', 'Thân gang siêu dày', 'Tự động vận hành theo túi khí'],
        tech_specs: { Dạng: 'Đơn / Đôi', 'Kích thước': 'DN25 - DN200', 'Áp lực': '16 bar' },
    },
];

async function main() {
    console.log('Seeding products...');

    // Get product type
    const productType = await db
        .select()
        .from(categoryTypes)
        .where(eq(categoryTypes.name, 'product'));
    if (productType.length === 0) {
        console.error('Product type not found. Run main seed first.');
        return;
    }

    // Get all categories
    const allCategories = await db.select().from(categories);

    // Create missing categories
    const neededCategories = ['Van Công Nghiệp', 'Bộ Điều Khiển', 'Thiết Bị Đo', 'Phụ kiện IoT'];
    for (const catName of neededCategories) {
        const exists = allCategories.find((c) => c.name === catName);
        if (!exists) {
            await db
                .insert(categories)
                .values({ name: catName, category_type_id: productType[0].id });
            console.log(`Created category: ${catName}`);
        }
    }

    // Refresh categories
    const updatedCategories = await db.select().from(categories);

    for (const product of SAMPLE_PRODUCTS) {
        const category = updatedCategories.find((c) => c.name === product.category_name);
        if (!category) {
            console.log(`Category not found for ${product.name}: ${product.category_name}`);
            continue;
        }

        // Check if product already exists
        const existing = await db.select().from(products).where(eq(products.slug, product.slug));
        if (existing.length > 0) {
            console.log(`Product already exists (skipping): ${product.name}`);
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
            features: product.features,
            tech_specs: product.tech_specs,
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
