# Hướng dẫn Điều hướng LMS

## Tổng quan
Hệ thống LMS đã được cấu trúc với 3 vai trò chính: **Student**, **Lecturer**, và **Admin**. Mỗi vai trò có các trang riêng biệt với điều hướng được quản lý thông qua Sidebar component.

## Cấu trúc Routing

### Base Path
Tất cả các trang LMS nằm trong: `/authorized/lms/app/`

---

## 1. STUDENT ROUTES

### Sidebar Navigation
- **Tổng quan**: `/authorized/lms/app/student`
- **Khám phá**: `/authorized/lms/app/student/browse`
- **Khóa học của tôi**: `/authorized/lms/app/student/courses`
- **Bài kiểm tra**: `/authorized/lms/app/student/tests`
- **Hồ sơ**: `/authorized/lms/app/student/profile`

### Chi tiết các trang

#### 1.1 Student Dashboard (`/student`)
- Hiển thị thống kê tổng quan
- Khóa học đang học với progress bar
- Hồ sơ học tập
- Quick actions

#### 1.2 Browse Courses (`/student/browse`)
- Tìm kiếm và lọc khóa học
- Hiển thị tất cả khóa học có sẵn
- Tabs: Tất cả / Miễn phí / Trả phí
- Thêm vào giỏ hàng
- Link đến chi tiết khóa học

#### 1.3 My Courses (`/student/courses`)
- Tabs: Đang học / Đã hoàn thành
- Progress tracking
- Link đến từng khóa học: `/student/courses/[id]`
- Hiển thị chứng chỉ cho khóa đã hoàn thành

#### 1.4 Tests (`/student/tests`)
- Danh sách bài kiểm tra đã làm
- Tabs: Tất cả / Đạt / Chưa đạt
- Thống kê điểm số
- Link xem chi tiết: `/student/tests/[id]/review`

#### 1.5 Profile (`/student/profile`)
- Cập nhật thông tin cá nhân
- Upload avatar
- Quản lý tài khoản

---

## 2. LECTURER ROUTES

### Sidebar Navigation
- **Tổng quan**: `/authorized/lms/app/lecturer`
- **Khóa học**: `/authorized/lms/app/lecturer/courses`
- **Học viên**: `/authorized/lms/app/lecturer/students`
- **Báo cáo**: `/authorized/lms/app/lecturer` (coming soon)

### Chi tiết các trang

#### 2.1 Lecturer Dashboard (`/lecturer`)
- Thống kê: Khóa học, Học viên, Doanh thu, Đánh giá
- Danh sách khóa học của giảng viên
- Quick action: Tạo khóa học mới
- Link quản lý và chỉnh sửa khóa học

#### 2.2 Courses Management (`/lecturer/courses`)
- Tabs: Đã xuất bản / Bản nháp
- Tìm kiếm khóa học
- Thống kê tổng quan
- Actions:
  - Tạo mới: `/lecturer/courses/new`
  - Quản lý: `/lecturer/courses/[id]`
  - Chỉnh sửa: `/lecturer/courses/[id]/edit`

#### 2.3 Students Management (`/lecturer/students`)
- Tabs: Đang hoạt động / Không hoạt động / Tất cả
- Tìm kiếm học viên
- Thống kê: Tiến độ, Hoàn thành, Thời gian học
- Xem chi tiết từng học viên

---

## 3. ADMIN ROUTES

### Sidebar Navigation
- **Tổng quan**: `/authorized/lms/app/admin`
- **Người dùng**: `/authorized/lms/app/admin/users`
- **Khóa học**: `/authorized/lms/app/admin/courses`
- **Danh mục**: `/authorized/lms/app/admin/categories`
- **Giao dịch**: `/authorized/lms/app/admin/transactions`

### Chi tiết các trang

#### 3.1 Admin Dashboard (`/admin`)
- Thống kê tổng quan: Users, Courses, Revenue, Orders
- Người dùng mới
- Đơn hàng gần đây
- Khóa học chờ duyệt

