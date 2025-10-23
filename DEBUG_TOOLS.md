# 🛠️ Debug Tools & Utilities

## 🔍 JWT Token Debugger

### Quick Access

Mở trình duyệt và truy cập:

```
http://localhost:3000/debug-token.html
```

### Features

- ✅ View token from localStorage
- ✅ Decode JWT payload
- ✅ Check token expiry
- ✅ Validate user ID fields (`sub`, `userId`, `user_id`)
- ✅ Copy token to clipboard
- ✅ Real-time status check

---

## 🐛 Common Issues & Quick Fixes

### 1. "User ID not found in token"

**Cause:** Token không chứa field User ID mà frontend đang tìm

**Fix:**

```javascript
// Check token in browser console:
const token = localStorage.getItem("auth_token");
const payload = JSON.parse(atob(token.split(".")[1]));
console.log("Token payload:", payload);

// Should contain one of:
// - sub (JWT standard)
// - userId (camelCase)
// - user_id (snake_case)
```

**Solution:** ✅ Đã fix - Frontend giờ hỗ trợ cả 3 fields

---

### 2. "Token expired"

**Cause:** JWT token đã hết hạn

**Fix:**

1. Login lại để có token mới
2. Hoặc clear cache: `localStorage.clear()`

---

### 3. "Failed to fetch courses"

**Cause:** Backend không chạy hoặc CORS issue

**Check:**

```bash
# LMS Backend
curl http://localhost:8083/api/health

# System-Management Backend
curl http://localhost:8000/api/health
```

**Fix:**

- Start backend services
- Check CORS configuration
- Verify API endpoints

---

## 📊 Backend Services

### System-Management (Laravel)

```bash
Port: 8000
API Base: http://localhost:8000/api
Auth: JWT with 'sub' field
```

### LMS (Spring Boot)

```bash
Port: 8083
API Base: http://localhost:8083/api
Auth: JWT with 'userId' or 'sub' fallback
```

### Frontend (Next.js)

```bash
Port: 3000
Dev: npm run dev
Build: npm run build
```

---

## 🔧 Quick Debug Commands

### Check Token in Browser Console

```javascript
// Get token
const token = localStorage.getItem("auth_token");
console.log("Token:", token);

// Decode payload
const payload = JSON.parse(atob(token.split(".")[1]));
console.log("Payload:", payload);

// Check expiry
const now = Math.floor(Date.now() / 1000);
const isExpired = payload.exp < now;
console.log("Expired:", isExpired);
console.log("Expires at:", new Date(payload.exp * 1000));
```

### Check API Connection

```javascript
// Test LMS API
fetch("http://localhost:8083/api/health")
  .then((r) => r.json())
  .then(console.log);

// Test with auth
fetch("http://localhost:8083/api/course", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("auth_token"),
  },
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 📝 Log Files

### Frontend Logs

```
Browser Console (F12)
Network Tab - Check API calls
```

### Backend Logs

```
LMS: Check Spring Boot console
System-Management: Check Laravel logs
```

---

## 🚨 Emergency Reset

Nếu mọi thứ không hoạt động:

```javascript
// 1. Clear all storage
localStorage.clear();
sessionStorage.clear();

// 2. Clear cookies
document.cookie.split(";").forEach((c) => {
  document.cookie = c
    .replace(/^ +/, "")
    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// 3. Hard refresh
// Press: Ctrl + Shift + R

// 4. Login lại
```

---

## 📞 Support Checklist

Khi gặp lỗi, cung cấp thông tin sau:

- [ ] Screenshot lỗi
- [ ] Browser console logs
- [ ] Network tab (API calls)
- [ ] Token payload (use debug-token.html)
- [ ] User type (STUDENT/LECTURER/ADMIN)
- [ ] Current route/page

---

## 🔗 Useful Links

- Debug Tool: http://localhost:3000/debug-token.html
- API Docs: `API_DOCUMENTATION.md`
- JWT Fix: `JWT_TOKEN_FIX.md`
- Integration Guide: `LECTURER_INTEGRATION_COMPLETE.md`

---

**Last Updated:** 2025-01-XX
