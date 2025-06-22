# Hệ thống Bảo mật API

## Tổng quan

Hệ thống này được thiết kế để bảo mật và ẩn tất cả API calls khỏi tab Network của trình duyệt client, đồng thời xử lý hiệu quả các file media (hình ảnh, video).

## Kiến trúc Bảo mật

### 1. Proxy API Routes
- **Vị trí**: `app/api/proxy/[...path]/route.ts`
- **Chức năng**: Làm proxy cho tất cả API calls từ client đến backend
- **Lợi ích**: Ẩn URL backend thật khỏi client
- **Xử lý**: Hỗ trợ cả text và binary data

### 2. Static Files Route
- **Vị trí**: `app/api/static/[...path]/route.ts`
- **Chức năng**: Xử lý file uploads (hình ảnh, video) với hiệu suất tối ưu
- **Lợi ích**: Cache headers, binary data handling
- **Hỗ trợ**: jpg, jpeg, png, gif, webp, mp4, avi, mov, wmv, flv, mkv, pdf, doc, docx

### 3. Endpoint Encryption
- **Utility**: `lib/utils/security.ts`
- **Chức năng**: Mã hóa endpoints để ẩn thông tin nhạy cảm
- **Ví dụ**: `/backend/auth/login` → `/b/u/login`

### 4. Security Headers
- **Middleware**: `middleware.ts`
- **Headers được thêm**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Server: Next.js` (ẩn thông tin server thật)
  - `Cache-Control: public, max-age=31536000, immutable` (cho static files)

## Cách hoạt động

### 1. API Calls
```typescript
// Client gọi API
const response = await apiGet('/backend/auth/login');
```

### 2. File Uploads
```typescript
// Client load hình ảnh
const imageUrl = getFullPath('uploads/images/2025/06/12/1749732080216-pikachu.webp');
// Kết quả: /api/static/uploads/images/2025/06/12/1749732080216-pikachu.webp
```

### 3. Route Selection
```typescript
// SecurityUtils tự động xác định route phù hợp
const route = SecurityUtils.getRouteForPath(path);
// uploads/file.jpg → /api/static
// backend/auth/login → /api/proxy
```

### 4. Backend Communication
```typescript
// Proxy gửi request đến backend thật
fetch('http://localhost:3002/backend/auth/login')
// Static route gửi request đến backend thật
fetch('http://localhost:3002/uploads/images/file.jpg')
```

## Bảo mật

### 1. Ẩn thông tin nhạy cảm
- ✅ Backend URL không hiển thị trong Network tab
- ✅ Endpoints được mã hóa
- ✅ Headers nhạy cảm được ẩn
- ✅ Request ID ngẫu nhiên

### 2. File Media Handling
- ✅ Binary data được xử lý đúng cách
- ✅ Content-type được bảo toàn
- ✅ Cache headers cho static files
- ✅ Hiệu suất tối ưu cho uploads

### 3. Security Headers
- ✅ Bảo vệ khỏi XSS
- ✅ Bảo vệ khỏi clickjacking
- ✅ Ẩn thông tin server
- ✅ Content type sniffing protection

### 4. Error Handling
- ✅ Lỗi được ẩn khỏi client
- ✅ Logging an toàn
- ✅ Fallback mechanisms

## Cấu hình

### Environment Variables
```env
BACKEND_API_URL=http://localhost:3002
NEXT_PUBLIC_ENCRYPTION_KEY=your-secret-key-32-chars
```

### API Endpoints
Tất cả endpoints được định nghĩa trong `lib/api/end-points.ts` và tự động được mã hóa khi sử dụng.

### File Uploads
Tất cả file uploads được xử lý qua `/api/static/` route với cache headers và binary data handling.

## Monitoring

### Request Tracking
- Mỗi request có unique ID
- Logging được thực hiện ở server-side
- Client không thể truy cập thông tin nhạy cảm

### File Performance
- Static files được cache với max-age=31536000
- Binary data được xử lý hiệu quả
- Content-type được bảo toàn

### Debugging
Để debug, kiểm tra:
1. Server logs
2. Network tab (chỉ thấy proxy calls)
3. Request ID trong headers
4. Cache headers cho static files

## Testing

### Test Security
```bash
npm run test:security
```

### Test Media Files
```bash
npm run test:media
```

## Lưu ý

⚠️ **Quan trọng**: 
- Không bao giờ expose `BACKEND_API_URL` ra client
- Luôn sử dụng proxy cho tất cả API calls
- Sử dụng static route cho file uploads
- Kiểm tra security headers định kỳ
- Cập nhật encryption key thường xuyên
- Monitor cache performance cho static files 