# ✅ STUDENT QUIZ RESULTS - BACKEND INTEGRATION

## 🎯 Vấn đề đã fix

**Triệu chứng:**

- Học sinh không xem được bài kiểm tra đã làm
- Trang `/authorized/lms/app/student/tests` dùng mock data

**Nguyên nhân:**

- Chưa tích hợp API backend
- Chưa có hook để lấy quiz results của student

---

## 🔧 ĐÃ THÊM MỚI

### 1. Backend API Method

**File:** `src/lib/lms-api-client.ts`

```typescript
// Get all quiz results for current student (across all courses)
async getMyAllQuizResults() {
  return this.get<QuizResultResponse[]>(`/quiz-results/my-all-results`);
}
```

**Backend endpoint:**

```
GET /api/quiz-results/my-all-results
Authorization: Bearer {token}
```

---

### 2. React Hook

**File:** `src/lib/hooks/useLms.ts`

```typescript
export function useMyAllQuizResults(options?: UseLmsQueryOptions) {
  const [results, setResults] = useState<QuizResultResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getMyAllQuizResults();
      setResults(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { results, loading, error, fetchResults, refetch: fetchResults };
}
```

---

### 3. Updated Student Tests Page

**File:** `src/app/authorized/lms/app/student/tests/page.tsx`

**Changes:**

- ✅ Replaced mock data with `useMyAllQuizResults` hook
- ✅ Added loading state
- ✅ Added error handling
- ✅ Added refresh button
- ✅ Adjusted UI to match API response format

---

## 📊 API Response Format

### QuizResultResponse Interface:

```typescript
interface QuizResultResponse {
  id: number;
  quizId: number;
  quizTitle: string;
  studentId: number;
  studentName: string;
  score: number; // percentage (0-100)
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number; // minutes
  attemptNumber: number;
  isPassed: boolean;
  takenAt: string; // ISO date string
  feedback?: string;
}
```

---

## 🎨 UI Components

### Stats Cards:

```
┌─────────────────────┐ ┌─────────────────────┐
│ Tổng số bài: 12     │ │ Đạt yêu cầu: 10     │
└─────────────────────┘ └─────────────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ Chưa đạt: 2         │ │ Điểm TB: 85%        │
└─────────────────────┘ └─────────────────────┘
```

### Filters:

```
[Tất cả (12)] [Đạt (10)] [Chưa đạt (2)]
```

### Result Cards:

```
┌─────────────────────────────────────────────┐
│ React Hooks Quiz          [Đạt] Badge      │
│ Lần thử 1 • Student Name                    │
├─────────────────────────────────────────────┤
│ Điểm số: 85% (17/20 câu đúng)              │
│ [Progress bar]                              │
│                                             │
│ ⏱ 25 phút  📅 15 tháng 1, 2024, 10:30     │
│                                             │
│ [Xem chi tiết]                              │
└─────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

```
1. Student navigates to /authorized/lms/app/student/tests
   ↓
2. Page loads → useMyAllQuizResults hook
   ↓
3. Hook calls lmsApiClient.getMyAllQuizResults()
   ↓
4. GET /api/quiz-results/my-all-results (with token)
   ↓
5. Backend returns QuizResultResponse[]
   ↓
6. Hook sets results state
   ↓
7. Page renders:
   - Stats cards (total, passed, failed, avg)
   - Filter tabs
   - Result cards
```

---

## 🧪 Testing Steps

### 1. Check API Endpoint (Backend)

**Method 1 - Console:**

```javascript
// Login first, then:
const response = await fetch(
  "http://localhost:8083/api/quiz-results/my-all-results",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
  }
);
const data = await response.json();
console.log("Quiz Results:", data);
```

**Method 2 - Postman:**

```
GET http://localhost:8083/api/quiz-results/my-all-results
Headers:
  Authorization: Bearer {your_token}
