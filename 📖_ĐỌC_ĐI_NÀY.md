# 📖 HƯỚNG DẪN SỬ DỤNG - CẬP NHẬT FRONTEND

## 🎯 BẠN CẦN ĐỌC FILE NÀO?

### 🚀 **Muốn bắt đầu nhanh?**

👉 Đọc: **`⚡_QUICK_START.md`**

- Code examples thực tế
- Copy & paste được ngay
- Giải thích từng bước

### 📚 **Cần tra cứu API chi tiết?**

👉 Đọc: **`📚_API_ENDPOINTS_REFERENCE.md`**

- Tất cả endpoints
- Request/Response format
- Authorization matrix
- Error codes

### 🎉 **Muốn biết thay đổi gì?**

👉 Đọc: **`🎉_BACKEND_API_UPDATED.md`**

- So sánh BEFORE/AFTER
- Chi tiết thay đổi
- Approval workflow
- Debugging guide

### ✅ **Muốn xem tổng kết?**

👉 Đọc: **`✅_HOÀN_THÀNH_CẬP_NHẬT.md`**

- Checklist hoàn thành
- Breaking changes
- Next steps

---

## 📁 CẤU TRÚC TÀI LIỆU

```
📖_ĐỌC_ĐI_NÀY.md              ← BẠN ĐANG Ở ĐÂY
│
├── ⚡_QUICK_START.md           ← Bắt đầu tại đây
│   ├── Code examples
│   ├── Common use cases
│   └── UI components
│
├── 📚_API_ENDPOINTS_REFERENCE.md  ← Tra cứu API
│   ├── All endpoints
│   ├── Request/Response
│   ├── Authorization
│   └── Error codes
│
├── 🎉_BACKEND_API_UPDATED.md      ← Chi tiết thay đổi
│   ├── BEFORE/AFTER comparison
│   ├── Approval workflow
│   ├── Testing checklist
│   └── Debugging tips
│
└── ✅_HOÀN_THÀNH_CẬP_NHẬT.md      ← Tổng kết
    ├── Danh sách thay đổi
    ├── Breaking changes
    └── Status report
```

---

## 🔥 THAY ĐỔI QUAN TRỌNG NHẤT

### 1. **Endpoint URLs đã đổi**

```
❌ KHÔNG DÙNG NỮA:
PUT /course/updateCourse/{id}/with-file
PUT /lesson/updateLesson/{id}/with-video

✅ SỬ DỤNG:
PUT /course/updateCourse/{id}
PUT /lesson/updateLesson/{id}
```

### 2. **File là OPTIONAL khi update**

```typescript
// ✅ Không có file mới
await lmsApiClient.updateCourse(id, data);

// ✅ Có file mới
await lmsApiClient.updateCourse(id, data, newFile);
```

### 3. **Thêm Approval System**

```typescript
// Course mới tạo có approvalStatus = "PENDING"
const response = await lmsApiClient.createCourse(data, file);
console.log(response.result.approvalStatus); // "PENDING"

// Admin phê duyệt
await lmsApiClient.approveCourse(courseId, {
  approvalStatus: ApprovalStatus.APPROVED,
});
```

### 4. **Lecturer có endpoint riêng**

```typescript
// Xem courses của mình (bao gồm PENDING)
const courses = await lmsApiClient.getLecturerCourses();
```

---

## 💻 CODE NHANH

### Tạo Course

```typescript
const response = await lmsApiClient.createCourse(
  {
    title: "React Course",
    description: "Learn React",
    price: 199,
    categoryId: 1,
  },
  imageFile
);
```

### Sửa Course

```typescript
// Không có ảnh mới
await lmsApiClient.updateCourse(courseId, { title: "New Title" });

// Có ảnh mới
await lmsApiClient.updateCourse(courseId, { title: "New Title" }, newImage);
```

### Tạo Lesson

```typescript
// Không có video
await lmsApiClient.createLesson({
  courseId: 1,
  title: "Lesson 1",
  orderIndex: 1,
});

// Có video
await lmsApiClient.createLesson(
  {
    courseId: 1,
    title: "Lesson 1",
    orderIndex: 1,
  },
  videoFile
);
```

### Sửa Lesson

