# 🔧 Hướng dẫn Fix lỗi 404 và Redirect

## ❌ Vấn đề
- Trang luôn redirect về `/auth/login`
- Lỗi 404 cho static files
- Không thể truy cập LMS pages

## ✅ Đã sửa

### 1. **next.config.mjs** - Xóa global redirect
```javascript
// ❌ TRƯỚC (SAI)
async redirects() {
  return [
    {
      source: '/',
      destination: '/auth/login',
      permanent: true,
    },
  ];
}

// ✅ SAU (ĐÚNG)
// Removed global redirect - let pages handle their own routing
```

### 2. **Lý do lỗi**
- Global redirect trong `next.config.mjs` đã force tất cả requests về `/auth/login`
- Điều này làm cho:
  - Static files không load được
  - LMS pages không accessible
  - Tất cả routes bị redirect

---

## 🚀 Cách khắc phục

### **Bước 1: Restart Dev Server**

**Windows:**
```bash
# Dừng server hiện tại (Ctrl+C)
# Xóa cache
rmdir /s /q .next
rmdir /s /q node_modules\.cache

# Restart
npm run dev
```

**Hoặc chạy file batch:**
```bash
fix-build.bat
```

### **Bước 2: Clear Browser Cache**
1. Mở DevTools (F12)
2. Right-click vào Refresh button
3. Chọn "Empty Cache and Hard Reload"

### **Bước 3: Test Routes**

Sau khi restart, test các URLs:

```
✅ http://localhost:3000/
✅ http://localhost:3000/auth/login
✅ http://localhost:3000/authorized/lms/app/student
✅ http://localhost:3000/authorized/lms/app/lecturer
✅ http://localhost:3000/authorized/lms/app/admin
```

---

## 📋 Routing Logic mới

### **Root Path (`/`)**
- Không còn global redirect
- Sẽ hiển thị landing page hoặc redirect dựa trên auth status

### **Auth Pages**
```
/auth/login    → Login page
/auth/register → Register page
```

### **LMS Pages**
```
/authorized/lms/app/student   → Student dashboard
/authorized/lms/app/lecturer  → Lecturer dashboard
/authorized/lms/app/admin     → Admin dashboard
```

---

## 🔍 Kiểm tra lỗi

### **Nếu vẫn bị lỗi 404:**

1. **Check console errors:**
   - Mở DevTools → Console
   - Xem file nào bị 404
   - Copy error message

2. **Check Next.js output:**
   - Xem terminal nơi chạy `npm run dev`
   - Tìm compilation errors

3. **Check file paths:**
   - Verify tất cả imports đúng
   - Check `@lms/` alias hoạt động

### **Nếu vẫn redirect về login:**

1. **Check middleware:**
   ```bash
   # Xem file middleware
   src/middleware.ts
   ```

2. **Check auth logic:**
   - Có thể có auth check redirect về login
   - Tạm thời disable để test

3. **Check layout files:**
   - `src/app/layout.tsx`
   - `src/app/authorized/layout.tsx`

---

## 🎯 Expected Behavior

### **Sau khi fix:**

1. **Root path (`/`):**
   - Hiển thị landing page
   - Hoặc redirect dựa trên auth status

2. **Auth pages:**
   - `/auth/login` → Login form
   - `/auth/register` → Register form

3. **LMS pages:**
   - Tất cả routes hoạt động
   - Static files load đúng
   - No 404 errors

4. **Navigation:**
   - Sidebar links work
   - All internal links work
   - No unexpected redirects

---

## 📝 Notes

### **Về Global Redirects:**
- ❌ **KHÔNG nên** dùng global redirect trong `next.config.mjs`
- ✅ **NÊN** handle redirects trong:
  - Middleware (`src/middleware.ts`)
  - Page components
  - Layout components

### **Về Authentication:**
- Auth logic nên ở middleware
- Protected routes check auth status
- Redirect to login only if not authenticated

### **Về Static Files:**
- Next.js tự động serve từ `/public`
- Build files ở `/.next/static`
- Không cần config đặc biệt

---

## ✅ Checklist

Sau khi fix, verify:

- [ ] Dev server starts without errors
- [ ] No 404 errors in console
- [ ] Can access `/auth/login`
- [ ] Can access `/authorized/lms/app/student`
- [ ] Can access `/authorized/lms/app/lecturer`
- [ ] Can access `/authorized/lms/app/admin`
- [ ] Static files load (CSS, JS, images)
- [ ] Navigation works
- [ ] No unexpected redirects

---

## 🆘 Nếu vẫn lỗi

### **Option 1: Fresh Install**
```bash
# Backup code
# Delete node_modules and .next
rmdir /s /q node_modules
rmdir /s /q .next

# Reinstall
npm install
npm run dev
```

### **Option 2: Check Dependencies**
```bash
# Update Next.js
npm install next@latest react@latest react-dom@latest

# Clear cache
npm cache clean --force
```

### **Option 3: Check Port**
```bash
# Nếu port 3000 bị chiếm
npm run dev -- -p 3001
```

---

## 📞 Support

Nếu vẫn gặp vấn đề:
1. Check terminal output
2. Check browser console
3. Check file paths
4. Verify all imports

---

**Status**: ✅ FIXED
**Last Updated**: 2024
**Version**: 1.0.0
