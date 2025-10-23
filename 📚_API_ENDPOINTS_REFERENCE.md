# 📚 TÀI LIỆU THAM KHẢO API ENDPOINTS - LMS SYSTEM

## 🌐 Base URL

```
Production: http://localhost:8083/api
Development: http://localhost:8083/api
```

---

## 🔐 AUTHENTICATION

Tất cả API (trừ public APIs) đều yêu cầu JWT token trong header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📂 1. CATEGORY APIS

### 1.1 Get All Categories (Public)

```http
GET /api/category
```

**Response:**

```json
{
  "code": 1000,
  "result": [
    {
      "id": 1,
      "name": "Programming",
      "description": "Programming courses",
      "createdAt": "2024-10-20T10:00:00+07:00",
      "updatedAt": "2024-10-20T10:00:00+07:00",
      "courses": []
    }
  ]
}
```

### 1.2 Get Category By ID (Public)

```http
GET /api/category/{categoryId}
```

### 1.3 Create Category (LECTURER+)

```http
POST /api/category/createCategory
Content-Type: application/json

{
  "name": "Web Development",
  "description": "Web development courses"
}
```

### 1.4 Update Category (LECTURER+)

```http
PUT /api/category/{categoryId}
Content-Type: application/json

{
  "name": "Advanced Web Development",
  "description": "Updated description"
}
```

### 1.5 Delete Category (ADMIN)

```http
DELETE /api/category/{categoryId}
```

---

## 📚 2. COURSE APIS

### 2.1 Get All Courses (Public - Only APPROVED)

```http
GET /api/course
```

**Note:** Chỉ trả về courses có `approvalStatus = APPROVED`

### 2.2 Get Course By ID

```http
GET /api/course/{courseId}
Authorization: Bearer <TOKEN>
```

**Authorization:**

- ADMIN/LECTURER: Xem tất cả
- STUDENT: Chỉ xem courses đã enrolled

### 2.3 Get Lecturer's Courses (LECTURER)

```http
GET /api/course/lecturer/my-courses
Authorization: Bearer <LECTURER_TOKEN>
```

**Response:** Tất cả courses của lecturer (bao gồm PENDING, APPROVED, REJECTED)

### 2.4 Get All Courses For Admin (ADMIN)

```http
GET /api/course/admin/all
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:** Tất cả courses trong hệ thống

### 2.5 Get Pending Courses (ADMIN)

```http
GET /api/course/admin/pending
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:** Chỉ courses có `approvalStatus = PENDING`

### 2.6 Create Course (LECTURER+)

```http
POST /api/course/createCourse
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- course: {
    "title": "React Advanced",
    "description": "Learn React in depth",
    "price": 199,
    "categoryId": 1,
    "status": "UPCOMING",
    "startTime": "2024-11-01T09:00:00+07:00",
    "endTime": "2024-12-31T23:59:00+07:00"
  }
- file: [course_image.jpg]
```

**Response:**

```json
{
  "code": 1000,
  "message": "Khóa học đã được tạo và đang chờ phê duyệt từ Admin",
  "result": {
    "id": 1,
    "title": "React Advanced",
    "approvalStatus": "PENDING",
    "teacherId": 2,
    "img": "/uploads/courses/1729389600000_image.jpg"
    // ...
  }
}
```

### 2.7 Update Course (Owner or ADMIN)

```http
PUT /api/course/updateCourse/{courseId}
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- course: {
    "title": "React Advanced - Updated",
    "description": "Updated description",
    "price": 249,
    "status": "OPEN"
  }
- file: [new_image.jpg] (optional)
```

**Note:**

- Nếu là LECTURER sửa course đã APPROVED → chuyển về PENDING
- Nếu là ADMIN sửa → giữ nguyên APPROVED

### 2.8 Approve/Reject Course (ADMIN)

```http
POST /api/course/{courseId}/approve
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

# Approve
{
  "approvalStatus": "APPROVED"
}

# Reject
{
  "approvalStatus": "REJECTED",
  "rejectionReason": "Nội dung không phù hợp"
}
```