```typescript
// Không có video mới
await lmsApiClient.updateLesson(lessonId, { title: "Updated" });

// Có video mới
await lmsApiClient.updateLesson(lessonId, { title: "Updated" }, newVideo);
```

---

## 🎨 UI COMPONENTS

### Hiển thị Approval Status

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
```

---

## 🔧 FILES ĐÃ SỬA

### 1. `src/lib/lms-api-client.ts`

- ✅ Sửa `updateCourse()` method
- ✅ Sửa `updateLesson()` method
- ✅ Thêm `getLecturerCourses()`
- ✅ Thêm `getAllCoursesForAdmin()`
- ✅ Thêm `getPendingCourses()`
- ✅ Thêm `approveCourse()`
- ✅ Thêm types: `ApprovalStatus`, `ApprovalRequest`

### 2. `src/lib/hooks/useLecturerCourses.ts`

- ✅ Sử dụng `getLecturerCourses()` endpoint mới
- ✅ Đơn giản hóa `updateCourse()`

---

## ⚠️ BREAKING CHANGES

### Nếu bạn đang sử dụng code cũ:

#### ❌ Code CŨ (không hoạt động nữa)

```typescript
// SAI - Endpoint không tồn tại
await fetch("/api/course/updateCourse/1/with-file", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

#### ✅ Code MỚI (sử dụng)

```typescript
// ĐÚNG
await lmsApiClient.updateCourse(1, data, imageFile);
```

---

## 🚀 LỘ TRÌNH HỌC

### Bước 1: Hiểu cơ bản (10 phút)

1. Đọc phần "THAY ĐỔI QUAN TRỌNG NHẤT" ở trên
2. Xem "CODE NHANH" để hiểu cách dùng
3. Chạy thử 1-2 examples

### Bước 2: Thực hành (30 phút)

1. Đọc `⚡_QUICK_START.md`
2. Copy code examples
3. Test trong project của bạn

### Bước 3: Nâng cao (1 giờ)

1. Đọc `📚_API_ENDPOINTS_REFERENCE.md`
2. Hiểu authorization matrix
3. Học error handling

### Bước 4: Master (2 giờ)

1. Đọc `🎉_BACKEND_API_UPDATED.md`
2. Hiểu approval workflow
3. Implement approval UI

---

## 🐛 GẶP VẤN ĐỀ?

### Lỗi 404 Not Found

```
❌ PUT /course/updateCourse/1/with-file  → 404
✅ PUT /course/updateCourse/1            → 200
```

👉 Xem: `🎉_BACKEND_API_UPDATED.md` → Section "DEBUGGING"

### Lỗi 415 Unsupported Media Type

👉 Kiểm tra đang dùng `lmsApiClient` chứ không phải fetch trực tiếp
👉 Xem: `⚡_QUICK_START.md` → Section "NOTES QUAN TRỌNG"

### Token expired

👉 Xem: `⚡_QUICK_START.md` → Section "DEBUGGING"

---

## 📞 HỖ TRỢ

### Tài liệu có sẵn:

- ✅ API Reference
- ✅ Quick Start Guide
- ✅ Backend Changes
- ✅ Completion Report

### Nếu vẫn cần hỗ trợ:

1. Đọc lại tài liệu liên quan
2. Check browser Console & Network tab
3. Verify JWT token
4. Check endpoint URL

---

## ✅ CHECKLIST TRƯỚC KHI BẮT ĐẦU

- [ ] Đã đọc file này
- [ ] Đã đọc `⚡_QUICK_START.md`
- [ ] Hiểu BREAKING CHANGES
- [ ] Biết file nào cần đọc khi gặp vấn đề
- [ ] Đã test code examples

---

## 🎯 TÓM TẮT

**Điều quan trọng nhất cần nhớ:**

1. **Endpoints đã đổi** - Không có `/with-file` hoặc `/with-video` nữa
2. **File là optional** - Khi update không bắt buộc phải có file mới
3. **Có approval system** - Courses cần được admin phê duyệt
4. **Lecturer có endpoint riêng** - Dùng `getLecturerCourses()`
5. **Dùng `lmsApiClient`** - Đừng gọi fetch trực tiếp

**Bắt đầu từ đâu?**
👉 Đọc `⚡_QUICK_START.md` và copy code examples!

---

**Chúc bạn coding vui vẻ! 🚀**
