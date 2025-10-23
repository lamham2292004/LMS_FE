# ✅ LMS Integration Setup Checklist

## 📋 Pre-requisites

- [ ] Java 17+ installed
- [ ] Node.js 18+ installed
- [ ] MySQL 8+ installed and running
- [ ] Maven installed

## 🗄️ Database Setup

- [ ] MySQL service is running
- [ ] Database `LMS` created
  ```sql
  CREATE DATABASE LMS;
  ```
- [ ] Database credentials correct in `application.yaml`

## 🔧 Backend Setup (Spring Boot)

- [ ] Navigate to backend directory
  ```bash
  cd f:\DoAn\LMS
  ```
- [ ] Check `application.yaml` configuration
  - [ ] Database URL: `jdbc:mysql://localhost:3306/LMS`
  - [ ] Database credentials correct
  - [ ] CORS origins include: `http://localhost:3000`
- [ ] Build and run backend
  ```bash
  mvn clean install
  mvn spring-boot:run
  ```
- [ ] Verify backend is running
  ```bash
  curl http://localhost:8083/api/health
  ```
  Should return:
  ```json
  {
    "code": 1000,
    "result": {
      "status": "UP",
      ...
    }
  }
  ```

## 🎨 Frontend Setup (Next.js)

- [ ] Navigate to frontend directory
  ```bash
  cd f:\DoAn\FE_LMS
  ```
- [ ] Create `.env.local` file
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000/api
  NEXT_PUBLIC_LMS_API_URL=http://localhost:8083/api
  ```
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Start development server
  ```bash
  npm run dev
  ```
- [ ] Verify frontend is running
  - Open: `http://localhost:3000`

## 🧪 Testing Integration

### Test 1: Connection Test

- [ ] Open: `http://localhost:3000/test-lms`
- [ ] Check sections:
  - [ ] Health Check shows "UP"
  - [ ] Categories load successfully
  - [ ] Courses load successfully
  - [ ] Connection info shows correct URLs

### Test 2: Public APIs (No Login Required)

- [ ] Open: `http://localhost:3000/authorized/lms/app/student/browse-lms`
- [ ] Verify:
  - [ ] Courses display correctly
  - [ ] Can filter by category
  - [ ] Can search courses
  - [ ] Images load (or fallback)
  - [ ] Status badges show correctly

### Test 3: Student Features (Login Required)

- [ ] Login with Student account
- [ ] Navigate to: `/authorized/lms/app/student/browse-lms`
- [ ] Try enrolling in a course
  - [ ] Click "Đăng ký khóa học" button
  - [ ] Should show success message
- [ ] Navigate to: `/authorized/lms/app/student/my-courses-lms`
- [ ] Verify:
  - [ ] Enrolled courses display
  - [ ] Stats show correct numbers
  - [ ] Can see enrollment date

### Test 4: Components

- [ ] Test `<CourseList />` component
  - [ ] Courses render in grid
  - [ ] Hover effects work
  - [ ] Click navigates correctly
- [ ] Test `<EnrollButton />` component
  - [ ] Shows correct state (enroll/enrolled)
  - [ ] Handles errors properly
  - [ ] Shows loading state
- [ ] Test `<MyEnrollments />` component
  - [ ] Enrollments display correctly
  - [ ] Filter by status works
  - [ ] Refresh button works

## 🔑 Authentication Testing

- [ ] Login as Student

  - [ ] Can browse courses
  - [ ] Can enroll in courses
  - [ ] Can view my enrollments
  - [ ] ❌ Cannot create courses
  - [ ] ❌ Cannot create categories

- [ ] Login as Lecturer

  - [ ] Can browse courses
  - [ ] ❌ Cannot enroll in courses
  - [ ] Can create courses
  - [ ] Can create lessons
  - [ ] Can create quizzes

- [ ] Login as Admin
  - [ ] Can do everything
  - [ ] Can create categories
  - [ ] Can delete courses
  - [ ] Can view all enrollments

## 🚨 Error Handling

- [ ] Test without login
  - [ ] Public pages work
  - [ ] Protected pages redirect or show error
- [ ] Test with expired token
  - [ ] Shows appropriate error
  - [ ] Redirects to login
- [ ] Test enrolling twice
  - [ ] Shows "Already enrolled" error
- [ ] Test backend offline
  - [ ] Shows connection error
  - [ ] Retry button works

## 📊 Console Checks

Open browser console and verify:

- [ ] No CORS errors
- [ ] No 401/403 errors
- [ ] API responses have correct format
- [ ] JWT token is being sent in headers
- [ ] Loading states log correctly

## 🔍 Network Tab Checks

Open Network tab and verify:

- [ ] Requests to `localhost:8083/api/*`
- [ ] Authorization header present
- [ ] Response format is correct:
  ```json
  {
    "code": 1000,
    "result": { ... }
  }
  ```

## 📁 File Structure Verification

- [ ] `src/lib/lms-api-client.ts` exists
- [ ] `src/lib/hooks/useLms.ts` exists
- [ ] `src/lib/config.ts` updated with LMS_API_CONFIG
- [ ] `src/components/LMS/` directory exists
  - [ ] `CourseList.tsx`
  - [ ] `EnrollButton.tsx`
  - [ ] `MyEnrollments.tsx`
- [ ] `src/app/test-lms/page.tsx` exists
- [ ] Documentation files exist:
  - [ ] `LMS_INTEGRATION_GUIDE.md`
  - [ ] `LMS_QUICKSTART.md`
  - [ ] `README_LMS_INTEGRATION.md`

## ✨ Optional Enhancements

- [ ] Add loading skeletons
- [ ] Add toast notifications
- [ ] Add course detail page integration
- [ ] Add lecturer course management
- [ ] Add admin category management
- [ ] Add quiz taking interface
- [ ] Add progress tracking
- [ ] Add certificates

## 📝 Notes

Record any issues or observations:

```
Date: ___________
Issue:
Solution:

---

Date: ___________
Issue:
Solution:
```

## 🎉 Final Verification

- [ ] All backend endpoints accessible
- [ ] All frontend pages load correctly
- [ ] Authentication flow works
- [ ] Enrollments work
- [ ] No console errors
- [ ] No CORS issues
- [ ] Documentation complete

---

**Status:**

- [ ] Not Started
- [ ] In Progress
- [ ] Completed
- [ ] Issues Found (See Notes)

**Completed Date:** ****\_\_\_****

**Sign-off:** ****\_\_\_****
