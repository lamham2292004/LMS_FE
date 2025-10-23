# 🔍 HƯỚNG DẪN DEBUG THANH TIẾN ĐỘ

## ❓ Vấn đề: Thanh tiến độ không hoạt động

Nếu thanh tiến độ (Progress bar) không hiển thị đúng, có thể do một trong các nguyên nhân sau:

---

## 🔎 1. Kiểm tra Backend có trả về `progress` không

### Cách kiểm tra:

Mở **DevTools Console** trong trình duyệt (F12), sau đó kiểm tra:

1. Vào trang chi tiết học viên: `/authorized/lms/app/lecturer/courses/[id]/students/[studentId]`
2. Mở tab **Network**
3. Tìm request đến `/api/enrollment`
4. Xem response:

```json
{
  "code": 1000,
  "result": [
    {
      "id": 1,
      "studentId": 3,
      "courseId": 1,
      "status": "ACTIVE",
      "enrolledAt": "2024-10-20T10:00:00+07:00",
      "progress": 65 // ← Giá trị này phải tồn tại
    }
  ]
}
```

**Nếu `progress` là `null`, `undefined` hoặc không tồn tại:**
→ Backend chưa trả về giá trị này. Cần yêu cầu backend thêm field này.

---

## 🔧 2. Kiểm tra giá trị `progress` trong code

### Thêm console.log tạm thời:

Mở file: `src/app/authorized/lms/app/lecturer/courses/[id]/students/[studentId]/page.tsx`

Thêm đoạn code sau (sau dòng 22):

```typescript
const { data, loading, error, refetch } = useStudentEnrollmentDetail(
  courseId,
  studentId
);
const { enrollment, quizResults, stats } = data;

// DEBUG: Thêm đoạn này
console.log("🔍 Debug Progress Bar:");
console.log("  - Enrollment:", enrollment);
console.log("  - Progress value:", enrollment?.progress);
console.log("  - Type of progress:", typeof enrollment?.progress);
```

Sau đó reload trang và xem Console:

- Nếu `progress` là `undefined` → Backend chưa trả về
- Nếu `progress` là `0` → Học viên chưa có tiến độ (bình thường)
- Nếu `progress` là `65` → Giá trị đúng, thanh progress bar sẽ hiển thị 65%

---

## 🎨 3. Kiểm tra CSS/Styling

### Mở DevTools Elements:

1. Inspect thanh tiến độ
2. Tìm element có class `progress-indicator` hoặc tương tự
3. Kiểm tra style:

```css
.progress-indicator {
  transform: translateX(-35%); /* Nếu progress = 65, sẽ dịch -35% */
}
```

**Nếu `transform` là `translateX(-100%)`:**
→ Giá trị progress là 0, thanh sẽ ẩn hoàn toàn

---

## ✅ 4. Component Progress hoạt động như thế nào

File: `src/app/authorized/lms/components/ui/progress.tsx`

```typescript
<ProgressPrimitive.Indicator
  className="bg-primary h-full w-full flex-1 transition-all"
  style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
/>
```

**Công thức:**

- `value = 0` → `translateX(-100%)` → Thanh ẩn hoàn toàn
- `value = 50` → `translateX(-50%)` → Thanh hiển thị 50%
- `value = 100` → `translateX(0%)` → Thanh đầy 100%

---

## 🐛 5. Các trường hợp phổ biến

### Trường hợp 1: Backend trả về `progress = null`

**Hiện tượng:** Thanh progress bar ẩn hoàn toàn

**Nguyên nhân:** Code sử dụng `enrollment.progress || 0`, nên `null` sẽ thành `0`

**Giải pháp:** Backend cần update để luôn trả về số (0-100)

---

### Trường hợp 2: Backend trả về `progress` dạng string

**Hiện tượng:** Thanh không hoạt động hoặc hiển thị sai

**VD:** `"progress": "65"` thay vì `"progress": 65`

**Giải pháp:**

Sửa code trong `page.tsx`:

```typescript
<Progress value={Number(enrollment.progress) || 0} className="mt-4" />
```

---

### Trường hợp 3: CSS bị override

**Hiện tượng:** Thanh có nhưng không thấy màu

**Kiểm tra:**

- Class `bg-primary` có màu không?
- Có CSS nào override `transform` không?

**Giải pháp:**

Thêm inline style:

```typescript
<Progress
  value={enrollment.progress || 0}
  className="mt-4"
  style={{ backgroundColor: "#e5e7eb" }} // Màu nền
/>
```

---

## 📊 6. Test với giá trị cố định

Để test xem component Progress có hoạt động không:

```typescript
{
  /* Test Progress Bar */
}
<div className="space-y-4">
  <div>
    <p>Progress 0%</p>
    <Progress value={0} />
  </div>
  <div>
    <p>Progress 25%</p>
    <Progress value={25} />
  </div>
  <div>
    <p>Progress 50%</p>
    <Progress value={50} />
  </div>
  <div>
    <p>Progress 75%</p>
    <Progress value={75} />
  </div>
  <div>
    <p>Progress 100%</p>
    <Progress value={100} />
  </div>
</div>;
```

Nếu các thanh này hiển thị đúng → Component Progress hoạt động bình thường
→ Vấn đề nằm ở dữ liệu từ backend

---

## 🔧 7. Giải pháp tạm thời

Nếu backend chưa trả về `progress`, có thể tính toán tạm:

```typescript
// Tính progress dựa trên số bài quiz đã hoàn thành
const calculatedProgress =
  stats.totalQuizzes > 0
    ? Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100)
    : 0;

// Sử dụng giá trị tính toán nếu backend không có
const displayProgress = enrollment.progress ?? calculatedProgress;
```

Sau đó dùng:

```typescript
<Progress value={displayProgress} className="mt-4" />
```

---

## 📞 Liên hệ Backend

Nếu backend chưa trả về field `progress`, hãy yêu cầu:

### API Endpoint: `GET /api/enrollment`

**Response mong muốn:**

```json
{
  "code": 1000,
  "result": [
    {
      "id": 1,
      "studentId": 3,
      "courseId": 1,
      "status": "ACTIVE",
      "enrolledAt": "2024-10-20T10:00:00+07:00",
      "progress": 65, // ← INTEGER từ 0-100
      "studentName": "Nguyễn Văn A", // Bonus: tên học viên
      "studentEmail": "student@email.com" // Bonus: email
    }
  ]
}
```

**Cách tính `progress`:**

- Có thể dựa vào số lessons đã hoàn thành
- Hoặc số quiz đã pass
- Hoặc kết hợp cả hai

---

## ✅ Checklist Debug

- [ ] Kiểm tra Network tab - API `/enrollment` trả về `progress`?
- [ ] Giá trị `progress` có phải số (0-100)?
- [ ] Console.log để xem giá trị thực tế
- [ ] Test component Progress với giá trị cố định
- [ ] Kiểm tra CSS không bị override
- [ ] Thử với nhiều giá trị khác nhau

---

**Lưu ý:** Hiện tại code đã handle trường hợp `progress` là `undefined` hoặc `null` bằng cách sử dụng `|| 0`, nên thanh sẽ hiển thị 0% thay vì bị lỗi.
