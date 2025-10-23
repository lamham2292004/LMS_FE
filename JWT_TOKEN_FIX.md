# 🔧 JWT Token User ID Field Fix

## 🐛 Vấn đề

Frontend không lấy được User ID từ JWT token, gây lỗi: **"User ID not found in token"**

## 🔍 Nguyên nhân

Hệ thống sử dụng **2 backend khác nhau** với cấu trúc JWT token khác nhau:

### 1. System-Management Backend (Laravel)

**Tạo token với `sub` field (JWT standard):**

```php
// AuthController.php line 119
'sub' => $user->id,
'user_type' => 'lecturer',
'username' => 'gv_GV002',
'lecturerCode' => 'GV002',
...
```

**Token payload thực tế:**

```json
{
  "sub": 1,
  "user_type": "lecturer",
  "username": "gv_GV002",
  "studentCode": null,
  "lecturerCode": "GV002",
  "exp": 1234567890,
  "iat": 1234567890
}
```

### 2. LMS Backend (Spring Boot)

**Đọc token với fallback logic:**

```java
// JwtTokenUtil.java lines 61-66
Object userIdObj = claims.get("userId");
if (userIdObj == null) {
    userIdObj = claims.getSubject(); // Fallback to "sub"
}
```

Backend LMS **hỗ trợ cả 3 trường hợp**:

- `userId` (camelCase)
- `user_id` (snake_case)
- `sub` (JWT standard)

### 3. Frontend (Next.js) - VẤN ĐỀ

**Code cũ chỉ tìm 2 field:**

```typescript
// ❌ KHÔNG TÌM THẤY
const lecturerId = decodedToken.userId || decodedToken.user_id;
```

Thiếu field `sub`!

---

## ✅ Giải pháp

### 1. Update `DecodedToken` interface

**File:** `src/lib/token-manager.ts`

```typescript
export interface DecodedToken {
  exp: number;
  iat: number;
  sub?: number; // ✅ JWT standard - subject (user ID)
  userId?: number; // Spring Boot style
  user_id?: number; // Snake case style
  email: string;
  userType?: string;
  user_type?: string;
  [key: string]: any;
}
```

### 2. Update User ID extraction logic

**File:** `src/lib/hooks/useLecturerCourses.ts`

```typescript
// ✅ Thử cả 3 field theo thứ tự ưu tiên
const lecturerId =
  decodedToken.sub || decodedToken.userId || decodedToken.user_id;

if (!lecturerId) {
  console.error("Token payload:", decodedToken);
  throw new Error("User ID not found in token");
}

console.log("✅ Lecturer ID from token:", lecturerId);
```

---

## 🎯 Kết quả

✅ **Hoạt động với cả 3 backend:**

1. System-Management (Laravel) - `sub` field
2. LMS (Spring Boot) - `userId` field
3. Bất kỳ service nào dùng `user_id` (snake_case)

✅ **Fallback chain:**

```
sub → userId → user_id
```

---

## 📊 JWT Token Structure Comparison

| Backend                     | User ID Field              | User Type Field                    | Style                     |
| --------------------------- | -------------------------- | ---------------------------------- | ------------------------- |
| System-Management (Laravel) | `sub`                      | `user_type`                        | JWT Standard + snake_case |
| LMS (Spring Boot)           | `userId` (fallback: `sub`) | `userType` (fallback: `user_type`) | camelCase + fallback      |
| Frontend (Next.js)          | ✅ Hỗ trợ cả 3             | ✅ Hỗ trợ cả 2                     | Flexible                  |

---

## 🧪 Testing

### Check token payload in browser console:

```javascript
// Paste in browser console
const token = localStorage.getItem("auth_token");
if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log("Token payload:", payload);
  console.log("User ID:", payload.sub || payload.userId || payload.user_id);
}
```

### Expected output:

```json
{
  "sub": 1,
  "user_type": "lecturer",
  "username": "gv_GV002",
  "lecturerCode": "GV002",
  "exp": 1234567890,
  "iat": 1234567890
}
User ID: 1
```

---

## 🔒 Security Notes

1. **JWT Standard Field `sub`** (Subject):

   - Chuẩn RFC 7519
   - Nên dùng cho User ID
   - Được hỗ trợ bởi hầu hết thư viện JWT

2. **Custom Claims**:

   - `userId`, `user_id`: Custom fields
   - Linh hoạt nhưng không chuẩn
   - Cần đồng bộ giữa các services

3. **Best Practice**:
   - Ưu tiên `sub` cho User ID
   - Document rõ JWT structure
   - Có fallback logic cho compatibility

---

## 📝 Files Changed

1. ✅ `src/lib/token-manager.ts` - Add `sub` field to interface
2. ✅ `src/lib/hooks/useLecturerCourses.ts` - Update extraction logic
3. ✅ `JWT_TOKEN_FIX.md` - Documentation

---

## 🚀 Next Steps

1. **Refresh browser** (Ctrl+Shift+R)
2. **Login lại** nếu cần
3. **Navigate** to Lecturer Dashboard
4. **Check console** - Should see: `✅ Lecturer ID from token: 1`

---

## ⚠️ Common Issues

### Issue: Still getting "User ID not found"

**Solution:**

- Clear localStorage: `localStorage.clear()`
- Login lại để có token mới
- Check token expiry

### Issue: Token expired

**Solution:**

- Token có thể đã hết hạn
- Login lại để refresh token

### Issue: Wrong user type

**Solution:**

- Đảm bảo login với account LECTURER
- Check `user_type` field in token

---

**Status:** ✅ FIXED  
**Date:** 2025-01-XX  
**Author:** AI Assistant
