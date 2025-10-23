# ✅ ĐÃ FIX 3 VẤN ĐỀ!

## 🎯 TÓM TẮT

Đã fix **3 vấn đề** quan trọng trong hệ thống LMS:

1. ✅ **Hình ảnh khóa học không hiển thị đúng**
2. ✅ **Nút "Đăng ký" vẫn hiện khi đã enroll**
3. ✅ **Error message sai (TITLE_EXISTED thay vì ALREADY_ENROLLED)**

---

## 🐛 VẤN ĐỀ 1: Hình Ảnh Không Hiển Thị Đúng

### **Nguyên nhân:**

- Backend lưu image path như: `uploads/courses/course1.jpg`
- Frontend load image từ frontend's public folder thay vì backend URL
- Thiếu base URL của backend trong image path

### **Giải pháp:**

✅ Update `browse/page.tsx` để build full image URL:

```tsx
const imageUrl = course.img
  ? course.img.startsWith("http")
    ? course.img
    : `${
        process.env.NEXT_PUBLIC_LMS_API_URL?.replace("/api", "") ||
        "http://localhost:8083"
      }/${course.img}`
  : "/images/course-1.png";
```

**Giờ images sẽ load từ:**

- `http://localhost:8083/uploads/courses/course1.jpg` ✅

---

## 🐛 VẤN ĐỀ 2: Nút "Đăng ký" Vẫn Hiện Khi Đã Enroll

### **Nguyên nhân:**

- `EnrollButton` component chỉ dùng local state
- Không check enrollment status từ backend khi component mount
- Không có API endpoint để check enrollment

### **Giải pháp:**

#### **A. Backend: Thêm API endpoint**

✅ `EnrollmentController.java` - Line 89-106:

```java
@GetMapping("/check/{courseId}")
@PreAuthorize("hasRole('STUDENT')")
public ApiResponse<Boolean> checkEnrollment(
        @PathVariable Long courseId,
        @CurrentUserId Long currentUserId,
        @CurrentUser UserTokenInfo currentUser) {

    if (currentUser.getUserType() != UserType.STUDENT) {
        throw new AppException(ErroCode.STUDENT_ONLY);
    }

    boolean isEnrolled = enrollmentService.isStudentEnrolledInCourse(currentUserId, courseId);

    ApiResponse<Boolean> response = new ApiResponse<>();
    response.setResult(isEnrolled);
    return response;
}
```

#### **B. Frontend: Thêm Config**

✅ `config.ts`:

```typescript
enrollment: {
  // ... existing
  check: (courseId: number) => `/enrollment/check/${courseId}`,
}
```

#### **C. Frontend: Thêm API Method**

✅ `lms-api-client.ts`:

```typescript
async checkEnrollment(courseId: number) {
  return this.get<boolean>(`/enrollment/check/${courseId}`);
}
```

#### **D. Frontend: Thêm Hook**

✅ `useLms.ts` - `useCheckEnrollment`:

```typescript
export function useCheckEnrollment(
  courseId: number,
  options?: UseLmsQueryOptions
) {
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  // ... logic to check enrollment from backend
  return { isEnrolled, loading, error, checkEnrollment, refetch };
}
```

#### **E. Frontend: Update EnrollButton Component**

✅ `EnrollButton.tsx`:

```tsx
const { isEnrolled, checkEnrollment } = useCheckEnrollment(courseId);

useEffect(() => {
  checkEnrollment(); // Check on mount
}, [courseId]);

if (isEnrolled) {
  return <button disabled>✓ Đã đăng ký</button>;
}
```

**Kết quả:**

- Khi student đã enroll → Button hiện "✓ Đã đăng ký" (disabled) ✅
- Khi chưa enroll → Button hiện "📚 Đăng ký khóa học" ✅

---

## 🐛 VẤN ĐỀ 3: Error Message Sai

### **Nguyên nhân:**

- `EnrollmentService.java` Line 48 dùng sai error code:

```java
throw new AppException(ErroCode.TITLE_EXISTED); // ❌ SAI!
```

### **Giải pháp:**

✅ Update `EnrollmentService.java` - Line 48:

```java
throw new AppException(ErroCode.ALREADY_ENROLLED); // ✅ ĐÚNG!
```

**Error code `ALREADY_ENROLLED` đã có sẵn trong `ErroCode.java`:**

```java
ALREADY_ENROLLED(2108, "Đã đăng ký khóa học này rồi"),
```

**Kết quả:**

- Trước: "❌ Tiêu đề đã tồn tại" (confusing!)
- Sau: "⚠️ Đã đăng ký khóa học này rồi!" ✅

---

## 📊 TỔNG HỢP THAY ĐỔI

### **Backend Files:**

```
✏️ src/main/java/com/app/lms/service/EnrollmentService.java
   - Line 48: Đổi TITLE_EXISTED → ALREADY_ENROLLED

✏️ src/main/java/com/app/lms/controller/EnrollmentController.java
   - Line 89-106: Thêm endpoint /check/{courseId}
```

