# 🔍 DEBUG: VẪN BỊ LOGOUT KHI RELOAD

## 🎯 Mục tiêu

Tìm nguyên nhân chính xác tại sao vẫn bị logout khi reload trang.

---

## 📊 BƯỚC 1: Kiểm tra Debug Logs

### 1. Mở Browser Console

```
Chrome/Edge: F12 → Console tab
Firefox: F12 → Console tab
```

### 2. Login vào hệ thống

Quan sát logs khi login:

```
Logs expected:
✅ "🔧 ApiClient constructor - Token loaded from localStorage: NO"
✅ "🔍 AuthContext - checkAuth START"
✅ "🔍 apiClient.isAuthenticated(): false"
✅ "Login successful, user data: ..."
✅ "AuthContext - User set successfully: ..."
```

### 3. Reload trang (F5)

Quan sát logs khi reload:

```
Logs expected:
🔧 "ApiClient constructor - Token loaded from localStorage: YES (eyJhbG...) "
🔍 "AuthContext - checkAuth START"
🔍 "apiClient.isAuthenticated(): ???"  ← QUAN TRỌNG!
🔍 "localStorage auth_token: ???"      ← QUAN TRỌNG!
```

---

## 🧪 BƯỚC 2: Test với Debug Page

### 1. Truy cập debug page:

```
http://localhost:3000/debug-auth
```

### 2. Kiểm tra thông tin:

| Field             | Expected             | Actual |
| ----------------- | -------------------- | ------ |
| **Loading**       | NO ✅                | ?      |
| **Authenticated** | YES ✅               | ?      |
| **User**          | email@example.com ✅ | ?      |
| **Token**         | EXISTS ✅            | ?      |

### 3. Click "🔄 Check Again"

Xem logs có thay đổi không?

### 4. Click "↻ Force Reload"

Sau khi reload, check lại 4 fields trên.

---

## 🔍 BƯỚC 3: Phân tích các trường hợp

### Case 1: Token KHÔNG TỒN TẠI trong localStorage

**Logs:**

```
🔧 ApiClient constructor - Token loaded from localStorage: NO
🔍 localStorage auth_token: null
```

**Nguyên nhân:**

- Token không được lưu khi login
- Token bị clear bởi code khác

**Fix:**
→ Kiểm tra `api.ts` line 146-152 (`setToken` method)
→ Kiểm tra có đoạn code nào gọi `clearToken()` không

---

### Case 2: Token TỒN TẠI nhưng apiClient.isAuthenticated() = FALSE

**Logs:**

```
🔧 ApiClient constructor - Token loaded from localStorage: YES (eyJhbG...)
🔍 apiClient.isAuthenticated(): false  ← VẤN ĐỀ!
🔍 localStorage auth_token: eyJhbG...
```

**Nguyên nhân:**

- Constructor load token thành công
- Nhưng `this.token` bị set = null ở đâu đó

**Fix:**
→ Check có code nào gọi `apiClient.clearToken()` trước `checkAuth()` không
→ Check có multiple instances của `apiClient` không

---

### Case 3: Token TỒN TẠI, isAuthenticated() = TRUE, nhưng getProfile() FAIL

**Logs:**

```
🔧 ApiClient constructor - Token loaded from localStorage: YES
🔍 apiClient.isAuthenticated(): true
❌ AuthContext - Failed to check authentication: [error details]
```

**Nguyên nhân:**

- Token hết hạn (expired)
- Backend API không trả về profile
- Network error

**Fix:**
→ Check token expiry trong debug page
→ Check Network tab: Request to `/api/v1/student/profile` hoặc `/api/v1/lecturer/profile`
→ Check response status: 401? 403? 500?

---

### Case 4: Token HẾT HẠN

**Logs:**

```
Token expires: [past date]
Token expired: YES ❌
```

**Fix:**

1. **Tạm thời:** Login lại
2. **Lâu dài:** Tăng token expiry ở backend
3. **Best practice:** Implement refresh token

---

## 🛠️ BƯỚC 4: Check Network Tab

### 1. Mở Network tab (F12)

### 2. Reload trang, filter: `profile`

### 3. Check request:

```
Request URL: /api/v1/student/profile hoặc /api/v1/lecturer/profile
Request Headers:
  Authorization: Bearer eyJhbG...  ← Token có đúng không?
```

### 4. Check response:

| Status  | Meaning         | Action                      |
| ------- | --------------- | --------------------------- |
| **200** | OK ✅           | Profile loaded successfully |
| **401** | Unauthorized ❌ | Token invalid/expired       |
| **403** | Forbidden ❌    | No permission               |
| **404** | Not Found ❌    | Wrong endpoint              |
| **500** | Server Error ❌ | Backend issue               |

