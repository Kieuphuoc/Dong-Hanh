import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập | VPSA MRL',
  description: 'Đăng nhập cổng MRL — Hiệp hội Hồ tiêu và cây gia vị Việt Nam.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
