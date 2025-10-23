# 🎓 LMS Backend Integration - Complete Guide

## 📌 Tổng Quan

Dự án đã được tích hợp với **LMS Backend (Spring Boot)** để quản lý:

- ✅ Khóa học (Courses)
- ✅ Bài học (Lessons)
- ✅ Bài kiểm tra (Quizzes)
- ✅ Ghi danh (Enrollments)
- ✅ Danh mục (Categories)

## 🏗️ Kiến Trúc Hệ Thống

```
┌────────────────────────────────┐
│   Frontend (Next.js 14)        │
│   Port: 3000                   │
└──────────┬─────────────────────┘
           │
           ├─────────────────┬──────────────────┐
           │                 │                  │
           ▼                 ▼                  ▼
┌──────────────────┐  ┌──────────────┐  ┌─────────────┐
│ Identity Service │  │ LMS Backend  │  │  Other APIs │
│   (Laravel)      │  │ (Spring Boot)│  │             │
│   Port: 8000     │  │ Port: 8083   │  │             │
│                  │  │              │  │             │
│ - Authentication │  │ - Courses    │  │             │
│ - User Profiles  │  │ - Lessons    │  │             │
│ - Authorization  │  │ - Quizzes    │  │             │
└──────────────────┘  │ - Enrollments│  │             │
                      │ - Categories │  │             │
                      └──────────────┘  └─────────────┘
```

## 📁 Cấu Trúc Files Đã Tạo

```
f:\DoAn\FE_LMS\
├── src/
│   ├── lib/
│   │   ├── lms-api-client.ts          # LMS API Client chính
│   │   ├── hooks/
│   │   │   └── useLms.ts              # React Hooks cho LMS
│   │   └── config.ts                  # Cấu hình (đã cập nhật)
│   │
│   ├── components/
│   │   └── LMS/
│   │       ├── CourseList.tsx         # Component hiển thị danh sách khóa học
│   │       ├── EnrollButton.tsx       # Button đăng ký khóa học
│   │       └── MyEnrollments.tsx      # Component khóa học đã đăng ký
│   │
│   └── app/
│       ├── test-lms/
│       │   └── page.tsx               # Test page để kiểm tra integration
│       │
│       └── authorized/lms/app/student/
│           ├── browse-lms/
│           │   └── page.tsx           # Browse courses từ LMS backend
│           └── my-courses-lms/
│               └── page.tsx           # My courses từ LMS backend
│
├── LMS_INTEGRATION_GUIDE.md           # Hướng dẫn chi tiết
├── LMS_QUICKSTART.md                  # Quick start guide
└── README_LMS_INTEGRATION.md          # File này
```

## ⚙️ Setup & Installation

### 1. Cài Đặt Backend

#### **Bước 1.1: Khởi động MySQL**

```bash
# Windows
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

#### **Bước 1.2: Tạo Database**

```sql
CREATE DATABASE LMS;
```

#### **Bước 1.3: Khởi động Spring Boot Backend**

```bash
cd f:\DoAn\LMS
mvn spring-boot:run
```

✅ Backend sẽ chạy tại: `http://localhost:8083`

Kiểm tra:

```bash
curl http://localhost:8083/api/health
```

### 2. Cài Đặt Frontend

#### **Bước 2.1: Tạo file `.env.local`**

```env
# Identity Service (Laravel)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# LMS Service (Spring Boot)
NEXT_PUBLIC_LMS_API_URL=http://localhost:8083/api
```

#### **Bước 2.2: Install dependencies**

```bash
cd f:\DoAn\FE_LMS
npm install
```

#### **Bước 2.3: Khởi động Frontend**

```bash
npm run dev
```

✅ Frontend chạy tại: `http://localhost:3000`

## 🧪 Testing

### Test 1: Health Check

Truy cập: `http://localhost:3000/test-lms`

Bạn sẽ thấy:

- ✅ Health Check status
- ✅ Danh sách categories
- ✅ Danh sách courses
- ✅ Auth info (nếu đã login)

### Test 2: Browse Courses (Public)

Truy cập: `http://localhost:3000/authorized/lms/app/student/browse-lms`

