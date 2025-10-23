# 🎉 BACKEND API ĐÃ ĐƯỢC CẬP NHẬT - FRONTEND ĐÃ ĐIỀU CHỈNH

## 📅 Ngày cập nhật: 20/10/2024

## 🔥 TÓM TẮT THAY ĐỔI

Backend đã thay đổi cách xử lý **Course** và **Lesson**, bao gồm:

### 1. **Course APIs đã thay đổi**

#### ✅ Create Course (Không đổi)

```http
POST /api/course/createCourse
Content-Type: multipart/form-data

Form Data:
- course: JSON (CourseCreateRequest)
- file: File (image)
```

#### ⚠️ Update Course - ĐÃ THAY ĐỔI

**Trước đây (SAI):**

```http
PUT /api/course/updateCourse/{courseId}/with-file  ❌
Content-Type: application/json
```

**Hiện tại (ĐÚNG):**

```http
PUT /api/course/updateCourse/{courseId}  ✅
Content-Type: multipart/form-data

Form Data:
- course: JSON (CourseUpdateRequest)
- file: File (optional - chỉ khi cần thay ảnh)
```

#### 🆕 Endpoints mới

```http
# LECTURER - Xem khóa học của mình (bao gồm PENDING)
GET /api/course/lecturer/my-courses

# ADMIN - Xem tất cả khóa học (bao gồm PENDING, REJECTED)
GET /api/course/admin/all

# ADMIN - Xem khóa học chờ phê duyệt
GET /api/course/admin/pending

# ADMIN - Phê duyệt/Từ chối khóa học
POST /api/course/{courseId}/approve
Content-Type: application/json
{
  "approvalStatus": "APPROVED" | "REJECTED",
  "rejectionReason": "optional"
}
```

---

### 2. **Lesson APIs đã thay đổi**

#### ✅ Create Lesson (Không đổi)

```http
POST /api/lesson/createLesson
Content-Type: multipart/form-data

Form Data:
- lesson: JSON (LessonCreateRequest)
- video: File (optional)
```

#### ⚠️ Update Lesson - ĐÃ THAY ĐỔI

**Trước đây (SAI):**

```http
PUT /api/lesson/updateLesson/{lessonId}/with-video  ❌
Content-Type: application/json
```

**Hiện tại (ĐÚNG):**

```http
PUT /api/lesson/updateLesson/{lessonId}  ✅
Content-Type: multipart/form-data

Form Data:
- lesson: JSON (LessonUpdateRequest)
- video: File (optional - chỉ khi cần thay video)
```

---

## 📦 CẬP NHẬT TRONG FRONTEND

### 1. **File đã sửa: `src/lib/lms-api-client.ts`**

#### ✅ Thêm Enums mới

```typescript
export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
```

#### ✅ Thêm Request Types mới

```typescript
export interface ApprovalRequest {
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
}
```

#### ✅ Cập nhật CourseResponse

```typescript
export interface CourseResponse {
  // ... existing fields

  // Approval information (THÊM MỚI)
  approvalStatus?: ApprovalStatus;
  approvedBy?: number;
  approvedAt?: string;
  rejectionReason?: string;

  // ... other fields
  enrollments?: EnrollmentResponse[]; // THÊM MỚI
}
```

#### ✅ Sửa updateCourse method

