# 🎉 HOÀN THÀNH TÍCH HỢP CHI TIẾT HỌC VIÊN

## ✅ Vấn đề đã fix

**Triệu chứng:**

- Trang xem chi tiết học viên trong quản lý khóa học chưa hoạt động
- Đang sử dụng dữ liệu tĩnh (hardcoded) thay vì API thực

**Nguyên nhân:**

- Chưa có API client method để lấy quiz results của một học viên cụ thể
- Chưa có hook để tổng hợp dữ liệu enrollment và quiz results
- Trang chi tiết học viên chưa được tích hợp với backend

---

## 🔧 ĐÃ THÊM MỚI

### 1. API Client Method

**File:** `src/lib/lms-api-client.ts`

```typescript
// Get quiz results of a specific student in a course
async getStudentCourseResults(courseId: number, studentId: number) {
  // Get all enrollments to verify student is enrolled
  const enrollments = await this.getCourseEnrollments(courseId);
  const enrollment = enrollments.result?.find((e: EnrollmentResponse) => e.studentId === studentId);

  if (!enrollment) {
    throw new Error('Student not enrolled in this course');
  }

  // Get all quiz results for quizzes in this course
  const quizzes = await this.getQuizzesByCourse(courseId);
  const allResults: QuizResultResponse[] = [];

  if (quizzes.result && Array.isArray(quizzes.result)) {
    for (const quiz of quizzes.result) {
      const results = await this.getAllQuizResults(quiz.id);
      if (results.result && Array.isArray(results.result)) {
        const studentResults = results.result.filter((r: QuizResultResponse) => r.studentId === studentId);
        allResults.push(...studentResults);
      }
    }
  }

  return {
    code: 1000,
    result: allResults
  };
}
```

**Chức năng:**

- Kiểm tra học viên đã đăng ký khóa học chưa
- Lấy tất cả quiz results của học viên trong khóa học đó
- Lọc và trả về kết quả theo studentId

---

### 2. React Hook mới

**File:** `src/lib/hooks/useStudentEnrollmentDetail.ts`

```typescript
export interface StudentEnrollmentDetail {
  enrollment: EnrollmentResponse | null;
  quizResults: QuizResultResponse[];
  stats: {
    totalQuizzes: number;
    completedQuizzes: number;
    averageScore: number;
    passedQuizzes: number;
    failedQuizzes: number;
    totalAttempts: number;
  };
}

export function useStudentEnrollmentDetail(courseId: number, studentId: number) {
  const [data, setData] = useState<StudentEnrollmentDetail>({...});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentDetail = async () => {
    // 1. Get enrollment
    // 2. Get quiz results
    // 3. Calculate stats
  };

  return { data, loading, error, refetch };
}
```

**Tính năng:**

- ✅ Lấy thông tin enrollment của học viên
- ✅ Lấy tất cả quiz results trong khóa học
- ✅ Tính toán thống kê tự động:
  - Tổng số bài kiểm tra
  - Số bài đã hoàn thành
  - Điểm trung bình
  - Số bài đạt/chưa đạt
  - Tổng số lần làm bài

---

### 3. Cập nhật trang chi tiết học viên

**File:** `src/app/authorized/lms/app/lecturer/courses/[id]/students/[studentId]/page.tsx`

**Thay đổi chính:**

#### a. Thay dữ liệu tĩnh bằng hook

```typescript
// TRƯỚC
const studentData = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  // ... hardcoded data
};

// SAU
const { data, loading, error, refetch } = useStudentEnrollmentDetail(
  courseId,
  studentId
);
const { enrollment, quizResults, stats } = data;
```

#### b. Thêm Loading State

```tsx
if (loading) {
  return (
    <div className="flex flex-col">
      <Header title="Chi tiết học viên" />
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p>Đang tải thông tin học viên...</p>
      </div>
    </div>
  );
}
```

#### c. Thêm Error Handling

