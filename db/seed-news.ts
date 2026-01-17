import 'dotenv/config';
import { db } from './index';
import { categories, authors, newsArticles, categoryTypes } from './schema';
import { eq } from 'drizzle-orm';

const SAMPLE_NEWS = [
    {
        title: 'Sài Gòn Valve cung cấp van cho dự án Nhà máy nước Thủ Đức',
        slug: 'sai-gon-valve-cung-cap-van-cho-du-an-nha-may-nuoc-thu-duc',
        summary:
            'Hoàn thành bàn giao hệ thống van OKM và actuator NOAH cho dự án mở rộng công suất nhà máy nước Thủ Đức.',
        content:
            '<p>Sài Gòn Valve vừa hoàn thành bàn giao lô hàng van bướm OKM series 612X và bộ điều khiển điện NOAH cho dự án mở rộng công suất Nhà máy nước Thủ Đức lên 300.000 m³/ngày.</p><p>Dự án được triển khai từ đầu năm 2024 với tổng giá trị thiết bị hơn 5 tỷ đồng, bao gồm van bướm các kích thước từ DN200 đến DN800.</p><p>Đây là minh chứng cho sự tin tưởng của các đối tác lớn như SAWACO đối với chất lượng sản phẩm và dịch vụ của Sài Gòn Valve.</p>',
        category_name: 'Tin tức chung',
        status: 'published' as const,
        image_url:
            'https://saigonvalve.vn/uploads/files/2025/07/16/thumbs/z6809258125215_0bfd24b1d2a12247ce2fe99f8bc81598-306x234-5.jpg',
    },
    {
        title: 'Ra mắt cảm biến đo độ đục thế hệ mới SGVT420',
        slug: 'ra-mat-cam-bien-do-do-duc-the-he-moi-sgvt420',
        summary:
            'Cảm biến độ đục SGVT420 với bàn chải tự làm sạch, độ chính xác cao và khả năng chống nhiễu tốt.',
        content:
            '<p>Sài Gòn Valve chính thức ra mắt dòng cảm biến đo độ đục thế hệ mới SGVT420, được thiết kế với công nghệ tán xạ ánh sáng 90° và bàn chải tự làm sạch.</p><p>Sản phẩm đáp ứng tiêu chuẩn IP68, phù hợp cho các ứng dụng đo trực tuyến trong môi trường khắc nghiệt như nước thải, nước sông hoặc các hệ thống lọc nước công nghiệp.</p><ul><li>Độ phân giải siêu cao 0.01 NTU</li><li>Cổng giao tiếp RS485 Modbus RTU</li><li>Vỏ nhựa POM chịu hóa chất</li></ul>',
        category_name: 'Kiến thức kỹ thuật',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
    },
    {
        title: 'Hội thảo giới thiệu giải pháp IoT cho ngành nước',
        slug: 'hoi-thao-gioi-thieu-giai-phap-iot-cho-nganh-nuoc',
        summary:
            'Sài Gòn Valve tổ chức hội thảo giới thiệu các giải pháp IoT và tự động hóa cho ngành cấp thoát nước.',
        content:
            '<p>Ngày 15/3/2025, Sài Gòn Valve đã tổ chức thành công hội thảo "Giải pháp IoT thông minh cho ngành nước" tại TP.HCM với sự tham gia của hơn 100 đại biểu từ các công ty cấp nước trên toàn quốc.</p><p>Hội thảo giới thiệu các giải pháp Datalogger, SCADA và hệ thống quan trắc chất lượng nước giúp tối ưu hóa vận hành và giảm thất thoát nước (NRW).</p>',
        category_name: 'Sự kiện công ty',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/trien-lam.png',
    },
    {
        title: 'Hướng dẫn bảo trì van bướm công nghiệp đúng cách',
        slug: 'huong-dan-bao-tri-van-buom-cong-nghiep-dung-cach',
        summary:
            'Tổng hợp các bước bảo trì định kỳ và xử lý sự cố thường gặp với van bướm công nghiệp.',
        content:
            '<p>Van bướm là thiết bị quan trọng trong hệ thống đường ống công nghiệp. Việc bảo trì định kỳ giúp kéo dài tuổi thọ và đảm bảo vận hành ổn định.</p><h3>Các bước bảo trì cơ bản:</h3><ol><li>Kiểm tra gioăng làm kín mỗi 6 tháng để phát hiện sớm các vết nứt hoặc mòn.</li><li>Bôi trơn trục van bằng mỡ bôi trơn chuyên dụng chịu nhiệt.</li><li>Kiểm tra actuator và tín hiệu điều khiển để đảm bảo van đóng mở chính xác hoàn toàn.</li></ol>',
        category_name: 'Kiến thức kỹ thuật',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/ky-thuat.png',
    },
    {
        title: 'Sài Gòn Valve đạt danh hiệu Top 10 Thương hiệu mạnh Việt Nam 2024',
        slug: 'sai-gon-valve-top-10-thuong-hieu-manh-2024',
        summary:
            'Ghi nhận những nỗ lực không ngừng trong việc cung cấp giải pháp công nghệ ngành nước hiện đại.',
        content:
            '<p>Vượt qua hàng nghìn doanh nghiệp, Sài Gòn Valve đã vinh dự nhận giải thưởng Top 10 Thương hiệu mạnh Việt Nam năm 2024 tại lễ trao giải diễn ra tại Hà Nội.</p><p>Giải thưởng là minh chứng cho sự phát triển bền vững và những đóng góp của công ty trong việc mang lại những giải pháp công nghệ mới cho ngành hạ tầng đô thị Việt Nam.</p>',
        category_name: 'Sự kiện công ty',
        status: 'published' as const,
        image_url:
            'https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png',
    },
    {
        title: 'So sánh van cổng và van bướm: Sự khác biệt và ứng dụng',
        slug: 'so-sanh-van-cong-va-van-buom-su-khac-biet',
        summary:
            'Giúp khách hàng lựa chọn loại van phù hợp nhất cho dự án dựa trên yêu cầu kỹ thuật và ngân sách.',
        content:
            '<p>Van cổng và van bướm đều có chức năng đóng mở dòng chảy, nhưng chúng có cấu tạo và ứng dụng rất khác nhau.</p><h4>Van cổng:</h4><ul><li>Ưu điểm: Độ kín tuyệt đối, tổn thất áp suất thấp nhất.</li><li>Nhược điểm: Kích thước lớn, đóng mở chậm.</li></ul><h4>Van bướm:</h4><ul><li>Ưu điểm: Nhẹ, gọn, giá rẻ, đóng mở nhanh.</li><li>Nhược điểm: Có thể gây tổn thất áp suất nhẹ.</li></ul>',
        category_name: 'Kiến thức kỹ thuật',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
    },
    {
        title: 'Datalogger SV1-DAQ: Giải pháp giám sát thông minh từ xa',
        slug: 'datalogger-sv1-daq-giai-phap-iot',
        summary:
            'Thiết bị truyền tải dữ liệu tự động tích hợp 4G LTE cho các trạm quan trắc mạng lưới.',
        content:
            '<p>Làm thế nào để giám sát áp lực và lưu lượng trên toàn bộ mạng lưới cấp nước trải rộng hàng chục km? SV1-DAQ chính là câu trả lời.</p><p>Thiết bị có khả năng thu thập dữ liệu từ các cảm biến áp suất, lưu lượng, chất lượng nước và truyền về server đám mây qua mạng di động với mức tiêu thụ năng lượng cực thấp.</p>',
        category_name: 'Tin tức chung',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
    },
    {
        title: 'Vai trò của van giảm áp trong hệ thống cấp nước nhà cao tầng',
        slug: 'vai-tro-van-giam-ap-nha-cao-tang',
        summary:
            'Phân tích tại sao van giảm áp là thành phần không thể thiếu để bảo vệ đường ống trong các tòa nhà.',
        content:
            '<p>Trong các tòa nhà cao tầng, áp lực nước ở các tầng thấp thường rất lớn do chênh lệch độ cao. Nếu không có van giảm áp, đường ống và thiết bị vệ sinh sẽ dễ dàng bị bùng nổ hoặc hư hại.</p><p>Van giảm áp Arita do Sài Gòn Valve cung cấp giúp duy trì áp suất đầu ra ổn định bất kể áp đầu vào thay đổi, bảo vệ toàn diện hệ thống cơ điện (ME).</p>',
        category_name: 'Kiến thức kỹ thuật',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2025/03/19/VAN-C-NG-TL.png',
    },
    {
        title: 'Dự án xử lý nước thải KCN VSIP được Sài Gòn Valve trang bị thiết bị đo',
        slug: 'du-an-xu-ly-nuoc-thai-vsip-sgv',
        summary: 'Cung cấp hệ thống cảm biến đo Online pH, COD, TSS cho khu công nghiệp kiểu mẫu.',
        content:
            '<p>Tiếp tục khẳng định vị thế trong ngành xử lý nước thải, Sài Gòn Valve vừa hoàn tất lắp đặt hệ thống quan trắc chất lượng nước đầu ra tại KCN VSIP Bình Dương.</p><p>Hệ thống giúp nhà quản trị KCN giám sát liên tục các chỉ số môi trường, đảm bảo tuân thủ nghiêm ngặt quy định của Bộ Tài nguyên và Môi trường.</p>',
        category_name: 'Tin tức chung',
        status: 'published' as const,
        image_url:
            'https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg',
    },
    {
        title: 'Ứng dụng Actuator NOAH Korea trong tự động hóa nhà máy',
        slug: 'ung-dung-actuator-noah-korea-tu-dong-hoa',
        summary:
            'Tìm hiểu về bộ điều khiển điện thông minh giúp thay thế thao tác thủ công, nâng cao hiệu suất.',
        content:
            '<p>Bộ điều khiển điện (Actuator) NOAH từ Hàn Quốc nổi tiếng với độ bền và khả năng tích hợp mạnh mẽ. Tại Việt Nam, Sài Gòn Valve là đơn vị phân phối chính thức.</p><p>Sản phẩm đạt tiêu chuẩn IP67/IP68, cho phép vận hành trong môi trường ẩm ướt, bụi bẩn mà vẫn đảm bảo độ chính xác tuyệt đối.</p>',
        category_name: 'Kiến thức kỹ thuật',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2025/04/17/thumbs/IOT-306x234-5.png',
    },
    {
        title: 'Sài Gòn Valve khai trương văn phòng đại diện tại Hà Nội',
        slug: 'khai-truong-van-phong-dai-dien-ha-noi',
        summary: 'Mở rộng quy mô hoạt động để phục vụ khách hàng khu vực phía Bắc tốt hơn.',
        content:
            '<p>Nhằm đáp ứng nhu cầu ngày càng tăng về thiết bị ngành nước tại miền Bắc, Sài Gòn Valve chính thức khai trương văn phòng đại diện tại Hà Nội vào tháng 4/2025.</p><p>Văn phòng mới sẽ là trung tâm tư vấn kỹ thuật và hỗ trợ bảo hành cho các dự án tại khu vực đồng bằng sông Hồng và vùng núi phía Bắc.</p>',
        category_name: 'Sự kiện công ty',
        status: 'published' as const,
        image_url:
            'https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png',
    },
    {
        title: 'Công nghệ DMA và giải pháp chống thất thoát nước (NRW)',
        slug: 'cong-nghe-dma-giai-phap-chong-that-thoat',
        summary:
            'Cách chia vùng tách mạng lưới (DMA) kết hợp thiết bị đo thông minh của SGV giúp giảm tỷ lệ thất thoát nước.',
        content:
            '<p>Thất thoát nước là bài toán đau đầu của mọi công ty cấp nước. Việc áp dụng vùng quản lý áp lực (DMA) kết hợp với các đồng hồ đo lưu lượng điện từ cực nhạy giúp phát hiện sớm các vị trí rò rỉ ngầm.</p><p>Sài Gòn Valve cung cấp giải pháp trọn gói từ thiết kế DMA đến lắp đặt thiết bị đo và phần mềm giám sát SCADA.</p>',
        category_name: 'Kiến thức kỹ thuật',
        status: 'published' as const,
        image_url:
            'https://saigonvalve.vn/uploads/files/2024/06/12/Blue-and-White-Clean-Modern-Technology-Conference-Zoom-Virtual-Background-2-.png',
    },
    {
        title: 'Sài Gòn Valve đồng hành cùng các hoạt động thiện nguyện ngành nước',
        slug: 'sai-gon-valve-thien-nguyen-nganh-nuoc',
        summary: 'Tặng hệ thống lọc nước RO cho trường học tại các khu vực khó khăn.',
        content:
            '<p>Nằm trong chuỗi hoạt động trách nhiệm xã hội, Sài Gòn Valve đã trao tặng 5 hệ thống lọc nước sạch công suất lớn cho các trường tiểu học tại vùng sâu vùng xa tỉnh Đắk Lắk.</p><p>Chúng tôi mong muốn góp phần mang lại nguồn nước sạch an toàn cho các em học sinh, hướng tới một tương lai khỏe mạnh.</p>',
        category_name: 'Sự kiện công ty',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/trien-lam.png',
    },
    {
        title: 'Tiêu chuẩn bảo vệ IP68 là gì và tại sao nó quan trọng với ngành nước?',
        slug: 'tieu-chuan-ip68-va-quan-trong-nganh-nuoc',
        summary:
            'Giải mã các thông số kỹ thuật để giúp kỹ sư lựa chọn thiết bị không bị hư hỏng khi ngập nước.',
        content:
            '<p>IP68 là viết tắt của Ingress Protection 68 - cấp độ bảo vệ cao nhất cho thiết bị điện tử chống lại bụi và nước ngập lâu ngày.</p><p>Với đặc thù ngành nước, các thiết bị lắp đặt trong hố van thường xuyên bị ngập sâu sau các trận mưa lớn. Vì vậy, việc trang bị thiết bị đạt chuẩn IP68 là bắt buộc để đảm bảo hệ thống không bị gián đoạn.</p>',
        category_name: 'Kiến thức kỹ thuật',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/-c.png',
    },
    {
        title: 'Giải pháp Smart Water: Xu hướng tất yếu của đô thị thông minh',
        slug: 'giai-phap-smart-water-xu-huong-do-thi-thong-minh',
        summary: 'Sài Gòn Valve cùng xây dựng hạ tầng nước thông minh cho cuộc sống hiện đại.',
        content:
            '<p>Đô thị thông minh không thể thiếu quản lý nước thông minh. Từ việc đọc số đồng hồ tự động đến điều khiển áp lực tự động giúp tiết kiệm điện năng cho trạm bơm.</p><p>Sài Gòn Valve đang đi đầu trong việc cung cấp các hệ sinh thái Smart Water tích hợp AI và dữ liệu lớn (Big Data).</p>',
        category_name: 'Tin tức chung',
        status: 'published' as const,
        image_url: 'https://saigonvalve.vn/uploads/files/2024/11/14/DATALOGGER.png',
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
        const exists = allCategories.find((c) => c.name === catName);
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
        const [newAuthor] = await db
            .insert(authors)
            .values({
                name: 'SGV Admin',
                role: 'Content Manager',
            })
            .returning();
        defaultAuthor = newAuthor;
        console.log('Created default author: SGV Admin');
    }

    for (const news of SAMPLE_NEWS) {
        const category = updatedCategories.find((c) => c.name === news.category_name);
        if (!category) {
            console.log(`Category not found for ${news.title}: ${news.category_name}`);
            continue;
        }

        // Check if news already exists
        const existing = await db
            .select()
            .from(newsArticles)
            .where(eq(newsArticles.slug, news.slug));
        if (existing.length > 0) {
            console.log(`News already exists (skipping): ${news.title}`);
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
            image_url: news.image_url,
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