#### 3.2 Users Management (`/admin/users`)
- Tabs: Học viên / Giảng viên
- Tìm kiếm người dùng
- Actions:
  - Thêm người dùng mới
  - Chỉnh sửa thông tin
  - Phê duyệt giảng viên
  - Tạm khóa / Kích hoạt
  - Xóa người dùng

#### 3.3 Courses Management (`/admin/courses`)
- Tabs: Tất cả / Đã xuất bản / Chờ duyệt / Bản nháp
- Tìm kiếm và lọc
- Thống kê khóa học
- Actions: Xem, Sửa, Phê duyệt

#### 3.4 Categories Management (`/admin/categories`)
- Quản lý danh mục khóa học
- CRUD operations
- Thống kê số khóa học theo danh mục

#### 3.5 Transactions Management (`/admin/transactions`)
- Danh sách giao dịch
- Thống kê: Doanh thu, Thành công, Đang xử lý, Thất bại
- Tìm kiếm và lọc
- Xuất báo cáo Excel

---

## 4. SHARED ROUTES

### 4.1 Cart (`/cart`)
- Hiển thị giỏ hàng
- Xóa khóa học khỏi giỏ
- Tính tổng tiền
- Link đến checkout

### 4.2 Checkout (`/checkout`)
- Chọn phương thức thanh toán:
  - Thẻ tín dụng/ghi nợ
  - Chuyển khoản ngân hàng
  - Ví điện tử
- Nhập thông tin thanh toán
- Xác nhận đơn hàng
- Redirect đến: `/checkout/success`

### 4.3 Checkout Success (`/checkout/success`)
- Xác nhận thanh toán thành công
- Thông tin đơn hàng
- Link đến khóa học đã mua

---

## 5. COMPONENTS

### 5.1 Sidebar Component
**Location**: `src/app/authorized/lms/components/sidebar.tsx`

**Props**:
- `role`: "student" | "lecturer" | "admin"

**Features**:
- Dynamic menu items based on role
- Active state highlighting
- Logo và branding
- Settings link

### 5.2 Header Component
**Location**: `src/app/authorized/lms/components/header.tsx`

**Props**:
- `title`: string
- `showCart?`: boolean

**Features**:
- Page title
- Shopping cart icon (for students)
- User profile menu
- Notifications

---

## 6. NAVIGATION PATTERNS

### 6.1 Link Components
Sử dụng Next.js `Link` component cho client-side navigation:

```tsx
import Link from "next/link"

<Link href="/authorized/lms/app/student/courses">
  <Button>Xem khóa học</Button>
</Link>
```

### 6.2 Programmatic Navigation
Sử dụng `useRouter` hook:

```tsx
import { useRouter } from "next/navigation"

const router = useRouter()
router.push("/authorized/lms/app/student")
```

### 6.3 Active Route Detection
Sử dụng `usePathname` hook:

```tsx
import { usePathname } from "next/navigation"

const pathname = usePathname()
const isActive = pathname === "/authorized/lms/app/student"
```

---

## 7. ROUTE PROTECTION

### Authentication
Tất cả routes trong `/authorized/lms/app/` yêu cầu authentication.

### Role-based Access
- Student routes: Chỉ students
- Lecturer routes: Chỉ lecturers
- Admin routes: Chỉ admins

### Implementation
Sử dụng middleware hoặc layout-level protection.

---

## 8. IMPORT PATHS

### Alias Configuration
Project sử dụng path alias `@lms/` cho imports:

```tsx
import { Header } from "@lms/components/header"
import { Button } from "@lms/components/ui/button"
```

### Common Imports
```tsx
// Components
import { Header } from "@lms/components/header"
import { Sidebar } from "@lms/components/sidebar"

// UI Components
import { Button } from "@lms/components/ui/button"
import { Card } from "@lms/components/ui/card"
import { Badge } from "@lms/components/ui/badge"

// Utils
import { cn } from "@lms/lib/utils"

// Next.js
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
```

