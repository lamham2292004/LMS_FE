# 🔧 Áp dụng các fixes còn lại

## Còn 2 files cần sửa

### **File 1: quizzes/new/page.tsx**

**Path**: `src/app/authorized/lms/app/lecturer/courses/[id]/quizzes/new/page.tsx`

**Line 68** - Tìm:
```typescript
const handleSave = () => {
  router.push(`/lecturer/courses/${params.id}/quizzes`)
}
```

**Thay bằng**:
```typescript
const handleSave = () => {
  router.push(`/authorized/lms/app/lecturer/courses/${params.id}/quizzes`)
}
```

---

### **File 2: students/[studentId]/page.tsx**

**Path**: `src/app/authorized/lms/app/lecturer/courses/[id]/students/[studentId]/page.tsx`

**Line 73** - Tìm:
```typescript
<Link href={`/lecturer/courses/${params.id}`}>
```

**Thay bằng**:
```typescript
<Link href={`/authorized/lms/app/lecturer/courses/${params.id}`}>
```

---

## ✅ Sau khi sửa xong

Tất cả navigation trong lecturer section sẽ hoạt động:

1. ✅ Header → Profile
2. ✅ New Lesson → All links
3. ✅ New Quiz → Save redirect
4. ✅ Student Detail → Back button

**Test URLs:**
```
/authorized/lms/app/lecturer/courses/1/lessons/new
/authorized/lms/app/lecturer/courses/1/quizzes/new
/authorized/lms/app/lecturer/courses/1/students/1
```