---

## 🔧 BƯỚC 5: Kiểm tra localStorage trực tiếp

### Console commands:

```javascript
// 1. Check token
const token = localStorage.getItem("auth_token");
console.log("Token exists:", !!token);
console.log("Token length:", token?.length);

// 2. Decode token
if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Token payload:", payload);
    console.log("Expires:", new Date(payload.exp * 1000));
    console.log("Is expired:", Date.now() > payload.exp * 1000);
    console.log("User type:", payload.user_type);
  } catch (e) {
    console.error("Token decode error:", e);
  }
}

// 3. Check user type
console.log("User type:", localStorage.getItem("user_type"));

// 4. List all keys
console.log("All localStorage keys:", Object.keys(localStorage));
```

---

## 📝 BƯỚC 6: Thu thập thông tin báo lỗi

Nếu vẫn lỗi, copy toàn bộ logs này:

```javascript
// Run in console
console.log("=== DEBUG INFO START ===");
console.log(
  "1. Token:",
  localStorage.getItem("auth_token") ? "EXISTS" : "MISSING"
);
console.log("2. Token length:", localStorage.getItem("auth_token")?.length);
console.log("3. User type:", localStorage.getItem("user_type"));
console.log("4. All keys:", Object.keys(localStorage));

const token = localStorage.getItem("auth_token");
if (token) {
  try {
    const parts = token.split(".");
    console.log("5. Token parts:", parts.length);
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      console.log("6. Token payload:", payload);
      console.log("7. Expires:", new Date(payload.exp * 1000));
      console.log("8. Is expired:", Date.now() > payload.exp * 1000);
    }
  } catch (e) {
    console.log("5. Token decode error:", e);
  }
}
console.log("=== DEBUG INFO END ===");
```

**Gửi toàn bộ output này để tôi phân tích!**

---

## 🚨 Các vấn đề phổ biến

### Problem 1: Middleware redirect

**Check file:** `src/middleware.ts`

Nếu có middleware check token, có thể nó redirect về login.

**Solution:**

- Comment middleware tạm thời
- Hoặc fix middleware logic

---

### Problem 2: Multiple API Client instances

**Issue:**

```typescript
// Wrong: Creating new instance
const client = new ApiClient(API_BASE_URL);

// Right: Using singleton
import { apiClient } from "@/lib/api";
```

**Solution:**

- Đảm bảo chỉ dùng singleton `apiClient`
- Không tự tạo instance mới

---

### Problem 3: React Strict Mode

**Issue:**

- React 18 Strict Mode mount components 2 lần
- Có thể gây double API calls
- Token có thể bị clear trong 1 trong 2 lần

**Solution:**

- Tạm tắt Strict Mode để test:

```typescript
// next.config.js
module.exports = {
  reactStrictMode: false, // Tạm thời để debug
};
```

---

### Problem 4: Cookie vs localStorage mismatch

**Check:**

```javascript
// Console
console.log("Cookie token:", document.cookie);
console.log("LocalStorage token:", localStorage.getItem("auth_token"));
```

Nếu 2 tokens khác nhau → Problem!

---

## ✅ Expected Working Flow

```
1. Login
   ├─ Call apiClient.login()
   ├─ Backend returns token
   ├─ apiClient.setToken(token)
   │  ├─ this.token = token
   │  ├─ localStorage.setItem('auth_token', token)
   │  └─ document.cookie = `token=${token}...`
   ├─ AuthContext sets user
   └─ Redirect to dashboard

2. Reload Page
   ├─ ApiClient constructor runs
   │  ├─ this.token = localStorage.getItem('auth_token')
   │  └─ console.log "Token loaded: YES"
   ├─ AuthContext useEffect runs
   │  ├─ checkAuth() is called
   │  ├─ apiClient.isAuthenticated() → true ✅
   │  ├─ Call apiClient.getProfile()
   │  ├─ Backend returns user data
   │  └─ setUser(userData)
   └─ isAuthenticated = true ✅

3. User stays logged in ✅
```

---

## 📞 Next Steps

**Sau khi chạy debug:**

1. ✅ Copy toàn bộ console logs
2. ✅ Screenshot debug page (`/debug-auth`)
3. ✅ Copy output của debug script (BƯỚC 6)
4. ✅ Check Network tab screenshot
5. ✅ Gửi tất cả thông tin này

→ Tôi sẽ phân tích và fix chính xác!

---

Created: 2025-01-21
Purpose: Debug logout on reload issue
