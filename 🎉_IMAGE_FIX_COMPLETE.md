# 🎉 FIX XONG: Image + Update Course!

## ✅ HOÀN TẤT

1. ✅ **Fix image path** - Không còn double slash
2. ✅ **Update course với ảnh** - API mới `/with-file`
3. ✅ **Frontend hooks** - `useUpdateCourseWithFile()`

---

## 🚀 TEST NGAY - 3 BƯỚC

### **1. Restart Backend**

```bash
cd f:\DoAn\LMS

# Ctrl+C (stop backend)
mvn spring-boot:run
```

### **2. Test Image Display**

```
http://localhost:3000/authorized/lms/app/student/browse
```

**Kết quả:**

- ✅ Images hiển thị từ backend
- ✅ URL: `http://localhost:8083/uploads/courses/...`
- ✅ No double slash

### **3. Test Update With Image**

**Example Component:**

```tsx
import { useUpdateCourseWithFile } from "@/lib/hooks/useLms";

const { updateCourseWithFile, loading } = useUpdateCourseWithFile(courseId, {
  onSuccess: () => alert("Updated!"),
});

// Update với ảnh mới
await updateCourseWithFile(
  { title: "New Title", price: 700000 },
  imageFile // File from input
);

// Update KHÔNG thay ảnh (imageFile = undefined)
await updateCourseWithFile({ title: "New Title" }, undefined);
```

---

## 🔧 THAY ĐỔI CHI TIẾT

### **Backend:**

#### **1. Fix Image Path (CourseService.java)**

```java
// Trước:
course.setImg("/" + filePath.replace("\\", "/")); ❌

// Sau:
course.setImg(filePath.replace("\\", "/")); ✅
```

**Kết quả:**

- Database: `img = "uploads/courses/course1.jpg"`
- URL: `http://localhost:8083/uploads/courses/course1.jpg` ✅

#### **2. New API: Update With File**

**Endpoint:** `PUT /api/course/updateCourse/{courseId}/with-file`

**Accept:** `multipart/form-data`

**Parts:**

- `course` (JSON): CourseUpdateRequest
- `file` (File, optional): Image file

### **Frontend:**

#### **1. Update Config**

```typescript
courses: {
  updateWithFile: (id) => `/course/updateCourse/${id}/with-file`, // NEW
}
```

#### **2. New API Method**

```typescript
async updateCourseWithFile(courseId, courseData, imageFile?) {
  const formData = new FormData();
  formData.append('course', new Blob([JSON.stringify(courseData)],
    { type: 'application/json' }));
  if (imageFile) {
    formData.append('file', imageFile);
  }
  return this.uploadFile(`/course/updateCourse/${courseId}/with-file`, formData);
}
```

#### **3. New Hook**

```typescript
export function useUpdateCourseWithFile(courseId, options) {
  // ... returns { updateCourseWithFile, loading, error }
}
```

---

## 📖 SỬ DỤNG

### **Quick Example:**

```tsx
"use client";

import { useState } from "react";
import { useUpdateCourseWithFile } from "@/lib/hooks/useLms";

export default function EditForm({ courseId }) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File>();

  const { updateCourseWithFile, loading } = useUpdateCourseWithFile(courseId, {
    onSuccess: () => alert("✅ Updated!"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCourseWithFile({ title }, imageFile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <input type="file" onChange={(e) => setImageFile(e.target.files?.[0])} />

      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
}
```

---

## 🔍 SO SÁNH

### **Update WITHOUT Image:**

```tsx
import { useUpdateCourse } from "@/lib/hooks/useLms";

const { updateCourse } = useUpdateCourse(courseId);

// Chỉ update thông tin, không touch image
await updateCourse({
  title: "New Title",
  price: 600000,
});
```

### **Update WITH Image:**

```tsx
import { useUpdateCourseWithFile } from "@/lib/hooks/useLms";

const { updateCourseWithFile } = useUpdateCourseWithFile(courseId);

// Update + change image
await updateCourseWithFile({ title: "New Title", price: 600000 }, imageFile);
```

---

## 📁 FILES CHANGED

### **Backend (2 files):**

