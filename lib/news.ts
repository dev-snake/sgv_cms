export interface NewsArticle {
  id: string;
  title: string;
  desc: string;
  content?: string;
  date: string;
  image: string;
  category: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

export const NEWS_LIST: NewsArticle[] = [
  {
    id: "1",
    title: "Thiết bị thu nhận và truyền dữ liệu DATALOGGER SV1-DAQ",
    desc: "SV1-DAQ là thiết bị thu nhận và truyền dữ liệu thông minh, được thiết kế đặc biệt cho các hệ thống giám sát môi trường, ngành nước và hạ tầng kỹ thuật, ứng dụng mạng 4G/LTE.",
    date: "24/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-306x234-5.png",
    category: "CÔNG NGHỆ",
    author: "Admin",
    readTime: "5 phút",
    featured: true,
    content: `
      <h3>Thiết bị thu nhận và truyền dữ liệu DATALOGGER SV1-DAQ</h3>
      <p>Trong kỷ nguyên Công nghiệp 4.0, việc giám sát và quản lý dữ liệu từ xa đóng vai trò cực kỳ quan trọng trong mọi ngành sản xuất, đặc biệt là trong lĩnh vực cấp thoát nước và môi trường. <strong>DATALOGGER SV1-DAQ</strong> là giải pháp tiên tiến được thiết kế nhằm đáp ứng hoàn hảo các yêu cầu khắt khe này.</p>
      
      <h4>Đặc điểm nổi bật:</h4>
      <ul>
        <li>Hỗ trợ đa kết nối: 4G/LTE, Wifi, Ethernet giúp truyền tải dữ liệu ổn định và liên tục.</li>
        <li>Tích hợp nhiều cổng giao tiếp: Analog (4-20mA/0-10V), Digital (Pulse Input), RS485 (Modbus RTU).</li>
        <li>Khả năng lưu trữ nội bộ cực lớn, đảm bảo an toàn dữ liệu khi có sự cố mạng.</li>
        <li>Tiêu chuẩn bảo vệ IP68, hoạt động tốt trong các môi trường khắc nghiệt như hầm van, trạm bơm.</li>
      </ul>

      <h4>Thông số kỹ thuật:</h4>
      <table class="w-full border-collapse border border-slate-200 my-6">
        <thead>
          <tr class="bg-slate-50">
            <th class="border border-slate-200 p-2 text-left">Thông số</th>
            <th class="border border-slate-200 p-2 text-left">Mô tả</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-200 p-2 font-medium">Vi xử lý</td>
            <td class="border border-slate-200 p-2">ARM Cortex-M4 hiệu năng cao</td>
          </tr>
          <tr>
            <td class="border border-slate-200 p-2 font-medium">Ngõ vào Analog</td>
            <td class="border border-slate-200 p-2">8 kênh, độ phân giải 16-bit</td>
          </tr>
          <tr>
            <td class="border border-slate-200 p-2 font-medium">Truyền thông</td>
            <td class="border border-slate-200 p-2">4G LTE Cat 1, NB-IoT (tùy chọn)</td>
          </tr>
          <tr>
            <td class="border border-slate-200 p-2 font-medium">Nguồn cấp</td>
            <td class="border border-slate-200 p-2">9-30VDC / Pin Lithium dự phòng</td>
          </tr>
        </tbody>
      </table>

      <p>Với sự kết hợp hoàn hảo giữa phần cứng mạnh mẽ và phần mềm quản lý linh hoạt, SV1-DAQ không chỉ là một thiết bị ghi dữ liệu đơn thuần mà còn là trung tâm điều phối thông minh cho các hệ thống giám sát hiện đại.</p>
    `,
  },
  {
    id: "2",
    title: "HỆ THỐNG QUAN TRẮC CHẤT LƯỢNG NƯỚC TỰ ĐỘNG – GIẢI PHÁP GIÁM SÁT 24/7",
    desc: "Hệ thống quan trắc chất lượng nước là một giải pháp tích hợp các thiết bị đo lường, truyền thông và phần mềm điều khiển nhằm giám sát liên tục và tự động các chỉ số nước tại hiện trường một cách chính xác nhất.",
    date: "24/06/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg",
    category: "DỰ ÁN",
    author: "Kỹ sư SGV",
    readTime: "8 phút",
    content: `
      <h3>Hệ thống quan trắc chất lượng nước tự động</h3>
      <p>Sài Gòn Valve mang đến giải pháp giám sát chất lượng nước toàn diện, giúp các đơn vị quản lý vận hành mạng lưới cấp nước hoặc xử lý nước thải nắm bắt được thông tin chính xác về các chỉ số hóa lý của nguồn nước trong thời gian thực.</p>

      <h4>Các thành phần chính của hệ thống:</h4>
      <ul>
        <li><strong>Cảm biến (Sensors):</strong> Đo đạc các chỉ số như pH, Clo dư, Độ đục (Turbidity), Độ dẫn điện (Conductivity), Oxy hòa tan (DO), COD/BOD.</li>
        <li><strong>Bộ thu nhận dữ liệu (RTU/Datalogger):</strong> Thu thập tín hiệu từ các cảm biến và truyền về trung tâm điều hành qua mạng không dây (3G/4G/IoT).</li>
        <li><strong>Hệ thống phân tích và cảnh báo:</strong> Phần mềm hiển thị biểu đồ, thống kê và tự động gửi cảnh báo qua Email/SMS khi có chỉ số vượt ngưỡng cho phép.</li>
      </ul>

      <h4>Lợi ích vượt trội:</h4>
      <p>Giải pháp giúp giảm thiểu tối đa việc lấy mẫu thủ công, tiết kiệm thời gian và chi phí nhân lực. Đồng thời, việc giám sát liên tục 24/7 giúp phát hiện sớm các sự cố ô nhiễm, đảm bảo an toàn cấp nước cho người dân và doanh nghiệp.</p>
      <img src="https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg" alt="Hệ thống quan trắc" class="rounded-xl my-8 w-full" />
    `,
  },
  {
    id: "3",
    title: "SÀI GÒN VALVE – NHÀ PHÂN PHỐI ĐỘC QUYỀN ACTUATOR NOAH TẠI VIỆT NAM",
    desc: "SÀI GÒN VALVE là nhà phân phối độc quyền bộ điều khiển (Actuator) NOAH tại Việt Nam, mang đến giải pháp điều khiển tiên tiến cho hệ thống van công nghiệp.",
    date: "18/04/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/04/17/thumbs/IOT-306x234-5.png",
    category: "HỢP TÁC",
    author: "Admin",
    readTime: "6 phút",
  },
  {
    id: "12",
    title: "HỆ THỐNG SCADA LÀ GÌ? ỨNG DỤNG SCADA TRONG NGÀNH CẤP THOÁT NƯỚC",
    desc: "SCADA (Supervisory Control and Data Acquisition) là hệ thống điều khiển giám sát và thu thập dữ liệu, đóng vai trò 'bộ não' của các nhà máy sản xuất hiện đại.",
    date: "09/09/2024",
    image: "https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/-i-u-khi-n-gi-m-s-t-306x234-5.png",
    category: "CÔNG NGHỆ",
    author: "Phòng Kỹ Thuật",
    readTime: "10 phút",
    content: `
      <h3>Hệ thống SCADA - 'Bộ não' của ngành nước thông minh</h3>
      <p>SCADA không chỉ là một thuật ngữ kỹ thuật, mà là cả một cuộc cách mạng trong cách chúng ta quản lý hạ tầng đô thị. Tại Sài Gòn Valve, chúng tôi chuyên sâu vào việc thiết kế and triển khai các hệ thống SCADA tối ưu cho ngành nước.</p>
      
      <h4>Cấu trúc của một hệ thống SCADA:</h4>
      <ol>
        <li><strong>Tầng thiết bị hiện trường:</strong> Van, bơm, cảm biến.</li>
        <li><strong>Tầng điều khiển cơ sở:</strong> PLC, RTU.</li>
        <li><strong>Tầng truyền thông:</strong> Mạng LAN, WAN, Wireless.</li>
        <li><strong>Tầng giám sát (HMI/Server):</strong> Nơi con người tương tác với máy móc qua giao diện đồ họa.</li>
      </ol>

      <h4>Tại sao ngành nước cần SCADA?</h4>
      <p>Việc quản lý hàng trăm km đường ống và hàng chục trạm bơm bằng sức người là không thể. SCADA giúp phát hiện rò rỉ ngay lập tức thông qua sự sụt giảm áp lực bất thường, điều khiển đóng mở van từ xa để điều tiết lưu lượng và tính toán thất thoát nước chính xác đến từng mét khối.</p>
    `,
  },
  {
    id: "13",
    title: "VAN ĐIỀU KHIỂN TỰ ĐỘNG VÀ NHỮNG ĐIỀU CẦN BIẾT",
    desc: "Tìm hiểu về các loại van điều khiển điện và khí nén, cách thức vận hành và ưu điểm vượt trội so với van vận hành thủ công trong công nghiệp.",
    date: "07/08/2024",
    image: "https://saigonvalve.vn/uploads/files/2024/09/30/thumbs/z5775374896330_34978cd15a40f6e3bf01947b2bbb7ca2-306x234-5.jpg",
    category: "SẢN PHẨM",
    author: "Kỹ sư SGV",
    readTime: "7 phút",
    content: `
      <h3>Van điều khiển tự động: Hiệu quả và Chính xác</h3>
      <p>Van điều khiển là thiết bị không thể thiếu trong các hệ thống tự động hóa. Nó cho phép thay đổi lưu lượng, áp suất hoặc nhiệt độ của dòng chảy một cách tự động dựa trên tín hiệu điều khiển.</p>

      <h4>Phân loại theo nguồn năng lượng:</h4>
      <ul>
        <li><strong>Van điều khiển điện (Electric Control Valve):</strong> Sử dụng động cơ điện (Motor) để truyền động. Ưu điểm là chính xác, không cần hệ thống khí nén cồng kềnh.</li>
        <li><strong>Van điều khiển khí nén (Pneumatic Control Valve):</strong> Sử dụng áp lực khí nén. Tốc độ đóng mở cực nhanh, an toàn trong môi trường dễ cháy nổ.</li>
      </ul>

      <p>Tại Sài Gòn Valve, chúng tôi cung cấp các dòng van điều khiển từ những thương hiệu hàng đầu thế giới, tích hợp công nghệ feedback để báo vị trí chính xác về trung tâm điều khiển.</p>
    `,
  },
  {
    id: "4",
    title: "VAN OKM – GIẢI PHÁP TỐI ƯU CHO HỆ THỐNG CÔNG NGHIỆP",
    desc: "Van OKM là thương hiệu van công nghiệp cao cấp đến từ Nhật Bản, cung cấp các giải pháp tối ưu cho hệ thống cấp nước và xử lý nước thải công nghiệp.",
    date: "29/03/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/03/03/thumbs/BANNER-306x234-5.png",
    category: "SẢN PHẨM",
    author: "Admin",
    readTime: "4 phút",
  },
  {
    id: "5",
    title: "GIẢI PHÁP VAN CỔNG THỦY LỰC CHO HỆ THỐNG CẤP THOÁT NƯỚC THÔNG MINH",
    desc: "Van cổng thủy lực thông minh kết hợp với hệ thống điều khiển IOT đang trở thành giải pháp tối ưu giúp nâng cao hiệu quả vận hành.",
    date: "21/03/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/03/19/thumbs/VAN-C-NG-TL-306x234-5.png",
    category: "KỸ THUẬT",
    author: "Kỹ sư SGV",
    readTime: "7 phút",
  },
  {
    id: "6",
    title: "UBND TỈNH AN GIANG TIẾP VÀ LÀM VIỆC VỚI CLB DOANH NHÂN KHÁNH HÒA - SÀI GÒN",
    desc: "Câu lạc bộ Doanh nhân Khánh Hòa - Sài Gòn đã có buổi làm việc với lãnh đạo tỉnh nhằm tìm hiểu cơ hội hợp tác và đầu tư.",
    date: "14/02/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/02/14/thumbs/IMG_9996_compressed-306x234-5.jpg",
    category: "SỰ KIỆN",
    author: "Ban Truyền Thông",
    readTime: "3 phút",
  },
  {
    id: "7",
    title: "Van giảm áp đa hằng số SV3-PRV: Giải pháp giúp tiết kiệm và giảm thiểu thất thoát nước",
    desc: "Tối ưu hóa hoạt động, giúp doanh nghiệp giảm thiểu thất thoát nước, quản lý hệ thống một cách hiệu quả và tiết kiệm tài nguyên.",
    date: "06/01/2025",
    image: "https://saigonvalve.vn/uploads/files/2025/02/15/thumbs/H-NH-WEB-VGA-SV3-PRV-15022025-1739610828-306x234-5.png",
    category: "SẢN PHẨM",
    author: "Phòng R&D",
    readTime: "5 phút",
  },
  {
    id: "8",
    title: "CÔNG NGHỆ KIỂM SOÁT DÒNG CHẢY HIỆN ĐẠI GIẢM THẤT THOÁT NƯỚC TẠI VIỆT NAM",
    desc: "Thất thoát nước là một vấn đề nghiêm trọng, gây lãng phí tài nguyên quý giá và ảnh hưởng đến doanh thu của các doanh nghiệp.",
    date: "25/12/2024",
    image: "https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/-i-u-khi-n-gi-m-s-t-306x234-5.png",
    category: "CÔNG NGHỆ",
    author: "Admin",
    readTime: "8 phút",
  },
];
