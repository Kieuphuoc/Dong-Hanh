'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

function IconEye({ off }: { off?: boolean }) {
  return off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.3 21.3 0 0 1-2.16 3.19M1 1l22 22M14.12 14.12A3 3 0 0 1 9.88 9.88" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const partners = [
  {
    id: 'tentamus',
    name: 'Tentamus Vietnam',
    quote: 'Đối tác giải pháp dịch vụ kiểm nghiệm',
    logo: '/brands/tentamus.svg',
    phone: '0333 482849',
    phoneHref: 'tel:0333482849',
    email: 'purchasing.vnm@tentamus.com',
    website: 'tentamus.vn',
    websiteHref: 'https://tentamus.vn',
  },
  {
    id: 'arito',
    name: 'Arito',
    quote: 'Đối tác giải pháp công nghệ',
    logo: '/brands/Arito-brandname.png',
    phone: '+(028) 7101 2288',
    phoneHref: 'tel:+02871012288',
    email: 'contact@arito.vn',
    website: 'arito.vn',
    websiteHref: 'https://arito.vn',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const vi = lang === 'vi';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => router.push('/'), 600);
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#0b120e] lg:flex-row">
      <section className="relative order-2 flex min-h-[50vh] flex-1 flex-col overflow-hidden lg:order-1 lg:min-h-dvh">
        <img
          src="/brands/hero-spice.jpg"
          alt=""
          className="login-hero-img absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,12,0.35)_0%,rgba(8,16,12,0.55)_45%,rgba(8,16,12,0.88)_100%)]" />

        <div className="relative z-10 flex flex-1 flex-col justify-between px-8 py-10 sm:px-14 lg:px-16 lg:py-14">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <img
              src="/brands/vpsa-white.png"
              alt="VPSA — Hiệp hội Hồ tiêu và cây gia vị Việt Nam"
              className="h-auto w-[min(72%,520px)] object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            />
          </div>

          <div className="mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-2">
            {partners.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
              >
                <div className="mb-3 inline-flex rounded-lg bg-white px-3 py-1.5">
                  <img src={p.logo} alt={p.name} className="h-6 w-auto max-w-[120px] object-contain" />
                </div>
                <p className="text-[13px] font-semibold text-white">{p.name}</p>
                <p className="mt-0.5 text-[12px] text-emerald-100/80">{p.quote}</p>
                <p className="mt-3 space-x-3 text-[11px] text-white/65">
                  <a href={p.phoneHref} className="hover:text-white">
                    {p.phone}
                  </a>
                  <span className="text-white/25">·</span>
                  <a href={`mailto:${p.email}`} className="hover:text-white">
                    {p.email}
                  </a>
                  <span className="text-white/25">·</span>
                  <a href={p.websiteHref} target="_blank" rel="noreferrer" className="hover:text-white">
                    {p.website}
                  </a>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <aside className="order-1 flex w-full flex-col bg-[#fafaf8] px-8 py-7 sm:px-12 lg:order-2 lg:h-dvh lg:w-[420px] lg:shrink-0 xl:w-[460px]">
        <div className="flex justify-end">
          <div className="inline-flex text-[12px] font-medium text-neutral-400">
            <button type="button" onClick={() => setLang('vi')} className={vi ? 'text-neutral-900' : 'hover:text-neutral-700'}>
              Tiếng Việt
            </button>
            <span className="mx-2 text-neutral-300">/</span>
            <button type="button" onClick={() => setLang('en')} className={!vi ? 'text-neutral-900' : 'hover:text-neutral-700'}>
              English
            </button>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[340px] flex-1 flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-800">VPSA MRL</p>
          <h2 className="mt-3 text-[34px] font-semibold tracking-tight text-neutral-900">
            {vi ? 'Đăng nhập' : 'Sign in'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            {vi ? 'Cổng thông tin dư lượng thuốc bảo vệ thực vật.' : 'Maximum Residue Limits information portal.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <label className="block space-y-2">
              <span className="text-[13px] text-neutral-600">{vi ? 'Tài khoản' : 'Username'}</span>
              <input
                type="text"
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full border-0 border-b border-neutral-300 bg-transparent py-2.5 text-[15px] outline-none transition focus:border-emerald-800"
              />
            </label>

            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <label htmlFor="login-password" className="text-[13px] text-neutral-600">
                  {vi ? 'Mật khẩu' : 'Password'}
                </label>
                <button type="button" className="text-[12px] text-emerald-800 hover:underline">
                  {vi ? 'Quên mật khẩu' : 'Forgot password'}
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-0 border-b border-neutral-300 bg-transparent py-2.5 pr-10 text-[15px] outline-none transition focus:border-emerald-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label={showPassword ? (vi ? 'Ẩn mật khẩu' : 'Hide password') : vi ? 'Hiện mật khẩu' : 'Show password'}
                >
                  {showPassword ? <IconEye off /> : <IconEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#163d1c] py-3.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#0f2b14] disabled:opacity-70"
            >
              {submitting ? (vi ? 'Đang đăng nhập...' : 'Signing in...') : vi ? 'Đăng nhập' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="pt-8 text-center text-[11px] text-neutral-400">© 2026 VPSA · mrl.vpsaspice.org</p>
      </aside>
    </div>
  );
}
