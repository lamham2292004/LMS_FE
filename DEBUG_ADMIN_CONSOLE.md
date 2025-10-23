# 🔍 DEBUG ADMIN PAGE - CONSOLE

## Bước 1: Mở Console

1. Vào trang Admin: `http://localhost:3001/authorized/lms/app/admin/courses`
2. Nhấn **F12** → Tab **Console**
3. Refresh trang (**Ctrl + R**)

---

## Bước 2: Tìm Debug Logs

Tìm logs bắt đầu với: **`🔍 Debug courses:`**

Ví dụ output mong đợi:

```javascript
🔍 Debug courses: [
  {
    id: 1,
    title: "Next Js",
    approvalStatus: "PENDING",  // ← Phải là "PENDING"
    approvalStatusType: "string"
  },
  {
    id: 2,
    title: "HTML",
    approvalStatus: "PENDING",
    approvalStatusType: "string"
  }
]

🔍 ApprovalStatus enum: {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
}
```

---

## Bước 3: Copy & Paste Output

Sau khi thấy logs, copy và gửi lại cho tôi:

- Giá trị của `approvalStatus`
- Giá trị của `approvalStatusType`

---

## Vấn đề có thể:

### ❌ Nếu `approvalStatus` = undefined hoặc null:

→ Backend không trả về field này

### ❌ Nếu `approvalStatus` = "REJECTED" (nhưng DB là PENDING):

→ Backend mapper sai

### ❌ Nếu `approvalStatusType` = "object":

→ Backend trả về object thay vì string

---

## Backup: Check Network Tab

Nếu không thấy console logs:

1. **F12** → Tab **Network**
2. Refresh trang
3. Tìm request: **`admin/all`**
4. Click vào → Tab **Response**
5. Tìm course đầu tiên, xem field `approvalStatus`

Screenshot hoặc copy JSON response gửi lại cho tôi.
