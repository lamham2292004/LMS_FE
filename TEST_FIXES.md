# 🧪 TEST CÁC FIXES - 5 PHÚT

## ⚡ 3 VẤN ĐỀ ĐÃ FIX

1. ✅ Hình ảnh khóa học
2. ✅ Nút đăng ký (đã enroll)
3. ✅ Error message

---

## 🚀 SETUP - 2 BƯỚC

### **1. Restart Backend**

```bash
cd f:\DoAn\LMS

# Stop backend hiện tại (Ctrl+C)
# Rồi start lại:
mvn spring-boot:run
```

### **2. Restart Frontend**

```bash
cd f:\DoAn\FE_LMS

# Stop frontend (Ctrl+C)
# Rồi start lại:
npm run dev
```

---

## 🧪 TEST 1: Hình Ảnh Khóa Học

### **Option A: Thêm ảnh mẫu**

**Bước 1: Tạo folder (nếu chưa có):**

```bash
cd f:\DoAn\LMS
mkdir uploads\courses
```

**Bước 2: Copy một ảnh bất kỳ vào:**

```bash
# Đặt file ảnh (jpg/png) vào:
f:\DoAn\LMS\uploads\courses\course1.jpg
```

**Bước 3: Update database:**

```sql
-- Vào MySQL:
USE LMS;

UPDATE courses
SET img = 'uploads/courses/course1.jpg'
WHERE id = 1;
```

**Bước 4: Test:**

```
http://localhost:3000/authorized/lms/app/student/browse
```

**Kết quả mong đợi:**

- ✅ Thấy ảnh course1.jpg hiển thị
- ✅ Nếu ảnh không load được → Hiện placeholder `/images/course-1.png`

### **Option B: Test với URL trực tiếp**

**Update database với URL:**

```sql
UPDATE courses
SET img = 'https://via.placeholder.com/400x200?text=Course+1'
WHERE id = 1;
```

**Test:**

```
http://localhost:3000/authorized/lms/app/student/browse
```

**Kết quả:** Thấy ảnh placeholder với text "Course 1" ✅

---

## 🧪 TEST 2: Nút "Đăng ký"

### **Setup:**

1. Login với tài khoản STUDENT
2. Chọn 1 khóa học để test

### **Kịch bản A: Chưa đăng ký**

**Test:**

```
http://localhost:3000/authorized/lms/app/student/browse
```

**Kết quả:**

- ✅ Button hiển thị: "📚 Đăng ký khóa học"
- ✅ Button **KHÔNG** disabled
- ✅ Có thể click

### **Kịch bản B: Click đăng ký**

**Steps:**

1. Click "📚 Đăng ký khóa học"
2. Confirm dialog → Click OK

**Kết quả:**

- ✅ Loading spinner hiện ra
- ✅ Alert: "✅ Đã đăng ký khóa học ... thành công!"
- ✅ Button đổi thành: "✓ Đã đăng ký" (disabled)

### **Kịch bản C: Refresh page**

**Steps:**

1. Sau khi enroll, refresh page (F5)
2. Scroll đến course vừa enroll

**Kết quả:**

- ✅ Button hiện: "✓ Đã đăng ký" (disabled)
- ✅ **KHÔNG** hiện "📚 Đăng ký khóa học" nữa

### **Kịch bản D: Vào My Courses**

**Test:**

```
http://localhost:3000/authorized/lms/app/student/courses
```

**Kết quả:**

- ✅ Thấy course vừa enroll trong tab "Đang học"

### **Kịch bản E: Quay lại Browse**

**Steps:**

1. Từ My Courses, quay lại Browse
2. Tìm course đã enroll

**Kết quả:**

- ✅ Button vẫn hiện: "✓ Đã đăng ký" (disabled)
- ✅ Không thể click enroll lại

---

## 🧪 TEST 3: Error Message

### **Setup:**

Enroll một course trước

### **Test: Enroll lại bằng API**

**Cách 1: Dùng Browser Console**

