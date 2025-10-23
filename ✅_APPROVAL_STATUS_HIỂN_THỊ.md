# ✅ ĐÃ THÊM HIỂN THỊ APPROVAL STATUS

## 🎯 VẤN ĐỀ ĐÃ GIẢI QUYẾT

Bạn nghĩ rằng courses không cần phê duyệt vì **không thấy badge "Chờ phê duyệt"** trên UI.

## 🔍 NGUYÊN NHÂN

**Backend hoạt động ĐÚNG** - tất cả courses tạo mới đều có `approvalStatus = PENDING`:

```sql
mysql> SELECT id, title, approval_status FROM courses ORDER BY created_at DESC LIMIT 3;

id | title         | approval_status
6  | Java cơ bản   | PENDING        ✅
5  | Css           | PENDING        ✅
4  | HTML          | PENDING        ✅
```

**Frontend** chỉ hiển thị `status` (OPEN/UPCOMING/CLOSED) **KHÔNG hiển thị `approvalStatus`**!

---

## ✅ ĐÃ FIX

Đã cập nhật trang `/authorized/lms/app/lecturer/courses/page.tsx` để hiển thị approval status.

### Thay đổi:

#### Before ❌

```tsx
<Badge variant="default">Đã xuất bản</Badge>
```

#### After ✅

```tsx
<div className="flex gap-2 flex-wrap">
  <Badge variant="default">Đã xuất bản</Badge>

  {/* Approval Status Badges */}
  {course.approvalStatus === ApprovalStatus.PENDING && (
    <Badge variant="warning" className="bg-yellow-500">
      <Clock className="h-3 w-3 mr-1" />
      Chờ phê duyệt
    </Badge>
  )}

  {course.approvalStatus === ApprovalStatus.APPROVED && (
    <Badge variant="success" className="bg-green-500">
      <CheckCircle className="h-3 w-3 mr-1" />
      Đã duyệt
    </Badge>
  )}

  {course.approvalStatus === ApprovalStatus.REJECTED && (
    <Badge variant="destructive">
      <XCircle className="h-3 w-3 mr-1" />
      Bị từ chối
    </Badge>
  )}
</div>;

{
  /* Rejection Reason */
}
{
  course.rejectionReason && (
    <p className="text-sm text-destructive mt-2">
      Lý do từ chối: {course.rejectionReason}
    </p>
  );
}
```

---

## 🎨 GIẢ DIỆN MỚI

### Tab "Đã xuất bản"

```
┌─────────────────────────────────────┐
│  📚 React Advanced Course          │
│  ┌──────────────┐  ┌──────────────┐│
│  │ Đã xuất bản  │  │ ⏰ Chờ duyệt ││  ← THÊM MỚI
│  └──────────────┘  └──────────────┘│
│  Programming                        │
└─────────────────────────────────────┘
```

### Tab "Bản nháp" với course bị từ chối

```
┌─────────────────────────────────────┐
│  📚 Java Basics                     │
│  ┌───────────┐  ┌────────────────┐ │
│  │ Bản nháp  │  │ ❌ Bị từ chối  │ │  ← THÊM MỚI
│  └───────────┘  └────────────────┘ │
│  Programming                        │
│  ⚠️ Lý do từ chối: Nội dung chưa    │  ← THÊM MỚI
│     phù hợp với yêu cầu             │
└─────────────────────────────────────┘
```

---

## 🔄 FLOW APPROVAL HIỂN THỊ

### 1. Lecturer tạo course mới

```tsx
Status: UPCOMING
ApprovalStatus: PENDING

UI hiển thị:
┌────────────────────────────────┐
│ ┌───────────┐  ┌────────────┐ │
│ │ Bản nháp  │  │ ⏰ Chờ duyệt│ │
│ └───────────┘  └────────────┘ │
└────────────────────────────────┘
```

### 2. Admin approve

```tsx
Status: UPCOMING → OPEN (lecturer changes)
ApprovalStatus: PENDING → APPROVED

UI hiển thị:
┌────────────────────────────────────┐
│ ┌──────────────┐  ┌──────────────┐│
│ │ Đã xuất bản  │  │ ✅ Đã duyệt  ││
│ └──────────────┘  └──────────────┘│
└────────────────────────────────────┘
```

