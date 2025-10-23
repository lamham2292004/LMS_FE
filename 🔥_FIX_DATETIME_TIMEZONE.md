# 🔥 FIX: DateTime Format with Timezone

## 🐛 Lỗi

### Error Message:

```
JSON parse error: Cannot deserialize value of type `java.time.OffsetDateTime`
from String "2025-10-16T16:27:00": Failed to deserialize java.time.OffsetDateTime
```

### Root Cause:

- Frontend gửi: `2025-10-16T16:27:00`
- Backend Spring Boot cần: `2025-10-16T16:27:00+07:00` (với timezone)
- Backend sử dụng `OffsetDateTime` không phải `LocalDateTime`

---

## ✅ Solution

### Format datetime với timezone:

**Before:**

```typescript
const formatDateTime = (datetime: string) => {
  if (!datetime) return undefined;
  return datetime.includes(":") && datetime.split(":").length === 2
    ? `${datetime}:00`
    : datetime;
};
// Output: "2025-10-16T15:15:00"
```

**After:**

```typescript
const formatDateTime = (datetime: string) => {
  if (!datetime) return undefined;
  // Add seconds if missing
  const withSeconds =
    datetime.includes(":") && datetime.split(":").length === 2
      ? `${datetime}:00`
      : datetime;
  // Add timezone offset (Vietnam = +07:00)
  return `${withSeconds}+07:00`;
};
// Output: "2025-10-16T15:15:00+07:00"
```

---

## 📝 Changes Made

### 1. Create Course

**File:** `src/app/authorized/lms/app/lecturer/courses/new/page.tsx`

```typescript
// Now sends: "2025-10-16T15:15:00+07:00"
startTime: formatDateTime(startTime),
endTime: formatDateTime(endTime),
```

### 2. Edit Course

**File:** `src/app/authorized/lms/app/lecturer/courses/[id]/edit/page.tsx`

**Loading datetime FROM backend:**

```typescript
// "2025-10-16T15:15:00+07:00" -> "2025-10-16T15:15"
if (courseData.startTime) {
  const dateStr = courseData.startTime.split("+")[0].split(".")[0];
  setStartTime(dateStr.substring(0, 16));
}
```

**Sending datetime TO backend:**

```typescript
// "2025-10-16T15:15" -> "2025-10-16T15:15:00+07:00"
startTime: formatDateTime(startTime),
endTime: formatDateTime(endTime),
```

---

## 🌍 Timezone Info

| Timezone      | Offset | Format Example            |
| ------------- | ------ | ------------------------- |
| Vietnam (ICT) | +07:00 | 2025-10-16T15:15:00+07:00 |
| UTC           | +00:00 | 2025-10-16T08:15:00+00:00 |

**Note:** Đang dùng hardcode +07:00 cho Vietnam timezone.

---

## 🧪 Testing

### Test Create Course:

```bash
1. Fill form with dates
2. Start: 2025-01-20T09:00
3. End: 2025-03-20T17:00
4. Click "Tạo khóa học"

Expected backend receives:
- startTime: "2025-01-20T09:00:00+07:00"
- endTime: "2025-03-20T17:00:00+07:00"
```

### Test Edit Course:

```bash
1. Open edit page
2. Dates should display without timezone
3. Modify dates
4. Save

Expected:
- Display: "2025-01-20T09:00" (no timezone shown)
- Send: "2025-01-20T09:00:00+07:00" (with timezone)
```

---

## 🚀 Backend Expectation

### Spring Boot OffsetDateTime:

```java
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
private OffsetDateTime startTime;
```

Accepts:

- ✅ `2025-10-16T15:15:00+07:00`
- ✅ `2025-10-16T15:15:00Z`
- ❌ `2025-10-16T15:15:00` (no timezone)
- ❌ `2025-10-16T15:15` (no seconds, no timezone)

---

## 💡 Future Improvements

### Option 1: Dynamic Timezone

```typescript
const formatDateTime = (datetime: string) => {
  if (!datetime) return undefined;
  const withSeconds =
    datetime.split(":").length === 2 ? `${datetime}:00` : datetime;
  // Get user's timezone dynamically
  const offset = -new Date().getTimezoneOffset() / 60;
  const sign = offset >= 0 ? "+" : "-";
  const hours = Math.abs(offset).toString().padStart(2, "0");
  return `${withSeconds}${sign}${hours}:00`;
};
```

### Option 2: Use Day.js/Date-fns

```typescript
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDateTime = (datetime: string) => {
  if (!datetime) return undefined;
  return dayjs(datetime).tz("Asia/Ho_Chi_Minh").format();
};
```

---

## ✅ Status

- [x] Fix create course datetime format
- [x] Fix edit course datetime format
- [x] Add timezone offset (+07:00)
- [x] Parse datetime from backend correctly
- [ ] Dynamic timezone detection
- [ ] User timezone preference

---

**Date:** 2025-01-16  
**Fixed:** DateTime format with timezone for Spring Boot OffsetDateTime
