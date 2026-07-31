import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

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
      className={`${quicksand.variable} h-full antialiased`}
      style={{ fontFamily: 'var(--font-quicksand), sans-serif' }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Suspense fallback={<div className="h-16 bg-card-bg border-b border-border" />}>
          <Navbar />
        </Suspense>
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
