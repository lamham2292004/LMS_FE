# ⚡ HƯỚNG DẪN NHANH - LMS FRONTEND

## 🎯 MỤC ĐÍCH

File này giúp bạn nhanh chóng sử dụng các API đã được cập nhật trong frontend.

---

## 🚀 THAY ĐỔI QUAN TRỌNG

### ✅ Đã sửa

1. **Update Course API** - Đổi từ `/updateCourse/{id}/with-file` → `/updateCourse/{id}`
2. **Update Lesson API** - Đổi từ `/updateLesson/{id}/with-video` → `/updateLesson/{id}`
3. **Thêm Approval System** - Courses có trạng thái phê duyệt
4. **Thêm Lecturer APIs** - Endpoint riêng cho lecturer xem courses của mình

### 📦 Files đã cập nhật

- ✅ `src/lib/lms-api-client.ts` - API client chính
- ✅ `src/lib/hooks/useLecturerCourses.ts` - Hook quản lý courses

---

## 💻 CODE EXAMPLES

### 1. 🎓 Tạo Khóa Học

```typescript
import {
  lmsApiClient,
  CourseCreateRequest,
  CourseStatus,
} from "@/lib/lms-api-client";

const handleCreateCourse = async () => {
  // Prepare data
  const courseData: CourseCreateRequest = {
    title: "React Advanced",
    description: "Learn React in depth",
    price: 199,
    categoryId: 1,
    status: CourseStatus.UPCOMING,
    startTime: "2024-11-01T09:00:00+07:00",
    endTime: "2024-12-31T23:59:00+07:00",
  };

  // Prepare image file (from input)
  const imageFile = document.querySelector('input[type="file"]').files[0];

  try {
    const response = await lmsApiClient.createCourse(courseData, imageFile);

    console.log("✅ Course created:", response.result);
    // response.result.approvalStatus === "PENDING"

    alert(response.message); // "Khóa học đã được tạo và đang chờ phê duyệt từ Admin"
  } catch (error) {
    console.error("❌ Error:", error);
  }
};
```

---

### 2. ✏️ Sửa Khóa Học

```typescript
const handleUpdateCourse = async (courseId: number) => {
  const courseData = {
    title: "React Advanced - Updated",
    description: "Updated description",
    price: 249,
    status: CourseStatus.OPEN,
  };

  // Case 1: Không thay đổi ảnh
  try {
    const response = await lmsApiClient.updateCourse(courseId, courseData);
    console.log("✅ Updated:", response.result);
  } catch (error) {
    console.error("❌ Error:", error);
  }

  // Case 2: Có ảnh mới
  const newImage = document.querySelector('input[type="file"]').files[0];
  try {
    const response = await lmsApiClient.updateCourse(
      courseId,
      courseData,
      newImage
    );
    console.log("✅ Updated with new image:", response.result);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};
```

---

### 3. 📖 Tạo Bài Học

```typescript
const handleCreateLesson = async (courseId: number) => {
  const lessonData = {
    courseId: courseId,
    title: "Introduction to React",
    description: "Learn React basics",
    orderIndex: 1,
    duration: 45,
    status: "OPEN" as LessonStatus,
  };

  // Case 1: Không có video
  try {
    const response = await lmsApiClient.createLesson(lessonData);
    console.log("✅ Lesson created:", response.result);
  } catch (error) {
    console.error("❌ Error:", error);
  }

  // Case 2: Có video
  const videoFile = document.querySelector('input[type="file"]').files[0];
  try {
    const response = await lmsApiClient.createLesson(lessonData, videoFile);
    console.log("✅ Lesson created with video:", response.result);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};
```

---

### 4. ✏️ Sửa Bài Học

```typescript
const handleUpdateLesson = async (lessonId: number) => {
  const lessonData = {
    title: "Introduction to React - Updated",
    description: "Updated description",
    duration: 50,
  };

  // Case 1: Không thay video
  try {
    const response = await lmsApiClient.updateLesson(lessonId, lessonData);
    console.log("✅ Updated:", response.result);
  } catch (error) {
    console.error("❌ Error:", error);
  }

  // Case 2: Có video mới
  const newVideo = document.querySelector('input[type="file"]').files[0];
  try {
    const response = await lmsApiClient.updateLesson(
      lessonId,
      lessonData,
      newVideo
    );
    console.log("✅ Updated with new video:", response.result);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};
```

---

### 5. 📚 Lecturer - Xem Courses Của Mình

```typescript
const MyCoursesComponent = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Endpoint mới - tự động lọc theo teacherId từ JWT
        const response = await lmsApiClient.getLecturerCourses();
        setCourses(response.result || []);

        // response.result bao gồm:
        // - Courses có approvalStatus = PENDING
        // - Courses có approvalStatus = APPROVED
        // - Courses có approvalStatus = REJECTED
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadCourses();
  }, []);

  return (
    <div>
      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <span>{course.approvalStatus}</span>
          {course.rejectionReason && <p>Lý do: {course.rejectionReason}</p>}
        </div>
      ))}
    </div>
  );
};
```

---

### 6. 👨‍💼 Admin - Phê Duyệt Courses

