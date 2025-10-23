# 🎉 ĐÃ HOÀN THÀNH: COURSE STATUS & ENROLLMENT LOGIC

## ✅ Những gì đã làm

### 1. **EnrollButton với Course Status Logic** ✓

Updated `EnrollButton.tsx` để xử lý 3 trạng thái khóa học:

#### 🟢 **OPEN** - Đang mở

- ✅ Cho phép đăng ký
- ✅ Hiển thị nút "📚 Đăng ký"
- ✅ Sau khi đăng ký → "✓ Đã đăng ký"

#### 🔵 **UPCOMING** - Sắp mở

- ✅ **KHÔNG** cho phép đăng ký
- ✅ Hiển thị nút "🔵 Sắp mở" (disabled)
- ✅ Hiển thị thời gian mở: **"📅 14/01/2025 10:00"**
- ✅ Tooltip khi hover: "Mở vào: 14/01/2025 10:00"

#### 🔴 **CLOSED** - Đã đóng

- ✅ **KHÔNG** cho phép đăng ký
- ✅ Hiển thị nút "🔴 Đã đóng" (disabled)

### 2. **Course Card với startTime** ✓

Updated trang Browse để hiển thị:

```jsx
<Badge variant="outline">📅 14/01/2025 // Hiển thị khi có startTime</Badge>
```

### 3. **Status Badge với màu sắc** ✓

Trên course card:

- 🟢 **OPEN**: Nền xanh lá
- 🔵 **UPCOMING**: Nền xanh dương
- 🔴 **CLOSED**: Nền xám

## 🎨 UI/UX Preview

### Course Card với status OPEN:

```
┌──────────────────────────┐
│  [🟢 Đang mở]    [Miễn phí]│
│       [Ảnh khóa học]      │
└──────────────────────────┘
[Công nghệ] [📅 14/01/2025]

Lập trình Next.js
Khóa học Next.js từ cơ bản...

🕐 5 bài học

Miễn phí          [📚 Đăng ký]
```

### Course Card với status UPCOMING:

```
┌──────────────────────────┐
│  [🔵 Sắp mở]     [Miễn phí]│
│       [Ảnh khóa học]      │
└──────────────────────────┘
[Công nghệ] [📅 20/02/2025]

Machine Learning cơ bản
Học ML từ đầu...

🕐 10 bài học

1,500,000đ    [🔵 Sắp mở]
              📅 20/02/2025 09:00
```

### Course Card với status CLOSED:

```
┌──────────────────────────┐
│  [🔴 Đã đóng]            │
│       [Ảnh khóa học]      │
└──────────────────────────┘
[Công nghệ] [📅 01/12/2024]

Python cơ bản
Đã kết thúc...

500,000đ          [🔴 Đã đóng]
```

## 🧪 Testing Guide

### Test Case 1: Course OPEN (Có thể đăng ký)

```sql
-- Backend: Update course status to OPEN
UPDATE courses SET
  status = 'OPEN',
  start_time = '2025-01-14 10:00:00',
  end_time = '2025-03-14 23:59:59'
WHERE id = 1;
```

**Expected:**

- ✅ Badge: "🟢 Đang mở" (xanh lá)
- ✅ startTime: "📅 14/01/2025"
- ✅ Button: "📚 Đăng ký" (clickable)
- ✅ Click → Đăng ký thành công
- ✅ Button → "✓ Đã đăng ký" (disabled)

### Test Case 2: Course UPCOMING (Chưa mở)

```sql
-- Backend: Set course to UPCOMING
UPDATE courses SET
  status = 'UPCOMING',
  start_time = '2025-02-20 09:00:00',
  end_time = '2025-04-20 23:59:59'
WHERE id = 2;
```

**Expected:**

- ✅ Badge: "🔵 Sắp mở" (xanh dương)
- ✅ startTime: "📅 20/02/2025"
- ✅ Button: "🔵 Sắp mở" (disabled, không click được)
- ✅ Dưới button: "📅 20/02/2025 09:00"
- ✅ Hover button → Tooltip: "Mở vào: 20/02/2025 09:00"

### Test Case 3: Course CLOSED (Đã đóng)

```sql
-- Backend: Set course to CLOSED
UPDATE courses SET
  status = 'CLOSED',
  start_time = '2024-12-01 10:00:00',
  end_time = '2024-12-31 23:59:59'
WHERE id = 3;
```

**Expected:**

- ✅ Badge: "🔴 Đã đóng" (xám)
- ✅ startTime: "📅 01/12/2024" (nếu có)
- ✅ Button: "🔴 Đã đóng" (disabled, không click được)

### Test Case 4: Course không có startTime

```sql
-- Backend: Course without startTime
UPDATE courses SET
  status = 'OPEN',
  start_time = NULL,
  end_time = NULL
WHERE id = 4;
```

**Expected:**

- ✅ Không hiển thị badge startTime
- ✅ Button vẫn hoạt động bình thường (vì status = OPEN)

## 📁 Files đã cập nhật

### 1. EnrollButton.tsx

```typescript
interface EnrollButtonProps {
  courseId: number;
  courseName?: string;
  courseStatus?: CourseStatus | string;  // ✅ NEW
  startTime?: string;                     // ✅ NEW
  onSuccess?: () => void;
  className?: string;
}

// Logic:
- courseStatus === 'OPEN' → Cho đăng ký
- courseStatus === 'UPCOMING' → Show "Sắp mở" + startTime
- courseStatus === 'CLOSED' → Show "Đã đóng"
```

