import { cn } from '../../lib/utils';

export function Loader({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <div role="status" aria-label="Loading" className={cn('animate-spin rounded-full border-2 border-bone/10 border-t-sol', sizes[size], className)} />;
}

/** Full-screen loader: a sun rising over a hairline horizon. */
export function PageLoader({ label = 'Calibrating sensors' }: { label?: string }) {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-ink" role="status" aria-label={label}>
      <div className="flex w-56 flex-col items-center gap-5">
        <div className="relative h-14 w-full overflow-hidden">
          <div className="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 translate-y-1/2 animate-[sunrise_1.6s_cubic-bezier(.16,1,.3,1)_infinite_alternate] rounded-full bg-[radial-gradient(circle,#FFE2C2_0%,#FF8A4C_35%,#FF5B1F_60%,rgba(255,91,31,0)_72%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-bone/40" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">{label}…</p>
      </div>
      <style>{'@keyframes sunrise{from{transform:translate(-50%,85%)}to{transform:translate(-50%,40%)}}'}</style>
    </div>
  );
}