```tsx
if (error || !enrollment) {
  return (
    <Card className="border-destructive">
      <CardContent className="p-6 flex items-center gap-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive">Lỗi tải dữ liệu</h3>
          <p>{error || "Không tìm thấy thông tin học viên"}</p>
        </div>
        <Button onClick={refetch}>Thử lại</Button>
      </CardContent>
    </Card>
  );
}
```

#### d. Hiển thị thông tin thực từ API

**Thông tin học viên:**

```tsx
<h1 className="text-2xl font-bold">
  {enrollment.studentName || `Học viên #${studentId}`}
</h1>;
{
  enrollment.studentEmail && (
    <div className="flex items-center gap-2">
      <Mail className="h-4 w-4" />
      {enrollment.studentEmail}
    </div>
  );
}
<Badge variant={enrollment.status === "ACTIVE" ? "default" : "secondary"}>
  {enrollment.status === "ACTIVE"
    ? "Đang học"
    : enrollment.status === "COMPLETED"
    ? "Hoàn thành"
    : "Đã hủy"}
</Badge>;
```

**Thống kê:**

- Tiến độ: `{enrollment.progress || 0}%`
- Bài kiểm tra: `{stats.completedQuizzes}/{stats.totalQuizzes}`
- Tổng lượt làm: `{stats.totalAttempts}`
- Điểm TB: `{stats.averageScore.toFixed(0)}`
- Đạt/Chưa đạt: `{stats.passedQuizzes} | {stats.failedQuizzes}`

#### e. Hiển thị kết quả bài kiểm tra

**Tính năng mới:**

- ✅ Hiển thị kết quả tốt nhất cho mỗi bài kiểm tra
- ✅ Hiển thị số lần làm bài
- ✅ Hiển thị lịch sử tất cả các lần làm bài
- ✅ Link đến trang chi tiết kết quả quiz
- ✅ Progress bar theo điểm số
- ✅ Badge đạt/chưa đạt

```tsx
{
  bestQuizResults.map((quizResult) => (
    <div key={quizResult.quizId} className="rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <h3>{quizResult.quizTitle}</h3>
        <Badge variant={quizResult.isPassed ? "default" : "destructive"}>
          {quizResult.isPassed ? "Đạt" : "Chưa đạt"}
        </Badge>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4">
        <div>Điểm cao nhất: {quizResult.score.toFixed(1)}/100</div>
        <div>Số lần làm: {quizResult.attempts}</div>
        <div>
          Câu đúng: {quizResult.correctAnswers}/{quizResult.totalQuestions}
        </div>
        <div>Lần cuối: {takenDate}</div>
      </div>

      <Progress value={quizResult.score} />

      {/* Lịch sử làm bài */}
      {quizResult.allAttempts.length > 1 && (
        <div className="mt-4 pt-4 border-t">
          <p className="font-semibold mb-2">Lịch sử làm bài:</p>
          <div className="grid grid-cols-4 gap-2">
            {quizResult.allAttempts.map((attempt, idx) => (
              <div className="p-2 rounded bg-muted">
                <p>Lần {idx + 1}</p>
                <p>{attempt.score.toFixed(1)} điểm</p>
                <p>{format(new Date(attempt.takenAt), "dd/MM HH:mm")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button asChild>
        <Link
          href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/${quizResult.quizId}/results`}
        >
          Xem chi tiết
        </Link>
      </Button>
    </div>
  ));
}
```

#### f. Empty State

```tsx
{
  bestQuizResults.length === 0 && (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">
        Học viên chưa làm bài kiểm tra nào
      </p>
    </div>
  );
}
```

---

## 📊 Luồng dữ liệu

```
1. User truy cập /authorized/lms/app/lecturer/courses/[id]/students/[studentId]
   ↓
2. useStudentEnrollmentDetail hook được gọi
   ↓
3. Hook gọi API:
   - getCourseEnrollments(courseId) → Tìm enrollment của studentId
   - getStudentCourseResults(courseId, studentId) → Lấy quiz results
   - getQuizzesByCourse(courseId) → Lấy danh sách quizzes
   ↓
4. Hook tính toán stats:
   - completedQuizzes = unique quiz IDs từ results
   - averageScore = average của tất cả results
   - passedQuizzes/failedQuizzes = đếm theo best result của mỗi quiz
   ↓
5. Component nhận data và render:
   - Loading state → Loader
   - Error state → Error card với retry button
   - Success state → Hiển thị đầy đủ thông tin
```

---

## 🎯 API Endpoints được sử dụng

| Endpoint                                      | Method | Mục đích                             |
| --------------------------------------------- | ------ | ------------------------------------ |
| `/api/enrollment`                             | GET    | Lấy tất cả enrollments               |
| `/api/quiz-results/quiz/{quizId}/all-results` | GET    | Lấy tất cả results của một quiz      |
| `/api/quiz/course/{courseId}`                 | GET    | Lấy danh sách quizzes trong khóa học |

---

## ✨ Tính năng mới

1. **Xem thông tin học viên:**

   - Tên học viên (hoặc ID nếu backend chưa trả về)
   - Email (nếu có)
   - Ngày đăng ký
   - Trạng thái: Đang học/Hoàn thành/Đã hủy

2. **Thống kê tổng quan:**

   - Tiến độ học tập (%)
   - Số bài kiểm tra đã làm / tổng số
   - Tổng số lần làm bài
   - Điểm trung bình
   - Số bài đạt / chưa đạt

3. **Chi tiết kết quả quiz:**

   - Hiển thị tất cả bài kiểm tra đã làm
   - Điểm cao nhất cho mỗi bài
   - Số lần làm bài
   - Câu đúng / tổng câu
   - Lần làm gần nhất
   - Lịch sử tất cả các lần làm
   - Link xem chi tiết kết quả

4. **UX Improvements:**
   - Loading state với spinner
   - Error handling với retry button
   - Refresh button để làm mới dữ liệu
   - Empty state khi chưa có kết quả
   - Progress bar trực quan
   - Badge màu sắc theo trạng thái
   - Responsive layout

---

## 🧪 Test Cases

### Test 1: Học viên đã làm bài kiểm tra

- ✅ Hiển thị đầy đủ thông tin enrollment
- ✅ Hiển thị thống kê chính xác
- ✅ Hiển thị danh sách kết quả quiz
- ✅ Hiển thị lịch sử làm bài nếu > 1 lần

### Test 2: Học viên chưa làm bài nào

- ✅ Hiển thị thông tin enrollment
- ✅ Stats hiển thị 0/X
- ✅ Hiển thị empty state

### Test 3: Học viên không tồn tại

- ✅ Hiển thị error message
- ✅ Có nút retry
- ✅ Có nút quay lại

### Test 4: Loading state

- ✅ Hiển thị spinner
- ✅ Hiển thị message "Đang tải..."

---

## 📝 Lưu ý cho Backend

**Để cải thiện UX, backend nên:**

1. Thêm field `studentName` vào `EnrollmentResponse`:

```json
{
  "id": 1,
  "studentId": 3,
  "studentName": "Nguyễn Văn A", // ← Cần thêm
  "studentEmail": "student@email.com", // ← Cần thêm
  "courseId": 1,
  "status": "ACTIVE",
  "enrolledAt": "2024-10-20T10:00:00+07:00",
  "progress": 65 // ← Đã có
}
```

2. Thêm endpoint riêng để lấy quiz results của một học viên:

```
GET /api/quiz-results/student/{studentId}/course/{courseId}
```

Hiện tại đang phải gọi nhiều API và filter phía frontend, không tối ưu cho performance.

---

## 🎉 Kết quả

✅ Trang chi tiết học viên đã **hoạt động hoàn toàn** với dữ liệu thật từ backend
✅ Hiển thị **đầy đủ thông tin** về enrollment và quiz results
✅ **Loading state** và **error handling** hoàn chỉnh
✅ **UI/UX** trực quan và responsive
✅ **Không có linter errors**

---

**Ngày hoàn thành:** 21/10/2024
**Version:** 1.0.0
