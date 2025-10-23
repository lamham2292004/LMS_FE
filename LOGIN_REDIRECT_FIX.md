# 🔧 Fix: Đăng nhập bị redirect về /login

## ❌ Vấn đề

Sau khi đăng nhập thành công, trang bị redirect về lại `/auth/login` thay vì vào dashboard.

## 🔍 Nguyên nhân

**Middleware không thể đọc token!**

```typescript
// middleware.ts (trước đây)
const token = req.cookies.get("token")?.value; // ❌ Đọc từ cookies

// api.ts (trước đây)
localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token); // ❌ Lưu vào localStorage
```

**Vấn đề:**

- 🔴 **localStorage** chỉ tồn tại ở client-side (browser)
- 🔴 **Middleware** chạy ở server-side (không có localStorage)
- 🔴 Server không thể đọc localStorage → Middleware nghĩ user chưa đăng nhập
- 🔴 Middleware redirect về `/login`

**Vấn đề thứ 2:**

- 🔴 Middleware check `/login` nhưng path thực tế là `/auth/login`
- 🔴 Middleware matcher quá rộng, chặn nhiều page không cần thiết

---

## ✅ Giải pháp đã áp dụng

### **1. Lưu token vào CẢ localStorage VÀ cookies**

```typescript
// src/lib/api.ts
setToken(token: string): void {
  this.token = token;
  if (typeof window !== "undefined") {
    // ✅ Lưu vào localStorage (cho client)
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    // ✅ Lưu vào cookies (cho middleware)
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  }
}

clearToken(): void {
  this.token = null;
  if (typeof window !== "undefined") {
    // ✅ Xóa localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

    // ✅ Xóa cookie
    document.cookie = "token=; path=/; max-age=0";
  }
}
```

### **2. Sửa middleware paths cho đúng**

```typescript
// src/middleware.ts
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Path đúng: /auth/login (không phải /login)
  if (
    !token &&
    !pathname.startsWith("/auth/login") &&
    !pathname.startsWith("/auth/register") &&
    !pathname.startsWith("/test-") && // Allow test pages
    !pathname.startsWith("/courses-demo") && // Allow demo pages
    !pathname.startsWith("/debug-") && // Allow debug pages
    pathname !== "/" // Allow home page
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // ✅ Chỉ protect /authorized/* (không chặn hết mọi thứ)
  matcher: ["/authorized/:path*"],
};
```

---

## 🧪 Cách test

### **Bước 1: Clear old token**

1. Mở DevTools (F12)
2. Console tab, chạy:

```javascript
// Clear old token
localStorage.clear();
document.cookie = "token=; path=/; max-age=0";
location.reload();
```

### **Bước 2: Đăng nhập lại**

1. Vào `http://localhost:3000/auth/login`
2. Đăng nhập với tài khoản:
   - **Student**: `student1` / `123456`
   - **Lecturer**: `lecturer1` / `123456`
   - **Admin**: `admin` / `admin123`

### **Bước 3: Verify token trong cookies**

1. Sau khi đăng nhập, mở DevTools
2. **Application tab** → **Cookies** → `http://localhost:3000`
3. Kiểm tra có cookie `token` không

```
Name:   token
Value:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Path:   /
Max-Age: 604800 (7 days)
```

### **Bước 4: Verify redirect thành công**

Sau khi đăng nhập, bạn sẽ được redirect đến:

- ✅ Student → `/authorized/student/dashboard`
- ✅ Lecturer → `/authorized/lecturer/dashboard`
- ✅ Admin → `/authorized/admin/dashboard`

**KHÔNG còn bị redirect về `/auth/login`!**

---

## 📊 So sánh Before/After

### **Before (Lỗi)**

```
1. User login → Token lưu vào localStorage
2. Redirect đến /authorized/student/dashboard
3. Middleware chạy → Đọc cookies (không có token)
4. Middleware: "Không có token!" → Redirect về /login
5. ❌ Loop forever
```

### **After (Fix)**

```
1. User login → Token lưu vào CẢ localStorage VÀ cookies
2. Redirect đến /authorized/student/dashboard
3. Middleware chạy → Đọc cookies (có token!)
4. Middleware: "OK, có token" → Allow access
5. ✅ User vào dashboard thành công
```

---

## 🔍 Debug nếu vẫn lỗi

### **1. Check cookies có token không?**

```javascript
// Console
document.cookie.split(";").find((c) => c.includes("token"));
// Expect: " token=eyJhbGc..."
```

### **2. Check middleware có chạy không?**

Xem console log trong terminal (nơi chạy `npm run dev`):

- Nếu thấy middleware log → Middleware đang chạy
- Nếu không thấy → Middleware config sai

### **3. Manually set cookie**

```javascript
// Console - Set token manually
const token = localStorage.getItem("token");
document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
location.reload();
```

---

## 🎯 Kết luận

**Đã fix:**

- ✅ Token được lưu vào cookies (middleware đọc được)
- ✅ Middleware paths đúng (`/auth/login` thay vì `/login`)
- ✅ Middleware chỉ protect `/authorized/*` (không chặn test pages)
- ✅ Clear token xóa cả localStorage VÀ cookies

**Giờ đăng nhập sẽ:**

- ✅ Redirect đúng dashboard theo role
- ✅ Không bị loop về login page
- ✅ Token persist trong 7 ngày
