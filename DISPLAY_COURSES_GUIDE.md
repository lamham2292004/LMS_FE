# 📚 Hiển Thị Khóa Học Từ Backend - Hướng Dẫn

## 🎯 Mục Tiêu

Hiển thị danh sách khóa học từ LMS Backend (Spring Boot) lên Frontend (Next.js)

---

## ✅ BƯỚC 1: Kiểm Tra Backend Có Dữ Liệu

### 1.1 Test API Bằng Postman/cURL

```bash
# Test categories
curl http://localhost:8083/api/category

# Test courses
curl http://localhost:8083/api/course
```

**Kết quả mong đợi:**

```json
{
  "code": 1000,
  "result": [
    {
      "id": 1,
      "title": "Khóa học mẫu",
      "description": "Mô tả",
      "price": 100000,
      ...
    }
  ]
}
```

### 1.2 Nếu Chưa Có Dữ Liệu

Tạo dữ liệu test trong backend bằng cách:

#### **Option A: Qua Postman/API**

**Tạo Category:**

```bash
POST http://localhost:8083/api/category/createCategory
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Lập Trình Web",
  "description": "Các khóa học về lập trình web"
}
```

**Tạo Course:**

```bash
POST http://localhost:8083/api/course/createCourse
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

course: {
  "title": "React cơ bản",
  "description": "Học React từ đầu",
  "price": 299000,
  "categoryId": 1,
  "status": "OPEN"
}
file: [chọn file ảnh]
```

#### **Option B: Qua SQL**

```sql
-- Insert Categories
INSERT INTO categories (name, description, created_at, updated_at) VALUES
('Lập Trình Web', 'Các khóa học về lập trình web', NOW(), NOW()),
('Data Science', 'Khóa học về khoa học dữ liệu', NOW(), NOW()),
('Mobile Development', 'Phát triển ứng dụng di động', NOW(), NOW());

-- Insert Courses
INSERT INTO courses (title, description, price, teacher_id, status, category_id, created_at, updated_at) VALUES
('React cơ bản', 'Học React từ đầu', 299000, 1, 'OPEN', 1, NOW(), NOW()),
('Node.js Backend', 'Xây dựng API với Node.js', 399000, 1, 'OPEN', 1, NOW(), NOW()),
('Python Data Science', 'Phân tích dữ liệu với Python', 499000, 1, 'OPEN', 2, NOW(), NOW());
```

---

## ✅ BƯỚC 2: Sử Dụng Pages Đã Có

### 2.1 Browse Courses (Public - Không Cần Login)

**URL:** `http://localhost:3000/authorized/lms/app/student/browse-lms`

Trang này sẽ:

- ✅ Hiển thị tất cả khóa học từ backend
- ✅ Filter theo category
- ✅ Search khóa học
- ✅ Hiển thị giá, status, description

**File:** `src/app/authorized/lms/app/student/browse-lms/page.tsx`

### 2.2 Test Page (Debug)

**URL:** `http://localhost:3000/test-lms`

Trang này sẽ hiển thị:

- ✅ Health check
- ✅ Raw API responses
- ✅ Categories list
- ✅ Courses list
- ✅ Connection info

**File:** `src/app/test-lms/page.tsx`

### 2.3 My Courses (Cần Login Student)

**URL:** `http://localhost:3000/authorized/lms/app/student/my-courses-lms`

Trang này sẽ:

- ✅ Hiển thị các khóa học đã enroll
- ✅ Phân loại theo status (Active/Completed)
- ✅ Hiển thị progress

**File:** `src/app/authorized/lms/app/student/my-courses-lms/page.tsx`

---

## ✅ BƯỚC 3: Tích Hợp Vào Pages Khác

### 3.1 Thêm Vào Student Dashboard

**File:** `src/app/authorized/lms/app/student/page.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useCourses } from "@/lib/hooks/useLms";
import CourseList from "@/components/LMS/CourseList";

export default function StudentDashboard() {
  const { courses, loading, error, fetchCourses } = useCourses();

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Dashboard - Khóa Học Mới</h1>

      {loading && <p>Đang tải...</p>}
      {error && <p>Lỗi: {error.message}</p>}

      {/* Hiển thị 6 khóa học mới nhất */}
      <div className="grid grid-cols-3 gap-4">
        {courses.slice(0, 6).map((course) => (
          <div key={course.id} className="border p-4 rounded">
            <h3>{course.title}</h3>
            <p>{course.price.toLocaleString()} đ</p>
          </div>
        ))}
      </div>

      {/* Hoặc dùng component có sẵn */}
      <CourseList />
    </div>
  );
}
```

### 3.2 Thêm Vào Home Page

**File:** `src/app/page.tsx` hoặc `src/app/authorized/lms/page.tsx`

```typescript
import CourseList from "@/components/LMS/CourseList";

export default function HomePage() {
  return (
    <div>
      <h1>Khám Phá Khóa Học</h1>
      <CourseList />
    </div>
  );
}
```

### 3.3 Tạo Course Detail Page

