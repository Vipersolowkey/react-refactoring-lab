# People Studio — React Refactoring Lab

Ứng dụng được tạo mới trong D:\execercise vì thư mục ban đầu trống. Dữ liệu người là dữ liệu mẫu. Form chỉ kiểm tra tại trình duyệt, không có backend, không gửi hoặc lưu lời nhắn. Không có phiên bản legacy để đo trước/sau hay tái hiện lỗi từ slide.

## Chạy

Yêu cầu Node.js 22 trở lên (đã chạy bằng Node 24.14.0).

```powershell
cd D:\execercise
npm ci
npm run dev
```

Mở URL do Vite in ra. Bản production:

```powershell
npm run build
npm run preview -- --port 4173
```

Mở http://127.0.0.1:4173. Khi đưa lên hosting khác, cấu hình fallback các URL SPA về index.html; phản hồi HTTP 200 của Vite cho URL không tồn tại không phải HTTP 404 từ server. Trang 404 của bài này được render phía client.

## File theo bài

| Yêu cầu | File |
| --- | --- |
| 1.2 / 1.2.1: Routes, element, index, nested layout, Outlet, active NavLink, 404 | src/main.jsx, src/App.jsx |
| 1.2.2: Grid, useParams, people.find, ID sai, dl/dt/dd | src/App.jsx, src/pages/PersonDetail.jsx, src/people.js, src/styles.css |
| 1.1: lazy cấp module, Suspense, skeleton, aria-busy/live, reduced motion | src/App.jsx, src/components/Skeleton.jsx, src/styles.css |
| Form: state chính, touched, focus lỗi, accessibility | src/components/SimpleForm.jsx, src/components/InputField.jsx, src/validation.js |
| Kiểm tra | tests/app.test.jsx, tests/loading.test.jsx |

## Kiểm tra thủ công

1. Mở / rồi /people: điều hướng được tô active; chọn mỗi người và kiểm tra URL /people/1, /people/2, /people/3. Back/Forward phải đổi chi tiết tương ứng.
2. Mở /people/3 trực tiếp rồi reload. /people hiển thị hướng dẫn chọn người; /people/nope hiển thị ID không tồn tại; /missing hiển thị trang 404.
3. Chạy bản production. Mở DevTools > Network, chọn Disable cache và Slow 3G. Trong tab mới mở /people/1 rồi /contact. Skeleton phải có trước nội dung; header vẫn còn, danh sách vẫn còn khi tải chi tiết. Sau khi module đã tải, nó được cache trong phiên; không mong skeleton xuất hiện ở mọi lần chọn người. Có thể đóng tab và mở tab mới để thử cold load. Không có delay giả trong mã production.
4. DevTools > chế độ thiết bị, thử 320, 375, 720 và 1280 px. Master-detail chuyển một cột ở <=720 px. Kiểm tra tên, email, textarea và navigation không tràn ngang, kể cả zoom 200%.
5. Form ban đầu không báo lỗi. Blur Email trống để thấy lỗi. Submit trống phải focus Họ tên. Điền tên hợp lệ rồi submit phải focus Email. Điền tên >=2 ký tự, email hợp lệ và lời nhắn >=10 ký tự để thấy thông báo hợp lệ. Sửa email sai phải xóa thông báo thành công. Tab/Shift+Tab phải có viền focus.
6. Muốn đánh giá CLS, dùng Performance/Lighthouse với cache tắt và ghi kết quả thực tế theo viewport; chưa có số đo CLS trong lần bàn giao này.

## Quy tắc validation

- Họ tên sau trim: ít nhất 2 ký tự.
- Email sau trim: định dạng cơ bản user@domain.suffix (không xác minh hộp thư tồn tại).
- Lời nhắn sau trim: ít nhất 10 ký tự.
- Đây là quy tắc mới cho bài thực hành, không phải quy tắc kế thừa từ project cũ.
- Dữ liệu đồng bộ tại trình duyệt; không có validation bất đồng bộ nên chưa cần cơ chế hủy/loại kết quả cũ.

## Exercise 1.3 — phân tích code thực tế

InputField không có state hoặc useEffect; nó nhận value, onChange, onBlur và error qua props. SimpleForm giữ values là nguồn chính; touched, submitted và success là trạng thái tương tác riêng. errors được tính bằng hàm validate(values), không lưu thêm vào state; không lưu một bản isValid khác.

Luồng gõ phím: onChange -> cập nhật values trong SimpleForm và xóa success -> render SimpleForm -> validate(values) -> truyền value/error vào InputField. Không có bước effect đồng bộ ngược lên cha hoặc xuống con. Khi submit, cùng hàm validate đã suy ra errors từ values hiện tại; tìm trường lỗi đầu tiên và focus trực tiếp qua form.elements. Việc thay đổi touched qua onBlur chỉ điều khiển lúc hiển thị lỗi.

Không quan sát hoặc đo số lần render thực trong browser; không khẳng định một phím tạo đúng một render. React có thể batch cập nhật, và StrictMode development có thể gọi lại render để phát hiện lỗi. Bản mới không dùng chuỗi 5 useEffect; không có bằng chứng về lỗi Maximum update depth exceeded hay race condition trong phiên bản cũ vì không được cung cấp mã cũ.

Nếu bổ sung validation async: theo dõi request ID hoặc hủy request cũ để chỉ nhận kết quả của input mới nhất. Chỉ dùng effect khi cần đồng bộ với hệ thống bên ngoài; không thêm effect chỉ để sao chép value/errors.

## Giải thích với thầy

Em tạo một ứng dụng React mới theo yêu cầu bài. Layout chung chứa Outlet; mỗi URL chọn một trang hoặc một thành viên. PersonDetail và trang liên hệ được tách thành module tải khi cần. Skeleton có bố cục tương ứng và thông báo loading cho công nghệ hỗ trợ. Form dùng một nguồn giá trị tại component cha và validation là hàm thuần, tránh chuỗi effect đồng bộ. Em có test routing, lịch sử điều hướng, loading và validation; chưa có số đo CLS hoặc dữ liệu so sánh với code legacy.

## Phục hồi khi module tải lỗi

PageBoundary trong src/components/PageBoundary.jsx bao vùng lazy của danh sách và trang liên hệ. Khi module tải lỗi, thông báo lỗi thay vùng nội dung, giữ layout dùng chung và có đường tải lại. Đây là tải lại trang đầy đủ vì React.lazy cache import lỗi; nội dung form chưa gửi có thể mất khi tải lại. tests/chunk-error.test.jsx mô phỏng module bị từ chối để kiểm tra header/list vẫn tồn tại; chưa thay thế kiểm tra ngắt mạng trên browser thật.

## Liên kết bài nộp

- Mã nguồn: https://github.com/Vipersolowkey/react-refactoring-lab
- Hội thoại GPT: https://chatgpt.com/s/cx_6b0000109cfc81918b93d0359281c392