### 2.9 Delete Course (ADMIN)

```http
DELETE /api/course/{courseId}
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 📖 3. LESSON APIS

### 3.1 Get All Lessons (LECTURER+)

```http
GET /api/lesson
Authorization: Bearer <TOKEN>
```

### 3.2 Get Lesson By ID

```http
GET /api/lesson/{lessonId}
Authorization: Bearer <TOKEN>
```

**Authorization:**

- ADMIN/LECTURER: Xem tất cả
- STUDENT: Chỉ xem lessons của courses đã enrolled

### 3.3 Create Lesson (LECTURER+)

```http
POST /api/lesson/createLesson
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- lesson: {
    "courseId": 1,
    "title": "Introduction to React",
    "description": "Learn React basics",
    "orderIndex": 1,
    "duration": 45,
    "status": "OPEN"
  }
- video: [lesson_video.mp4] (optional)
```

### 3.4 Update Lesson (Owner or ADMIN)

```http
PUT /api/lesson/updateLesson/{lessonId}
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- lesson: {
    "title": "Introduction to React - Updated",
    "description": "Updated description",
    "orderIndex": 1,
    "duration": 50,
    "status": "OPEN"
  }
- video: [new_video.mp4] (optional)
```

### 3.5 Delete Lesson (ADMIN)

```http
DELETE /api/lesson/{lessonId}
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 🎯 4. QUIZ APIS

### 4.1 Get All Quizzes (LECTURER+)

```http
GET /api/quiz
Authorization: Bearer <TOKEN>
```

### 4.2 Get Quiz By ID

```http
GET /api/quiz/{quizId}
Authorization: Bearer <TOKEN>
```

### 4.3 Get Quizzes By Lesson

```http
GET /api/quiz/lesson/{lessonId}
Authorization: Bearer <TOKEN>
```

### 4.4 Get Quizzes By Course

```http
GET /api/quiz/course/{courseId}
Authorization: Bearer <TOKEN>
```

### 4.5 Create Quiz (LECTURER+)

```http
POST /api/quiz
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "lessonId": 1,
  "title": "React Basics Quiz",
  "description": "Test your React knowledge",
  "timeLimit": 30,
  "maxAttempts": 3,
  "passScore": 70.0
}
```

### 4.6 Update Quiz (Owner or ADMIN)

```http
PUT /api/quiz/{quizId}
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "React Basics Quiz - Updated",
  "timeLimit": 45,
  "passScore": 75.0
}
```

### 4.7 Delete Quiz (ADMIN)

```http
DELETE /api/quiz/{quizId}
Authorization: Bearer <ADMIN_TOKEN>
```

---

## ❓ 5. QUESTION APIS

### 5.1 Get Questions By Quiz

```http
GET /api/question/quiz/{quizId}
Authorization: Bearer <TOKEN>
```

### 5.2 Create Question (LECTURER+)

```http
POST /api/question
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "quizId": 1,
  "questionText": "What is React?",
  "questionType": "MULTIPLE_CHOICE",
  "points": 10.0,
  "orderIndex": 1
}
```

**Question Types:**

- `MULTIPLE_CHOICE`
- `TRUE_FALSE`
- `SHORT_ANSWER`

### 5.3 Update Question (Owner or ADMIN)

```http
PUT /api/question/{questionId}
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "questionText": "What is React.js?",
  "points": 15.0
}
```

### 5.4 Delete Question (ADMIN)

```http
DELETE /api/question/{questionId}
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 💡 6. ANSWER OPTION APIS

### 6.1 Get Answer Options By Question

```http
GET /api/answerOption/question/{questionId}
Authorization: Bearer <TOKEN>
```

### 6.2 Create Answer Option (LECTURER+)

```http
POST /api/answerOption
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "questionId": 1,
  "answerText": "A JavaScript library",
  "isCorrect": true,
  "orderIndex": 1
}
```

### 6.3 Update Answer Option (Owner or ADMIN)

```http
PUT /api/answerOption/{optionId}
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "answerText": "A JavaScript library for building UIs",
  "isCorrect": true
}
```

### 6.4 Delete Answer Option (ADMIN)

```http
DELETE /api/answerOption/{optionId}
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 📝 7. ENROLLMENT APIS

