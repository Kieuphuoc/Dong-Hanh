import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập | Arito.vn',
  description: 'Đăng nhập cổng tin nội bộ Arito — đối tác Tentamus Vietnam và VPSA.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
