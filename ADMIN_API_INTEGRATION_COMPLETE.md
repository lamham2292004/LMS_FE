# ✅ TÍCH HỢP ADMIN VỚI BACKEND API HOÀN TẤT

## 📋 Tổng quan

Đã hoàn thành việc tích hợp phần Admin với backend LMS API, bao gồm chức năng:

- ✅ Xem tất cả khóa học (PENDING, APPROVED, REJECTED)
- ✅ Phê duyệt khóa học (Approve)
- ✅ Từ chối khóa học với lý do (Reject)
- ✅ Xóa khóa học (Delete)

---

## 🔧 Các thay đổi đã thực hiện

### 1. **Thêm Hooks cho Admin** (`src/lib/hooks/useLms.ts`)

#### `useAdminCourses()`

```typescript
// Lấy tất cả khóa học (bao gồm PENDING, APPROVED, REJECTED)
const { courses, loading, error, fetchCourses } = useAdminCourses();
```

**API Endpoint:** `GET /api/course/admin/all`

#### `useApproveCourse()`

```typescript
// Phê duyệt hoặc Từ chối khóa học
const { approveCourse, loading } = useApproveCourse({
  onSuccess: (data) => {
    /* reload list */
  },
  onError: (error) => {
    /* show error */
  },
});

// Usage:
await approveCourse(courseId, {
  approvalStatus: ApprovalStatus.APPROVED,
});

// hoặc
await approveCourse(courseId, {
  approvalStatus: ApprovalStatus.REJECTED,
  rejectionReason: "Nội dung chưa đầy đủ...",
});
```

**API Endpoint:** `POST /api/course/{courseId}/approve`

#### `useDeleteCourse()`

```typescript
// Xóa khóa học
const { deleteCourse, loading } = useDeleteCourse();

// Usage:
await deleteCourse(courseId);
```

**API Endpoint:** `DELETE /api/course/{courseId}`

---

### 2. **Cập nhật Trang Admin Courses** (`admin/courses/page.tsx`)

#### Thay đổi chính:

- ❌ **Loại bỏ:** Mock data
- ✅ **Thêm:** Tích hợp API thực từ backend
- ✅ **Thêm:** Xử lý approval/rejection/delete thực tế
- ✅ **Thêm:** Loading states và error handling
- ✅ **Thêm:** Real-time reload sau khi approve/reject/delete

#### Các Tab hiển thị:

1. **Tất cả** - Hiển thị tất cả khóa học
2. **Đã phê duyệt** - Chỉ khóa học APPROVED
3. **Chờ duyệt** - Chỉ khóa học PENDING (có nút Phê duyệt/Từ chối)
4. **Bị từ chối** - Chỉ khóa học REJECTED (hiển thị lý do)

#### Thông tin hiển thị:

- Hình ảnh khóa học (từ backend)
- Tên và mô tả
- Danh mục (categoryName)
- Teacher ID
- Số học viên đã đăng ký
- Giá khóa học
- **Approval Status** với badge màu:
  - 🟢 Xanh lá: APPROVED
  - 🟡 Vàng: PENDING
  - 🔴 Đỏ: REJECTED
- Ngày tạo
- Lý do từ chối (nếu có)

#### Stats Dashboard:

- Tổng số khóa học
- Số khóa học đã phê duyệt
- Số khóa học chờ duyệt (màu vàng nổi bật)
- Tổng số học viên

---

## 🎯 Workflow Phê duyệt Khóa học

### Kịch bản 1: Approve Course

```
Admin click "Phê duyệt"
    ↓
Hiển thị Dialog xác nhận
    ↓
Admin confirm
    ↓
POST /api/course/{courseId}/approve
{
  "approvalStatus": "APPROVED"
}
    ↓
Backend update:
  - approvalStatus = APPROVED
  - approvedBy = adminId
  - approvedAt = NOW()
    ↓
Frontend:
  - Hiển thị thông báo thành công
  - Reload danh sách khóa học
  - Course hiện ở tab "Đã phê duyệt"
  - Student có thể thấy course
```

### Kịch bản 2: Reject Course

