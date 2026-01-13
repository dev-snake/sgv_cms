export interface Product {
  id: string;
  name: string;
  category: string;
  status: "available" | "out_of_stock" | "discontinued";
  price?: string;
  image: string;
  sku: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Van Cổng Gang Mặt Bích OKM",
    category: "Van Công Nghiệp",
    status: "available",
    sku: "OKM-GV-01",
    image: "https://saigonvalve.vn/uploads/files/2025/03/03/thumbs/BANNER-306x234-5.png",
  },
  {
    id: "2",
    name: "Bộ Điều Khiển Điện NOAH SA Series",
    category: "Bộ Điều Khiển",
    status: "available",
    sku: "NOAH-SA-10",
    image: "https://saigonvalve.vn/uploads/files/2025/04/17/thumbs/IOT-306x234-5.png",
  },
  {
    id: "3",
    name: "DATALOGGER SV1-DAQ",
    category: "Thiết Bị IoT",
    status: "available",
    sku: "SGV-DAQ-01",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-306x234-5.png",
  },
  {
    id: "4",
    name: "Van Giảm Áp SV3-PRV",
    category: "Van Thủy Lực",
    status: "out_of_stock",
    sku: "SGV-PRV-40",
    image: "https://saigonvalve.vn/uploads/files/2025/02/15/thumbs/H-NH-WEB-VGA-SV3-PRV-15022025-1739610828-306x234-5.png",
  },
];
