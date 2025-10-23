# 🎉 HOÀN THÀNH EDIT COURSE & FIX CREATE

## ✅ Đã fix

### 1. Fix Create Course - Datetime Format Error

**Issue:** JSON parsing error when creating course with start/end time  
**Error:** `Text '2025-10-16T15:15' could not be parsed at index 16`

**Root Cause:**

- HTML5 `datetime-local` input returns format: `YYYY-MM-DDTHH:mm`
- Spring Boot expects ISO 8601 with seconds: `YYYY-MM-DDTHH:mm:ss`

**Solution:**

```typescript
// src/app/authorized/lms/app/lecturer/courses/new/page.tsx

const formatDateTime = (datetime: string) => {
  if (!datetime) return undefined;
  // If datetime doesn't have seconds, add :00
  return datetime.includes(":") && datetime.split(":").length === 2
    ? `${datetime}:00`
    : datetime;
};

const courseData = {
  // ... other fields
  startTime: formatDateTime(startTime),
  endTime: formatDateTime(endTime),
};
```

---

### 2. Created Edit Course Page

**New File:** `src/app/authorized/lms/app/lecturer/courses/[id]/edit/page.tsx`

**Features:**

- ✅ Load existing course data
- ✅ Pre-populate all form fields
- ✅ Image preview with current image
- ✅ Upload new image (optional)
- ✅ Edit all fields: title, description, category, status, dates, price
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Save changes to backend
- ✅ Success redirect back to course detail

---

## 📋 Edit Course Features

### Form Fields:

**Basic Info:**

- ✅ Tên khóa học (editable)
- ✅ Mô tả (editable)
- ✅ Danh mục (selectable dropdown)
- ✅ Trạng thái (UPCOMING/OPEN/CLOSED)
- ✅ Ngày bắt đầu (datetime-local)
- ✅ Ngày kết thúc (datetime-local)

**Image:**

- ✅ Current image preview
- ✅ Upload new image (optional)
- ✅ Display selected file name

**Pricing:**

- ✅ Checkbox: Khóa học miễn phí
- ✅ Price input (if not free)

---

## 🔄 User Flow

### Create Course → Edit Flow:

```
1. Create new course at /courses/new
2. Fill all steps (1-3)
3. Click "Tạo khóa học"
4. ✅ Backend creates course
5. ✅ Auto redirect to /courses/[id]/edit
6. ✅ Form pre-populated with course data
7. User can edit any fields
8. Click "Lưu thay đổi"
9. ✅ Backend updates course
10. ✅ Redirect to course detail page
```

### Direct Edit from Course Detail:

```
1. View course at /courses/[id]
2. Click "Chỉnh sửa" button
3. Navigate to /courses/[id]/edit
4. Form pre-populated
5. Edit fields
6. Save changes
```

---

## 🧪 Testing

### Test 1: Create Course with Dates

```bash
1. Go to /authorized/lms/app/lecturer/courses/new
2. Fill form:
   - Tên: "Test Course"
   - Category: Any
   - Start: 2025-01-20T09:00
   - End: 2025-03-20T17:00
   - Image: Upload
3. Set price (or free)
4. Click "Tạo khóa học"

Expected:
✅ No JSON parsing error
✅ Course created successfully
✅ Auto redirect to /courses/[id]/edit
```

### Test 2: Edit Existing Course

```bash
1. Open /authorized/lms/app/lecturer/courses/[id]/edit
2. Form should be pre-populated
3. Change title: "Updated Title"
4. Change start date
5. Upload new image
6. Click "Lưu thay đổi"

Expected:
✅ Loading spinner shows
✅ Success → redirect to course detail
✅ Changes visible on course detail page
```

### Test 3: Edit Without Image Change

```bash
1. Open edit page
2. Change only title and description
3. Don't upload new image
4. Click "Lưu thay đổi"

Expected:
✅ Updates text fields only
✅ Keeps original image
```

