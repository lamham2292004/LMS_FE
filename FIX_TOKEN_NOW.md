# 🚨 FIX TOKEN EXPIRED - NGAY BÂY GIỜ

## ❌ Vấn Đề: Token Đã Hết Hạn

```
Token đã hết hạn: JWT expired at 2025-10-10T11:44:35Z
Current time: 2025-10-11T12:24:52
```

---

## ✅ GIẢI PHÁP NHANH (30 giây)

### **Bước 1: Mở Browser Console**

Nhấn `F12` hoặc `Ctrl+Shift+J`

### **Bước 2: Chạy lệnh này**

```javascript
localStorage.removeItem("auth_token");
```

### **Bước 3: Reload trang**

Nhấn `F5` hoặc `Ctrl+R`

### **Bước 4: Login lại**

Truy cập: `http://localhost:3000/auth/login`

---

## 🎉 XONG! Token mới đã được tạo

---

## 🛠️ Tính Năng Mới (Đã Fix)

Tôi đã thêm **Token Manager** tự động:

1. ✅ **Tự động check** token hết hạn trước mỗi request
2. ✅ **Cảnh báo** khi token sắp hết (< 10 phút)
3. ✅ **Tự động clear** token hết hạn
4. ✅ **Popup hỏi** user có muốn login lại không

---

## 🔍 Debug Token

Truy cập trang debug để xem chi tiết:

```
http://localhost:3000/debug-token
```

Trang này sẽ cho bạn biết:

- ✅ Token có hết hạn không
- ✅ Thời gian còn lại
- ✅ Thông tin token
- ✅ Nút clear/login

---

## 📝 Files Mới Đã Tạo

1. `src/lib/token-manager.ts` - Quản lý token
2. `src/components/TokenStatus.tsx` - Hiển thị trạng thái token
3. `src/app/debug-token/page.tsx` - Debug token
4. `TOKEN_FIX_GUIDE.md` - Hướng dẫn chi tiết

---

## 🔧 Tăng Thời Gian Token (Optional)

Nếu muốn token tồn tại lâu hơn, edit Laravel `.env`:

```env
JWT_TTL=10080  # 7 days (thay vì 60 minutes)
JWT_REFRESH_TTL=20160  # 14 days
```

Sau đó:

```bash
php artisan config:clear
php artisan config:cache
```

---

## ✨ Từ Giờ Trở Đi

**Token Manager sẽ tự động:**

- ⚠️ Cảnh báo khi token sắp hết
- ❌ Báo lỗi khi token hết hạn
- 🔄 Gợi ý login lại
- 🗑️ Xóa token cũ

**Bạn không cần lo lắng về token nữa!** 🎉

---

## 🆘 Nếu Vẫn Lỗi

1. Check backend đang chạy: `http://localhost:8083/api/health`
2. Check token trong localStorage: Console → Application → Local Storage
3. Visit debug page: `http://localhost:3000/debug-token`
4. Clear all cookies & local storage
5. Login lại

---

**Happy Coding! 🚀**
