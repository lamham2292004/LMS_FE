// File: src/features/layout/components/Sidebar/moduleList.ts

// ==========================================================
// ===                    SỬA LỖI Ở ĐÂY                     ===
// ==========================================================
// 1. Tách câu lệnh import thành hai dòng riêng biệt cho hai thư viện
import {
  faHouse,
  faFile,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

// 2. Import kiểu dữ liệu IModule (nếu cần)
import { IModule } from '@lms/features/layout/types';

/**
 * Đây là danh sách các mục sẽ hiển thị trên thanh menu chính của FE_LMS.
 * Sidebar của hệ thống sẽ đọc từ biến này để render ra giao diện.
 */
export const moduleList: IModule[] = [
  {
    name: 'Dashboard',
    icon: faHouse, // Icon cũ của hệ thống
    path: '/authorized/dashboard',
  },
  {
    name: 'Học trực tuyến',
    icon: faGraduationCap, // Icon mới cho module LMS
    path: '/authorized/lms', // Trỏ đến trang điều hướng
  },
  {
    name: 'Documents',
    icon: faFile, // Icon cũ của hệ thống
    path: '/authorized/dashboard/documents',
  },
];

// 3. Đã xóa phần interface ModuleConfig và biến modules không được sử dụng
// để giữ cho code sạch sẽ và đúng với cấu trúc của project.