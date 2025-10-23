# 🚨 FIX LỖI: ẢNH BỊ LẶP "/uploads"

## ❌ VẤN ĐỀ

### Lỗi hiện tại:

```
Error: Invalid src prop (http://localhost:8083/uploads/uploads/courses/1760602079712_html.png)
                                              ^^^^^^^^^^^^^^^^ LẶP 2 LẦN!
```

### Nguyên nhân:

1. **Backend** (`FileUploadService.java` dòng 39):

   ```java
   return uploadDir + fileName;
   // uploadDir = "uploads/courses/"
   // Kết quả: "uploads/courses/1760602079712_html.png"
   ```

   ➡️ Backend trả về path **ĐÃ BAO GỒM** `"uploads/"`

2. **Frontend** (helper function cũ):
   ```typescript
   return `${LMS_API_CONFIG.uploadsUrl}/${imagePath}`;
   // uploadsUrl = "http://localhost:8083/uploads"
   // imagePath = "uploads/courses/1760602079712_html.png"
   // Kết quả: "http://localhost:8083/uploads/uploads/..." ❌
   ```
   ➡️ Frontend ghép thêm `"/uploads"` nữa → **BỊ LẶP!**

---

## ✅ GIẢI PHÁP

### Đã fix file: `src/lib/config.ts`

```typescript
export function getLmsImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "/images/course-1.png"; // Default fallback
  }

  // Nếu đã là URL đầy đủ
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_LMS_API_URL?.replace("/api", "") ||
    "http://localhost:8083";

  // ✅ KIỂM TRA: Nếu path đã có "uploads/" thì ghép trực tiếp
  if (imagePath.startsWith("uploads/")) {
    return `${baseUrl}/${imagePath}`;
    // "http://localhost:8083" + "/" + "uploads/courses/abc.jpg"
    // → "http://localhost:8083/uploads/courses/abc.jpg" ✅
  }

  // Nếu không, ghép với uploadsUrl (path cũ như "courses/abc.jpg")
  return `${LMS_API_CONFIG.uploadsUrl}/${imagePath}`;
}
```

---

## 🚀 CÁC BƯỚC THỰC HIỆN

### Bước 1: ✅ Đã sửa code

- File `src/lib/config.ts` đã được update

### Bước 2: ⚠️ RESTART FRONTEND (BẮT BUỘC!)

**Tại sao phải restart?**

- File `next.config.mjs` đã thay đổi (thêm config cho `images.remotePatterns`)
- Next.js chỉ đọc config này khi khởi động

**Cách restart:**

1. **Dừng dev server hiện tại:**

   - Nhấn `Ctrl + C` trong terminal đang chạy `npm run dev`

2. **Chạy lại:**

   ```bash
   cd f:\DoAn\FE_LMS
   npm run dev
   ```

3. **Đợi đến khi thấy:**
   ```
   ✓ Ready in Xms
   ○ Local: http://localhost:3000
   ```

### Bước 3: Kiểm tra Backend đang chạy

```bash
# Kiểm tra backend có chạy ở port 8083 không?
# Mở browser và truy cập:
http://localhost:8083/uploads/courses/1760602079712_html.png
```

Nếu 404 → File không tồn tại hoặc backend chưa chạy

### Bước 4: Test lại

1. Đăng nhập với **Lecturer**
2. Vào **"Quản lý khóa học"**
3. Click **"Quản lý"** trên khóa học
4. ✅ Ảnh sẽ hiển thị đúng!

---

## 🔍 DEBUG

### Nếu vẫn lỗi, kiểm tra:

#### 1. Console Browser (F12)

```
// URL phải là:
http://localhost:8083/uploads/courses/1760602079712_html.png

// KHÔNG PHẢI:
http://localhost:8083/uploads/uploads/courses/... ❌
```

#### 2. Backend Response

Mở **Network tab** → Click vào API call → Xem Response:

```json
{
  "code": 1000,
  "result": {
    "id": 1,
    "img": "uploads/courses/1760602079712_html.png"
    // ^^^^^ Nếu đã có "uploads/" → OK!
    // Nếu là "courses/..." → Backend lưu sai
  }
}
```

#### 3. File có tồn tại không?

Kiểm tra thư mục backend:

```
f:\DoAn\LMS\
  uploads\
    courses\
      1760602079712_html.png  ← File phải có ở đây!
```

---

## 📊 SO SÁNH TRƯỚC VÀ SAU

### ❌ TRƯỚC (SAI)

```
Backend trả về: "uploads/courses/abc.jpg"
↓
getLmsImageUrl("uploads/courses/abc.jpg")
↓
`http://localhost:8083/uploads` + `/` + `uploads/courses/abc.jpg`
↓
http://localhost:8083/uploads/uploads/courses/abc.jpg ❌ LẶP!
```

### ✅ SAU (ĐÚNG)

```
Backend trả về: "uploads/courses/abc.jpg"
↓
getLmsImageUrl("uploads/courses/abc.jpg")
↓
if (imagePath.startsWith('uploads/')) {
  return `http://localhost:8083` + `/` + `uploads/courses/abc.jpg`
}
↓
http://localhost:8083/uploads/courses/abc.jpg ✅ ĐÚNG!
```

---

## 🎯 CHECKLIST

- [x] ✅ Sửa helper function `getLmsImageUrl`
- [ ] ⚠️ **RESTART FRONTEND** (`Ctrl+C` → `npm run dev`)
- [ ] ✅ Kiểm tra backend đang chạy (port 8083)
- [ ] ✅ Test lại trang "Quản lý khóa học"

---

## 💡 LƯU Ý

### Khi tạo khóa học mới:

Backend sẽ lưu path theo format: `"uploads/courses/timestamp_filename.ext"`

### Khi hiển thị:

Frontend tự động build thành: `"http://localhost:8083/uploads/courses/timestamp_filename.ext"`

### Nếu backend thay đổi cách lưu path:

- Nếu backend chỉ lưu `"courses/abc.jpg"` (không có "uploads/")
- Frontend vẫn hoạt động vì có fallback:
  ```typescript
  return `${LMS_API_CONFIG.uploadsUrl}/${imagePath}`;
  // → "http://localhost:8083/uploads/courses/abc.jpg"
  ```

---

**Ngày fix**: 16/10/2025  
**Trạng thái**: ✅ ĐÃ SỬA CODE - CHỜ RESTART FRONTEND
