# 🔍 TEST BACKEND RESPONSE

## Bước 1: Test Backend Trực Tiếp

### Option 1: Dùng Browser

Mở link này trong browser (đã login admin):

```
http://localhost:8083/api/course/admin/all
```

Copy **TOÀN BỘ** response và gửi lại cho tôi.

---

### Option 2: Dùng Postman

```http
GET http://localhost:8083/api/course/admin/all
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### Option 3: Network Tab trong Frontend

1. Vào trang Admin: `http://localhost:3001/authorized/lms/app/admin/courses`
2. **F12** → Tab **Network**
3. **Ctrl + R** (refresh)
4. Tìm request: **`all`** (hoặc `admin/all`)
5. Click vào → Tab **Response**
6. **Copy toàn bộ JSON** gửi lại

---

## Kết quả mong đợi:

```json
{
  "code": 1000,
  "result": [
    {
      "id": 1,
      "title": "Next Js",
      "approvalStatus": "PENDING",  // ← Phải là "PENDING" string
      "price": 0,
      "teacherId": 1,
      ...
    }
  ]
}
```

---

## ❌ Nếu `approvalStatus` khác "PENDING":

→ Backend đang map SAI → Phải fix backend

---

## ✅ Nếu `approvalStatus` = "PENDING":

→ Backend đúng, Frontend parse SAI → Phải fix frontend

---

**Hãy gửi cho tôi response JSON để tôi xem!**
