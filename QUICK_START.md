# ⚡ QUICK START - Hiển Thị Khóa Học Ngay

## 🎯 Mục Tiêu

Hiển thị khóa học từ backend trong **5 phút**

---

## 📋 Checklist

### ✅ Bước 1: Backend Đang Chạy

```bash
cd f:\DoAn\LMS
mvn spring-boot:run
```

→ Backend tại: `http://localhost:8083`

### ✅ Bước 2: Token Hợp Lệ

1. Mở: `http://localhost:3000/debug-token`
2. Nếu expired → Login lại tại: `http://localhost:3000/auth/login`

### ✅ Bước 3: Frontend Đang Chạy

```bash
cd f:\DoAn\FE_LMS
npm run dev
```

→ Frontend tại: `http://localhost:3000`

---

## 🚀 Xem Khóa Học Ngay

### **Option 1: Demo Page (Đơn giản nhất)** ⭐ RECOMMENDED

```
http://localhost:3000/courses-demo
```

→ Page đơn giản với full features

### **Option 2: Browse Page (Đầy đủ features)**

```
http://localhost:3000/authorized/lms/app/student/browse-lms
```

→ Page browse với filter, search

### **Option 3: Test Page (Debug)**

```
http://localhost:3000/test-lms
```

→ Xem raw data & debug

---

## 🔍 Kiểm Tra Backend Có Data

### Test Bằng cURL:

```bash
# Test courses
curl http://localhost:8083/api/course

# Test categories
curl http://localhost:8083/api/category
```

### Kết Quả Mong Đợi:

```json
{
  "code": 1000,
  "result": [
    {
      "id": 1,
      "title": "Khóa học...",
      "price": 100000,
      ...
    }
  ]
}
```

---

## 📊 Nếu Backend Chưa Có Data

### Quick Insert SQL:

```sql
-- Vào MySQL
mysql -u root -p
USE LMS;

-- Insert Categories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES
(1, 'Lập Trình Web', 'Các khóa học về lập trình web', NOW(), NOW()),
(2, 'Data Science', 'Khoa học dữ liệu', NOW(), NOW()),
(3, 'Mobile Dev', 'Phát triển mobile', NOW(), NOW());

-- Insert Courses
INSERT INTO courses (id, title, description, price, teacher_id, status, category_id, created_at, updated_at) VALUES
(1, 'React cơ bản', 'Học React từ đầu', 299000, 1, 'OPEN', 1, NOW(), NOW()),
(2, 'Node.js Backend', 'Xây dựng API với Node.js', 399000, 1, 'OPEN', 1, NOW(), NOW()),
(3, 'Python Data Science', 'Phân tích dữ liệu', 499000, 1, 'OPEN', 2, NOW(), NOW()),
(4, 'React Native', 'Xây dựng app mobile', 599000, 1, 'OPEN', 3, NOW(), NOW()),
(5, 'HTML & CSS Free', 'HTML CSS miễn phí', 0, 1, 'OPEN', 1, NOW(), NOW());
```

---

## 🎨 Tích Hợp Vào Pages Khác

### Thêm Vào Any Page:

```typescript
"use client";

import { useEffect } from "react";
import { useCourses } from "@/lib/hooks/useLms";

export default function MyPage() {
  const { courses, loading, error, fetchCourses } = useCourses();

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Khóa Học ({courses.length})</h1>
      <div className="grid grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded">
            <h3>{course.title}</h3>
            <p>{course.price.toLocaleString()} đ</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Hoặc Dùng Component Có Sẵn:

```typescript
import CourseList from "@/components/LMS/CourseList";

export default function MyPage() {
  return (
    <div>
      <h1>Khóa Học</h1>
      <CourseList />
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Không thấy courses?

**Kiểm tra:**

1. Backend running? `curl http://localhost:8083/api/health`
2. Token valid? `http://localhost:3000/debug-token`
3. Backend có data? `curl http://localhost:8083/api/course`
4. Console có errors? F12 → Console

**Fix:**

```bash
# Clear token cũ
localStorage.removeItem('auth_token')

# Login lại
→ http://localhost:3000/auth/login

# Refresh page
F5
```

### CORS Error?

**Fix:** Check `application.yaml`:

```yaml
cors:
  allowed-origins: http://localhost:3000
```

---

## 📝 Quick Links

| Page            | URL                                          | Mô tả               |
| --------------- | -------------------------------------------- | ------------------- |
| **Demo**        | `/courses-demo`                              | Simple demo page ⭐ |
| **Browse**      | `/authorized/lms/app/student/browse-lms`     | Full browse page    |
| **Test**        | `/test-lms`                                  | Debug & test        |
| **My Courses**  | `/authorized/lms/app/student/my-courses-lms` | Enrolled courses    |
| **Debug Token** | `/debug-token`                               | Check token         |

---

## ✅ Success Criteria

Bạn thành công khi:

- ✅ Mở `/courses-demo` thấy danh sách khóa học
- ✅ Có thể filter theo category
- ✅ Có thể search khóa học
- ✅ Có thể click enroll (nếu login Student)
- ✅ Thấy số lượng courses, categories đúng

---

## 🎉 Done!

Nếu thấy khóa học → **SUCCESS!** 🎊

Nếu không thấy → Check:

1. `/debug-token` - Token OK?
2. Backend logs - Có errors?
3. Browser console - Có errors?
4. `/test-lms` - API responses OK?

---

**Chúc bạn thành công! 🚀**

Next: Đọc [DISPLAY_COURSES_GUIDE.md](./DISPLAY_COURSES_GUIDE.md) để tìm hiểu thêm
