'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const slides = [
  {
    id: 'tentamus',
    layer: 'brand-slide-a',
    quote: 'Tentamus Vietnam — Đối tác giải pháp dịch vụ kiểm nghiệm',
    intro:
      'Thành viên Tentamus Group với hơn 90 phòng thí nghiệm toàn cầu. Tại Việt Nam, chúng tôi đồng hành kiểm soát chất lượng thủy sản, thực phẩm, nông sản và môi trường theo chuẩn Châu Âu, Mỹ, Nhật Bản.',
    logo: '/brands/tentamus-white.svg',
    logoAlt: 'Tentamus Vietnam',
    image: '/brands/banner-lab.jpg',
    accent: 'from-emerald-950/85 via-teal-950/55 to-black/40',
    phone: '0333 482849',
    phoneHref: 'tel:0333482849',
    email: 'purchasing.vnm@tentamus.com',
    website: 'tentamus.vn',
    websiteHref: 'https://tentamus.vn',
    tag: 'Kiểm nghiệm & tư vấn chất lượng',
  },
  {
    id: 'arito',
    layer: 'brand-slide-b',
    quote: 'Arito — Đối tác giải pháp công nghệ',
    intro:
      'Arito ERP kết nối tài chính, mua bán, kho, sản xuất và nhân sự trên một nền tảng. Đồng hành cùng doanh nghiệp số hóa vận hành, giảm chi phí và ra quyết định chính xác theo thời gian thực.',
    logo: '/brands/arito-blue.png',
    logoAlt: 'Arito',
    image: '/brands/banner-tech.jpg',
    accent: 'from-slate-950/88 via-indigo-950/50 to-black/35',
    phone: '+(028) 7101 2288',
    phoneHref: 'tel:+02871012288',
    email: 'contact@arito.vn',
    website: 'arito.vn',
    websiteHref: 'https://arito.vn',
    tag: 'ERP & chuyển đổi số',
  },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      router.push('/');
    }, 600);
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-slate-950 text-white lg:grid lg:grid-cols-3">
      <section className="relative min-h-[44vh] flex-[1.35] overflow-hidden lg:col-span-2 lg:h-full lg:min-h-0 lg:flex-none">
        {slides.map((item) => (
          <article key={item.id} className={`brand-slide ${item.layer}`}>
            <img src={item.image} alt="" className="h-full w-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
              <div className="flex items-start justify-between gap-4">
                <div className={`rounded-2xl px-4 py-3 backdrop-blur-md ring-1 ${
                  item.id === 'arito' ? 'bg-white ring-white/40' : 'bg-white/10 ring-white/15'
                }`}>
                  <img
                    src={item.logo}
                    alt={item.logoAlt}
                    className="h-9 w-auto max-w-[180px] object-contain sm:h-11"
                  />
                </div>
                <div className="rounded-2xl bg-white px-3 py-2 shadow-xl shadow-black/20">
                  <img src="/brands/vpsa.png" alt="VPSA" className="h-11 w-auto object-contain sm:h-12" />
                </div>
              </div>

              <div className="max-w-2xl space-y-5 pb-10">
                <span className="inline-flex rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 ring-1 ring-white/15">
                  {item.tag}
                </span>
                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  {item.quote}
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{item.intro}</p>

                <div className="flex flex-col gap-2 pt-2 text-sm text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <a href={item.phoneHref} className="hover:text-white">
                    {item.phone}
                  </a>
                  <a href={`mailto:${item.email}`} className="hover:text-white">
                    {item.email}
                  </a>
                  <a href={item.websiteHref} target="_blank" rel="noreferrer" className="hover:text-white">
                    {item.website}
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="brand-dots" aria-hidden>
          <span className="brand-dot brand-dot-a" />
          <span className="brand-dot brand-dot-b" />
        </div>
      </section>

      <aside className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto bg-[#f4f7f5] px-6 py-8 text-slate-900 sm:px-10 lg:h-full lg:flex-none">
        <div className="mx-auto w-full max-w-[360px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@arito.vn"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mật khẩu</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted hover:text-foreground"
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" className="size-4 rounded border-border accent-primary" />
                Ghi nhớ tôi
              </label>
              <button type="button" className="font-medium text-primary hover:underline">
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-primary-hover disabled:opacity-70"
            >
              {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
            <img src="/brands/tentamus.svg" alt="Tentamus" className="h-7 w-auto object-contain" />
            <img src="/brands/arito-blue.png" alt="Arito" className="h-8 w-auto max-w-[110px] object-contain" />
            <img src="/brands/vpsa.png" alt="VPSA" className="h-10 w-auto object-contain" />
          </div>
        </div>
      </aside>
    </div>
  );
}