Không cần login, bạn có thể:

- ✅ Xem tất cả khóa học
- ✅ Filter theo category
- ✅ Search khóa học
- ❌ Đăng ký khóa học (cần login)

### Test 3: My Enrollments (Student Only)

1. Login với tài khoản **Student**
2. Truy cập: `http://localhost:3000/authorized/lms/app/student/my-courses-lms`
3. Xem các khóa học đã đăng ký

## 📚 Sử Dụng Trong Code

### Cách 1: Sử Dụng API Client (Low-level)

```typescript
import { lmsApiClient } from "@/lib/lms-api-client";

// Trong component hoặc function
async function loadCourses() {
  try {
    const response = await lmsApiClient.getAllCourses();
    const courses = response.result; // Array of CourseResponse
    console.log("Courses:", courses);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Cách 2: Sử Dụng React Hooks (Khuyến nghị)

```typescript
"use client";

import { useEffect } from "react";
import { useCourses } from "@/lib/hooks/useLms";

export default function MyComponent() {
  const { courses, loading, error, fetchCourses } = useCourses({
    onSuccess: (data) => {
      console.log("Loaded:", data.length, "courses");
    },
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.price} VNĐ</p>
        </div>
      ))}
    </div>
  );
}
```

### Cách 3: Sử Dụng Components Có Sẵn

```typescript
import CourseList from "@/components/LMS/CourseList";
import EnrollButton from "@/components/LMS/EnrollButton";
import MyEnrollments from "@/components/LMS/MyEnrollments";

export default function Page() {
  return (
    <div>
      {/* Hiển thị danh sách khóa học */}
      <CourseList />

      {/* Button đăng ký */}
      <EnrollButton courseId={1} courseName="React Course" />

      {/* Khóa học đã đăng ký */}
      <MyEnrollments />
    </div>
  );
}
```

## 🔐 Authentication & Authorization

### JWT Token Flow

1. **User login** qua Identity Service (Laravel):

   ```typescript
   const response = await apiClient.login({ email, password });
   // Token được lưu vào localStorage['auth_token']
   ```

2. **LMS API** tự động sử dụng token:

   ```typescript
   // Không cần truyền token thủ công
   const courses = await lmsApiClient.getAllCourses();
   // Header tự động: Authorization: Bearer <token>
   ```

3. **Backend** kiểm tra quyền:
   - Trích xuất `userId`, `userType`, `email` từ JWT
   - Kiểm tra role (STUDENT, LECTURER, ADMIN)
   - Trả về data hoặc error

### Permission Matrix

| Endpoint                           | Public | Student | Lecturer | Admin |
| ---------------------------------- | ------ | ------- | -------- | ----- |
| GET /api/health                    | ✅     | ✅      | ✅       | ✅    |
| GET /api/category                  | ✅     | ✅      | ✅       | ✅    |
| GET /api/course                    | ✅     | ✅      | ✅       | ✅    |
| POST /api/enrollment/enroll        | ❌     | ✅      | ❌       | ✅    |
| GET /api/enrollment/my-enrollments | ❌     | ✅      | ❌       | ✅    |
| POST /api/course/createCourse      | ❌     | ❌      | ✅       | ✅    |
| POST /api/quiz-results/submit      | ❌     | ✅      | ❌       | ✅    |

## 📊 Available Hooks

### Category Hooks

```typescript
import {
  useCategories,
  useCategory,
  useCreateCategory,
} from "@/lib/hooks/useLms";

const { categories, loading, fetchCategories } = useCategories();
const { data: category, execute } = useCategory(categoryId);
const { createCategory, loading } = useCreateCategory();
```

### Course Hooks

```typescript
import {
  useCourses,
  useCourse,
  useCreateCourse,
  useUpdateCourse,
} from "@/lib/hooks/useLms";

const { courses, loading, fetchCourses } = useCourses();
const { data: course, execute } = useCourse(courseId);
const { createCourse, loading } = useCreateCourse();
const { updateCourse, loading } = useUpdateCourse(courseId);
```

### Enrollment Hooks (Student)

```typescript
import { useMyEnrollments, useEnrollCourse } from "@/lib/hooks/useLms";

