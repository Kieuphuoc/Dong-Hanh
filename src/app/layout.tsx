import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Arito.vn - Trang tin tức nội bộ doanh nghiệp hiện đại',
  description: 'Nền tảng tin tức nội bộ hiện đại của doanh nghiệp, cập nhật nhanh chóng các thông tin công nghệ, văn hóa doanh nghiệp và tin tức kinh doanh mới nhất.',
  keywords: ['arito', 'tin tuc noi bo', 'van hoa doanh nghiep', 'multimedia', 'tin cong nghe'],
  authors: [{ name: 'Antigravity' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${quicksand.variable} h-full antialiased`}
      style={{ fontFamily: 'var(--font-quicksand), sans-serif' }}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
