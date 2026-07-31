import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card-bg border-t border-border mt-12 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-md shadow-sm">
                ĐH
              </span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                DongHanh.vn
              </span>
            </div>
            <p className="text-sm text-muted">
              Trang tin nội bộ chính thức của Tập đoàn Đồng Hành. Cập nhật liên tục tin tức kinh doanh, công nghệ, văn hóa và hoạt động phong trào của các thành viên.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Danh mục chính</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Tin tức chung</Link>
              </li>
              <li>
                <Link href="/?category=3" className="hover:text-primary transition-colors">Công nghệ số</Link>
              </li>
              <li>
                <Link href="/multimedia" className="hover:text-primary transition-colors">Bản tin Multimedia</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">Trang quản trị tòa soạn</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Thông tin tòa soạn</h3>
            <p className="text-sm text-muted mb-2">
              <strong>Địa chỉ:</strong> Tòa nhà Đồng Hành, Cầu Giấy, Hà Nội
            </p>
            <p className="text-sm text-muted mb-2">
              <strong>Điện thoại:</strong> 024 7300 7300
            </p>
            <p className="text-sm text-muted">
              <strong>Email:</strong> lienhe@donghanh.vn
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted">
          <p>© {new Date().getFullYear()} DongHanh.vn. Xây dựng bởi Antigravity với Next.js và Tailwind CSS.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:underline">Điều khoản sử dụng</a>
            <a href="#" className="hover:underline">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
