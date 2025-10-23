# 📸 GUIDE: Update Course Với Image

## 🎯 TÓM TẮT

Backend và Frontend đã được update để support **upload ảnh khi update course**.

### **Những gì đã fix:**

1. ✅ **Image path** - Không còn "/" ở đầu
2. ✅ **Update Course API** - Hỗ trợ upload file mới
3. ✅ **Frontend hooks** - Thêm `useUpdateCourseWithFile()`

---

## 🔧 BACKEND CHANGES

### **1. New Endpoint: Update Course With File**

**URL:** `PUT /api/course/updateCourse/{courseId}/with-file`

**Content-Type:** `multipart/form-data`

**Request Parts:**

- `course` (JSON): CourseUpdateRequest
- `file` (File, optional): Image file

**Example cURL:**

```bash
curl -X PUT "http://localhost:8083/api/course/updateCourse/1/with-file" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "course={\"title\":\"Updated Title\",\"price\":600000};type=application/json" \
  -F "file=@/path/to/image.jpg"
```

**Response:**

```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "id": 1,
    "title": "Updated Title",
    "price": 600000,
    "img": "uploads/courses/course_1234567890.jpg",
    ...
  }
}
```

### **2. Existing Endpoint (Still Works)**

**URL:** `PUT /api/course/updateCourse/{courseId}`

**Content-Type:** `application/json`

**For:** Update course WITHOUT changing image

---

## 🎨 FRONTEND USAGE

### **Method 1: Hook - Update With File** ⭐ RECOMMENDED

```tsx
"use client";

import { useState } from "react";
import { useUpdateCourseWithFile } from "@/lib/hooks/useLms";

export default function EditCourseForm({ courseId }: { courseId: number }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState<File | undefined>();

  const { updateCourseWithFile, loading, error } = useUpdateCourseWithFile(
    courseId,
    {
      onSuccess: (result) => {
        alert("✅ Cập nhật khóa học thành công!");
        console.log("Updated course:", result);
      },
      onError: (err) => {
        alert("❌ Lỗi: " + err.message);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      title,
      price,
      // ... other fields
    };

    // Call with or without image
    await updateCourseWithFile(courseData, imageFile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Tên khóa học:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label>Giá:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Ảnh mới (optional):</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0])}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Đang cập nhật..." : "Cập nhật khóa học"}
      </button>

      {error && <p className="text-red-600">{error.message}</p>}
    </form>
  );
}
```

### **Method 2: Direct API Call**

```tsx
import { lmsApiClient } from '@/lib/lms-api-client';

async function updateCourse() {
  const courseData = {
    title: 'Updated Course',
    price: 700000,
    categoryId: 2,
  };

  const imageFile = // ... get File from input

  try {
    const response = await lmsApiClient.updateCourseWithFile(
      1, // courseId
      courseData,
      imageFile // optional
    );

    console.log('Updated:', response.result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### **Method 3: Update WITHOUT Image**

```tsx
import { useUpdateCourse } from "@/lib/hooks/useLms";

const { updateCourse, loading } = useUpdateCourse(courseId, {
  onSuccess: () => alert("Updated!"),
});

// Update without changing image
await updateCourse({
  title: "New Title",
  description: "New Description",
});
```

---

## 📋 REQUEST FIELDS

### **CourseUpdateRequest:**

```typescript
interface CourseUpdateRequest {
  title?: string; // Tên khóa học
  description?: string; // Mô tả
  price?: number; // Giá (VND)
  categoryId?: number; // ID category mới
  status?: CourseStatus; // 'PUBLISHED' | 'UPCOMING' | 'CLOSED'
  startTime?: string; // ISO 8601: "2025-01-01T00:00:00Z"
  endTime?: string; // ISO 8601
}
```

**Lưu ý:**

- Tất cả fields đều **optional**
- Chỉ update field được gửi lên
- `categoryId`: Nếu có, backend sẽ validate và update category
- Image: Nếu `file` được gửi, backend sẽ save file mới

---

## 🖼️ IMAGE HANDLING

### **Backend:**

**Save path:**

```
uploads/courses/course_1234567890.jpg
```

**Database value:**

```
img = "uploads/courses/course_1234567890.jpg"
```

**Serve URL:**

```
http://localhost:8083/uploads/courses/course_1234567890.jpg
```

### **Frontend:**

**Display image:**

```tsx
const imageUrl = course.img
  ? `http://localhost:8083/${course.img}`
  : "/images/course-1.png"; // fallback