```typescript
import { ApprovalStatus } from "@/lib/lms-api-client";

// Xem danh sách chờ phê duyệt
const loadPendingCourses = async () => {
  try {
    const response = await lmsApiClient.getPendingCourses();
    console.log("Pending courses:", response.result);
    return response.result;
  } catch (error) {
    console.error("Error:", error);
  }
};

// Phê duyệt
const approveCourse = async (courseId: number) => {
  try {
    const response = await lmsApiClient.approveCourse(courseId, {
      approvalStatus: ApprovalStatus.APPROVED,
    });

    console.log("✅ Approved:", response.result);
    alert("Khóa học đã được phê duyệt thành công");
  } catch (error) {
    console.error("Error:", error);
  }
};

// Từ chối
const rejectCourse = async (courseId: number, reason: string) => {
  try {
    const response = await lmsApiClient.approveCourse(courseId, {
      approvalStatus: ApprovalStatus.REJECTED,
      rejectionReason: reason,
    });

    console.log("✅ Rejected:", response.result);
    alert("Khóa học đã bị từ chối");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

### 7. 🎨 Hiển Thị Trạng Thái Phê Duyệt

```tsx
import { ApprovalStatus } from "@/lib/lms-api-client";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

const CourseStatusBadge = ({ course }) => {
  return (
    <div className="space-y-2">
      {/* Approval Status Badge */}
      {course.approvalStatus === ApprovalStatus.PENDING && (
        <Badge variant="warning" className="bg-yellow-500">
          ⏳ Chờ phê duyệt
        </Badge>
      )}

      {course.approvalStatus === ApprovalStatus.APPROVED && (
        <Badge variant="success" className="bg-green-500">
          ✅ Đã phê duyệt
        </Badge>
      )}

      {course.approvalStatus === ApprovalStatus.REJECTED && (
        <Badge variant="destructive" className="bg-red-500">
          ❌ Bị từ chối
        </Badge>
      )}

      {/* Rejection Reason */}
      {course.approvalStatus === ApprovalStatus.REJECTED &&
        course.rejectionReason && (
          <Alert variant="destructive">
            <p className="font-semibold">Lý do từ chối:</p>
            <p>{course.rejectionReason}</p>
          </Alert>
        )}

      {/* Course Status */}
      <Badge variant="outline">
        {course.status === "OPEN"
          ? "📖 Đang mở"
          : course.status === "UPCOMING"
          ? "🔜 Sắp mở"
          : "🔒 Đã đóng"}
      </Badge>
    </div>
  );
};
```

---

### 8. 🔧 Sử dụng Hook `useLecturerCourses`

```tsx
import { useLecturerCourses } from "@/lib/hooks/useLecturerCourses";

const LecturerCoursesPage = () => {
  const {
    courses, // Danh sách courses
    stats, // Thống kê
    loading, // Loading state
    error, // Error state
    refetch, // Refresh data
    createCourse, // Tạo course
    updateCourse, // Sửa course
    deleteCourse, // Xóa course
  } = useLecturerCourses();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div>Total: {stats?.totalCourses}</div>
        <div>Published: {stats?.publishedCourses}</div>
        <div>Students: {stats?.totalStudents}</div>
        <div>Revenue: ${stats?.totalRevenue}</div>
      </div>

      {/* Courses List */}
      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>Students: {course.studentCount}</p>
          <p>Revenue: ${course.revenue}</p>
          <CourseStatusBadge course={course} />
        </div>
      ))}
    </div>
  );
};
```

---

## 🎯 COMMON USE CASES

### Case 1: Form tạo/sửa course với ảnh

```tsx
const CourseForm = ({
  courseId,
  mode,
}: {
  courseId?: number;
  mode: "create" | "edit";
}) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = { title, price, categoryId: 1 };

    try {
      if (mode === "create") {
        if (!imageFile) {
          alert("Vui lòng chọn ảnh");
          return;
        }
        await lmsApiClient.createCourse(courseData, imageFile);
        alert("Tạo khóa học thành công! Đang chờ phê duyệt.");
      } else {
        // Edit mode - imageFile is optional
        await lmsApiClient.updateCourse(
          courseId!,
          courseData,
          imageFile || undefined
        );
        alert("Cập nhật thành công!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />
      <button type="submit">
        {mode === "create" ? "Tạo Khóa Học" : "Cập Nhật"}
      </button>
    </form>
  );
};
```

---

## ⚠️ NOTES QUAN TRỌNG

### 1. Multipart Form Data

- Backend yêu cầu `multipart/form-data` cho create và update
- File là **REQUIRED** khi create
- File là **OPTIONAL** khi update
- `lmsApiClient` tự động xử lý việc này

### 2. Approval Workflow

```
Lecturer tạo course → PENDING
    ↓
Admin approve → APPROVED
    ↓
Lecturer edit → PENDING (lại)
    ↓
Admin approve → APPROVED
```

### 3. Authorization

- **STUDENT**: Chỉ xem courses đã enrolled
- **LECTURER**: Xem courses của mình, tạo/sửa courses
- **ADMIN**: Xem tất cả, phê duyệt courses

---

## 🐛 DEBUGGING

### Kiểm tra token

```typescript
import { tokenManager } from "@/lib/token-manager";

const token = tokenManager.getToken();
console.log("Token:", token);

const decoded = tokenManager.getDecodedToken();
console.log("User info:", decoded);
```

### Kiểm tra API response

```typescript
try {
  const response = await lmsApiClient.createCourse(data, file);
  console.log("Response:", response);
  console.log("Code:", response.code);
  console.log("Result:", response.result);
  console.log("Message:", response.message);
} catch (error) {
  console.error("Error:", error);
  console.error("Status:", error.status);
  console.error("Code:", error.code);
  console.error("Message:", error.message);
}
```

---

## 📚 TÀI LIỆU THAM KHẢO

- 📄 **Chi tiết API**: `📚_API_ENDPOINTS_REFERENCE.md`
- 🎉 **Thay đổi Backend**: `🎉_BACKEND_API_UPDATED.md`
- 🔧 **API Client**: `src/lib/lms-api-client.ts`
- 🪝 **Hooks**: `src/lib/hooks/`

---

**Last Updated:** 20/10/2024
**Version:** 1.0.0