```
Admin click "Từ chối"
    ↓
Hiển thị Dialog nhập lý do
    ↓
Admin nhập lý do và confirm
    ↓
POST /api/course/{courseId}/approve
{
  "approvalStatus": "REJECTED",
  "rejectionReason": "Nội dung chưa đầy đủ..."
}
    ↓
Backend update:
  - approvalStatus = REJECTED
  - approvedBy = adminId
  - approvedAt = NOW()
  - rejectionReason = "..."
    ↓
Frontend:
  - Hiển thị thông báo từ chối
  - Reload danh sách
  - Course hiện ở tab "Bị từ chối"
  - Lecturer có thể thấy lý do và sửa lại
```

### Kịch bản 3: Delete Course

```
Admin click "Xóa"
    ↓
Hiển thị Dialog cảnh báo
    ↓
Admin confirm
    ↓
DELETE /api/course/{courseId}
    ↓
Backend xóa course khỏi database
    ↓
Frontend:
  - Hiển thị thông báo xóa thành công
  - Reload danh sách
  - Course biến mất khỏi tất cả tabs
```

---

## 🔗 API Endpoints được sử dụng

### Admin Course Management:

- `GET /api/course/admin/all` - Lấy tất cả khóa học (includes PENDING, APPROVED, REJECTED)
- `POST /api/course/{courseId}/approve` - Phê duyệt hoặc từ chối khóa học
- `DELETE /api/course/{courseId}` - Xóa khóa học

### Request/Response Examples:

#### Approve Course:

```json
// Request
POST /api/course/3/approve
{
  "approvalStatus": "APPROVED"
}

// Response
{
  "code": 1000,
  "result": {
    "id": 3,
    "title": "...",
    "approvalStatus": "APPROVED",
    "approvedBy": 1,
    "approvedAt": "2025-01-21T10:30:00Z",
    ...
  },
  "message": "Khóa học đã được phê duyệt thành công"
}
```

#### Reject Course:

```json
// Request
POST /api/course/3/approve
{
  "approvalStatus": "REJECTED",
  "rejectionReason": "Nội dung chưa đầy đủ. Vui lòng thêm ít nhất 15 bài học."
}

// Response
{
  "code": 1000,
  "result": {
    "id": 3,
    "title": "...",
    "approvalStatus": "REJECTED",
    "approvedBy": 1,
    "approvedAt": "2025-01-21T10:30:00Z",
    "rejectionReason": "Nội dung chưa đầy đủ...",
    ...
  },
  "message": "Khóa học đã bị từ chối"
}
```

---

## 🎨 UI/UX Improvements

### Badge System:

```tsx
// Màu sắc theo approval status
APPROVED  → bg-success (xanh lá)
PENDING   → bg-yellow-500 (vàng)
REJECTED  → bg-red-500 (đỏ)
```

### Card Styling:

- **PENDING courses:** Border và background màu vàng nhạt
- **REJECTED courses:** Border và background màu đỏ nhạt
- **APPROVED courses:** Style bình thường

### Action Buttons:

- **PENDING:** Hiển thị cả "Phê duyệt" và "Từ chối"
- **APPROVED:** Chỉ có "Xem" và "Xóa"
- **REJECTED:** Chỉ có "Xem" và "Xóa"
- Tất cả có loading states khi processing

### Dialogs:

1. **Approve Dialog:**

   - Simple confirmation
   - "Bạn có chắc muốn phê duyệt khóa học này?"

2. **Reject Dialog:**

   - Textarea để nhập lý do
   - Required field (button disabled nếu empty)
   - Placeholder: "Nhập lý do từ chối..."

3. **Delete Dialog:**
   - Warning message
   - "Hành động này không thể hoàn tác"

---

## 🔧 Technical Details

### Type Safety:

```typescript
import { ApprovalStatus, CourseResponse } from "@/lib/lms-api-client";

// Proper typing
const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(
  null
);

// Type-safe approval data
interface ApprovalRequest {
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
}
```

### State Management:

