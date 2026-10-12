import Link from 'next/link';
import { Logo } from '../../components/ui/Logo';
import { AuthTabs } from '../../components/auth/AuthTabs';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100svh] flex-col bg-paper lg:flex-row">
      {/* the visual half: dawn over a roof that is already talking */}
      <aside className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-[radial-gradient(100%_70%_at_50%_100%,#3A1A0A_0%,#07070A_62%)] p-5 text-bone sm:min-h-[340px] md:p-10 lg:min-h-0 lg:w-1/2">
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="GridSense home">
            <Logo />
            <span className="text-[17px] font-bold" style={{ fontStretch: '110%' }}>GridSense</span>
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">IST 06:58 · Morning</span>
        </div>

        <div className="relative z-10 mt-8 lg:mt-0">
          <p className="text-[38px] font-extrabold uppercase leading-[.95] tracking-[-.03em] sm:text-[52px] xl:text-[68px] animate-rise" style={{ fontStretch: '125%' }}>
            Your roof is<br />already <span className="font-serif text-[1.08em] font-normal normal-case italic text-sol">talking.</span>
          </p>
          <p className="mt-5 hidden max-w-md text-[17px] leading-relaxed text-muted sm:block animate-rise [animation-delay:.12s]">
            Sign in to hear it — live telemetry, AI diagnosis and alerts for every panel.
          </p>
        </div>

        <div aria-hidden className="relative h-28 sm:h-36 lg:h-56">
          <div className="auth-sun absolute bottom-0 left-1/2 h-[100px] w-[200px] -translate-x-1/2 rounded-t-full sm:h-[180px] sm:w-[360px] bg-[radial-gradient(circle_at_50%_100%,#FFB27A_0%,#FF5B1F_40%,rgba(255,91,31,0)_100%)] lg:h-[200px] lg:w-[400px]" />
          <svg className="absolute -bottom-6 left-0 h-12 w-full" viewBox="0 0 600 48" preserveAspectRatio="none">
            <path className="auth-wave" d="M0 24 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 l10 0 l7 -20 l8 40 l7 -20 l10 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#EFEBE3" strokeOpacity=".55" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="absolute inset-x-[-40px] bottom-0 h-px bg-bone/50" />
          <div className="absolute -bottom-9 inset-x-0 hidden justify-between font-mono text-[11px] uppercase tracking-[.08em] text-dim md:flex">
            <span>Alpha 0.31 kW</span><span>Beta 0.29 kW</span><span>Gamma 0.27 kW</span><span className="text-sol">Delta 0.12 kW ▲</span>
          </div>
        </div>
        <div className="h-4 md:h-6" />
      </aside>

      {/* the form half */}
      <main className="flex flex-1 items-center justify-center px-5 py-10 text-ink md:px-10 lg:py-16">
        <div className="w-full max-w-[420px]">
          <AuthTabs />
          <div className="mt-8">{children}</div>
          <div className="mt-8 flex justify-between border-t border-ink/10 pt-4 font-mono text-[11px] uppercase tracking-[.08em] text-[#8A857B]">
            <span>Encrypted session</span>
            <span>No card required</span>
          </div>
        </div>
      </main>

      <style>{`
        .auth-sun{animation:authSun 2.4s cubic-bezier(.16,1,.3,1) both}
        @keyframes authSun{from{transform:translate(-50%,70%);opacity:.3}to{transform:translate(-50%,0);opacity:1}}
        .auth-wave{stroke-dasharray:6 6;animation:authWave 6s linear infinite}
        @keyframes authWave{to{stroke-dashoffset:-240}}
      `}</style>
    </div>
  );
}
