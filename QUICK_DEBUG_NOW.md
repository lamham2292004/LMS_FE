# ⚡ DEBUG NGAY - VẪN BỊ LOGOUT

## 🎯 Làm ngay 3 bước này:

---

### **BƯỚC 1: Mở Console & Login**

1. **F12** → Tab **Console**
2. **Login** vào hệ thống
3. **Copy toàn bộ logs** có icon 🔧, 🔍, ✅

---

### **BƯỚC 2: Reload & Check Logs**

1. **F5** (Reload trang)
2. Tìm dòng log này:

```
🔧 ApiClient constructor - Token loaded from localStorage: ???
```

**CHO TÔI BIẾT:**

- ✅ "YES" → Token có load được
- ❌ "NO" → Token bị mất!

---

### **BƯỚC 3: Test Debug Page**

1. Vào: **http://localhost:3000/debug-auth**

2. Screenshot màn hình

3. Cho tôi biết 4 dòng này:

```
Loading: ???
Authenticated: ???
User: ???
Token: ???
```

---

## 🔍 Hoặc chạy script này trong Console:

```javascript
console.clear();
console.log("=== DEBUG START ===");
console.log("1. Token exists:", !!localStorage.getItem("auth_token"));
console.log("2. Token length:", localStorage.getItem("auth_token")?.length);
console.log("3. User type:", localStorage.getItem("user_type"));

const token = localStorage.getItem("auth_token");
if (token) {
  try {
    const parts = token.split(".");
    console.log("4. Token parts:", parts.length);
    const payload = JSON.parse(atob(parts[1]));
    console.log("5. Expires:", new Date(payload.exp * 1000).toLocaleString());
    console.log("6. Is expired:", Date.now() > payload.exp * 1000);
  } catch (e) {
    console.log("4. Token ERROR:", e.message);
  }
}
console.log("=== DEBUG END ===");
```

**Copy & paste toàn bộ output cho tôi!**

---

## 📸 Screenshots cần:

1. ✅ Console logs (sau khi reload)
2. ✅ Debug page (`/debug-auth`)
3. ✅ Network tab (filter: "profile")

---

## 🚨 Nếu thấy lỗi này:

### Error: "apiClient NOT authenticated"

→ Token KHÔNG được load từ localStorage
→ **VẤN ĐỀ:** Constructor không chạy đúng

### Error: "Failed to check authentication: 401"

→ Token hết hạn hoặc invalid
→ **FIX:** Login lại

### Error: "Token expired: YES ❌"

→ Token đã hết hạn
→ **FIX:** Login lại hoặc tăng expiry ở backend

---

**Gửi cho tôi kết quả 3 bước trên để fix chính xác!** 🎯
