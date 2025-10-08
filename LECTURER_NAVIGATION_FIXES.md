# 🔧 Lecturer Navigation Fixes - Tất cả Links cần sửa

## 📋 Tổng quan

Danh sách TẤT CẢ các links cần sửa trong lecturer pages.

---

## ✅ Đã sửa

### **1. Header - Link "Hồ sơ"** ✅
**File**: `components/header.tsx`
```typescript
// ✅ FIXED
<DropdownMenuItem asChild>
  <Link href="/authorized/lms/app/student/profile">
    <User className="mr-2 h-4 w-4" />
    <span>Hồ sơ</span>
  </Link>
</DropdownMenuItem>
```

### **2. New Lesson Page** ✅
**File**: `lecturer/courses/[id]/lessons/new/page.tsx`

**Links đã sửa:**
- ✅ Back button: `/authorized/lms/app/lecturer/courses/${params.id}`
- ✅ Cancel button: `/authorized/lms/app/lecturer/courses/${params.id}`
- ✅ Submit redirect: `/authorized/lms/app/lecturer/courses/${params.id}`
- ✅ Quiz link: `/authorized/lms/app/lecturer/courses/${params.id}/quizzes/new`

---

## ⚠️ CẦN SỬA

### **3. New Quiz Page**
**File**: `lecturer/courses/[id]/quizzes/new/page.tsx`

**Cần sửa:**
```typescript
// Line 68
router.push(`/lecturer/courses/${params.id}/quizzes`)
// → router.push(`/authorized/lms/app/lecturer/courses/${params.id}/quizzes`)
```

### **4. Edit Quiz Page**
**File**: `lecturer/courses/[id]/quizzes/[quizId]/edit/page.tsx`

**Không có links cần sửa** - Chỉ có Save button không redirect

### **5. Quiz Results Page**
**File**: `lecturer/courses/[id]/quizzes/[quizId]/results/page.tsx`

**Không có links cần sửa** - Chỉ có "Chi tiết" buttons chưa có href

### **6. Student Detail Page**
**File**: `lecturer/courses/[id]/students/[studentId]/page.tsx`

**Cần sửa:**
```typescript
// Line 73
<Link href={`/lecturer/courses/${params.id}`}>
// → <Link href={`/authorized/lms/app/lecturer/courses/${params.id}`}>
```

---

## 📝 Chi tiết từng file

### **File 1: quizzes/new/page.tsx**

**Location**: Line 68
```typescript
// BEFORE
const handleSave = () => {
  router.push(`/lecturer/courses/${params.id}/quizzes`)
}

// AFTER
const handleSave = () => {
  router.push(`/authorized/lms/app/lecturer/courses/${params.id}/quizzes`)
}
```

### **File 2: students/[studentId]/page.tsx**

**Location**: Line 73
```typescript
// BEFORE
<Link href={`/lecturer/courses/${params.id}`}>
  <ArrowLeft className="mr-2 h-4 w-4" />
  Quay lại
</Link>

// AFTER
<Link href={`/authorized/lms/app/lecturer/courses/${params.id}`}>
  <ArrowLeft className="mr-2 h-4 w-4" />
  Quay lại
</Link>
```

---

## 🗺️ Complete Navigation Map

```
Lecturer Dashboard
    │
    ├─→ Courses
    │   └─→ Course Detail [id]
    │       ├─→ Lessons
    │       │   └─→ New Lesson ✅
    │       │       ├─→ Back ✅
    │       │       ├─→ Cancel ✅
    │       │       ├─→ Submit ✅
    │       │       └─→ Create Quiz ✅
    │       │
    │       ├─→ Quizzes
    │       │   ├─→ New Quiz ⚠️
    │       │   │   └─→ Save (needs fix)
    │       │   │
    │       │   └─→ Quiz [quizId]
    │       │       ├─→ Edit ✅
    │       │       └─→ Results ✅
    │       │
    │       └─→ Students
    │           └─→ Student Detail [studentId] ⚠️
    │               └─→ Back (needs fix)
    │
    └─→ Settings ✅
```

---

## 🔧 Quick Fix Commands

### **Fix Quiz New Page**
```typescript
// File: lecturer/courses/[id]/quizzes/new/page.tsx
// Line: 68

// Find:
router.push(`/lecturer/courses/${params.id}/quizzes`)

// Replace with:
router.push(`/authorized/lms/app/lecturer/courses/${params.id}/quizzes`)
```

### **Fix Student Detail Page**
```typescript
// File: lecturer/courses/[id]/students/[studentId]/page.tsx
// Line: 73

// Find:
<Link href={`/lecturer/courses/${params.id}`}>

// Replace with:
<Link href={`/authorized/lms/app/lecturer/courses/${params.id}`}>
```

---

## ✅ Testing Checklist

### **New Lesson Page**
- [x] Back button works
- [x] Cancel button works
- [x] Submit redirects correctly
- [x] "Create Quiz" link works

### **New Quiz Page**
- [ ] Save button redirects correctly (needs fix)

### **Edit Quiz Page**
- [x] Save button (no redirect needed)

### **Quiz Results Page**
- [x] Page loads
- [x] Stats display

### **Student Detail Page**
- [ ] Back button works (needs fix)

---

## 📊 Summary

### **Total Files**: 6 files
- ✅ Fixed: 2 files (header.tsx, lessons/new/page.tsx)
- ⚠️ Need Fix: 2 files (quizzes/new/page.tsx, students/[studentId]/page.tsx)
- ✅ OK: 2 files (quizzes/[quizId]/edit/page.tsx, quizzes/[quizId]/results/page.tsx)

### **Total Links**: 8 links
- ✅ Fixed: 5 links
- ⚠️ Need Fix: 2 links
- ✅ OK: 1 link

---

## 🚀 Next Steps

1. Fix `quizzes/new/page.tsx` - Line 68
2. Fix `students/[studentId]/page.tsx` - Line 73
3. Test all navigation flows
4. Verify all redirects work

---

**Status**: 🟡 IN PROGRESS
**Priority**: HIGH
**Estimated Time**: 5 minutes
