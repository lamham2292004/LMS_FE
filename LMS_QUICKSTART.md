# 🚀 LMS Backend Integration - Quick Start

## ✅ Setup (5 phút)

### 1. Khởi động Backend

```bash
cd f:\DoAn\LMS
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8083`

### 2. Cấu hình Frontend

Tạo file `.env.local`:

```env
NEXT_PUBLIC_LMS_API_URL=http://localhost:8083/api
```

### 3. Khởi động Frontend

```bash
cd f:\DoAn\FE_LMS
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

### 4. Test Connection

Truy cập: `http://localhost:3000/test-lms`

---

## 📝 Sử Dụng Cơ Bản

### 1. Import API Client

```typescript
import { lmsApiClient } from "@/lib/lms-api-client";
```

### 2. Hoặc sử dụng Hooks (khuyến nghị)

```typescript
import { useCourses, useEnrollCourse } from "@/lib/hooks/useLms";
```

### 3. Ví dụ: Hiển thị danh sách khóa học

```typescript
"use client";

import CourseList from "@/components/LMS/CourseList";

export default function CoursesPage() {
  return (
    <div>
      <h1>Danh sách khóa học</h1>
      <CourseList />
    </div>
  );
}
```

### 4. Ví dụ: Đăng ký khóa học

```typescript
import EnrollButton from "@/components/LMS/EnrollButton";

function CourseDetail({ courseId, courseName }) {
  return (
    <div>
      <h1>{courseName}</h1>
      <EnrollButton courseId={courseId} courseName={courseName} />
    </div>
  );
}
```

### 5. Ví dụ: Khóa học của tôi (Student)

```typescript
import MyEnrollments from "@/components/LMS/MyEnrollments";

export default function MyCoursesPage() {
  return <MyEnrollments />;
}
```

---

## 📚 Components Có Sẵn

- `<CourseList />` - Hiển thị danh sách khóa học
- `<EnrollButton />` - Nút đăng ký khóa học
- `<MyEnrollments />` - Danh sách khóa học đã đăng ký

---

## 🔑 Authentication

JWT token từ Identity Service (Laravel) tự động được sử dụng cho LMS Backend.

**Lưu ý:** Đảm bảo user đã login qua Identity Service trước khi sử dụng các API cần authentication.

---

## 📖 Tài Liệu Đầy Đủ

- [LMS Integration Guide](./LMS_INTEGRATION_GUIDE.md) - Hướng dẫn chi tiết
- [Backend README](f:\DoAn\LMS\README.md) - API Documentation
- [API Client Source](./src/lib/lms-api-client.ts) - Source code
- [React Hooks](./src/lib/hooks/useLms.ts) - Custom hooks

---

## 🆘 Troubleshooting

### Backend không kết nối được?

```bash
# Check backend đang chạy
curl http://localhost:8083/api/health
```

### CORS Error?

Kiểm tra file `application.yaml` của backend:

```yaml
cors:
  allowed-origins: http://localhost:3000
```

### 401 Unauthorized?

Đảm bảo đã login và có JWT token trong localStorage.

---

## ✨ Next Steps

1. ✅ Test connection tại `/test-lms`
2. ✅ Xem các course công khai (không cần login)
3. ✅ Login qua Identity Service
4. ✅ Test enrollment và quiz features

**Chúc bạn code vui vẻ! 🎉**