const { enrollments, loading, fetchEnrollments } = useMyEnrollments();
const { enrollCourse, loading } = useEnrollCourse();
```

### Quiz Hooks (Student)

```typescript
import { useSubmitQuiz, useMyQuizResults } from "@/lib/hooks/useLms";

const { submitQuiz, loading } = useSubmitQuiz();
const { results, loading, fetchResults } = useMyQuizResults(quizId);
```

## 🚨 Error Handling

### Error Codes

```typescript
enum LmsErrorCode {
  SUCCESS = 1000,
  TOKEN_NOT_EXIST = 2001,
  TOKEN_INVALID = 2002,
  TOKEN_EXPIRED = 2003,
  UNAUTHORIZED = 2101,
  STUDENT_ONLY = 2103,
  COURSE_NOT_FOUND = 1004,
  ALREADY_ENROLLED = 2108,
  NOT_ENROLLED = 2106,
  QUIZ_MAX_ATTEMPTS = 1017,
}
```

### Xử Lý Errors

```typescript
try {
  await lmsApiClient.enrollCourse(courseId);
} catch (error: any) {
  switch (error.code) {
    case 2108: // Already enrolled
      alert("Bạn đã đăng ký khóa học này rồi!");
      break;
    case 2103: // Student only
      alert("Chỉ sinh viên mới có thể đăng ký");
      break;
    case 2001:
    case 2002:
    case 2003: // Token errors
      alert("Vui lòng đăng nhập lại");
      window.location.href = "/auth/login";
      break;
    default:
      alert("Lỗi: " + error.message);
  }
}
```

## 🔧 Troubleshooting

### 1. Backend không kết nối

**Triệu chứng:**

```
Failed to fetch
```

**Giải pháp:**

```bash
# Kiểm tra backend đang chạy
curl http://localhost:8083/api/health

# Nếu không chạy, khởi động lại
cd f:\DoAn\LMS
mvn spring-boot:run
```

### 2. CORS Error

**Triệu chứng:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Giải pháp:**
Kiểm tra file `application.yaml` của backend:

```yaml
cors:
  allowed-origins: http://localhost:3000
```

### 3. 401 Unauthorized

**Triệu chứng:**

```json
{ "code": 2001, "message": "Token không tồn tại trong request" }
```

**Giải pháp:**

- Đảm bảo đã login
- Kiểm tra token trong localStorage:

```javascript
localStorage.getItem("auth_token");
```

### 4. Student Only Error

**Triệu chứng:**

```json
{ "code": 2103, "message": "Chỉ dành cho học viên" }
```

**Giải pháp:**

- Login với tài khoản Student
- Hoặc kiểm tra `userType` trong JWT token

## 📖 Tài Liệu Tham Khảo

- [LMS Integration Guide](./LMS_INTEGRATION_GUIDE.md) - Hướng dẫn chi tiết đầy đủ
- [Quick Start Guide](./LMS_QUICKSTART.md) - Hướng dẫn bắt đầu nhanh
- [Backend README](f:\DoAn\LMS\README.md) - API Documentation chi tiết
- [API Client Source](./src/lib/lms-api-client.ts) - Source code
- [React Hooks Source](./src/lib/hooks/useLms.ts) - Hooks implementation

## 🎯 Next Steps

1. ✅ Test connection tại `/test-lms`
2. ✅ Browse courses (public)
3. ✅ Login với account Student
4. ✅ Test enrollment
5. ✅ Test quiz submission
6. ⬜ Tích hợp vào các pages khác
7. ⬜ Add thêm features

## 👥 Contributors

- Backend: Spring Boot LMS System
- Frontend: Next.js Integration
- Integration: LMS API Client & Hooks

---

**Chúc bạn phát triển thành công! 🚀**

Nếu có vấn đề, kiểm tra:

1. Backend đang chạy? → `curl http://localhost:8083/api/health`
2. Frontend đang chạy? → `http://localhost:3000/test-lms`
3. JWT token có trong localStorage? → Inspect → Application → Local Storage
4. CORS configured? → Check `application.yaml`