<img src={imageUrl} alt={course.title} />;
```

**Image validation:**

```tsx
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file ảnh!");
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("Ảnh không được lớn hơn 5MB!");
    return;
  }

  setImageFile(file);
};
```

---

## 🔍 IMAGE PATH FIX

### **Vấn đề cũ:**

**Backend lưu:**

```
img = "/uploads/courses/course1.jpg"
```

**Frontend build URL:**

```
http://localhost:8083//uploads/courses/course1.jpg  // ❌ Double slash
```

### **Fix mới:** ✅

**Backend lưu:**

```
img = "uploads/courses/course1.jpg"  // No leading slash
```

**Frontend build URL:**

```
http://localhost:8083/uploads/courses/course1.jpg  // ✅ Single slash
```

---

## 🧪 TESTING

### **1. Update Course WITH Image**

**Test UI:**

```tsx
<form onSubmit={handleUpdate}>
  <input type="file" onChange={handleImageChange} />
  <button type="submit">Update</button>
</form>
```

**Expected:**

1. Select image file ✅
2. Click "Update" ✅
3. Loading spinner ✅
4. Success alert ✅
5. Image updated trong database ✅
6. New image hiển thị ✅

### **2. Update Course WITHOUT Image**

**Test:**

```tsx
await updateCourse({
  title: "New Title",
  price: 800000,
});
```

**Expected:**

- Title và price updated ✅
- Image **KHÔNG** thay đổi ✅

### **3. Check Image Display**

**Test:**

```tsx
// After update, reload course
const course = await lmsApiClient.getCourse(courseId);

console.log("Image path:", course.img);
// Expected: "uploads/courses/course_xxx.jpg"

const fullUrl = `http://localhost:8083/${course.img}`;
console.log("Full URL:", fullUrl);
// Expected: "http://localhost:8083/uploads/courses/course_xxx.jpg"
```

---

## 📁 COMPLETE EXAMPLE COMPONENT

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  useCourse,
  useUpdateCourseWithFile,
  useCategories,
} from "@/lib/hooks/useLms";
import { CourseStatus } from "@/lib/lms-api-client";

interface EditCourseFormProps {
  courseId: number;
  onSuccess?: () => void;
}

export default function EditCourseForm({
  courseId,
  onSuccess,
}: EditCourseFormProps) {
  // Fetch course data
  const { data: course, loading: loadingCourse } = useCourse(courseId);
  const { categories } = useCategories();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [status, setStatus] = useState<CourseStatus>("PUBLISHED");
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string>("");

  // Update hook
  const { updateCourseWithFile, loading, error } = useUpdateCourseWithFile(
    courseId,
    {
      onSuccess: (result) => {
        alert("✅ Cập nhật khóa học thành công!");
        onSuccess?.();
      },
      onError: (err) => {
        alert("❌ Lỗi: " + err.message);
      },
    }
  );

  // Load course data
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setPrice(course.price);
      setCategoryId(course.categoryId);
      setStatus(course.status);

      if (course.img) {
        setImagePreview(`http://localhost:8083/${course.img}`);
      }
    }
  }, [course]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh không được lớn hơn 5MB!");
      return;
    }

    setImageFile(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const courseData = {
      title,
      description,
      price,
      categoryId,
      status,
    };

    await updateCourseWithFile(courseData, imageFile);
  };

  if (loadingCourse) {
    return <div>Đang tải...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Tên khóa học:</label>
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-2">Mô tả:</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-2">Giá (VND):</label>
        <input
          className="w-full border p-2 rounded"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min={0}
        />
      </div>

      <div>
        <label className="block mb-2">Danh mục:</label>
        <select
          className="w-full border p-2 rounded"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          <option value={0}>-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2">Trạng thái:</label>
        <select
          className="w-full border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as CourseStatus)}
        >
          <option value="PUBLISHED">Published</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Ảnh khóa học:</label>
        <input
          className="w-full border p-2 rounded"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <p className="text-sm text-gray-500 mt-1">
          Để trống nếu không muốn thay đổi ảnh
        </p>
      </div>

      {imagePreview && (
        <div>
          <p className="mb-2">Preview:</p>
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-w-md h-48 object-cover rounded"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Đang cập nhật..." : "Cập nhật khóa học"}
      </button>

      {error && <p className="text-red-600 mt-2">{error.message}</p>}
    </form>
  );
}
```

---

## ✅ CHECKLIST

Sau khi update, kiểm tra:

- [ ] Backend restart thành công
- [ ] Frontend build không lỗi
- [ ] Endpoint `/updateCourse/{id}/with-file` hoạt động
- [ ] Update WITH file: Image mới saved
- [ ] Update WITHOUT file: Image cũ giữ nguyên
- [ ] Image display đúng URL
- [ ] No leading slash trong image path
- [ ] File validation hoạt động
- [ ] Preview image hoạt động

---

## 🎓 API SUMMARY

| Endpoint                              | Method | Content-Type        | Purpose                    |
| ------------------------------------- | ------ | ------------------- | -------------------------- |
| `/course/createCourse`                | POST   | multipart/form-data | Tạo course với ảnh         |
| `/course/updateCourse/{id}`           | PUT    | application/json    | Update course (no image)   |
| `/course/updateCourse/{id}/with-file` | PUT    | multipart/form-data | Update course + ảnh ✨ NEW |

---

**Updated:** $(date)  
**Status:** ✅ COMPLETED
