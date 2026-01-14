import { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Cung cấp van cho Nhà máy nước Thủ Đức",
    client_name: "SAWACO",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    category_id: "1",
    category: "Cấp nước",
    status: "completed",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg",
  },
  {
    id: "2",
    name: "Hệ thống SCADA trạm bơm tăng áp An Giang",
    client_name: "Cấp nước An Giang",
    start_date: "2025-02-01",
    category_id: "2",
    category: "Tự động hóa",
    status: "ongoing",
    image: "https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/-i-u-khi-n-gi-m-s-t-306x234-5.png",
  },
];