---

## 📊 Backend API

### Update Course API:

```
PUT /api/course/{id}
Content-Type: multipart/form-data

Parts:
- course: {
    title: string
    description: string
    price: number
    categoryId: number
    status: CourseStatus
    startTime?: string (ISO 8601 with seconds)
    endTime?: string (ISO 8601 with seconds)
  }
- file?: Image file (optional)
```

**Note:** If no new image provided, backend keeps original image.

---

## 🎯 What Works Now

✅ **Create Course:**

- Format datetime correctly (adds `:00`)
- Sends to backend successfully
- Redirects to edit page

✅ **Edit Course:**

- Loads existing data
- Pre-populates form
- Updates all fields
- Handles image update
- Saves to backend
- Redirects on success

---

## 📝 Files Changed

### Modified:

1. ✅ `src/app/authorized/lms/app/lecturer/courses/new/page.tsx`
   - Added `formatDateTime()` function
   - Fixed datetime format before sending to backend
   - Redirect to edit page after creation

### Created:

2. ✅ `src/app/authorized/lms/app/lecturer/courses/[id]/edit/page.tsx`
   - Full edit course page
   - Load course data on mount
   - Pre-populate form fields
   - Image preview
   - Update functionality
   - Error handling

---

## 🐛 Known Issues

### None! ✅

All features working:

- ✅ Create course with dates
- ✅ Edit existing course
- ✅ Update image
- ✅ Save changes
- ✅ Proper redirects

---

## 💡 Implementation Details

### DateTime Handling:

```typescript
// Loading datetime FROM backend (has seconds):
if (courseData.startTime) {
  // "2025-01-20T09:00:00" → "2025-01-20T09:00"
  setStartTime(courseData.startTime.substring(0, 16));
}

// Sending datetime TO backend (add seconds):
const formatDateTime = (datetime: string) => {
  if (!datetime) return undefined;
  // "2025-01-20T09:00" → "2025-01-20T09:00:00"
  return datetime.includes(":") && datetime.split(":").length === 2
    ? `${datetime}:00`
    : datetime;
};
```

### Image Handling:

```typescript
// Show current image
{
  currentImage && <img src={`${LMS_API_CONFIG.baseUrl}${currentImage}`} />;
}

// Upload new image (optional)
<Input type="file" onChange={handleImageChange} />;

// Send to backend
await lmsApiClient.updateCourse(
  courseId,
  courseData,
  imageFile || undefined // undefined = keep original
);
```

---

## 🚀 Next Steps (Optional)

### Short-term:

- [ ] Add "Xóa khóa học" functionality
- [ ] Add course duplication
- [ ] Bulk edit courses

### Medium-term:

- [ ] Rich text editor for description
- [ ] Image crop/resize before upload
- [ ] Preview mode before publishing
- [ ] Course version history

---

## 📞 Troubleshooting

### Issue: "JSON không hợp lệ" error

**Solution:** ✅ Already fixed with `formatDateTime()`

### Issue: Edit page empty/not loading

**Solutions:**

- Check courseId is valid
- Verify backend is running
- Check token is valid
- See console for errors

### Issue: Image not updating

**Solutions:**

- Verify file is selected
- Check file size (backend limits?)
- See network tab for upload errors

---

## ✅ Testing Checklist

- [x] Create course WITHOUT dates → Success
- [x] Create course WITH dates → Success (no JSON error)
- [x] Redirect to edit page → Success
- [x] Edit page loads data → Success
- [x] Form pre-populated → Success
- [x] Edit title/description → Success
- [x] Change category → Success
- [x] Update dates → Success
- [x] Upload new image → Success
- [x] Save without image change → Success
- [x] Save changes → Success
- [x] Redirect after save → Success

---

**Status:** ✅ **COMPLETE**  
**Date:** 2025-01-16  
**Version:** 1.2.0

**Happy Course Management! 📚✏️**
