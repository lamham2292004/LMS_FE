# 🎉 ĐÃ FIX XONG 3 VẤN ĐỀ!

## ✅ 1. TRANG DANH SÁCH KHÓA HỌC - ĐÃ CÓ ẢNH

**File**: `src/app/authorized/lms/app/lecturer/courses/page.tsx`

### Vấn đề:

- Trang "Quản lý khóa học" (danh sách) chưa hiển thị ảnh
- Đang dùng cách build URL cũ → bị lặp `/uploads/uploads/`

### Đã fix:

```tsx
// ❌ TRƯỚC
const imageUrl = course.img
  ? `${LMS_API_CONFIG.baseUrl.replace('/api', '')}${course.img}`
  : "/images/course-1.png";

<img src={imageUrl} ... />

// ✅ SAU
import Image from "next/image"
import { getLmsImageUrl } from "@/lib/config"

<div className="relative h-48 w-full bg-muted">
  <Image
    src={getLmsImageUrl(course.img)}
    alt={course.title}
    fill
    className="object-cover"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src = "/images/course-1.png";
    }}
  />
</div>
```

**Kết quả:**

- ✅ Hiển thị ảnh cho **cả "Đã xuất bản" và "Bản nháp"**
- ✅ Dùng Next.js Image component → tối ưu hóa ảnh
- ✅ Có fallback nếu load lỗi

---

## ✅ 2. TRANG QUẢN LÝ CHI TIẾT - ĐÃ OK

**File**: `src/app/authorized/lms/app/lecturer/courses/[id]/page.tsx`

**Trạng thái**: ✅ Đã hoạt động từ trước (user confirm)

---

## ✅ 3. TẠO BÀI HỌC - ĐÃ FIX

**File**: `src/lib/lms-api-client.ts`

### Vấn đề:

Backend yêu cầu `@RequestPart("lesson")` phải là **Blob JSON**, nhưng frontend gửi **string JSON**

**Backend (LessonController.java):**

```java
@PostMapping(value = "/createLesson", consumes = {"multipart/form-data"})
public ApiResponse<LessonResponse> createLesson(
    @RequestPart("lesson") @Valid LessonCreateRequest request,
    //            ^^^^^^ Yêu cầu Blob JSON!
    @RequestPart(value = "video", required = false) MultipartFile video) {
    // ...
}
```

### Đã fix:

```typescript
// ❌ TRƯỚC (SAI)
async createLesson(lessonData: LessonCreateRequest, videoFile?: File) {
  const formData = new FormData();
  formData.append('lesson', JSON.stringify(lessonData)); // ❌ Gửi string!
  if (videoFile) {
    formData.append('video', videoFile);
  }
  return this.uploadFile<LessonResponse>('/lesson/createLesson', formData);
}

// ✅ SAU (ĐÚNG)
async createLesson(lessonData: LessonCreateRequest, videoFile?: File) {
  const formData = new FormData();
  // ✅ Wrap JSON trong Blob với type 'application/json'
  formData.append('lesson', new Blob([JSON.stringify(lessonData)], { type: 'application/json' }));
  if (videoFile) {
    formData.append('video', videoFile);
  }
  console.log('📝 Creating lesson:', lessonData);
  console.log('📹 Video file:', videoFile?.name);
  return this.uploadFile<LessonResponse>('/lesson/createLesson', formData);
}
```

**Tại sao phải dùng Blob?**

- Spring Boot `@RequestPart` với `MultipartFile` yêu cầu JSON phải có `Content-Type: application/json`
- Gửi string thuần sẽ bị backend reject vì thiếu Content-Type
- Wrap trong `Blob` với type `application/json` → Backend nhận đúng format

---

## 🚀 KIỂM TRA

### 1️⃣ Kiểm tra trang danh sách khóa học

1. Vào: **"Quản lý khóa học"**
2. ✅ Kiểm tra xem có ảnh ở mỗi card không
3. ✅ Cả tab "Đã xuất bản" và "Bản nháp" đều phải có ảnh

### 2️⃣ Kiểm tra tạo bài học

1. Vào: **"Quản lý khóa học" → "Quản lý" (một khóa học) → Tab "Bài học" → "Thêm bài học"**
2. Điền thông tin:
   - ✅ Tiêu đề: "Bài học test"
   - ✅ Mô tả: "Mô tả test"
   - ✅ Thời lượng: 30 phút
   - ✅ Thứ tự: 1
   - ✅ Video (optional): Upload file hoặc bỏ trống
