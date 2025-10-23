# 🎉 ĐÃ FIX XONG: HIỂN THỊ ẢNH KHÓA HỌC TỪ BACKEND LMS

## ✅ Đã hoàn thành

### 1. **Backend LMS** ✅

- Backend đã có config sẵn trong `StaticResourceConfig.java`
- Serve ảnh qua URL: `http://localhost:8083/uploads/**`
- Ví dụ: `http://localhost:8083/uploads/courses/abc.jpg`

### 2. **Frontend - Helper Function** ✅

**File**: `src/lib/config.ts`

```typescript
// Thêm uploadsUrl vào LMS_API_CONFIG
export const LMS_API_CONFIG = {
  baseUrl: "http://localhost:8083/api",
  uploadsUrl: "http://localhost:8083/uploads", // ✅ MỚI
  // ...
};

// Helper function để build URL ảnh
export function getLmsImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "/images/course-1.png"; // Default fallback
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath; // Đã là URL đầy đủ
  }

  // Backend trả về: "courses/abc.jpg"
  // Kết quả: "http://localhost:8083/uploads/courses/abc.jpg"
  return `${LMS_API_CONFIG.uploadsUrl}/${imagePath}`;
}
```

### 3. **Frontend - Next.js Config** ✅

**File**: `next.config.mjs`

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '8083',
      pathname: '/uploads/**',
    },
  ],
}
```

### 4. **Frontend - Trang Quản Lý Khóa Học** ✅

**File**: `src/app/authorized/lms/app/lecturer/courses/[id]/page.tsx`

**Đã thêm:**

- Import `Image` từ Next.js
- Import `getLmsImageUrl` helper function
- Hiển thị ảnh khóa học với kích thước 320x192px (tỉ lệ 5:3)
- Fallback image nếu load lỗi
- Hiển thị mô tả khóa học (line-clamp-3)

```tsx
<div className="relative h-48 w-80 overflow-hidden rounded-lg border bg-muted">
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

### 5. **Backend - Fix Lỗi QuizController** ✅

**File**: `f:\DoAn\LMS\src\main\java\com\app\lms\controller\QuizController.java`

**Dòng 67-69**: Fix syntax `@PreAuthorize`

```java
// ❌ TRƯỚC (SAI)
@PreAuthorize("hasRole('ADMIN') or hasRole('LECTURER')" +
              "(@authorizationService.canStudentAccessLessonQuizzes(#courseId,authentication.name))")
//            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ THIẾU " or " và SAI METHOD!

// ✅ SAU (ĐÚNG)
@PreAuthorize("hasRole('ADMIN') or hasRole('LECTURER') or " +
              "@authorizationService.canStudentAccessCourseQuizzes(#courseId, authentication.name)")
```

---

## 🚀 CÁC BƯỚC KIỂM TRA

### Bước 1: Restart Backend LMS (NẾU CHƯA)

```bash
cd f:\DoAn\LMS
mvn spring-boot:run
```

### Bước 2: Restart Frontend (NẾU CHƯA)

```bash
cd f:\DoAn\FE_LMS
npm run dev
```

### Bước 3: Kiểm tra hiển thị ảnh

1. Đăng nhập với tài khoản **Lecturer**
2. Vào **"Khóa học của tôi"**
3. Click **"Quản lý"** trên một khóa học
4. ✅ Kiểm tra xem **ảnh khóa học có hiển thị** ở góc trên bên trái không

---

## 📊 CÁCH BACKEND TRẢ VỀ ẢNH

### Backend Response

```json
{
  "code": 1000,
  "result": {
    "id": 1,
    "title": "Lập trình Python",
    "img": "courses/abc-def-ghi.jpg", // ← Đường dẫn tương đối
    "description": "...",
    "price": 100000
    // ...
  }
}
```

### Frontend Build URL

```typescript
// Backend trả về: "courses/abc-def-ghi.jpg"
getLmsImageUrl("courses/abc-def-ghi.jpg");

// Kết quả: "http://localhost:8083/uploads/courses/abc-def-ghi.jpg"
```

### Next.js Image Component

```tsx
<Image
  src="http://localhost:8083/uploads/courses/abc-def-ghi.jpg"
  // Next.js sẽ optimize và load ảnh
/>
```

---

## 🔍 DEBUG

### Nếu ảnh không hiển thị, kiểm tra:

1. **Console Browser** (F12)

   - Có lỗi CORS không?
   - Có lỗi 404 (Not Found) không?
   - URL ảnh đúng chưa?

2. **Backend Console**

   - Backend có chạy ở port 8083 không?
   - Thư mục `uploads/` có tồn tại không?

3. **Thử truy cập trực tiếp**
   ```
   http://localhost:8083/uploads/courses/your-image.jpg
   ```
   - Nếu 404: File không tồn tại hoặc đường dẫn sai
   - Nếu OK: Vấn đề ở frontend

---

## 📝 GHI CHÚ

- Ảnh fallback: `/images/course-1.png` (trong thư mục `public/`)
- Kích thước ảnh khóa học: **320x192px** (tỉ lệ 5:3)
- Cache: Backend cache ảnh 1 giờ (3600 seconds)
- Mô tả khóa học: Hiển thị tối đa 3 dòng (`line-clamp-3`)

---

## ✨ TÍNH NĂNG MỚI

### Trang Quản Lý Khóa Học bây giờ hiển thị:

- ✅ **Ảnh khóa học** (320x192px)
- ✅ **Tiêu đề khóa học**
- ✅ **Trạng thái** (Đã xuất bản / Sắp mở / Đã đóng)
- ✅ **Ngày cập nhật**
- ✅ **Mô tả khóa học** (3 dòng)
- ✅ **Nút Xem trước & Chỉnh sửa**

---

## 🎯 KẾ HOẠCH TIẾP THEO

Bạn có thể thêm tính năng hiển thị ảnh cho:

- [ ] Trang danh sách khóa học (lecturer)
- [ ] Trang browse courses (student)
- [ ] Trang my courses (student)
- [ ] Preview page (lecturer)

Chỉ cần import và sử dụng `getLmsImageUrl(course.img)` là xong!

---

---

## ⚠️ UPDATE: FIX LỖI BỊ LẶP "/uploads"

**Vấn đề phát hiện**: Backend trả về `"uploads/courses/abc.jpg"` (đã có "uploads/"), nhưng helper function cũ lại ghép thêm → bị lặp!

**Đã fix**:

- File `src/lib/config.ts` - Helper function `getLmsImageUrl`
- Giờ tự động kiểm tra nếu path đã có "uploads/" thì ghép đúng

**YÊU CẦU**: ⚠️ **PHẢI RESTART FRONTEND** (`Ctrl+C` → `npm run dev`)

📄 Chi tiết: Xem file `🚨_FIX_ẢNH_BỊ_LẶP_UPLOADS.md`

---

**Ngày hoàn thành**: 16/10/2025  
**Trạng thái**: ✅ ĐÃ FIX - CHỜ RESTART