---

## 9. LAYOUT STRUCTURE

```
app/authorized/lms/app/
├── layout.tsx (Main LMS Layout with Sidebar)
├── student/
│   ├── layout.tsx (Student-specific layout)
│   └── [pages]
├── lecturer/
│   ├── layout.tsx (Lecturer-specific layout)
│   └── [pages]
└── admin/
    ├── layout.tsx (Admin-specific layout)
    └── [pages]
```

---

## 10. NEXT STEPS

### Cần hoàn thiện:
1. ✅ Tất cả trang đã có nội dung cơ bản
2. ✅ Sidebar navigation đã được cấu hình
3. ✅ Import paths đã được chuẩn hóa
4. 🔄 API integration (cần kết nối backend)
5. 🔄 Authentication & Authorization
6. 🔄 Dynamic routes ([id] pages)
7. 🔄 Form validation
8. 🔄 Error handling
9. 🔄 Loading states
10. 🔄 SEO optimization

### Trang cần tạo thêm:
- `/student/courses/[id]` - Chi tiết khóa học
- `/student/courses/[id]/learn` - Học bài
- `/lecturer/courses/new` - Tạo khóa học mới
- `/lecturer/courses/[id]` - Quản lý khóa học
- `/lecturer/courses/[id]/edit` - Chỉnh sửa khóa học
- `/checkout/success` - Thanh toán thành công
- `/settings` - Cài đặt chung

---

## 11. TESTING NAVIGATION

### Manual Testing Checklist:
- [ ] Tất cả links trong sidebar hoạt động
- [ ] Active state hiển thị đúng
- [ ] Breadcrumbs (nếu có) hiển thị đúng
- [ ] Back button hoạt động
- [ ] Deep links hoạt động
- [ ] 404 page cho invalid routes
- [ ] Role-based access control

### Test URLs:
```
# Student
http://localhost:3000/authorized/lms/app/student
http://localhost:3000/authorized/lms/app/student/browse
http://localhost:3000/authorized/lms/app/student/courses
http://localhost:3000/authorized/lms/app/student/tests
http://localhost:3000/authorized/lms/app/student/profile

# Lecturer
http://localhost:3000/authorized/lms/app/lecturer
http://localhost:3000/authorized/lms/app/lecturer/courses
http://localhost:3000/authorized/lms/app/lecturer/students

# Admin
http://localhost:3000/authorized/lms/app/admin
http://localhost:3000/authorized/lms/app/admin/users
http://localhost:3000/authorized/lms/app/admin/courses
http://localhost:3000/authorized/lms/app/admin/categories
http://localhost:3000/authorized/lms/app/admin/transactions

# Shared
http://localhost:3000/authorized/lms/app/cart
http://localhost:3000/authorized/lms/app/checkout
```

---

## 12. TROUBLESHOOTING

### Common Issues:

1. **404 Not Found**
   - Kiểm tra path có đúng không
   - Kiểm tra file `page.tsx` có tồn tại không

2. **Import errors**
   - Kiểm tra path alias trong `tsconfig.json`
   - Đảm bảo sử dụng `@lms/` prefix

3. **Sidebar không hiển thị**
   - Kiểm tra layout.tsx
   - Kiểm tra role prop

4. **Active state không hoạt động**
   - Kiểm tra pathname matching logic
   - Kiểm tra exact vs partial matching

---

## Kết luận

Hệ thống điều hướng LMS đã được thiết lập hoàn chỉnh với:
- ✅ 3 vai trò với các trang riêng biệt
- ✅ Sidebar navigation động
- ✅ Tất cả trang chính đã có nội dung
- ✅ Import paths đã được chuẩn hóa
- ✅ Layout structure rõ ràng

Hệ thống sẵn sàng cho việc tích hợp API và phát triển thêm các tính năng.
