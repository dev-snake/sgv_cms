export interface Project {
  id: string;
  name: string;
  location: string;
  year: string;
  category: string;
  image: string;
  status: "completed" | "ongoing" | "planning";
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Cung cấp van cho Nhà máy nước Thủ Đức",
    location: "TP. Hồ Chí Minh",
    year: "2024",
    category: "Cấp nước",
    status: "completed",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/495616963_642796365424897_6462862703532989991_n-306x234-5.jpg",
  },
  {
    id: "2",
    name: "Hệ thống SCADA trạm bơm tăng áp An Giang",
    location: "Tỉnh An Giang",
    year: "2025",
    category: "Tự động hóa",
    status: "ongoing",
    image: "https://saigonvalve.vn/uploads/files/2025/02/17/thumbs/-i-u-khi-n-gi-m-s-t-306x234-5.png",
  },
  {
    id: "3",
    name: "Lắp đặt Datalogger mạng lưới Sawaco",
    location: "Toàn TP.HCM",
    year: "2024",
    category: "Giám sát",
    status: "completed",
    image: "https://saigonvalve.vn/uploads/files/2025/06/24/thumbs/datalogger-1-306x234-5.png",
  },
];