### 7.1 Student Self-Enroll (STUDENT)

```http
POST /api/enrollment/enroll
Authorization: Bearer <STUDENT_TOKEN>
Content-Type: application/json

{
  "courseId": 1
}
```

**Response:**

```json
{
  "code": 1000,
  "result": {
    "id": 1,
    "studentId": 3,
    "courseId": 1,
    "status": "ACTIVE",
    "enrolledAt": "2024-10-20T10:00:00+07:00"
  }
}
```

### 7.2 Get My Enrollments (STUDENT)

```http
GET /api/enrollment/my-enrollments
Authorization: Bearer <STUDENT_TOKEN>
```

### 7.3 Get All Enrollments (LECTURER+)

```http
GET /api/enrollment
Authorization: Bearer <TOKEN>
```

### 7.4 Create Enrollment (LECTURER+)

```http
POST /api/enrollment/createEnrollment
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "studentId": 3,
  "courseId": 1,
  "status": "ACTIVE"
}
```

### 7.5 Update Enrollment (LECTURER+)

```http
PUT /api/enrollment/{enrollmentId}
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

**Enrollment Status:**

- `ACTIVE`
- `COMPLETED`
- `CANCELLED`

### 7.6 Delete Enrollment (ADMIN)

```http
DELETE /api/enrollment/{enrollmentId}
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 📊 8. QUIZ RESULT APIS

### 8.1 Submit Quiz (STUDENT)

```http
POST /api/quiz-results/submit
Authorization: Bearer <STUDENT_TOKEN>
Content-Type: application/json

{
  "quizId": 1,
  "answers": {
    "1": "1",  // questionId: answerOptionId
    "2": "4"
  },
  "timeTaken": 25
}
```

**Response:**

```json
{
  "code": 1000,
  "result": {
    "id": 1,
    "quizId": 1,
    "quizTitle": "React Basics Quiz",
    "studentId": 3,
    "studentName": "John Doe",
    "score": 80.0,
    "totalQuestions": 2,
    "correctAnswers": 2,
    "timeTaken": 25,
    "attemptNumber": 1,
    "isPassed": true,
    "takenAt": "2024-10-20T10:00:00+07:00",
    "feedback": "Câu 1: Đúng\nCâu 2: Đúng\n"
  }
}
```

### 8.2 Get My Quiz Results (STUDENT)

```http
GET /api/quiz-results/my-results/{quizId}
Authorization: Bearer <STUDENT_TOKEN>
```

### 8.3 Get My Best Result (STUDENT)

```http
GET /api/quiz-results/my-best-result/{quizId}
Authorization: Bearer <STUDENT_TOKEN>
```

### 8.4 Get My Course Results (STUDENT)

```http
GET /api/quiz-results/my-course-results/{courseId}
Authorization: Bearer <STUDENT_TOKEN>
```

### 8.5 Can Take Quiz (STUDENT)

```http
GET /api/quiz-results/can-take/{quizId}
Authorization: Bearer <STUDENT_TOKEN>
```

**Response:**

```json
{
  "code": 1000,
  "result": true
}
```

### 8.6 Get All Quiz Results (LECTURER+)

```http
GET /api/quiz-results/quiz/{quizId}/all-results
Authorization: Bearer <TOKEN>
```

---

## 🧪 9. TEST/HEALTH APIS

### 9.1 Health Check (Public)

```http
GET /api/health
```

**Response:**

```json
{
  "code": 1000,
  "result": {
    "status": "UP",
    "timestamp": "2024-10-20T10:00:00+07:00",
    "service": "LMS API",
    "version": "1.0.0"
  }
}
```

### 9.2 Test Auth

```http
GET /api/test/me
Authorization: Bearer <TOKEN>
```

**Response:**

```json
{
  "code": 1000,
  "result": {
    "userId": 1,
    "accountId": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "userType": "STUDENT",
    "isAdmin": false
  }
}
```

