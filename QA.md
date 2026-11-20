# Báo cáo QA — 20/11/2026

## Kết quả cuối cùng

| Kiểm tra | Kết quả và giới hạn |
| --- | --- |
| npm run lint | Exit 0; cấu hình hiện tại kiểm tra quy tắc React Hooks, không phải toàn bộ chất lượng code |
| npm test | 14/14 tests, 4 file; React Testing Library + jsdom, không phải browser E2E |
| npm run build | Exit 0; 47 modules |
| npm audit | 0 vulnerabilities tại thời điểm chạy |
| Direct URLs | /people/1, /people/3, /people/nope, /contact, /missing trả HTTP 200 và SPA HTML qua Vite preview |
| Code splitting | Chunk riêng PersonDetail-CetZh8pO.js (0.90 kB) và Contact-CsMUGPm5.js (2.12 kB); chunk chính 270.71 kB |

Phiên bản cài thực tế: React 19.3.1, React Router 7.18.6, Vite 6.4.6, Vitest 5.1.1. Bản preview: http://127.0.0.1:4173/.

## Luồng đã xác minh trong test

- Route index và active NavLink; chọn người khác nhau, Back/Forward qua MemoryRouter.
- Mở route chi tiết trực tiếp trong MemoryRouter, tra đúng người; ID sai và URL sai có fallback.
- Validation biên, submit trống, focus trường lỗi đầu tiên, nhập giá trị hợp lệ, sửa thành sai và xóa thông báo thành công.
- Blur mới hiện lỗi; khi tên đã hợp lệ, submit focus email.
- Skeleton có aria-busy/live, giữ header và danh sách; skeleton form không có fake controls nhận focus.
- Các trường có required và aria-describedby liên kết tới đúng lỗi.
- Skip link dẫn tới main có tabindex=-1.
- Error boundary hiển thị thông báo và đường tải lại khi component lỗi.
- Mock module PersonDetail ném lỗi khi import: kiểm tra ngay trong App thật cho thấy thông báo lỗi xuất hiện nhưng điều hướng chung và danh sách người vẫn còn. Đây là mô phỏng import bị từ chối, chưa phải thử ngắt mạng trong browser.

## Lỗi/thiếu sót đã xử lý

1. Skeleton form trước đó dùng avatar và các hàng chi tiết người: đã thay bằng tiêu đề, mô tả, hai ô nhập và textarea placeholder.
2. Chưa xử lý module lazy tải lỗi: thêm PageBoundary tại mỗi vùng lazy; có thông báo lỗi và đường tải lại, bảo toàn layout chung. Reload được dùng vì React.lazy cache kết quả import lỗi. Với vùng người, đường phục hồi quay lại /people; với form là /contact.
3. Đích skip link chưa nhận focus: bổ sung tabindex=-1 cho main.
4. Trường bắt buộc chưa được khai báo bằng thuộc tính required: đã bổ sung; vẫn dùng noValidate để quy tắc custom xử lý submit.
5. Cập nhật values/touched dùng functional state update để dựa trên state mới nhất.
6. Định dạng mã nguồn và bổ sung tests cùng hướng dẫn README.md.

## Browser QA chưa hoàn tất

Đã thử lại công cụ Computer Use native trên Chrome. Đọc được cửa sổ và screenshot, nhưng khi mở tab kiểm tra, hệ thống chặn thao tác vì không xác định được URL hiện tại đủ tin cậy để áp dụng policy. Đã dừng thao tác browser; không có bằng chứng browser của ứng dụng trong lượt này.

Do đó chưa xác minh trực quan mobile/overflow, zoom 200%, Back/Forward browser thật, reload-render browser thật, skeleton khi throttling mạng, screen reader thật hoặc số đo CLS. Test jsdom và HTTP không thay thế các bước này. Không khẳng định CLS = 0 hoặc toàn bộ QA đã đạt. Hướng dẫn kiểm tra các phần còn lại có trong README.md.

Không có code legacy để xác nhận chuỗi 5 effects, render count trước/sau hay lỗi Maximum update depth exceeded. Form mới không có useEffect hoặc state giá trị trùng giữa cha và con. Dữ liệu mẫu; form chỉ kiểm tra tại trình duyệt, không gửi backend.
