# Hướng Dẫn Kết Nối LMS Frontend và Backend

## 🚀 Tổng Quan

Dự án LMS đã được cấu hình để kết nối Frontend (Next.js) với Backend (Laravel/PHP). Tài liệu này hướng dẫn cách thiết lập và kiểm tra kết nối.

## 📋 Cấu Hình Đã Thực Hiện

### 1. Environment Variables
- ✅ Tạo file `.env.local` với cấu hình API URL
- ✅ Cấu hình `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

### 2. API Client
- ✅ Cập nhật `src/lib/api-client.ts` với error handling nâng cao
- ✅ Hỗ trợ authentication với JWT tokens
- ✅ Retry logic và timeout handling
- ✅ CORS configuration

### 3. Next.js Configuration
- ✅ Cập nhật `next.config.mjs` với CORS headers
- ✅ API rewrites để proxy requests
- ✅ Environment variables configuration

### 4. Error Handling
- ✅ Enhanced error messages trong AuthContext
- ✅ Custom hooks với retry logic (`src/hooks/useApi.ts`)
- ✅ Loading states và error states

## 🔧 Cách Chạy Dự Án

### Frontend (Next.js)
```bash
# Cài đặt dependencies
npm install

# Chạy development server
PORT=3000 npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

### Backend (Laravel)
```bash
# Chạy Laravel server (giả sử backend chạy trên port 8000)
php artisan serve --port=8000
```

Backend sẽ chạy tại: http://localhost:8000

## 🧪 Kiểm Tra Kết Nối

### 1. Sử dụng API Test Page
Truy cập: http://localhost:3000/api-test

Trang này sẽ test các endpoint sau:
- Health Check
- Login Test
- Get Profile
- Get Students
- Get Classes
- Get Departments

### 2. Kiểm Tra Network Tab
1. Mở Developer Tools (F12)
2. Vào tab Network
3. Thực hiện các thao tác đăng nhập
4. Kiểm tra các API calls có thành công không

### 3. Kiểm Tra Console Logs
Các API calls sẽ được log chi tiết trong console để debug.

## 📡 API Endpoints Được Hỗ Trợ

### Authentication
- `POST /v1/login` - Đăng nhập
- `POST /v1/logout` - Đăng xuất
- `GET /v1/me` - Lấy thông tin user
- `POST /v1/refresh` - Làm mới token

### Students
- `GET /v1/students` - Danh sách sinh viên
- `GET /v1/student/profile` - Profile sinh viên
- `PUT /v1/student/profile` - Cập nhật profile

### Lecturers
- `GET /v1/lecturers` - Danh sách giảng viên
- `GET /v1/lecturer/profile` - Profile giảng viên
- `PUT /v1/lecturer/profile` - Cập nhật profile

### Classes
- `GET /v1/classes` - Danh sách lớp học
- `POST /v1/classes` - Tạo lớp mới
- `GET /v1/classes/{id}` - Chi tiết lớp học
- `PUT /v1/classes/{id}` - Cập nhật lớp học
- `DELETE /v1/classes/{id}` - Xóa lớp học

### Departments
- `GET /v1/departments` - Danh sách khoa/phòng ban
- `GET /v1/departments/tree` - Cây cấu trúc khoa/phòng ban
- `POST /v1/departments` - Tạo khoa/phòng ban mới

## 🔍 Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS, kiểm tra:
1. Backend có cấu hình CORS đúng không
2. Frontend có gửi đúng headers không
3. API URL có đúng không

### Lỗi 401 Unauthorized
1. Kiểm tra token có được lưu đúng không
2. Token có hết hạn không
3. Backend có validate token đúng không

### Lỗi 500 Internal Server Error
1. Kiểm tra backend có chạy không
2. Kiểm tra database connection
3. Kiểm tra logs của backend

### Lỗi Network
1. Kiểm tra backend có chạy trên port 8000 không
2. Kiểm tra firewall settings
3. Kiểm tra API URL trong `.env.local`

## 📝 Cấu Hình Nâng Cao

### Thay Đổi API URL
Chỉnh sửa file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-backend-url/api
```

### Thêm Endpoint Mới
1. Thêm endpoint vào `src/lib/config.ts`
2. Thêm method vào `src/lib/api-client.ts`
3. Tạo custom hook trong `src/hooks/useApi.ts`

### Custom Error Handling
Sử dụng `useApi` hook với options:
```typescript
const { data, loading, error, execute } = useApi(apiClient.get, {
  retries: 3,
  retryDelay: 1000,
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error),
});
```

## 🎯 Kết Luận

Frontend và Backend đã được kết nối thành công với:
- ✅ API client hoàn chỉnh
- ✅ Error handling nâng cao
- ✅ Authentication flow
- ✅ CORS configuration
- ✅ Testing tools

Để bắt đầu sử dụng, hãy:
1. Chạy backend trên port 8000
2. Chạy frontend trên port 3000
3. Truy cập http://localhost:3000/api-test để test kết nối
4. Thực hiện đăng nhập để test authentication flow

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console logs trong browser
2. Network tab trong Developer Tools
3. Backend logs
4. File `API_DOCUMENTATION.md` để biết chi tiết API