```typescript
async updateCourse(courseId: number, courseData: CourseUpdateRequest, imageFile?: File) {
  const formData = new FormData();
  formData.append('course', new Blob([JSON.stringify(courseData)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('file', imageFile);
  }

  // PUT /course/updateCourse/{courseId}
  const response = await fetch(`${this.baseURL}/course/updateCourse/${courseId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  return response;
}
```

#### ✅ Sửa updateLesson method

```typescript
async updateLesson(lessonId: number, lessonData: LessonUpdateRequest, videoFile?: File) {
  const formData = new FormData();
  formData.append('lesson', new Blob([JSON.stringify(lessonData)], { type: 'application/json' }));
  if (videoFile) {
    formData.append('video', videoFile);
  }

  // PUT /lesson/updateLesson/{lessonId}
  const response = await fetch(`${this.baseURL}/lesson/updateLesson/${lessonId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  return response;
}
```

#### ✅ Thêm APIs mới

```typescript
// LECTURER - Get my courses
async getLecturerCourses() {
  return this.get<CourseResponse[]>('/course/lecturer/my-courses');
}

// ADMIN - Get all courses
async getAllCoursesForAdmin() {
  return this.get<CourseResponse[]>('/course/admin/all');
}

// ADMIN - Get pending courses
async getPendingCourses() {
  return this.get<CourseResponse[]>('/course/admin/pending');
}

// ADMIN - Approve/Reject course
async approveCourse(courseId: number, approvalData: ApprovalRequest) {
  return this.post<CourseResponse>(`/course/${courseId}/approve`, approvalData);
}
```

---

### 2. **File đã sửa: `src/lib/hooks/useLecturerCourses.ts`**

#### ✅ Sử dụng endpoint mới

```typescript
const fetchCourses = async () => {
  // TRƯỚC ĐÂY:
  // const coursesResponse = await lmsApiClient.getAllCourses();
  // const lecturerCourses = coursesResponse.result.filter(...)

  // HIỆN TẠI:
  const coursesResponse = await lmsApiClient.getLecturerCourses();
  const lecturerCourses = coursesResponse.result || [];

  // Backend tự động lọc theo teacherId từ JWT token
  // Bao gồm cả courses có approvalStatus = PENDING
};
```

#### ✅ Cập nhật updateCourse

```typescript
const updateCourse = async (
  courseId: number,
  courseData: any,
  imageFile?: File
) => {
  // Gọi trực tiếp updateCourse với imageFile optional
  const response = await lmsApiClient.updateCourse(
    courseId,
    courseData,
    imageFile
  );
  await fetchCourses(); // Refresh
  return response;
};
```

---

## 🎯 LUỒNG PHÊ DUYỆT KHÓA HỌC MỚI

### 1. **Lecturer tạo khóa học**

```typescript
// Tạo khóa học mới
const response = await lmsApiClient.createCourse(courseData, imageFile);

// Backend response:
{
  code: 1000,
  message: "Khóa học đã được tạo và đang chờ phê duyệt từ Admin",
  result: {
    id: 1,
    title: "React Course",
    approvalStatus: "PENDING",  // ⏳ Chờ phê duyệt
    // ...
  }
}
```

### 2. **Admin xem danh sách chờ phê duyệt**

```typescript
const pendingCourses = await lmsApiClient.getPendingCourses();

// Response: Danh sách courses có approvalStatus = PENDING
```

### 3. **Admin phê duyệt hoặc từ chối**

```typescript
// Phê duyệt
await lmsApiClient.approveCourse(courseId, {
  approvalStatus: ApprovalStatus.APPROVED,
});

// Từ chối
await lmsApiClient.approveCourse(courseId, {
  approvalStatus: ApprovalStatus.REJECTED,
  rejectionReason: "Nội dung không phù hợp",
});
```

### 4. **Lecturer sửa khóa học đã APPROVED**

```typescript
const response = await lmsApiClient.updateCourse(courseId, updatedData, newImage);

// Backend response:
{
  code: 1000,
  message: "Khóa học đã được cập nhật và đang chờ phê duyệt lại",
  result: {
    id: 1,
    approvalStatus: "PENDING",  // ⏳ Quay về PENDING
    // ...
  }
}
```

---

## 🔍 KIỂM TRA APPROVAL STATUS

### Hiển thị trạng thái trong UI

```tsx
{
  course.approvalStatus === "PENDING" && (
    <Badge variant="warning">⏳ Chờ phê duyệt</Badge>
  );
}

{
  course.approvalStatus === "APPROVED" && (
    <Badge variant="success">✅ Đã phê duyệt</Badge>
  );
}

{
  course.approvalStatus === "REJECTED" && (
    <Badge variant="destructive">❌ Bị từ chối</Badge>
  );
}

{
  course.rejectionReason && (
    <Alert variant="destructive">
      <p>Lý do từ chối: {course.rejectionReason}</p>
    </Alert>
  );
}
```

---

## 📋 TESTING CHECKLIST

### ✅ Course Management

- [x] Tạo course mới → approvalStatus = PENDING
- [x] Lecturer xem courses của mình (bao gồm PENDING)
- [x] Admin xem tất cả courses
- [x] Admin phê duyệt course
- [x] Sửa course (có/không có ảnh mới)
- [x] Sửa course đã APPROVED → quay về PENDING

### ✅ Lesson Management

- [x] Tạo lesson mới (có/không có video)
- [x] Sửa lesson (có/không có video mới)
- [x] Xem lesson details
- [x] Xóa lesson (ADMIN only)

---

## 🚀 CÁCH SỬ DỤNG

### Tạo khóa học

```tsx
import { lmsApiClient, CourseCreateRequest } from '@/lib/lms-api-client';

const handleCreateCourse = async () => {
  const courseData: CourseCreateRequest = {
    title: "React Advanced",
    description: "Learn React in depth",
    price: 199,
    categoryId: 1,
    status: CourseStatus.UPCOMING,
  };

  const imageFile = /* File object */;

  const response = await lmsApiClient.createCourse(courseData, imageFile);
  console.log('Created course:', response.result);
};
```

### Sửa khóa học

```tsx
const handleUpdateCourse = async (courseId: number) => {
  const courseData: CourseUpdateRequest = {
    title: "React Advanced - Updated",
    price: 249,
  };

  // Không có ảnh mới
  const response = await lmsApiClient.updateCourse(courseId, courseData);

  // Hoặc có ảnh mới
  const newImage = /* File object */;
  const response = await lmsApiClient.updateCourse(courseId, courseData, newImage);
};
```

### Sửa bài học

```tsx
const handleUpdateLesson = async (lessonId: number) => {
  const lessonData: LessonUpdateRequest = {
    title: "Introduction - Updated",
    duration: 45,
  };

  // Không có video mới
  const response = await lmsApiClient.updateLesson(lessonId, lessonData);

  // Hoặc có video mới
  const newVideo = /* File object */;
  const response = await lmsApiClient.updateLesson(lessonId, lessonData, newVideo);
};
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. **Multipart Form Data**

- Backend yêu cầu `Content-Type: multipart/form-data` cho cả CREATE và UPDATE
- Phần JSON phải được wrap trong Blob với `type: 'application/json'`
- File là optional cho UPDATE

### 2. **Approval Flow**

- Course mới → PENDING
- Admin approve → APPROVED
- Lecturer edit course đã APPROVED → quay về PENDING
- Admin edit course → giữ nguyên APPROVED

### 3. **Endpoint URLs**

- Không có `/with-file` hoặc `/with-video` suffix
- PUT `/course/updateCourse/{id}` ✅
- PUT `/lesson/updateLesson/{id}` ✅

---

## 🐛 DEBUGGING

### Nếu gặp lỗi 404 Not Found

```
❌ PUT /course/updateCourse/1/with-file  → 404
✅ PUT /course/updateCourse/1            → 200
```

### Nếu gặp lỗi 415 Unsupported Media Type

```typescript
// ❌ SAI - Gửi JSON
headers: { 'Content-Type': 'application/json' }

// ✅ ĐÚNG - Gửi FormData (không set Content-Type, browser tự set)
const formData = new FormData();
// ... không set Content-Type header
```

### Kiểm tra request trong Network tab

```
Request URL: http://localhost:8083/api/course/updateCourse/1
Request Method: PUT
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

Form Data:
  course: {"title":"Test","price":100,...}
  file: (binary)
```

---

## ✅ KẾT LUẬN

Frontend đã được cập nhật hoàn toàn để phù hợp với backend mới:

- ✅ Sử dụng multipart/form-data cho update
- ✅ Endpoint URLs đúng
- ✅ Hỗ trợ approval workflow
- ✅ Các API mới cho lecturer và admin
- ✅ Optional file/video khi update

**Bây giờ bạn có thể:**

1. Tạo, sửa, xóa khóa học với ảnh
2. Tạo, sửa, xóa bài học với video
3. Xem trạng thái phê duyệt
4. Lecturer xem courses của mình
5. Admin quản lý phê duyệt

**Chúc mừng! 🎉**
