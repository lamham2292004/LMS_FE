# 🔧 Yêu cầu Backend API - LMS

## 📋 Tổng quan

Document này liệt kê các yêu cầu cần thiết cho Backend API để hỗ trợ đầy đủ các chức năng Frontend đã được implement.

---

## ✅ Đã hoàn thành Frontend

### 1. Tạo Quiz/Bài kiểm tra ✅

**File:** `src/app/authorized/lms/app/lecturer/courses/[id]/quizzes/new/page.tsx`

**Chức năng:**

- Tạo bài kiểm tra với cài đặt (tiêu đề, mô tả, thời gian, điểm đạt, số lần làm)
- Thêm nhiều câu hỏi với các loại: MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER
- Lưu câu hỏi và đáp án vào backend

**API đang sử dụng:**

- ✅ `POST /api/quiz` - Tạo quiz
- ✅ `POST /api/question` - Tạo câu hỏi
- ✅ `POST /api/answerOption` - Tạo đáp án

**Trạng thái:** ✅ Frontend đã hoàn thành và kết nối với API

---

### 2. Hiển thị danh sách học viên với STT ✅

**File:** `src/app/authorized/lms/app/lecturer/courses/[id]/page.tsx`

**Chức năng:**

- Hiển thị danh sách học viên đã đăng ký khóa học
- Hiển thị STT đăng ký (số thứ tự)
- Hiển thị tiến độ học tập
- Hiển thị trạng thái (Đang học, Hoàn thành, Đã hủy)

**Trạng thái:** ✅ Frontend đã hoàn thành với UI cải tiến

---

## ⚠️ Yêu cầu Backend cần bổ sung

### 1. Thêm thông tin học viên vào EnrollmentResponse

**Vấn đề hiện tại:**

- `EnrollmentResponse` chỉ trả về `studentId` (number)
- Frontend không thể hiển thị tên và email của học viên

**Giải pháp:**

#### Option 1: Thêm field vào EnrollmentResponse (Khuyến nghị ⭐)

**Backend cần update:**

```java
// EnrollmentResponse.java
public class EnrollmentResponse {
    private Long id;
    private Long studentId;
    private String studentName;      // ✅ THÊM FIELD NÀY
    private String studentEmail;     // ✅ THÊM FIELD NÀY (optional)
    private Long courseId;
    private String courseName;
    private String courseImg;
    private EnrollmentStatus status;
    private LocalDateTime enrolledAt;
    private Integer progress;

    // getters and setters...
}
```

**Khi map từ Entity sang Response:**

```java
EnrollmentResponse response = new EnrollmentResponse();
response.setId(enrollment.getId());
response.setStudentId(enrollment.getStudentId());

// Join với User/Student entity để lấy thông tin
User student = enrollment.getStudent(); // or userRepository.findById(enrollment.getStudentId())
response.setStudentName(student.getFullName());    // ✅ SET FIELD MỚI
response.setStudentEmail(student.getEmail());      // ✅ SET FIELD MỚI

response.setCourseId(enrollment.getCourseId());
// ... other fields
```

**Frontend đã sẵn sàng:**

```typescript
// src/lib/lms-api-client.ts
export interface EnrollmentResponse {
  id: number;
  studentId: number;
  studentName?: string; // ✅ Đã thêm
  studentEmail?: string; // ✅ Đã thêm
  courseId: number;
  courseName: string;
  courseImg?: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  progress?: number;
}
```

**Display logic đã implement:**

```tsx
// Tự động hiển thị tên nếu có, nếu không thì hiển thị ID
{
  enrollment.studentName || `Học viên #${enrollment.studentId}`;
}

// Hiển thị email nếu có
{
  enrollment.studentEmail && <span>{enrollment.studentEmail}</span>;
}
```

---

#### Option 2: Tạo endpoint mới để lấy thông tin user

**Nếu không muốn thay đổi EnrollmentResponse, có thể tạo endpoint mới:**

```java
// UserController.java or StudentController.java

