'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, Globe } from 'lucide-react';

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
    name: 'Tentamus Việt Nam',
    quote: 'Đối tác giải pháp Tư vấn, Dịch vụ kiểm nghiệm - giám định',
    body: [
      'Tentamus Việt Nam là thành viên của Tentamus Group – tập đoàn kiểm nghiệm toàn cầu với hơn 90 phòng thí nghiệm trên khắp thế giới.',
      'Đơn vị được cấp phép kiểm tra, đánh giá thực phẩm, dược phẩm, mỹ phẩm, nông nghiệp và dinh dưỡng.',
      'Tại Việt Nam, Tentamus có 2 phòng kiểm nghiệm tại TP.HCM và Cần Thơ, cung cấp dịch vụ kiểm nghiệm và tư vấn chất lượng theo tiêu chuẩn quốc tế.',
    ],
    logo: '/brands/tentamus.svg',
    phone: '+84 918 491 918',
    phoneHref: 'tel:+84918491918',
    email: 'hello.vn@tentamus.com',
    website: 'tentamus.vn',
    websiteHref: 'https://tentamus.vn',
  },
  {
    id: 'arito',
    name: 'Arito Solutions',
    quote: 'Đối tác giải pháp Nền tảng công nghệ',
    body: [
      'Arito Solutions là đơn vị tư vấn - triển khai giải pháp quản trị doanh nghiệp toàn diện, bao gồm Bán hàng, Mua hàng, Kho, Tài chính - Kế toán và Quản lý Sản xuất.',
      'Đặc biệt, Arito còn phát triển các giải pháp chuyên biệt cho ngành Sản xuất thực phẩm - gia vị như Cổng thông tin Khách hàng/Nhà cung cấp, hệ thống MRL và các dịch vụ ứng dụng AI.',
    ],
    logo: '/brands/Arito-brandname.png',
    phone: '+84 362 089 487',
    phoneHref: 'tel:+84362089487',
    email: 'alden.tran@arito.vn',
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
    <div className="flex h-dvh min-h-dvh w-full overflow-hidden flex-col bg-[#142319] lg:flex-row">
      <section className="relative order-2 flex h-full flex-1 flex-col overflow-hidden lg:order-1 lg:h-dvh">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/brands/hero-spice.jpg"
            alt=""
            className="login-hero-img absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,35,22,0.15)_0%,rgba(15,35,22,0.35)_45%,rgba(15,35,22,0.65)_100%)]" />
        </div>

        <div className="relative z-10 flex h-full flex-1 flex-col justify-between p-4 sm:p-6 lg:p-6 xl:p-8 2xl:p-12">
          <div className="flex flex-1 flex-col items-center justify-center min-h-0 py-2 sm:py-4">
            <img
              src="/brands/vpsa-white.png"
              alt="VPSA — Hiệp hội Hồ tiêu và cây gia vị Việt Nam"
              className="h-auto max-h-[160px] sm:max-h-[200px] lg:max-h-[220px] xl:max-h-[260px] 2xl:max-h-[320px] w-auto object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            />
          </div>

          <div className="mx-auto grid w-full max-w-4xl 2xl:max-w-6xl gap-3 sm:gap-3.5 xl:gap-4 2xl:gap-6 lg:grid-cols-2 shrink-0">
            {partners.map((p) => (
              <article
                key={p.id}
                className="flex flex-col justify-between rounded-xl sm:rounded-2xl border border-white/25 bg-black/35 p-3.5 sm:p-4 xl:p-5 2xl:p-6 backdrop-blur-lg shadow-xl"
              >
                <div>
                  <div className="mb-2 sm:mb-2.5 inline-flex rounded-md bg-white px-2.5 py-1 xl:px-3 xl:py-1.5">
                    <img src={p.logo} alt={p.name} className="h-5 sm:h-6 2xl:h-7 w-auto max-w-[105px] sm:max-w-[120px] 2xl:max-w-[150px] object-contain" />
                  </div>
                  <p className="text-[13.5px] sm:text-[14px] 2xl:text-base font-semibold text-white">{p.name}</p>
                  <p className="mt-0.5 text-[12px] sm:text-[12.5px] 2xl:text-sm leading-tight text-emerald-100/90">{p.quote}</p>
                  <div className="mt-1.5 sm:mt-2 space-y-1 text-[11px] sm:text-[11.5px] xl:text-[12px] 2xl:text-[13px] leading-snug text-white/80">
                    {p.body.map((line) => (
                      <p key={line.slice(0, 24)}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-x-1.5 text-[11px] sm:text-[11.5px] xl:text-[12px] 2xl:text-[13px] text-white/85 whitespace-nowrap">
                  <a href={p.phoneHref} className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                    <span className="flex h-5 w-5 sm:h-5.5 sm:w-5.5 2xl:h-7 2xl:w-7 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 group-hover:bg-emerald-500/35 group-hover:text-emerald-300 transition-all">
                      <Phone className="h-3 w-3 2xl:h-4 2xl:w-4 shrink-0" />
                    </span>
                    <span>{p.phone}</span>
                  </a>
                  <span className="text-white/20">·</span>
                  <a href={`mailto:${p.email}`} className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                    <span className="flex h-5 w-5 sm:h-5.5 sm:w-5.5 2xl:h-7 2xl:w-7 items-center justify-center rounded-md bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30 group-hover:bg-sky-500/35 group-hover:text-sky-300 transition-all">
                      <Mail className="h-3 w-3 2xl:h-4 2xl:w-4 shrink-0" />
                    </span>
                    <span>{p.email}</span>
                  </a>
                  <span className="text-white/20">·</span>
                  <a href={p.websiteHref} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                    <span className="flex h-5 w-5 sm:h-5.5 sm:w-5.5 2xl:h-7 2xl:w-7 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30 group-hover:bg-amber-500/35 group-hover:text-amber-300 transition-all">
                      <Globe className="h-3 w-3 2xl:h-4 2xl:w-4 shrink-0" />
                    </span>
                    <span>{p.website}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <aside className="order-1 flex w-full flex-col bg-[#fafaf8] p-5 sm:p-8 lg:order-2 lg:h-dvh lg:w-[380px] xl:w-[420px] 2xl:w-[500px] lg:shrink-0 justify-between overflow-y-auto">
        <div className="relative z-20 flex justify-end shrink-0 pointer-events-auto">
          <div className="inline-flex items-center rounded-full bg-neutral-200/90 p-1 text-[12.5px] 2xl:text-sm font-medium text-neutral-600 shadow-inner">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setLang('vi');
              }}
              className={`cursor-pointer select-none rounded-full px-3.5 py-1.5 transition-all duration-200 ${
                lang === 'vi'
                  ? 'bg-[#3e9247] text-white shadow-sm font-bold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setLang('en');
              }}
              className={`cursor-pointer select-none rounded-full px-3.5 py-1.5 transition-all duration-200 ${
                lang === 'en'
                  ? 'bg-[#3e9247] text-white shadow-sm font-bold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[320px] sm:max-w-[340px] 2xl:max-w-[380px] flex-1 flex-col justify-center py-2 sm:py-4">
          <p className="text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-[0.28em] text-[#3e9247]">VPSA MRL</p>
          <h2 className="mt-2 sm:mt-3 text-[28px] sm:text-[32px] 2xl:text-[40px] font-semibold tracking-tight text-neutral-900">
            {vi ? 'Đăng nhập' : 'Sign in'}
          </h2>
          <p className="mt-1.5 text-[13px] sm:text-sm 2xl:text-base leading-relaxed text-neutral-500">
            {vi ? 'Cổng thông tin dư lượng thuốc bảo vệ thực vật.' : 'Maximum Residue Limits information portal.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 2xl:mt-10 space-y-4 sm:space-y-5 2xl:space-y-6">
            <label className="block space-y-1.5 sm:space-y-2">
              <span className="text-[12.5px] sm:text-[13px] 2xl:text-sm text-neutral-600">{vi ? 'Tài khoản' : 'Username'}</span>
              <input
                type="text"
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full border-0 border-b border-neutral-300 bg-transparent py-2 sm:py-2.5 text-[14px] sm:text-[15px] 2xl:text-base outline-none transition focus:border-[#3e9247]"
              />
            </label>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-end justify-between">
                <label htmlFor="login-password" className="text-[12.5px] sm:text-[13px] 2xl:text-sm text-neutral-600">
                  {vi ? 'Mật khẩu' : 'Password'}
                </label>
                <button type="button" className="text-[11.5px] sm:text-[12px] 2xl:text-[13px] text-[#3e9247] hover:underline">
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
                  className="w-full border-0 border-b border-neutral-300 bg-transparent py-2 sm:py-2.5 pr-10 text-[14px] sm:text-[15px] 2xl:text-base outline-none transition focus:border-[#3e9247]"
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
              className="w-full bg-[#3e9247] py-3 sm:py-3.5 2xl:py-4 text-[12.5px] sm:text-[13px] 2xl:text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#347c3c] shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (vi ? 'Đang đăng nhập...' : 'Signing in...') : vi ? 'Đăng nhập' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="shrink-0 pt-2 text-center text-[10.5px] sm:text-[11px] 2xl:text-[12px] text-neutral-400">© 2026 VPSA · mrl.vpsaspice.org</p>
      </aside>
    </div>
  );
}