```
✏️ CourseController.java
   - Line 75-86: Thêm endpoint /with-file

✏️ CourseService.java
   - Line 49: Fix image path (remove leading slash)
   - Line 65-90: Update method accept MultipartFile
   - Line 73-77: Update category if provided
   - Line 80-88: Update image if file provided
```

### **Frontend (3 files):**

```
✏️ config.ts
   - Line 65: Thêm updateWithFile endpoint

✏️ lms-api-client.ts
   - Line 190: Fix createCourse (use Blob)
   - Line 199-206: Thêm updateCourseWithFile method
   - Line 380: Thêm categoryId vào CourseUpdateRequest

✏️ useLms.ts
   - Line 183-204: Thêm useUpdateCourseWithFile hook
```

---

## 🧪 TEST SCENARIOS

### **Scenario 1: Update Title Only**

```tsx
await updateCourse({ title: "New Title" });
```

**Expected:**

- Title updated ✅
- Image KHÔNG thay đổi ✅

### **Scenario 2: Update + New Image**

```tsx
await updateCourseWithFile({ title: "New Title" }, newImageFile);
```

**Expected:**

- Title updated ✅
- Old image deleted (optional) ✅
- New image saved ✅
- Database updated ✅

### **Scenario 3: Update Category**

```tsx
await updateCourse({
  categoryId: 2,
});
```

**Expected:**

- Category updated ✅
- Other fields unchanged ✅

### **Scenario 4: Image Display**

```tsx
// After any update
const course = await getCourse(courseId);
const imageUrl = `http://localhost:8083/${course.img}`;

<img src={imageUrl} />; // ✅ Hiển thị đúng
```

---

## 📸 IMAGE PATH FLOW

### **Upload:**

```
User selects file (course.jpg)
    ↓
FormData: file = File object
    ↓
Backend: FileUploadService.saveCourseFile()
    ↓
Save to: f:\DoAn\LMS\uploads\courses\course_1234567890.jpg
    ↓
Database: img = "uploads/courses/course_1234567890.jpg"
    ↓
Response: { img: "uploads/courses/course_1234567890.jpg" }
```

### **Display:**

```
Frontend gets: course.img = "uploads/courses/course_1234567890.jpg"
    ↓
Build URL: `http://localhost:8083/${course.img}`
    ↓
Final URL: "http://localhost:8083/uploads/courses/course_1234567890.jpg"
    ↓
<img src="http://localhost:8083/uploads/courses/course_1234567890.jpg" />
    ↓
Backend serves từ: f:\DoAn\LMS\uploads\courses\course_1234567890.jpg
    ↓
Image hiển thị ✅
```

---

## ⚠️ LƯU Ý

### **1. Image Validation:**

```tsx
const handleImageChange = (e) => {
  const file = e.target.files?.[0];

  // Check type
  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file ảnh!");
    return;
  }

  // Check size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("Ảnh quá lớn! Max 5MB");
    return;
  }

  setImageFile(file);
};
```

### **2. Optional File:**

- `file` parameter là **optional** trong `/with-file` endpoint
- Nếu không gửi `file` → Chỉ update thông tin, không touch image
- Nếu gửi `file` → Update cả image

### **3. Backend Validation:**

- Backend check `file != null && !file.isEmpty()`
- Nếu true → Save file mới
- Nếu false → Giữ image cũ

---

## 📚 TÀI LIỆU CHI TIẾT

👉 **[UPDATE_COURSE_WITH_IMAGE_GUIDE.md](./UPDATE_COURSE_WITH_IMAGE_GUIDE.md)**

Bao gồm:

- Complete example component
- Image preview
- Form validation
- Error handling
- Testing guide

---

## ✅ CHECKLIST

Test để confirm fix thành công:

- [ ] Backend restart OK
- [ ] Frontend build OK
- [ ] No linter errors
- [ ] Image hiển thị từ backend (no double slash)
- [ ] Update course WITHOUT image works
- [ ] Update course WITH image works
- [ ] Image path: `uploads/courses/...` (no leading slash)
- [ ] URL correct: `http://localhost:8083/uploads/...`

---

**🎊 TẤT CẢ ĐÃ FIX XONG!**

**Test ngay:** Restart backend và test image display!