```javascript
// Open Console (F12)
// Paste code này:

fetch("http://localhost:8083/api/enrollment/enroll", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("auth_token"),
  },
  body: JSON.stringify({ courseId: 1 }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

**Kết quả mong đợi:**

```json
{
  "code": 2108,
  "message": "Đã đăng ký khóa học này rồi"
}
```

**❌ KHÔNG PHẢI:**

```json
{
  "code": 1002,
  "message": "Tiêu đề đã tồn tại"
}
```

### **Cách 2: Click nút Enroll trên course đã enroll**

**Steps:**

1. Nếu button không disabled (do bug)
2. Click "Đăng ký"

**Kết quả:**

- ✅ Alert: "⚠️ Bạn đã đăng ký khóa học này rồi!"
- ✅ Button chuyển thành "✓ Đã đăng ký"

---

## 🔍 DEBUG

### **Nếu hình ảnh không hiển thị:**

**Check 1: File tồn tại?**

```bash
# Check file:
dir f:\DoAn\LMS\uploads\courses\

# Nếu không có → Tạo và copy ảnh vào
```

**Check 2: Backend serve được ảnh?**

```bash
# Test trực tiếp:
curl http://localhost:8083/uploads/courses/course1.jpg

# Hoặc mở browser:
http://localhost:8083/uploads/courses/course1.jpg
```

**Kết quả:** Nếu thấy ảnh → Backend OK ✅

**Check 3: Frontend gọi đúng URL?**

```javascript
// Browser Console (F12) → Network tab
// Reload page /browse
// Tìm request đến image
// Check URL có đúng http://localhost:8083/uploads/...?
```

### **Nếu button vẫn hiện "Đăng ký" khi đã enroll:**

**Check 1: API check enrollment hoạt động?**

```bash
# Thay {courseId} bằng ID course đã enroll
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8083/api/enrollment/check/1
```

**Kết quả mong đợi:**

```json
{
  "code": 1000,
  "result": true
}
```

**Check 2: Frontend gọi API?**

```javascript
// Browser Console → Network tab
// Reload page /browse
// Tìm request: GET /api/enrollment/check/{courseId}
// Check response
```

### **Nếu error message vẫn sai:**

**Check backend code:**

```bash
# Check file:
f:\DoAn\LMS\src\main\java\com\app\lms\service\EnrollmentService.java

# Line 48 phải là:
throw new AppException(ErroCode.ALREADY_ENROLLED);

# Nếu vẫn là TITLE_EXISTED → Chưa rebuild backend
```

**Fix:** Restart backend:

```bash
cd f:\DoAn\LMS
# Ctrl+C (stop)
mvn spring-boot:run
```

---

## ✅ CHECKLIST THÀNH CÔNG

- [ ] Backend restart thành công
- [ ] Frontend restart thành công
- [ ] Hình ảnh hiển thị từ backend
- [ ] Button "Đăng ký" → Enroll thành công
- [ ] Button chuyển thành "✓ Đã đăng ký"
- [ ] Refresh page → Button vẫn "✓ Đã đăng ký"
- [ ] Course xuất hiện trong My Courses
- [ ] Error message: "Đã đăng ký khóa học này rồi"

---

## 📸 SCREENSHOTS

### **Trước khi enroll:**

```
┌──────────────────────────┐
│  [Image]                 │
│  React Basics            │
│  500,000đ                │
│  [📚 Đăng ký khóa học]   │ ← Enabled
└──────────────────────────┘
```

### **Sau khi enroll:**

```
┌──────────────────────────┐
│  [Image]                 │
│  React Basics            │
│  500,000đ                │
│  [✓ Đã đăng ký]          │ ← Disabled
└──────────────────────────┘
```

### **Trong My Courses:**

```
Tab: [Đang học] [Đã hoàn thành]

┌──────────────────────────┐
│  React Basics            │
│  Progress: [====  ] 65%  │
│  Đăng ký: 11/10/2025     │
│  [Tiếp tục học]          │
└──────────────────────────┘
```

---

## 🎉 HOÀN TẤT!

Nếu tất cả test đều pass → **Fixes hoàn toàn thành công!** 🎊

**Chi tiết kỹ thuật:** Đọc [`FIXES_COMPLETED.md`](./FIXES_COMPLETED.md)
