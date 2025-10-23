# 🚀 Quick Start Guide - Lecturer Dashboard

## 📋 Checklist trước khi bắt đầu

- [ ] Backend System-Management đã chạy (port 8000)
- [ ] Backend LMS đã chạy (port 8083)
- [ ] Frontend đã chạy (port 3000)
- [ ] Đã login với account LECTURER

---

## ⚡ Quick Start (3 bước)

### Bước 1: Start Services

```bash
# Terminal 1 - System Management
cd F:\DoAn\DT\System-Management
php artisan serve --port=8000

# Terminal 2 - LMS Backend
cd F:\DoAn\LMS
mvn spring-boot:run

# Terminal 3 - Frontend
cd F:\DoAn\FE_LMS
npm run dev
```

### Bước 2: Login

```
URL: http://localhost:3000/auth/login
Username: gv_GV002
Password: [your password]
```

### Bước 3: Access Dashboard

```
URL: http://localhost:3000/authorized/lms/app/lecturer
```

---

## 🎯 Features Available

### ✅ Dashboard (Trang chính)

- Xem tổng số khóa học
- Xem tổng số học viên
- Xem doanh thu
- Xem đánh giá trung bình
- Danh sách 5 courses gần nhất

**Route:** `/authorized/lms/app/lecturer`

---

### ✅ Courses Management (Quản lý khóa học)

**Route:** `/authorized/lms/app/lecturer/courses`

**Có thể làm:**

- Xem tất cả courses của mình
- Filter: Published / Draft
- Search courses
- Xem stats: học viên, doanh thu, đánh giá
- Quản lý từng course
- Chỉnh sửa course

---

### ✅ Create Course (Tạo khóa học mới)

**Route:** `/authorized/lms/app/lecturer/courses/new`

**3 bước:**

1. **Thông tin cơ bản**

   - Tên khóa học (required)
   - Mô tả
   - Chọn category (required)
   - Chọn status (UPCOMING/OPEN/CLOSED)
   - Upload ảnh (required)

2. **Mục tiêu học tập**

   - Skip (sẽ thêm sau)

3. **Giá & Submit**
   - Checkbox miễn phí
   - Nhập giá
   - Click "Tạo khóa học"

**Sau khi tạo:** Auto redirect đến trang edit course

---

### ✅ Course Details (Chi tiết khóa học)

**Route:** `/authorized/lms/app/lecturer/courses/[id]`

**Tabs:**

#### 1. Học viên

- Danh sách students đã enroll
- Xem trạng thái (ACTIVE/COMPLETED/CANCELLED)
- Xem tiến độ
- Link xem chi tiết từng học viên

#### 2. Bài học

- Danh sách lessons
- Thêm lesson mới
- Chỉnh sửa lesson

#### 3. Bài kiểm tra

- Danh sách quizzes
- Tạo quiz mới
- Xem kết quả quiz
- Chỉnh sửa quiz

#### 4. Đánh giá

- Placeholder (đang phát triển)

#### 5. Thống kê

- Placeholder (đang phát triển)

---

## 🐛 Debug & Troubleshooting

### Debug Token

```
URL: http://localhost:3000/debug-token.html
```

**Check:**

- Token có tồn tại không
- Token có expired không
- User ID có trong token không (`sub` field)
- User type đúng không (`user_type: 'lecturer'`)

---

### Common Issues

#### Issue 1: "User ID not found in token"

**Fix:** ✅ Đã fix - Refresh browser

#### Issue 2: "Not authenticated"

**Fix:**

```javascript
localStorage.clear();
// Login lại
```

#### Issue 3: "Failed to fetch courses"

**Fix:**

- Check LMS backend có chạy không
- Check network tab trong DevTools
- Verify token trong localStorage

#### Issue 4: Courses list empty

**Check:**

- Token có field `sub` không (User ID)
- Backend có courses nào cho lecturer này không
- Console có error không

---

## 📊 API Endpoints Used

### System-Management (Auth)

```
POST /api/v1/login           - Login
GET  /api/v1/me              - Get user info
```

### LMS Backend

```
GET    /api/course           - Get all courses
POST   /api/course/createCourse - Create course
GET    /api/course/{id}      - Get course details
PUT    /api/course/updateCourse/{id} - Update course

GET    /api/enrollment       - Get all enrollments
GET    /api/category         - Get categories
GET    /api/quiz/course/{id} - Get quizzes by course
```

---

## 🎨 UI Features

### Responsive Design

- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

### Loading States

- ✅ Spinner when fetching
- ✅ Button disabled during submit
- ✅ Skeleton screens

### Error Handling

- ✅ Error messages
- ✅ Fallback UI
- ✅ Retry options

### Empty States

- ✅ No courses
- ✅ No students
- ✅ No lessons
- ✅ No quizzes

---

## 📝 Sample Data

### Create Test Course

```json
{
  "title": "Lập trình Web với React",
  "description": "Khóa học từ cơ bản đến nâng cao",
  "price": 1500000,
  "categoryId": 1,
  "status": "OPEN"
}
```

### Create Test Lesson

```json
{
  "courseId": 1,
  "title": "Giới thiệu về React",
  "description": "Bài học đầu tiên",
  "orderIndex": 1,
  "duration": 30
}
```

---

## ✅ Success Checklist

Test theo thứ tự:

1. [ ] Login thành công
2. [ ] Dashboard hiển thị stats
3. [ ] Courses page hiển thị danh sách
4. [ ] Tạo course mới thành công
5. [ ] Xem chi tiết course
6. [ ] Xem danh sách enrollments
7. [ ] Xem danh sách lessons
8. [ ] Debug token tool hoạt động

---

## 🚨 Emergency Commands

### Clear Everything

```javascript
// Paste in browser console
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach((c) => {
  document.cookie = c
    .replace(/^ +/, "")
    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

### Check Backend Health

```bash
# LMS
curl http://localhost:8083/api/health

# System-Management
curl http://localhost:8000/api/health
```

---

## 📚 Documentation

- 📄 `LECTURER_INTEGRATION_COMPLETE.md` - Full integration guide
- 🔧 `JWT_TOKEN_FIX.md` - JWT token fix details
- 🛠️ `DEBUG_TOOLS.md` - Debug utilities
- 🎉 `🎉_JWT_FIX_COMPLETE.md` - Fix completion summary

---

## 🎯 What's Next?

### Phase 1 (Current) ✅

- [x] Lecturer Dashboard
- [x] Courses Management
- [x] Create Course
- [x] View Course Details
- [x] View Enrollments

### Phase 2 (Upcoming)

- [ ] Edit Course functionality
- [ ] Create/Edit Lesson
- [ ] Create/Edit Quiz
- [ ] View Quiz Results
- [ ] Student Detail View

### Phase 3 (Future)

- [ ] Analytics & Charts
- [ ] Review System
- [ ] Messaging with Students
- [ ] Bulk Operations

---

**Ready to go! Happy teaching! 👨‍🏫📚**
