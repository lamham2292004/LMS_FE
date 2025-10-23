# ✅ FIX: TOKEN KEY INCONSISTENCY

## 🐛 Vấn đề

**Triệu chứng:**

- Reload trang → Bị đẩy về login
- Back lại trang → Bị đẩy về login
- Token bị mất sau khi refresh

**Nguyên nhân:**
Có **2 API clients** đang dùng **2 keys khác nhau** để lưu/đọc token trong localStorage:

### Trước khi fix:

| File                        | Key đọc           | Key lưu           | Status |
| --------------------------- | ----------------- | ----------------- | ------ |
| `src/lib/api.ts` (main)     | `'auth_token'` ✅ | `'auth_token'` ✅ | OK     |
| `src/lib/api-client.ts`     | `'token'` ❌      | N/A               | SAI!   |
| `src/lib/lms-api-client.ts` | `'auth_token'` ✅ | N/A               | OK     |

### Flow lỗi:

```
1. User login
   └─ api.ts lưu token vào localStorage['auth_token'] ✅

2. User reload page
   └─ AuthContext checkAuth()
      └─ api-client.ts đọc token từ localStorage['token'] ❌
         └─ Không tìm thấy token!
            └─ isAuthenticated = false
               └─ ProtectedRoute redirect → /auth/login
```

---

## 🔧 Cách fix

### 1. `src/lib/api-client.ts`

**Thay đổi:**

```typescript
// ❌ BEFORE (SAI)
private getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')  // Sai key!
}

// ✅ AFTER (ĐÚNG)
private getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')  // Fixed!
}
```

---

### 2. `src/app/test-token/page.tsx` (Test page)

```typescript
// ❌ BEFORE
const token = localStorage.getItem("token");
localStorage.removeItem("token");

// ✅ AFTER
const token = localStorage.getItem("auth_token");
localStorage.removeItem("auth_token");
```

---

### 3. `src/app/page.tsx` (Root page)

```typescript
// ❌ BEFORE
const token = localStorage.getItem("token");

// ✅ AFTER
const token = localStorage.getItem("auth_token");
```

---

### 4. `src/components/UserProfileTest.tsx` (Test component)

```typescript
// ❌ BEFORE
'Authorization': `Bearer ${localStorage.getItem('token')}`

// ✅ AFTER
'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
```

---

## 📋 Tổng kết các key

### Sau khi fix, tất cả đều dùng key chuẩn:

| Key            | Mục đích                       |
| -------------- | ------------------------------ |
| `'auth_token'` | JWT token authentication ✅    |
| `'user_type'`  | User type (student/lecturer)   |
| `'user_data'`  | Optional: Full user data cache |

---

## ✅ Kết quả

Sau khi fix:

1. ✅ **Login → Token lưu vào `'auth_token'`**
2. ✅ **Reload page → Đọc token từ `'auth_token'`**
3. ✅ **Token tìm thấy → isAuthenticated = true**
4. ✅ **Không bị redirect về login**
5. ✅ **Back/Forward browser → Vẫn authenticated**

---

## 🧪 Testing

### 1. Test Login & Reload:

```bash
1. Đăng nhập vào hệ thống
2. Mở Console: Application → Local Storage
3. Verify có key 'auth_token' ✅
4. Reload trang (F5)
5. Kiểm tra: Không bị đẩy về login ✅
```

### 2. Test với Console:

```javascript
// Check token
console.log("Token:", localStorage.getItem("auth_token"));

// Check token expiry
const token = localStorage.getItem("auth_token");
if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log("Expires:", new Date(payload.exp * 1000));
  console.log("Is expired:", Date.now() > payload.exp * 1000);
}
```

### 3. Test Back/Forward:

```bash
1. Đăng nhập
2. Navigate qua các trang khác nhau
3. Click Back button
4. Click Forward button
5. Verify: Không bị logout ✅
```

---

## 🔍 Debug nếu vẫn lỗi

### Issue 1: Vẫn bị logout sau reload

**Check:**

```javascript
// Console
console.log("auth_token:", localStorage.getItem("auth_token"));
console.log("user_type:", localStorage.getItem("user_type"));
```

**Nếu token = null:**

- Token không được lưu khi login
- Check `api.ts` line 146-152 (setToken method)

**Nếu token expired:**

- Token hết hạn (thường 7 days)
- Cần đăng nhập lại

---

### Issue 2: Token có nhưng vẫn redirect

**Check AuthContext:**

```javascript
// src/features/auth/contexts/AuthContext.tsx
// Line 88-164: checkAuth function

// Console logs sẽ hiện:
// "AuthContext - Decoded token:"
// "AuthContext - User type from token:"
// "Failed to check authentication:" (nếu có lỗi)
```

**Possible causes:**

1. `getProfile()` API call fail (401, 403, 500)
2. Token format invalid
3. Backend không nhận token

---

### Issue 3: Token bị clear tự động

**Check LmsApiClient:**

```typescript
// src/lib/lms-api-client.ts line 42-54
// Có logic check token expiry và clear token
```

**Nếu token expired:**

- Will show alert: "Token đã hết hạn"
- Auto clear token
- Redirect to login

**Solution:**

- Tăng token expiry time ở backend
- Implement refresh token mechanism

---

## 🎯 Standard Key Usage

### Recommended localStorage keys:

```typescript
// Auth
'auth_token'     → JWT token (main authentication)
'user_type'      → 'student' | 'lecturer'
'user_data'      → Optional full user profile cache

// Preferences
'theme'          → 'light' | 'dark'
'user_preferences' → JSON object

// DO NOT USE:
'token'          → ❌ Deprecated
'jwt'            → ❌ Inconsistent
```

---

## 📚 Related Files

### Fixed:

- ✅ `src/lib/api-client.ts`
- ✅ `src/app/test-token/page.tsx`
- ✅ `src/app/page.tsx`
- ✅ `src/components/UserProfileTest.tsx`

### Using correct key:

- ✅ `src/lib/api.ts`
- ✅ `src/lib/lms-api-client.ts`
- ✅ `src/lib/token-manager.ts`
- ✅ `src/features/auth/contexts/AuthContext.tsx`

---

## 🎉 Summary

**What was wrong:**

- Multiple files using different localStorage keys for the same token

**What we fixed:**

- Standardized all files to use `'auth_token'`

**What user should see:**

- ✅ Login works
- ✅ Reload page stays logged in
- ✅ Back/forward browser works
- ✅ No unexpected logouts

---

Created: 2025-01-21
Status: ✅ Fixed
Issue: Token key inconsistency
Solution: Standardize to 'auth_token'
