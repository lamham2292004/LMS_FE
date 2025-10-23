# 🚀 TEST NGAY BÂY GIỜ!

## ⚡ 3 BƯỚC - 2 PHÚT

### **1️⃣ Start Backend**

```bash
cd f:\DoAn\LMS
mvn spring-boot:run
```

✅ Đợi thấy: "Started LmsApplication"

### **2️⃣ Check Token**

Mở browser: `http://localhost:3000/debug-token`

**Nếu token ❌ EXPIRED:**

```
→ Login lại: http://localhost:3000/auth/login
```

### **3️⃣ Xem Pages**

**Dashboard:**

```
http://localhost:3000/authorized/lms/app/student
```

→ Thấy stats thật từ backend ✅

**Browse Courses:**

```
http://localhost:3000/authorized/lms/app/student/browse
```

→ Thấy courses từ backend ✅

**My Courses:**

```
http://localhost:3000/authorized/lms/app/student/courses
```

→ Thấy enrollments của bạn ✅

---

## 🎯 DEMO NHANH

### **Test Enroll:**

1. Vào: `/authorized/lms/app/student/browse`
2. Click **"Đăng ký"** trên một khóa học
3. Alert "Đăng ký thành công!"
4. Vào: `/authorized/lms/app/student/courses`
5. Thấy khóa học vừa enroll ✅

### **Test Search:**

1. Vào: `/authorized/lms/app/student/browse`
2. Gõ tên khóa học vào ô search
3. Kết quả filter real-time ✅

### **Test Filter:**

1. Vào: `/authorized/lms/app/student/browse`
2. Click vào category button
3. Chỉ hiển thị courses của category đó ✅

---

## ✅ THÀNH CÔNG KHI

- [x] Dashboard hiển thị số liệu thực (không phải mock data)
- [x] Browse hiển thị courses từ backend
- [x] My Courses hiển thị enrollments
- [x] Enroll button hoạt động
- [x] Search tìm kiếm được
- [x] Filter theo category hoạt động

---

## ❌ NẾU CÓ VẤN ĐỀ

### **Không thấy courses:**

```bash
# Check backend có data?
curl http://localhost:8083/api/course

# Nếu empty → Insert data:
# Vào MySQL và chạy:
INSERT INTO category (name, description, status)
VALUES ('Web Development', 'Learn web dev', 'ACTIVE');

INSERT INTO course (title, description, price, category_id, status)
VALUES ('React Basics', 'Learn React', 500000, 1, 'PUBLISHED');
```

### **Token expired:**

```javascript
// Browser Console:
localStorage.clear();
// Rồi login lại
```

### **CORS Error:**

```yaml
# f:\DoAn\LMS\src\main\resources\application.yaml
cors:
  allowed-origins:
    - http://localhost:3000
```

---

## 📸 MÀN HÌNH MẪU

### **Dashboard:**

```
┌─────────────────────────────────────────────┐
│  Xin chào, Sinh viên! 👋                    │
│  Hôm nay bạn đã sẵn sàng học chưa?          │
│  [Tiếp tục học] [Khóa học của tôi]          │
└─────────────────────────────────────────────┘

Stats:
┌───────────┬───────────┬───────────┬───────────┐
│ Tổng: 5   │ Đang: 3   │ Hoàn: 2   │ Có: 20    │
└───────────┴───────────┴───────────┴───────────┘

Khóa học đang học:
[=========== 65% ] React Basics
[======     40% ] Python Course
```

### **Browse:**

```
Search: [____________] [🔄]
Categories: [Tất cả] [Web] [Python] [AI] ...

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 📸 Image     │ │ 📸 Image     │ │ 📸 Image     │
│ React Basics │ │ Python Pro   │ │ AI Course    │
│ 500,000đ     │ │ Miễn phí     │ │ 1,200,000đ   │
│ [Đăng ký]    │ │ [Đăng ký]    │ │ [Đăng ký]    │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🎉 HOÀN TẤT!

Nếu bạn thấy các pages hiển thị **dữ liệu thật từ backend**, nghĩa là đã kết nối **THÀNH CÔNG** rồi! 🎊

**Chi tiết hơn:** Đọc [`CONNECTED_TO_BACKEND.md`](./CONNECTED_TO_BACKEND.md)