@GetMapping("/api/user/{userId}")
public ResponseEntity<ApiResponse<UserInfo>> getUserById(@PathVariable Long userId) {
    // Implementation
}

@GetMapping("/api/student/{studentId}")
public ResponseEntity<ApiResponse<StudentInfo>> getStudentById(@PathVariable Long studentId) {
    // Implementation
}
```

**Response Model:**

```java
public class UserInfo {
    private Long id;
    private Long accountId;
    private String fullName;
    private String email;
    private UserType userType;
    private String studentCode;
    private String phone;
    private String address;
    // ... other fields
}

public class StudentInfo {
    private Long id;
    private Long accountId;
    private String fullName;
    private String email;
    private String studentCode;
    private Long classId;
    private String className;
    private Long departmentId;
    private String departmentName;
    // ... other fields
}
```

**Frontend đã sẵn sàng:**

```typescript
// src/lib/lms-api-client.ts - Đã thêm methods
async getUserById(userId: number) {
  return this.get<UserInfo>(`/user/${userId}`);
}

async getStudentById(studentId: number) {
  return this.get<StudentInfo>(`/student/${studentId}`);
}
```

**Lưu ý:** Option 2 sẽ yêu cầu nhiều API calls hơn (N+1 problem), không hiệu quả bằng Option 1.

---

## 🎯 Khuyến nghị

**Ưu tiên thực hiện Option 1:**

1. ✅ Hiệu quả hơn (1 query thay vì N+1)
2. ✅ Frontend đã sẵn sàng nhận data
3. ✅ Tương đồng với `QuizResultResponse` đã có `studentName`
4. ✅ Dễ maintain

**Implementation Steps:**

1. Update `EnrollmentResponse` class thêm 2 fields: `studentName`, `studentEmail`
2. Update query/mapper để join với User/Student table
3. Set giá trị cho 2 fields mới khi tạo response
4. Test API endpoint `/api/enrollment`
5. Kiểm tra Frontend tự động hiển thị tên học viên

---

## 📝 Testing

Sau khi backend update:

1. **Kiểm tra API Response:**

```bash
GET http://localhost:8083/api/enrollment

Response:
{
  "code": 1000,
  "result": [
    {
      "id": 1,
      "studentId": 5,
      "studentName": "Nguyễn Văn A",    // ✅ Có field này
      "studentEmail": "student@email.com", // ✅ Có field này
      "courseId": 2,
      "courseName": "HTML",
      "status": "ACTIVE",
      "enrolledAt": "2025-10-17T10:00:00",
      "progress": 65
    }
  ]
}
```

2. **Kiểm tra Frontend:**

- Mở trang: `/authorized/lms/app/lecturer/courses/[id]`
- Chọn tab "Học viên"
- Kiểm tra hiển thị tên học viên thay vì "Học viên #5"

---

## 🚀 Status

| Chức năng             | Frontend         | Backend         | Ghi chú                                         |
| --------------------- | ---------------- | --------------- | ----------------------------------------------- |
| Tạo Quiz              | ✅ Hoàn thành    | ✅ API sẵn sàng | Đã test thành công                              |
| Hiển thị STT học viên | ✅ Hoàn thành    | ✅ Sẵn sàng     | UI đã cải thiện                                 |
| Hiển thị tên học viên | ✅ Sẵn sàng      | ⚠️ Cần update   | Cần thêm `studentName` vào `EnrollmentResponse` |
| API lấy user theo ID  | ✅ Method có sẵn | ⚠️ Chưa có      | Optional - không bắt buộc nếu làm Option 1      |

---

## 📞 Contact

Nếu có câu hỏi về implementation, vui lòng liên hệ Frontend team hoặc xem code tại:

- `src/lib/lms-api-client.ts` (Line 603-614)
- `src/app/authorized/lms/app/lecturer/courses/[id]/page.tsx` (Line 188-283)