```typescript
// Loading states for each action
const { courses, loading, fetchCourses } = useAdminCourses()
const { approveCourse, loading: approving } = useApproveCourse()
const { deleteCourse, loading: deleting } = useDeleteCourse()

// Button disabled states
<Button disabled={approving || deleting}>
```

### Auto-refresh after actions:

```typescript
const { approveCourse } = useApproveCourse({
  onSuccess: () => {
    alert("✅ Success!");
    fetchCourses(); // ← Auto reload list
    setShowDialog(false);
  },
  onError: (error) => {
    alert(`❌ Error: ${error.message}`);
  },
});
```

---

## ✅ Testing Checklist

### Trang Admin Courses:

- [ ] Load danh sách courses từ backend
- [ ] Stats hiển thị đúng số liệu
- [ ] Filter theo tabs hoạt động
- [ ] Search courses hoạt động
- [ ] Hình ảnh hiển thị từ backend

### Approve Functionality:

- [ ] Click "Phê duyệt" mở dialog
- [ ] Confirm approve gửi API
- [ ] Thông báo thành công
- [ ] List reload và course chuyển sang APPROVED
- [ ] Student có thể thấy course

### Reject Functionality:

- [ ] Click "Từ chối" mở dialog
- [ ] Input lý do bắt buộc
- [ ] Confirm reject gửi API với reason
- [ ] Thông báo từ chối thành công
- [ ] List reload và course chuyển sang REJECTED
- [ ] Lecturer thấy lý do từ chối

### Delete Functionality:

- [ ] Click "Xóa" mở dialog cảnh báo
- [ ] Confirm delete gửi API
- [ ] Thông báo xóa thành công
- [ ] Course biến mất khỏi list

---

## 🚀 Flow hoàn chỉnh

```
┌─────────────┐
│  LECTURER   │ tạo course
│             │ ↓ status: PENDING
└─────────────┘

┌─────────────┐
│    ADMIN    │ xem course ở tab "Chờ duyệt"
│             │ ↓
│             │ [Option 1] Approve
│             │   → status: APPROVED
│             │   → Student có thể thấy
│             │
│             │ [Option 2] Reject + reason
│             │   → status: REJECTED
│             │   → Lecturer thấy lý do
│             │   → Lecturer sửa lại
│             │   → status: PENDING (lại từ đầu)
│             │
│             │ [Option 3] Delete
│             │   → Course bị xóa vĩnh viễn
└─────────────┘

┌─────────────┐
│   STUDENT   │ Browse courses
│             │ ↓ Chỉ thấy APPROVED
└─────────────┘
```

---

## 📝 Notes

### Đồng bộ với Backend:

- ✅ `approvalStatus`: PENDING | APPROVED | REJECTED
- ✅ `rejectionReason`: Required khi reject
- ✅ `approvedBy`: Admin ID được tự động set từ JWT
- ✅ `approvedAt`: Timestamp tự động

### Security:

- ✅ Tất cả endpoints yêu cầu JWT token
- ✅ `@PreAuthorize("hasRole('ADMIN')")` ở backend
- ✅ Double check admin role trong controller

### Known Issues:

- Teacher name chưa hiển thị (hiện dùng teacherId)
- Backend cần thêm endpoint `/user/{id}` để lấy thông tin giảng viên

---

## 🎉 Kết quả

Phần Admin giờ đây đã:

- ✅ Tích hợp hoàn toàn với backend LMS API
- ✅ Đồng bộ với Lecturer và Student về cách sử dụng API
- ✅ Xử lý approval workflow hoàn chỉnh
- ✅ UI/UX rõ ràng với feedback tức thì
- ✅ Type-safe và error handling đầy đủ
- ✅ Không còn mock data

**Admin có thể:**

1. ✅ Xem tất cả khóa học từ backend
2. ✅ Phê duyệt khóa học PENDING
3. ✅ Từ chối khóa học với lý do
4. ✅ Xóa khóa học không phù hợp
5. ✅ Thống kê real-time

**Sẵn sàng để test workflow đầy đủ!** 🚀

---

Created: 2025-01-21  
Status: ✅ Complete  
Next: Test full approval workflow từ Lecturer → Admin → Student
