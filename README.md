# LMS nội bộ (GitHub Pages)

Thư viện video và tài liệu hướng dẫn. **Phải đăng nhập bằng tài khoản được cấu hình** mới vào được. Video **nhúng trên site** (YouTube hoặc Google Drive). Admin thêm bài bằng link, không upload file video lớn lên GitHub.

## Xem nhanh trên máy này

Cần cài [Node.js](https://nodejs.org/) (bản LTS).

Mở PowerShell tại thư mục dự án và chạy:

```powershell
npm.cmd install
npm.cmd run dev
```

Mở địa chỉ Vite hiển thị trong cửa sổ PowerShell (thường là `http://localhost:5173`). Thông tin đăng nhập được cấu hình trong [`public/content/users.json`](public/content/users.json).

Đổi mật khẩu: tạo hash SHA-256 rồi sửa `passwordSha256` trong [`public/content/users.json`](public/content/users.json):

```bash
node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('MAT_KHAU_MOI')).then(buf => console.log(Buffer.from(buf).toString('hex')))"
```

GitHub Pages là site tĩnh: đây là cổng đăng nhập trên trình duyệt, không phải server bí mật. Ai xem được mã nguồn repo vẫn có thể đọc hash.

## Thêm / sửa bài (admin)

1. Mở hai cửa sổ PowerShell tại thư mục dự án và chạy:

```powershell
npm.cmd run dev
npm.cmd run cms
```

2. Mở `http://localhost:5173/admin/` — Decap CMS ghi vào `public/content/catalog.json`.
3. Commit và push; GitHub Actions deploy lên Pages.

Trên site đã publish, `/admin/` đăng nhập bằng GitHub; đây là quyền quản trị nội dung riêng, không dùng tài khoản `admin` trong LMS. Cần [OAuth app](https://decapcms.org/docs/github-backend/) trỏ về repo (hoặc chỉ dùng CMS trên máy local rồi push).

### Link video

- **YouTube:** dán `https://www.youtube.com/watch?v=...` hoặc `youtu.be/...`. Nên để **unlisted**. Có thể có quảng cáo.
- **Google Drive:** chia sẻ **Anyone with the link (Viewer)**, dán link `https://drive.google.com/file/d/ID/view`. Không quảng cáo. LMS tự nhúng `/preview`.
- **PDF:** link Drive/web, hoặc file nhỏ trong `public/docs/` rồi URL `/docs/ten-file.pdf` (giới hạn GitHub ~100MB/file).

Trường `kind`: `VIDEO` để nhúng; `FILE` để nút mở tài liệu (PDF Drive vẫn có thể xem preview).

## Đưa lên GitHub Pages (xem từ máy khác)

1. Repo → **Settings → Pages → Source: Deploy from a branch**.
2. Chọn nhánh **`main`**, thư mục **`/docs`**, rồi nhấn **Save**.
3. Trước mỗi lần push thay đổi ứng dụng hoặc nội dung, tạo bản build Pages:

```powershell
npm.cmd run build:pages
```

4. Commit và push các thay đổi, bao gồm thư mục `docs` vừa được tạo/cập nhật. Site: `https://<user>.github.io/Dean-Shoes-Brooks/`.

Repo **public**: file JSON (kể cả hash mật khẩu) sẽ công khai. Đây là cổng đăng nhập trên trình duyệt, không phải cơ chế bảo vệ nội dung riêng tư.

## Sửa lỗi `npm` không được nhận diện trên Windows

Nếu PowerShell báo `npm` không được nhận diện, hãy kiểm tra Node.js đã cài tại `C:\Program Files\nodejs`. Thêm thư mục này vào **Path** của người dùng bằng cách chạy lệnh sau trong PowerShell:

```powershell
$nodePath = 'C:\Program Files\nodejs'
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if (($userPath -split ';') -notcontains $nodePath) {
  [Environment]::SetEnvironmentVariable('Path', "$userPath;$nodePath", 'User')
}
```

Đóng và mở lại PowerShell (hoặc khởi động lại VS Code) để nhận PATH mới. Kiểm tra bằng `node --version` và `npm.cmd --version`, sau đó chạy các lệnh cài đặt và khởi động ở trên. Trong PowerShell, dùng `npm.cmd` để tránh vấn đề nhận diện lệnh `npm`.

## Không nằm trong bản này

Upload mp4 lên GitHub, SQLite, nhiều user tự đăng ký, quiz.