### 3. Lecturer sửa course

```tsx
Status: OPEN (unchanged)
ApprovalStatus: APPROVED → PENDING (reset)

UI hiển thị:
┌────────────────────────────────────┐
│ ┌──────────────┐  ┌──────────────┐│
│ │ Đã xuất bản  │  │ ⏰ Chờ duyệt ││
│ └──────────────┘  └──────────────┘│
└────────────────────────────────────┘
```

### 4. Admin reject

```tsx
Status: OPEN (unchanged)
ApprovalStatus: PENDING → REJECTED

UI hiển thị:
┌────────────────────────────────────┐
│ ┌──────────────┐  ┌────────────────┐│
│ │ Đã xuất bản  │  │ ❌ Bị từ chối  ││
│ └──────────────┘  └────────────────┘│
│ ⚠️ Lý do: Nội dung không phù hợp   │
└────────────────────────────────────┘
```

---

## 🎨 BADGE COLORS

| Status       | Color                  | Icon           |
| ------------ | ---------------------- | -------------- |
| **PENDING**  | Yellow (bg-yellow-500) | ⏰ Clock       |
| **APPROVED** | Green (bg-green-500)   | ✅ CheckCircle |
| **REJECTED** | Red (destructive)      | ❌ XCircle     |

---

## 📦 FILES CHANGED

### ✅ Updated: `src/app/authorized/lms/app/lecturer/courses/page.tsx`

**Imports added:**

```typescript
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { ApprovalStatus } from "@/lib/lms-api-client";
```

**Changes:**

- ✅ Added approval status badges in "Published" tab
- ✅ Added approval status badges in "Draft" tab
- ✅ Added rejection reason display
- ✅ Improved layout with flex-wrap for badges

---

## 🧪 TESTING

### Test Case 1: Course PENDING

1. Login as LECTURER
2. Tạo course mới
3. **Mong đợi:** Thấy badge màu vàng "⏰ Chờ phê duyệt"

### Test Case 2: Course APPROVED

1. Admin approve course
2. Lecturer refresh page
3. **Mong đợi:** Thấy badge màu xanh "✅ Đã duyệt"

### Test Case 3: Course REJECTED

1. Admin reject course với lý do
2. Lecturer refresh page
3. **Mong đợi:**
   - Thấy badge màu đỏ "❌ Bị từ chối"
   - Thấy text "Lý do từ chối: ..."

### Test Case 4: Edit APPROVED course

1. Lecturer sửa approved course
2. Refresh page
3. **Mong đợi:** Badge chuyển về "⏰ Chờ phê duyệt"

---

## ✅ VERIFICATION

### Check trong Database

```sql
-- Tất cả courses đều PENDING
SELECT id, title, approval_status, approved_by
FROM courses
WHERE approval_status = 'PENDING';

-- Output:
id | title         | approval_status | approved_by
6  | Java cơ bản   | PENDING        | NULL
5  | Css           | PENDING        | NULL
4  | HTML          | PENDING        | NULL
```

### Check trong UI

- ✅ Mở trang lecturer courses
- ✅ Thấy badge "⏰ Chờ phê duyệt" màu vàng
- ✅ Badge hiển thị ở cả 2 tabs (Published & Draft)
- ✅ Rejection reason hiển thị nếu có

---

## 🎉 KẾT LUẬN

**Backend luôn hoạt động đúng!** Courses luôn được tạo với `approvalStatus = PENDING`.

Vấn đề chỉ là **frontend không hiển thị** approval status. Bây giờ đã fix xong!

**Bạn có thể:**

1. ✅ Thấy rõ course đang ở trạng thái nào
2. ✅ Biết course đã được approve chưa
3. ✅ Xem lý do từ chối (nếu có)
4. ✅ Theo dõi workflow approval đầy đủ

---

**Refresh trang và xem badge "⏰ Chờ phê duyệt" xuất hiện! 🎉**
