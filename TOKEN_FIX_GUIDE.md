# 🔐 Token Expiration Fix Guide

## ❌ Vấn Đề

Token JWT của bạn đã **hết hạn** và frontend vẫn đang sử dụng token cũ, dẫn đến lỗi:

```
Token đã hết hạn: JWT expired at 2025-10-10T11:44:35Z
Current time: 2025-10-11T12:24:52
```

---

## ✅ Giải Pháp Nhanh (1 phút)

### **Bước 1: Xóa Token Cũ**

Mở **Browser Console** (F12) và chạy:

```javascript
localStorage.removeItem("auth_token");
```

### **Bước 2: Login Lại**

Truy cập trang login:

```
http://localhost:3000/auth/login
```

Đăng nhập lại để lấy token mới.

### **Bước 3: Verify Token Mới**

Truy cập trang debug token:

```
http://localhost:3000/debug-token
```

Kiểm tra token đã được refresh và còn hạn.

---

## 🛠️ Tính Năng Mới Đã Thêm

### 1. **Token Manager** (`src/lib/token-manager.ts`)

Tự động:

- ✅ Kiểm tra token có hết hạn không
- ✅ Cảnh báo khi token sắp hết hạn (< 10 phút)
- ✅ Tự động xóa token hết hạn
- ✅ Hiển thị thời gian còn lại

### 2. **Token Status Component** (`src/components/TokenStatus.tsx`)

Hiển thị:

- ✅ Trạng thái token (valid/expired)
- ✅ Thời gian còn lại
- ✅ Nút login lại nếu hết hạn

### 3. **Debug Token Page** (`src/app/debug-token/page.tsx`)

Debug:

- ✅ Xem thông tin token chi tiết
- ✅ Decode JWT token
- ✅ Kiểm tra expiry time
- ✅ Clear token

---

## 🔍 Cách Sử Dụng Tính Năng Mới

### A. Tự Động Check Token

LMS API client bây giờ **tự động kiểm tra** token trước mỗi request:

```typescript
// Trong lms-api-client.ts
private getToken(): string | null {
  const token = localStorage.getItem('auth_token');

  // Tự động check expired
  if (token && tokenManager.isTokenExpired(token)) {
    console.error('❌ Token đã hết hạn!');
    // Tự động clear
    tokenManager.clearExpiredToken();
    // Hỏi user có muốn login lại không
    const shouldRedirect = confirm('Token đã hết hạn. Đăng nhập lại?');
    if (shouldRedirect) {
      window.location.href = '/auth/login';
    }
    return null;
  }

  // Cảnh báo nếu sắp hết hạn
  if (token && tokenManager.willExpireSoon(token, 10)) {
    console.warn('⚠️ Token sẽ hết hạn trong 10 phút!');
  }

  return token;
}
```

### B. Hiển Thị Token Status

Thêm component vào layout:

```typescript
import TokenStatus from "@/components/TokenStatus";

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <TokenStatus /> {/* Hiển thị ở góc dưới bên phải */}
    </div>
  );
}
```

### C. Debug Token Issues

Truy cập trang debug:

```
http://localhost:3000/debug-token
```

Trang này sẽ hiển thị:

- ✅ Token có hết hạn không
- ✅ Thời gian hết hạn
- ✅ Decoded token info
- ✅ Raw token string
- ✅ Actions: Clear/Login

---

## 🔧 Cấu Hình Backend

### Laravel JWT Settings

Để tăng thời gian sống của token, edit `.env`:

```env
# JWT time to live (in minutes)
JWT_TTL=10080  # 7 days

# JWT refresh time to live (in minutes)
JWT_REFRESH_TTL=20160  # 14 days
```

Sau đó clear config:

```bash
php artisan config:clear
php artisan config:cache
```

---

## 📊 Token Lifecycle

```
┌─────────────────────────────────────────────────┐
│ 1. User Login                                   │
│    → Laravel generates JWT token                │
│    → Token valid for X minutes (JWT_TTL)        │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│ 2. Token Stored                                 │
│    → localStorage['auth_token'] = token         │
│    → Frontend uses token for API requests       │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│ 3. Token Usage                                  │
│    → Every API request includes token           │
│    → Backend validates token                    │
│    → Token Manager checks expiry                │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│ 4. Token Near Expiry (< 10 min)                │
│    → ⚠️ Warning shown to user                   │
│    → "Token sẽ hết hạn trong X phút"            │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│ 5. Token Expired                                │
│    → ❌ Token no longer valid                   │
│    → Auto cleared from localStorage             │
│    → Prompt user to login again                 │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
                Back to Step 1
```

---

## 🚨 Common Issues

### Issue 1: Token Hết Hạn Quá Nhanh

**Nguyên nhân:** JWT_TTL quá ngắn

**Giải pháp:**

```env
# Tăng JWT_TTL trong Laravel .env
JWT_TTL=10080  # 7 days thay vì 60 minutes
```

### Issue 2: Token Không Tự Động Clear

**Nguyên nhân:** Chưa implement token manager

**Giải pháp:** Đã fix bằng `token-manager.ts`

### Issue 3: User Không Biết Token Hết Hạn

**Nguyên nhân:** Không có UI feedback

**Giải pháp:** Thêm `<TokenStatus />` component

---

## 📝 Testing

### Test 1: Token Expiry Check

```typescript
import { isTokenValid, getTokenInfo } from "@/lib/token-manager";

console.log("Is token valid?", isTokenValid());
console.log("Token info:", getTokenInfo());
```

### Test 2: Manual Token Clear

```javascript
// In browser console
localStorage.removeItem("auth_token");
// Reload page → Should redirect to login
```

### Test 3: Debug Page

```
Visit: http://localhost:3000/debug-token
→ Should show detailed token info
```

---

## ✨ Best Practices

1. **Always Check Token Before API Calls**

   - ✅ Already implemented in `lms-api-client.ts`

2. **Show Token Status to Users**

   - ✅ Use `<TokenStatus />` component

3. **Provide Clear Error Messages**

   - ✅ "Token đã hết hạn. Vui lòng đăng nhập lại."

4. **Auto-Redirect on Expiry**

   - ✅ Confirm dialog → Redirect to `/auth/login`

5. **Log Token Events**
   - ✅ Console warnings for near-expiry
   - ✅ Console errors for expired tokens

---

## 🎯 Next Steps

1. ✅ Clear expired token: `localStorage.removeItem('auth_token')`
2. ✅ Login lại để lấy token mới
3. ✅ Visit `/debug-token` để verify
4. ✅ Thêm `<TokenStatus />` vào layout (optional)
5. ⬜ Consider implementing refresh token mechanism

---

**Vấn đề đã được fix! Hãy login lại để lấy token mới.** 🎉

Need help? Check `/debug-token` page for detailed info.