### **Frontend Files:**

```
✏️ src/lib/config.ts
   - Line 98: Thêm check: (courseId) => `/enrollment/check/${courseId}`

✏️ src/lib/lms-api-client.ts
   - Line 277-279: Thêm method checkEnrollment(courseId)

✏️ src/lib/hooks/useLms.ts
   - Line 294-320: Thêm hook useCheckEnrollment()

✏️ src/components/LMS/EnrollButton.tsx
   - Complete rewrite: Tích hợp useCheckEnrollment
   - Check enrollment status on mount
   - Show "✓ Đã đăng ký" khi enrolled

✏️ src/app/authorized/lms/app/student/browse/page.tsx
   - Line 155-223: Fix image URL (All courses tab)
   - Line 230-261: Fix image URL (Free courses tab)
   - Line 267-300: Fix image URL (Paid courses tab)
```

---

## 🚀 CÁCH TEST

### **Test 1: Hình ảnh**

1. Vào MySQL, thêm course có img:
   ```sql
   UPDATE courses SET img = 'uploads/courses/course1.jpg' WHERE id = 1;
   ```
2. Đặt file ảnh vào: `f:\DoAn\LMS\uploads\courses\course1.jpg`
3. Truy cập: `http://localhost:3000/authorized/lms/app/student/browse`
4. **Kết quả:** Thấy ảnh course hiển thị ✅

### **Test 2: Nút Đăng ký**

#### **Kịch bản A: Chưa enroll**

1. Login student chưa enroll course
2. Vào `/browse`
3. **Kết quả:** Button "📚 Đăng ký khóa học" ✅

#### **Kịch bản B: Đã enroll**

1. Enroll một course
2. Refresh page `/browse`
3. **Kết quả:** Button "✓ Đã đăng ký" (disabled) ✅

#### **Kịch bản C: Enroll lại**

1. Click "Đăng ký" trên course đã enroll
2. **Kết quả:** Alert "⚠️ Đã đăng ký khóa học này rồi!" ✅

### **Test 3: Error Message**

1. API call enroll course đã enrolled
2. **Trước:** Response error code 1002 "Tiêu đề đã tồn tại"
3. **Sau:** Response error code 2108 "Đã đăng ký khóa học này rồi" ✅

---

## 🔍 API ENDPOINTS MỚI

### **GET `/api/enrollment/check/{courseId}`**

**Mô tả:** Check xem student hiện tại đã enroll course chưa

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**

```json
{
  "code": 1000,
  "message": "Lấy dữ liệu thành công",
  "result": true
}
```

**Permissions:**

- Chỉ STUDENT
- Check enrollment của chính student đó (từ JWT)

**Use case:**

- Frontend check enrollment status trước khi hiển thị button
- Disable enroll button nếu đã enrolled
- Show/hide course actions dựa trên enrollment status

---

## 💡 TÀI LIỆU KỸ THUẬT

### **Image Loading Logic:**

```typescript
// 1. Check if image path exists
if (course.img) {
  // 2. Check if already full URL (starts with http)
  if (course.img.startsWith("http")) {
    return course.img; // Use as-is
  } else {
    // 3. Build full URL: backend_base + image_path
    return `http://localhost:8083/${course.img}`;
  }
} else {
  // 4. Fallback to placeholder
  return "/images/course-1.png";
}
```

### **Enrollment Check Flow:**

```
Component Mount
    ↓
useCheckEnrollment(courseId)
    ↓
lmsApiClient.checkEnrollment(courseId)
    ↓
GET /api/enrollment/check/{courseId}
    ↓
Backend: enrollmentService.isStudentEnrolledInCourse()
    ↓
Response: { result: true/false }
    ↓
Update State: setIsEnrolled(result)
    ↓
Render: Show "✓ Đã đăng ký" or "📚 Đăng ký khóa học"
```

---

## ✅ CHECKLIST

Kiểm tra đã fix thành công:

- [x] Backend compile không lỗi
- [x] Frontend build không lỗi
- [x] No linter errors
- [x] Image hiển thị từ backend
- [x] Enroll button check status on mount
- [x] Button disabled khi đã enroll
- [x] Error message đúng (ALREADY_ENROLLED)
- [x] API endpoint `/check/{courseId}` hoạt động
- [x] Hook `useCheckEnrollment` hoạt động

---

## 🎊 KẾT LUẬN

**Tất cả 3 vấn đề đã được fix hoàn toàn!**

1. ✅ Images load từ backend URL đúng
2. ✅ Enroll button check status và hiển thị đúng
3. ✅ Error message rõ ràng và chính xác

**Next steps:**

- Test thoroughly với các scenarios khác
- Add more error handling nếu cần
- Consider caching enrollment status

---

**Updated:** $(date)
**Status:** ✅ COMPLETED
