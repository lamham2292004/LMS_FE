# 🚀 START HERE - LMS Integration

## 🎉 Chúc mừng! Integration đã hoàn tất

Hệ thống đã được tích hợp thành công với **LMS Backend (Spring Boot)**.

---

## ⚡ Quick Start (5 phút)

### Bước 1: Khởi động Backend

```bash
cd f:\DoAn\LMS
mvn spring-boot:run
```

✅ Backend sẽ chạy tại: `http://localhost:8083`

### Bước 2: Tạo `.env.local`

Tạo file `.env.local` trong thư mục `f:\DoAn\FE_LMS`:

```env
NEXT_PUBLIC_LMS_API_URL=http://localhost:8083/api
```

### Bước 3: Khởi động Frontend

```bash
cd f:\DoAn\FE_LMS
npm run dev
```

✅ Frontend sẽ chạy tại: `http://localhost:3000`

### Bước 4: Test Integration

Mở trình duyệt và truy cập:

```
http://localhost:3000/test-lms
```

Bạn sẽ thấy:

- ✅ Health check status
- ✅ Danh sách categories
- ✅ Danh sách courses

---

## 📚 Tài Liệu

Chọn tài liệu phù hợp với nhu cầu của bạn:

### 🏃 Bắt Đầu Nhanh

👉 **[LMS_QUICKSTART.md](./LMS_QUICKSTART.md)**

- Setup trong 5 phút
- Ví dụ code cơ bản
- Common patterns

### 📖 Hướng Dẫn Chi Tiết

👉 **[LMS_INTEGRATION_GUIDE.md](./LMS_INTEGRATION_GUIDE.md)**

- Kiến trúc hệ thống
- API usage chi tiết
- Authentication flow
- Error handling
- Troubleshooting

### 📋 Tổng Quan

👉 **[README_LMS_INTEGRATION.md](./README_LMS_INTEGRATION.md)**

- File structure
- Hooks reference
- Component library
- Testing guide

### ✅ Checklist

👉 **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)**

- Pre-requisites
- Step-by-step setup
- Verification steps
- Testing checklist

### 🎯 Summary

👉 **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)**

- What was created
- Statistics
- Key features
- Next steps

---

## 🔥 Quick Examples

### Example 1: Browse Courses

```typescript
import { useCourses } from "@/lib/hooks/useLms";

const { courses, loading, fetchCourses } = useCourses();

useEffect(() => {
  fetchCourses();
}, []);

return (
  <div>
    {courses.map((course) => (
      <div key={course.id}>{course.title}</div>
    ))}
  </div>
);
```

### Example 2: Enroll Student

```typescript
import { useEnrollCourse } from "@/lib/hooks/useLms";

const { enrollCourse, loading } = useEnrollCourse({
  onSuccess: () => alert("Enrolled successfully!"),
});

<button onClick={() => enrollCourse(courseId)}>Enroll</button>;
```

### Example 3: Use Components

```typescript
import CourseList from '@/components/LMS/CourseList';
import EnrollButton from '@/components/LMS/EnrollButton';
import MyEnrollments from '@/components/LMS/MyEnrollments';

// Just use them!
<CourseList />
<EnrollButton courseId={1} courseName="React" />
<MyEnrollments />
```

---

## 🎯 Demo Pages

Try these pages right away:

1. **Test Page**

   ```
   http://localhost:3000/test-lms
   ```

   - Connection test
   - API responses
   - Debug info

2. **Browse Courses**

   ```
   http://localhost:3000/authorized/lms/app/student/browse-lms
   ```

   - Public courses
   - Filter by category
   - Search functionality

3. **My Courses** (Login required)
   ```
   http://localhost:3000/authorized/lms/app/student/my-courses-lms
   ```
   - Enrolled courses
   - Progress tracking
   - Course stats

---

## 🛠️ What Was Created

### Core Files

- ✅ `src/lib/lms-api-client.ts` - API client với 30+ endpoints
- ✅ `src/lib/hooks/useLms.ts` - 15+ React hooks
- ✅ `src/lib/config.ts` - Configuration (updated)

### Components

- ✅ `src/components/LMS/CourseList.tsx`
- ✅ `src/components/LMS/EnrollButton.tsx`
- ✅ `src/components/LMS/MyEnrollments.tsx`

### Pages

- ✅ `src/app/test-lms/page.tsx`
- ✅ `src/app/authorized/lms/app/student/browse-lms/page.tsx`
- ✅ `src/app/authorized/lms/app/student/my-courses-lms/page.tsx`

### Documentation

- ✅ 5 markdown files
- ✅ 1,000+ lines of documentation
- ✅ Examples for every feature

---

## 🚨 Troubleshooting

### Backend không chạy?

```bash
curl http://localhost:8083/api/health
```

Nếu lỗi → Start backend: `mvn spring-boot:run`

### CORS Error?

Check `application.yaml`:

```yaml
cors:
  allowed-origins: http://localhost:3000
```

### 401 Unauthorized?

- Đảm bảo đã login
- Check token: `localStorage.getItem('auth_token')`

---

## 📞 Need Help?

1. ❓ **Question about usage?**
   → Read [LMS_INTEGRATION_GUIDE.md](./LMS_INTEGRATION_GUIDE.md)

2. 🐛 **Bug or Error?**
   → Check [Troubleshooting section](./LMS_INTEGRATION_GUIDE.md#troubleshooting)

3. 🔧 **Setup Issues?**
   → Follow [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

4. 💡 **Want Examples?**
   → See [LMS_QUICKSTART.md](./LMS_QUICKSTART.md)

---

## ✨ Features Available

- ✅ Browse courses (Public)
- ✅ Enroll in courses (Student)
- ✅ View my enrollments (Student)
- ✅ Submit quizzes (Student)
- ✅ Create courses (Lecturer)
- ✅ Manage lessons (Lecturer)
- ✅ Create quizzes (Lecturer)
- ✅ Manage categories (Admin)

---

## 🎊 You're Ready!

Bạn đã có:

- ✅ Complete API integration
- ✅ Type-safe TypeScript code
- ✅ Reusable React hooks
- ✅ Pre-built components
- ✅ Working examples
- ✅ Comprehensive documentation

**Start building your LMS features now! 🚀**

---

**Happy Coding!** 💻

Need more help? Read the docs above or check the test page at `/test-lms`