3. Click **"Tạo bài học"**
4. ✅ Nếu thành công → Redirect về trang quản lý khóa học
5. ✅ Bài học mới xuất hiện trong danh sách

---

## 🔍 DEBUG (NẾU VẪN LỖI)

### Nếu ảnh vẫn không hiển thị:

1. **Kiểm tra Console (F12)**

   ```
   ✅ ĐÚNG: http://localhost:8083/uploads/courses/abc.jpg
   ❌ SAI:  http://localhost:8083/uploads/uploads/courses/abc.jpg
   ```

2. **Kiểm tra backend đang chạy:**
   - Backend phải chạy ở port 8083
   - Test URL trực tiếp trong browser

### Nếu tạo bài học vẫn lỗi:

1. **Mở Console (F12)**

   - Xem log: `📝 Creating lesson: ...`
   - Xem log: `📹 Video file: ...`

2. **Xem Network tab**
   - Request URL: `http://localhost:8083/api/lesson/createLesson`
   - Request Method: `POST`
   - Content-Type: `multipart/form-data`
3. **Kiểm tra FormData:**

   - `lesson`: Phải là Blob (application/json)
   - `video`: File (nếu có)

4. **Lỗi thường gặp:**
   - `400 Bad Request` → Dữ liệu sai format
   - `403 Forbidden` → Không có quyền (kiểm tra token)
   - `500 Internal Server Error` → Lỗi backend (xem log backend)

---

## 📝 TÓM TẮT THAY ĐỔI

| Vấn đề                                | File                             | Trạng thái |
| ------------------------------------- | -------------------------------- | ---------- |
| Trang danh sách khóa học không có ảnh | `lecturer/courses/page.tsx`      | ✅ ĐÃ FIX  |
| Trang quản lý chi tiết                | `lecturer/courses/[id]/page.tsx` | ✅ ĐÃ OK   |
| Tạo bài học không hoạt động           | `lms-api-client.ts`              | ✅ ĐÃ FIX  |

---

## ⚙️ BACKEND ENDPOINTS LIÊN QUAN

### Tạo bài học:

```
POST /api/lesson/createLesson
Content-Type: multipart/form-data

FormData:
  - lesson: Blob (application/json) - LessonCreateRequest
  - video: File (optional) - Video file
```

**LessonCreateRequest:**

```java
{
  "courseId": 1,
  "title": "Bài học 1",
  "description": "Mô tả",
  "orderIndex": 1,
  "duration": 30,
  "status": "OPEN" // OPEN | UPCOMING | CLOSED
}
```

---

## ✨ TÍNH NĂNG MỚI

### Trang "Quản lý khóa học" bây giờ hiển thị:

- ✅ **Ảnh khóa học** cho mỗi card (192px height)
- ✅ **Danh sách khóa học** theo tab (Đã xuất bản / Bản nháp)
- ✅ **Thống kê**: Tổng khóa học, học viên, đánh giá, doanh thu
- ✅ **Tìm kiếm** khóa học theo tên
- ✅ **Nút Quản lý & Chỉnh sửa** cho mỗi khóa học

### Tính năng "Tạo bài học":

- ✅ **Nhập thông tin cơ bản**: Tiêu đề, mô tả, thời lượng, thứ tự, trạng thái
- ✅ **Upload video** (optional)
- ✅ **Validation** form
- ✅ **Loading state** khi đang tạo
- ✅ **Error handling** và hiển thị lỗi
- ✅ **Redirect** về trang quản lý sau khi tạo thành công

---

**Ngày hoàn thành**: 16/10/2025  
**Trạng thái**: ✅ HOÀN THÀNH - READY TO TEST!

---

## 🎯 KẾ HOẠCH TIẾP THEO

Bây giờ bạn có thể:

- [ ] Test tạo bài học với video
- [ ] Thêm tính năng chỉnh sửa bài học
- [ ] Thêm tính năng xóa bài học
- [ ] Thêm tính năng sắp xếp lại thứ tự bài học
- [ ] Hiển thị ảnh ở các trang khác (student browse, my courses, etc.)
