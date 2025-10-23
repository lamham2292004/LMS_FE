# 🎓 Hướng Dẫn Tích Hợp LMS Backend với Frontend

## 📋 Mục Lục

- [Tổng Quan](#tổng-quan)
- [Cài Đặt](#cài-đặt)
- [Cấu Hình](#cấu-hình)
- [Sử Dụng API Client](#sử-dụng-api-client)
- [Sử Dụng React Hooks](#sử-dụng-react-hooks)
- [Ví Dụ Thực Tế](#ví-dụ-thực-tế)
- [Authentication Flow](#authentication-flow)
- [Error Handling](#error-handling)

---

## 📖 Tổng Quan

Hệ thống LMS Backend (Spring Boot) đã được tích hợp với Frontend Next.js thông qua:

- **Backend**: Spring Boot (port 8083) - `http://localhost:8083/api`
- **Frontend**: Next.js (port 3000) - `http://localhost:3000`
- **Authentication**: JWT Token (sử dụng chung với Identity Service)

### Kiến Trúc Tích Hợp

```
┌─────────────────────────┐
│   Next.js Frontend      │
│   (Port 3000)           │
└───────────┬─────────────┘
            │
            ├──────────────────────┐
            │                      │
            ▼                      ▼
┌─────────────────────┐  ┌─────────────────────┐
│  Identity Service   │  │   LMS Backend       │
│  (Port 8000)        │  │   (Port 8083)       │
│  - Auth/Login       │  │   - Courses         │
│  - User Profile     │  │   - Lessons         │
└─────────────────────┘  │   - Quizzes         │
                         │   - Enrollments     │
                         └─────────────────────┘
```

---

## ⚙️ Cài Đặt

### 1. Cấu Hình Backend (Spring Boot)

Đảm bảo backend đang chạy:

```bash
cd f:\DoAn\LMS
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8083`

### 2. Cấu Hình Frontend (Next.js)

Tạo file `.env.local` trong thư mục `f:\DoAn\FE_LMS`:

```env
# Identity Service (Laravel - Auth)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# LMS Service (Spring Boot - Courses, Lessons, Quizzes)
NEXT_PUBLIC_LMS_API_URL=http://localhost:8083/api
```

### 3. Cài Đặt Dependencies (nếu cần)

```bash
cd f:\DoAn\FE_LMS
npm install
```

---

## 🔧 Cấu Hình

### File Cấu Hình Chính

Các file đã được tạo sẵn:

1. **`src/lib/lms-api-client.ts`** - LMS API Client với đầy đủ methods
2. **`src/lib/hooks/useLms.ts`** - React Hooks để sử dụng LMS API
3. **`src/lib/config.ts`** - Configuration với LMS_API_CONFIG

### CORS Configuration

Backend đã được cấu hình CORS cho phép requests từ frontend:

```yaml
# application.yaml
cors:
  allowed-origins: http://localhost:3000,http://127.0.0.1:3000
```

---

## 🚀 Sử Dụng API Client

### Import API Client

```typescript
import { lmsApiClient } from "@/lib/lms-api-client";
```

### Các Methods Có Sẵn

#### 1. **Category APIs**

```typescript
// Lấy tất cả categories (Public - không cần token)
const categoriesResponse = await lmsApiClient.getAllCategories();
const categories = categoriesResponse.result;

// Lấy 1 category theo ID
const categoryResponse = await lmsApiClient.getCategory(1);

// Tạo category (ADMIN/LECTURER only)
const newCategory = await lmsApiClient.createCategory({
  name: "Lập Trình Web",
  description: "Các khóa học về lập trình web",
});

// Cập nhật category
await lmsApiClient.updateCategory(1, {
  name: "Web Development",
});

// Xóa category (ADMIN only)
await lmsApiClient.deleteCategory(1);
```

#### 2. **Course APIs**

```typescript
// Lấy tất cả courses (Public)
const coursesResponse = await lmsApiClient.getAllCourses();
const courses = coursesResponse.result;

// Lấy chi tiết course
// Note: Student chỉ xem được course đã enroll
const courseResponse = await lmsApiClient.getCourse(1);

// Tạo course với upload ảnh (LECTURER/ADMIN)
const courseData = {
  title: "Spring Boot Cơ Bản",
  description: "Khóa học Spring Boot từ đầu",
  price: 299000,
  categoryId: 1,
  status: "OPEN",
};
const imageFile = document.querySelector('input[type="file"]').files[0];
const newCourse = await lmsApiClient.createCourse(courseData, imageFile);

// Cập nhật course
await lmsApiClient.updateCourse(1, {
  title: "Spring Boot Nâng Cao",
  price: 499000,
});
```

#### 3. **Lesson APIs**

```typescript
// Lấy lesson (cần enroll course trước)
const lessonResponse = await lmsApiClient.getLesson(1);

// Tạo lesson với video (LECTURER)
const lessonData = {
  courseId: 1,
  title: "Bài 1: Giới Thiệu",
  description: "Giới thiệu về Spring Boot",
  orderIndex: 1,
  duration: 30,
};
const videoFile = document.querySelector('input[type="file"]').files[0];
const newLesson = await lmsApiClient.createLesson(lessonData, videoFile);

// Cập nhật lesson
await lmsApiClient.updateLesson(1, {
  title: "Bài 1: Giới Thiệu Spring Boot",
});
```

#### 4. **Quiz APIs**

```typescript
// Tạo quiz (LECTURER)
const quizData = {
  lessonId: 1,
  title: "Bài Kiểm Tra Chương 1",
  description: "Kiểm tra kiến thức cơ bản",
  timeLimit: 30,
  maxAttempts: 3,
  passScore: 70.0,
};
const newQuiz = await lmsApiClient.createQuiz(quizData);

// Tạo question
const questionData = {
  quizId: 1,
  questionText: "Spring Boot là gì?",
  questionType: "MULTIPLE_CHOICE",
  points: 10.0,
  orderIndex: 1,
};
await lmsApiClient.createQuestion(questionData);

// Tạo answer options
await lmsApiClient.createAnswerOption({
  questionId: 1,
  answerText: "Framework Java",
  isCorrect: true,
  orderIndex: 1,
});
```

#### 5. **Enrollment APIs (STUDENT)**

```typescript
// Enroll vào course
const enrollmentResponse = await lmsApiClient.enrollCourse(1);

// Xem các course đã enroll
const myEnrollmentsResponse = await lmsApiClient.getMyEnrollments();
const enrollments = myEnrollmentsResponse.result;
```

#### 6. **Quiz Result APIs (STUDENT)**

```typescript
// Submit quiz
const submitData = {
  quizId: 1,
  answers: {
    1: "1", // questionId: answerOptionId
    2: "4",
    3: "7",
  },
  timeTaken: 25, // minutes
};
const resultResponse = await lmsApiClient.submitQuiz(submitData);

// Xem kết quả các lần làm
const myResultsResponse = await lmsApiClient.getMyQuizResults(1);

// Xem kết quả tốt nhất
const bestResultResponse = await lmsApiClient.getMyBestResult(1);

// Kiểm tra có thể làm quiz không
const canTakeResponse = await lmsApiClient.canTakeQuiz(1);
const canTake = canTakeResponse.result; // true/false
```

---

## ⚛️ Sử Dụng React Hooks

### Import Hooks

```typescript
import {
  useCourses,
  useCourse,
  useEnrollCourse,
  useMyEnrollments,
  useSubmitQuiz,
} from "@/lib/hooks/useLms";
```

### Ví Dụ Sử Dụng Hooks

#### 1. **Hiển Thị Danh Sách Courses**

```typescript
function CoursesPage() {
  const { courses, loading, error, fetchCourses } = useCourses({
    onSuccess: (data) => {
      console.log("Loaded courses:", data);
    },
    onError: (err) => {
      console.error("Failed to load courses:", err);
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
          <p>{course.description}</p>
          <p>Price: ${course.price}</p>
        </div>
      ))}
    </div>
  );
}
```

#### 2. **Chi Tiết Course**

```typescript
function CourseDetailPage({ courseId }: { courseId: number }) {
  const { data: course, loading, error, execute } = useCourse(courseId);

  useEffect(() => {
    execute();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!course) return null;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Category: {course.categoryName}</p>
      <p>Price: ${course.price}</p>

      <h2>Lessons:</h2>
      {course.lessons?.map((lesson) => (
        <div key={lesson.id}>
          <p>
            {lesson.orderIndex}. {lesson.title}
          </p>
        </div>
      ))}
    </div>
  );
}
```

#### 3. **Enroll Course (Student)**

```typescript
function EnrollButton({ courseId }: { courseId: number }) {
  const { enrollCourse, loading, error } = useEnrollCourse({
    onSuccess: () => {
      alert("Đã đăng ký khóa học thành công!");
    },
    onError: (err) => {
      alert("Lỗi: " + err.message);
    },
  });

  const handleEnroll = async () => {
    await enrollCourse(courseId);
  };

  return (
    <button onClick={handleEnroll} disabled={loading}>
      {loading ? "Đang đăng ký..." : "Đăng ký khóa học"}
    </button>
  );
}
```

#### 4. **My Enrollments (Student)**

```typescript
function MyCoursesPage() {
  const { enrollments, loading, error, fetchEnrollments } = useMyEnrollments();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Các Khóa Học Của Tôi</h1>
      {enrollments.map((enrollment) => (
        <div key={enrollment.id}>
          <h3>{enrollment.courseName}</h3>
          <p>Status: {enrollment.status}</p>
          <p>
            Enrolled at: {new Date(enrollment.enrolledAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

#### 5. **Submit Quiz (Student)**

```typescript
function QuizPage({ quizId }: { quizId: number }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState(Date.now());

  const { submitQuiz, loading, error } = useSubmitQuiz({
    onSuccess: (result) => {
      alert(`Điểm của bạn: ${result.score}%`);
      if (result.isPassed) {
        alert("Chúc mừng! Bạn đã đạt!");
      }
    },
  });

  const handleSubmit = async () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 60000); // minutes
    await submitQuiz({
      quizId,
      answers,
      timeTaken,
    });
  };

  return (
    <div>
      {/* Quiz questions here */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang chấm bài..." : "Nộp bài"}
      </button>
    </div>
  );
}
```

---

## 🔐 Authentication Flow

### JWT Token Flow

1. **Login qua Identity Service** (Laravel):

```typescript
// User login through existing auth system
const response = await apiClient.login({ email, password });
// Token is stored in localStorage as 'auth_token'
```

2. **LMS API tự động sử dụng token**:

```typescript
// LMS client automatically gets token from localStorage
const courses = await lmsApiClient.getAllCourses();
// Request header: Authorization: Bearer <token>
```

3. **Token chứa thông tin user**:

```typescript
// Backend Spring Boot extract thông tin từ JWT:
// - userId
// - userType (STUDENT, LECTURER, ADMIN)
// - email
// - fullName
// etc.
```

### Permission Checking

Backend tự động kiểm tra quyền dựa trên JWT token:

- **Public endpoints**: Không cần token

  - `GET /api/health`
  - `GET /api/category`
  - `GET /api/course`

- **Student endpoints**: Cần role STUDENT

  - `POST /api/enrollment/enroll`
  - `GET /api/enrollment/my-enrollments`
  - `POST /api/quiz-results/submit`

- **Lecturer endpoints**: Cần role LECTURER hoặc ADMIN

  - `POST /api/course/createCourse`
  - `POST /api/lesson/createLesson`
  - `POST /api/quiz`

- **Admin endpoints**: Chỉ ADMIN
  - `DELETE /api/category/{id}`
  - `DELETE /api/course/{id}`

---

## ❌ Error Handling

### Error Codes từ Backend

```typescript
export enum LmsErrorCode {
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
  const response = await lmsApiClient.enrollCourse(courseId);
  console.log("Enrolled successfully");
} catch (error: any) {
  if (error.code === 2108) {
    alert("Bạn đã đăng ký khóa học này rồi!");
  } else if (error.code === 2001 || error.code === 2002) {
    alert("Vui lòng đăng nhập lại");
    // Redirect to login
  } else {
    alert("Đã có lỗi xảy ra: " + error.message);
  }
}
```

### Global Error Handler

```typescript
// Trong component root hoặc layout
useEffect(() => {
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;

    // Token expired -> redirect to login
    if (error?.code === 2003) {
      localStorage.removeItem("auth_token");
      window.location.href = "/auth/login";
    }

    // Unauthorized -> show message
    if (error?.code === 2101) {
      alert("Bạn không có quyền truy cập chức năng này");
    }
  });
}, []);
```

---

## 📝 Response Format

### LMS API Response Format

Tất cả API từ Spring Boot backend đều trả về format:

```typescript
{
  code: number,        // 1000 = success, other = error code
  result?: any,        // Data khi success
  message?: string     // Error message khi failed
}
```

### Ví Dụ Response

**Success:**

```json
{
  "code": 1000,
  "result": {
    "id": 1,
    "title": "Spring Boot Course",
    "description": "Learn Spring Boot",
    "price": 299000
  }
}
```

**Error:**

```json
{
  "code": 2106,
  "message": "Chưa đăng ký khóa học"
}
```

---

## 🧪 Testing

### Test Backend Connection

```typescript
import { lmsApiClient } from "@/lib/lms-api-client";

// Test health check
const healthResponse = await lmsApiClient.healthCheck();
console.log("Backend status:", healthResponse.result);

// Test auth
const userInfo = await lmsApiClient.testAuth();
console.log("Current user:", userInfo.result);
```

### Test Component

```typescript
// Create a test page: src/app/test-lms/page.tsx
"use client";

import { useEffect } from "react";
import { useCourses, useHealthCheck } from "@/lib/hooks/useLms";

export default function TestLMSPage() {
  const { status, checkHealth } = useHealthCheck();
  const { courses, fetchCourses } = useCourses();

  useEffect(() => {
    checkHealth();
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>LMS Backend Test</h1>
      <div>
        <h2>Health Check:</h2>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
      <div>
        <h2>Courses:</h2>
        <pre>{JSON.stringify(courses, null, 2)}</pre>
      </div>
    </div>
  );
}
```

---

## 🚀 Quick Start Checklist

- [ ] Backend Spring Boot đang chạy tại port 8083
- [ ] Tạo file `.env.local` với `NEXT_PUBLIC_LMS_API_URL=http://localhost:8083/api`
- [ ] Import `lmsApiClient` hoặc hooks từ `@/lib/hooks/useLms`
- [ ] Đảm bảo user đã login (có JWT token)
- [ ] Test với public API trước (categories, courses)
- [ ] Test với authenticated API (enrollment, quiz)

---

## 📚 Tài Liệu Tham Khảo

- [Backend README.md](f:\DoAn\LMS\README.md) - Chi tiết API endpoints
- [Frontend API Client](src/lib/lms-api-client.ts) - Source code client
- [React Hooks](src/lib/hooks/useLms.ts) - Custom hooks

---

## 🆘 Troubleshooting

### 1. CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Giải pháp:** Kiểm tra backend `application.yaml`:

```yaml
cors:
  allowed-origins: http://localhost:3000
```

### 2. 401 Unauthorized

```
{ code: 2001, message: "Token không tồn tại trong request" }
```

**Giải pháp:** Đảm bảo đã login và token trong localStorage

### 3. Connection Refused

```
Failed to fetch
```

**Giải pháp:** Kiểm tra backend đang chạy:

```bash
curl http://localhost:8083/api/health
```

---

Chúc bạn tích hợp thành công! 🎉