### 9.3 Test Simple (Public)

```http
GET /api/test/simple
```

---

## 📋 ERROR CODES

```typescript
export enum LmsErrorCode {
  SUCCESS = 1000,
  TOKEN_NOT_EXIST = 2001,
  TOKEN_INVALID = 2002,
  TOKEN_EXPIRED = 2003,
  UNAUTHORIZED = 2101,
  STUDENT_ONLY = 2103,
  LECTURER_ONLY = 2104,
  ADMIN_ONLY = 2105,
  NOT_ENROLLED = 2106,
  ALREADY_ENROLLED = 2108,
  COURSE_NOT_FOUND = 1004,
  LESSON_NOT_FOUND = 1005,
  QUIZ_NOT_FOUND = 1006,
  QUIZ_MAX_ATTEMPTS = 1017,
}
```

---

## 🎯 LUỒNG SỬ DỤNG CHÍNH

### 🎓 Student Flow

```
1. GET /api/category              → Browse categories
2. GET /api/course                → Browse courses
3. POST /api/enrollment/enroll    → Enroll in course
4. GET /api/course/{id}           → View course details
5. GET /api/lesson/{id}           → View lesson
6. GET /api/quiz/lesson/{id}      → View quizzes
7. POST /api/quiz-results/submit  → Take quiz
8. GET /api/quiz-results/my-results/{id} → View results
```

### 👨‍🏫 Lecturer Flow

```
1. POST /api/course/createCourse           → Create course (PENDING)
2. GET /api/course/lecturer/my-courses     → View my courses
3. POST /api/lesson/createLesson           → Add lessons
4. POST /api/quiz                          → Create quiz
5. POST /api/question                      → Add questions
6. POST /api/answerOption                  → Add answer options
7. GET /api/quiz-results/quiz/{id}/all-results → View student results
```

### 👨‍💼 Admin Flow

```
1. GET /api/course/admin/pending          → View pending courses
2. POST /api/course/{id}/approve          → Approve/Reject
3. GET /api/course/admin/all              → View all courses
4. GET /api/enrollment                    → View all enrollments
5. PUT /api/enrollment/{id}               → Update enrollment
```

---

## 🔒 AUTHORIZATION MATRIX

| Endpoint                            | Public             | Student            | Lecturer           | Admin              |
| ----------------------------------- | ------------------ | ------------------ | ------------------ | ------------------ |
| GET /api/category                   | ✅                 | ✅                 | ✅                 | ✅                 |
| POST /api/category                  | ❌                 | ❌                 | ✅                 | ✅                 |
| GET /api/course                     | ✅ (APPROVED only) | ✅ (APPROVED only) | ✅ (APPROVED only) | ✅ (APPROVED only) |
| GET /api/course/lecturer/my-courses | ❌                 | ❌                 | ✅                 | ❌                 |
| GET /api/course/admin/all           | ❌                 | ❌                 | ❌                 | ✅                 |
| POST /api/course/createCourse       | ❌                 | ❌                 | ✅                 | ✅                 |
| POST /api/course/{id}/approve       | ❌                 | ❌                 | ❌                 | ✅                 |
| POST /api/enrollment/enroll         | ❌                 | ✅                 | ❌                 | ❌                 |
| GET /api/enrollment/my-enrollments  | ❌                 | ✅                 | ❌                 | ❌                 |
| GET /api/enrollment                 | ❌                 | ❌                 | ✅                 | ✅                 |
| POST /api/quiz-results/submit       | ❌                 | ✅                 | ❌                 | ❌                 |

---

## 📝 NOTES

1. **Multipart Form Data**: Courses và Lessons sử dụng multipart/form-data cho create và update
2. **Approval Status**: Courses mới tạo có `approvalStatus = PENDING`
3. **Enrollment Check**: Students chỉ xem được courses/lessons đã enrolled
4. **Auto-grading**: Quiz results được tự động chấm điểm
5. **JWT Token**: Token chứa userId, userType, và các thông tin cần thiết

---

**Last Updated:** 20/10/2024
**Version:** 1.0.0