### 2. browse/page.tsx & browse-lms/page.tsx

```typescript
<EnrollButton
  courseId={course.id}
  courseName={course.title}
  courseStatus={course.status} // ✅ NEW
  startTime={course.startTime} // ✅ NEW
  className="text-sm px-3 py-2"
/>;

// Badge hiển thị startTime:
{
  course.startTime && (
    <Badge variant="outline">
      📅 {new Date(course.startTime).toLocaleDateString("vi-VN")}
    </Badge>
  );
}
```

## 🔧 Backend Setup (Nếu cần)

### Đảm bảo Course Entity có status và startTime:

```java
@Entity
@Table(name = "courses")
public class Course {
    // ...

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    CourseStatus status; // OPEN, UPCOMING, CLOSED

    @Column(name = "start_time")
    OffsetDateTime startTime;

    @Column(name = "end_time")
    OffsetDateTime endTime;
}
```

### CourseStatus Enum:

```java
public enum CourseStatus {
    UPCOMING,  // Sắp mở
    OPEN,      // Đang mở (cho phép đăng ký)
    CLOSED     // Đã đóng
}
```

### Database Migration (nếu chưa có):

```sql
-- Thêm columns nếu chưa có
ALTER TABLE courses
ADD COLUMN status VARCHAR(20) DEFAULT 'UPCOMING',
ADD COLUMN start_time TIMESTAMP,
ADD COLUMN end_time TIMESTAMP;

-- Set default status
UPDATE courses SET status = 'OPEN' WHERE status IS NULL;
```

## 🎯 Business Logic

### Khi nào nên set OPEN?

```sql
-- Auto set OPEN khi đến startTime (cần scheduler)
UPDATE courses
SET status = 'OPEN'
WHERE status = 'UPCOMING'
  AND start_time <= NOW();
```

### Khi nào nên set CLOSED?

```sql
-- Auto set CLOSED khi đến endTime (cần scheduler)
UPDATE courses
SET status = 'CLOSED'
WHERE status = 'OPEN'
  AND end_time <= NOW();
```

### Backend Scheduler (Optional - Advanced):

```java
@Scheduled(cron = "0 */5 * * * *") // Every 5 minutes
public void updateCourseStatus() {
    // Open courses
    courseRepository.findByStatusAndStartTimeBefore(
        CourseStatus.UPCOMING,
        OffsetDateTime.now()
    ).forEach(course -> {
        course.setStatus(CourseStatus.OPEN);
        courseRepository.save(course);
    });

    // Close courses
    courseRepository.findByStatusAndEndTimeBefore(
        CourseStatus.OPEN,
        OffsetDateTime.now()
    ).forEach(course -> {
        course.setStatus(CourseStatus.CLOSED);
        courseRepository.save(course);
    });
}
```

## 🚀 Quick Start - Test Ngay

### Bước 1: Cập nhật data trong MySQL

```sql
-- Course 1: OPEN (cho phép đăng ký)
UPDATE courses SET
  status = 'OPEN',
  start_time = '2025-01-14 10:00:00',
  end_time = '2025-03-14 23:59:59'
WHERE id = 1;

-- Course 2: UPCOMING (sắp mở)
UPDATE courses SET
  status = 'UPCOMING',
  start_time = '2025-02-20 09:00:00',
  end_time = '2025-04-20 23:59:59'
WHERE id = 2;

-- Course 3: CLOSED (đã đóng)
UPDATE courses SET
  status = 'CLOSED',
  start_time = '2024-11-01 10:00:00',
  end_time = '2024-12-31 23:59:59'
WHERE id = 3;
```

### Bước 2: Restart Backend (nếu cần)

```bash
cd f:\DoAn\LMS
mvn spring-boot:run
```

### Bước 3: Test Frontend

```
1. Vào trang: http://localhost:3000/authorized/lms/app/student/browse
2. Xem 3 courses với 3 trạng thái khác nhau
3. Test đăng ký:
   - Course OPEN: Đăng ký được ✅
   - Course UPCOMING: Không đăng ký được, show startTime ✅
   - Course CLOSED: Không đăng ký được ✅
```

## ✨ Features Summary

| Feature                                    | Status |
| ------------------------------------------ | ------ |
| Course status badge (OPEN/UPCOMING/CLOSED) | ✅     |
| Color coding (Green/Blue/Gray)             | ✅     |
| Conditional enrollment (chỉ OPEN)          | ✅     |
| Show startTime on card                     | ✅     |
| Show startTime on UPCOMING button          | ✅     |
| Tooltip on UPCOMING button                 | ✅     |
| Prevent enrollment on UPCOMING/CLOSED      | ✅     |
| Responsive design                          | ✅     |

## 🎉 Kết Luận

✅ **HOÀN THÀNH** - Course Status & Enrollment Logic

- Chỉ khóa học **OPEN** mới cho phép đăng ký
- Khóa học **UPCOMING** hiển thị thời gian mở
- Khóa học **CLOSED** hiển thị đã đóng
- UI/UX đẹp với màu sắc phù hợp
- Fully responsive

**Status: READY TO USE! 🚀**