**File:** `src/app/authorized/lms/app/student/courses/[id]/page-lms.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useCourse } from "@/lib/hooks/useLms";
import EnrollButton from "@/components/LMS/EnrollButton";

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const courseId = parseInt(params.id);
  const { data: course, loading, error, execute } = useCourse(courseId);

  useEffect(() => {
    execute();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Course Header */}
      <div className="mb-6">
        {course.img && (
          <img
            src={course.img}
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              {course.price.toLocaleString()} đ
            </span>
            <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded">
              {course.status}
            </span>
          </div>
          <EnrollButton courseId={course.id} courseName={course.title} />
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Nội dung khóa học</h2>
        {course.lessons && course.lessons.length > 0 ? (
          <ul className="space-y-2">
            {course.lessons.map((lesson, index) => (
              <li
                key={lesson.id}
                className="flex items-center p-3 bg-gray-50 rounded"
              >
                <span className="font-semibold mr-2">{index + 1}.</span>
                <span>{lesson.title}</span>
                {lesson.duration && (
                  <span className="ml-auto text-gray-500">
                    {lesson.duration} phút
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có bài học nào</p>
        )}
      </div>
    </div>
  );
}
```

---

## ✅ BƯỚC 4: Test & Verify

### 4.1 Test Workflow

1. **Start Backend:**

   ```bash
   cd f:\DoAn\LMS
   mvn spring-boot:run
   ```

2. **Start Frontend:**

   ```bash
   cd f:\DoAn\FE_LMS
   npm run dev
   ```

3. **Test Pages:**
   - ✅ Test page: `http://localhost:3000/test-lms`
   - ✅ Browse courses: `http://localhost:3000/authorized/lms/app/student/browse-lms`
   - ✅ My courses: `http://localhost:3000/authorized/lms/app/student/my-courses-lms`

### 4.2 Checklist

- [ ] Backend running và có data
- [ ] Frontend running
- [ ] Token valid (check `/debug-token`)
- [ ] Test page shows courses
- [ ] Browse page shows courses
- [ ] Can filter by category
- [ ] Can search courses
- [ ] Images load (or fallback)
- [ ] Can enroll in courses (if logged in as Student)

---

## 🎨 BƯỚC 5: Customize UI

### 5.1 Thay Đổi Layout

Edit `src/components/LMS/CourseList.tsx`:

```typescript
// Thay đổi số cột
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"> // 4 cột thay vì 3

// Thay đổi màu
<Badge className="bg-blue-500 text-white"> // Màu custom

// Thêm animation
<div className="transition-all duration-300 hover:scale-105">
```

### 5.2 Thêm Features

```typescript
// Sort by price
const sortedCourses = [...courses].sort((a, b) => a.price - b.price);

// Filter by price range
const affordableCourses = courses.filter((c) => c.price < 500000);

// Group by category
const groupedCourses = courses.reduce((acc, course) => {
  const category = course.categoryName;
  if (!acc[category]) acc[category] = [];
  acc[category].push(course);
  return acc;
}, {});
```

---

## 🐛 Troubleshooting

### Issue 1: Không Thấy Courses

**Kiểm tra:**

```bash
# Test backend API
curl http://localhost:8083/api/course

# Check browser console
# Mở F12 → Console → Xem errors

# Check network tab
# F12 → Network → Xem requests
```

**Giải pháp:**

- Backend có data chưa?
- Backend đang chạy chưa?
- Token còn hạn chưa? (`/debug-token`)
- CORS configured đúng chưa?

### Issue 2: Images Không Load

**Nguyên nhân:** Path ảnh không đúng

**Giải pháp:**

```typescript
// Fallback image
<img
  src={course.img || "/images/course-1.png"}
  onError={(e) => {
    e.currentTarget.src = "/images/course-1.png";
  }}
/>
```

### Issue 3: Cannot Enroll

**Nguyên nhân:** Token hết hạn hoặc không phải Student

**Giải pháp:**

- Check token: `/debug-token`
- Check user role: Console → `localStorage.getItem('auth_token')` → Decode tại jwt.io
- Login với account Student

---

## 📊 Architecture

```
Frontend (Next.js)
       │
       ├─ Pages
       │  ├─ /test-lms              → Test & Debug
       │  ├─ /browse-lms            → Browse all courses
       │  ├─ /my-courses-lms        → Student enrollments
       │  └─ /courses/[id]          → Course detail
       │
       ├─ Components
       │  ├─ CourseList             → Display courses
       │  ├─ EnrollButton           → Enroll action
       │  └─ MyEnrollments          → Show enrollments
       │
       ├─ Hooks
       │  ├─ useCourses()           → Fetch courses
       │  ├─ useCourse(id)          → Fetch single course
       │  └─ useEnrollCourse()      → Enroll action
       │
       └─ API Client
          └─ lmsApiClient           → HTTP requests
                 │
                 ▼
          Backend (Spring Boot)
          └─ /api/course            → Courses endpoint
```

---

## 🚀 Quick Start Commands

```bash
# 1. Check backend
curl http://localhost:8083/api/health

# 2. Check courses
curl http://localhost:8083/api/course

# 3. Start frontend
cd f:\DoAn\FE_LMS && npm run dev

# 4. Open test page
open http://localhost:3000/test-lms

# 5. Open browse page
open http://localhost:3000/authorized/lms/app/student/browse-lms
```

---

## ✨ Summary

**Đã có sẵn:**

- ✅ API Client đầy đủ
- ✅ React Hooks
- ✅ Components tái sử dụng
- ✅ 3 pages demo

**Bạn chỉ cần:**

1. Đảm bảo backend có data
2. Truy cập `/browse-lms` để xem courses
3. Integrate vào pages khác nếu muốn

**Pages quan trọng:**

- `/test-lms` - Test & debug
- `/browse-lms` - Browse courses
- `/my-courses-lms` - My enrollments
- `/debug-token` - Check token

---

**Happy Coding! 🎉**