```

---

### 2. Test Frontend

1. **Login as student**

2. **Navigate to:** `/authorized/lms/app/student/tests`

3. **Expected:**

   - Loading spinner first
   - Then stats cards with real data
   - List of quiz results

4. **If error:**
   - Check console for API errors
   - Check Network tab: Status 401? 403? 500?

---

### 3. Test Filters

```
Click "Tất cả" → Show all results
Click "Đạt" → Only show results where isPassed = true
Click "Chưa đạt" → Only show results where isPassed = false
```

---

### 4. Test Refresh

```
Click "Làm mới" button
→ Should refetch data
→ Button should show loading spinner
```

---

## 🐛 Troubleshooting

### Issue 1: "Chưa có bài kiểm tra nào"

**Possible causes:**

1. Student chưa làm quiz nào
2. API trả về mảng rỗng
3. Backend chưa có data

**Check:**

```javascript
// Console
const response = await fetch(
  "http://localhost:8083/api/quiz-results/my-all-results",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
  }
);
console.log(await response.json());
```

---

### Issue 2: 401 Unauthorized

**Cause:** Token missing or expired

**Fix:**

1. Login lại
2. Check token exists:

```javascript
console.log("Token:", localStorage.getItem("auth_token"));
```

---

### Issue 3: 404 Not Found

**Cause:** Backend endpoint chưa có

**Fix:**
→ Cần implement backend endpoint:

```java
// Backend (Spring Boot)
@GetMapping("/my-all-results")
public ResponseEntity<ApiResponse<List<QuizResultResponse>>> getMyAllQuizResults() {
    // Get current user ID from JWT
    // Fetch all quiz results for this user
    // Return results
}
```

---

### Issue 4: Data format mismatch

**Symptoms:**

- Fields undefined
- Date không hiển thị
- Score = NaN

**Check response format:**

```javascript
// Console
console.log("First result:", results[0]);
console.log("Keys:", Object.keys(results[0] || {}));
```

**Expected fields:**

```json
{
  "id": 1,
  "quizId": 10,
  "quizTitle": "React Hooks Quiz",
  "studentId": 2,
  "studentName": "Student Name",
  "score": 85,
  "totalQuestions": 20,
  "correctAnswers": 17,
  "timeTaken": 25,
  "attemptNumber": 1,
  "isPassed": true,
  "takenAt": "2024-01-15T10:30:00",
  "feedback": "Good job!"
}
```

---

## 📝 Backend Requirements

### Endpoint cần implement:

```java
@RestController
@RequestMapping("/api/quiz-results")
public class QuizResultController {

    @GetMapping("/my-all-results")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<QuizResultResponse>>> getMyAllQuizResults(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long studentId = getCurrentUserId(userDetails);
        List<QuizResult> results = quizResultService.findByStudentId(studentId);
        List<QuizResultResponse> responses = results.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(
            ApiResponse.success(responses)
        );
    }
}
```

---

## ✅ Checklist

Frontend:

- [x] Added `getMyAllQuizResults()` to API client
- [x] Created `useMyAllQuizResults()` hook
- [x] Updated student tests page
- [x] Added loading/error states
- [x] Added refresh button
- [x] Adjusted UI for API format

Backend (TODO):

- [ ] Implement `/quiz-results/my-all-results` endpoint
- [ ] Test endpoint with Postman
- [ ] Verify response format matches `QuizResultResponse`

---

## 🎉 Result

Sau khi backend implement endpoint, học sinh có thể:

- ✅ Xem tất cả bài kiểm tra đã làm
- ✅ Xem điểm số và kết quả
- ✅ Filter theo trạng thái (đạt/chưa đạt)
- ✅ Xem chi tiết từng bài (link to review page)
- ✅ Refresh để cập nhật data

---

Created: 2025-01-21
Status: ✅ Frontend Complete (Backend Pending)
Issue: Student can't view completed quiz results
Solution: Integrated backend API for quiz results
