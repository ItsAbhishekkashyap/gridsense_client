'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from './Logo';
import { toast } from './Toast';

export const NAV_LINKS = [
  { href: '/dashboard', label: 'Overview', ix: '01' },
  { href: '/dashboard/alerts', label: 'Alerts', ix: '02' },
  { href: '/dashboard/reports', label: 'Reports', ix: '03' },
  { href: '/dashboard/billing', label: 'Billing', ix: '04' },
  { href: '/dashboard/settings', label: 'Settings', ix: '05' },
];

export function isActive(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === '/dashboard' || pathname.startsWith('/dashboard/panels');
  return pathname === href || pathname.startsWith(href + '/');
}

export function initials(name?: string) {
  return (name || 'G').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();
  return async () => {
    try {
      await logout();
      router.push('/login');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to logout');
    }
  };
}

/** Today's sun position, drawn as an arc. Decorative; uses the visitor's clock. */
function SunWidget() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const rise = 5 * 60 + 43, set = 18 * 60 + 41;
  const mins = now ? now.getHours() * 60 + now.getMinutes() : 12 * 60;
  const t = Math.max(0, Math.min(1, (mins - rise) / (set - rise)));
  const up = mins > rise && mins < set;
  const x = 10 + 180 * t, y = 64 - Math.sin(Math.PI * t) * 52;
  const label = now ? now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--';
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex justify-between font-mono text-[11px] uppercase tracking-[.08em] text-muted">
        <span>{up ? 'Sun' : 'Night'}</span>
        <span className="text-bone" suppressHydrationWarning>{label}</span>
      </div>
      <svg viewBox="0 0 200 70" className="mt-2 w-full" aria-hidden>
        <path d="M10 64 Q100 -20 190 64" fill="none" stroke="#EFEBE3" strokeOpacity=".22" strokeDasharray="3 4" />
        <line x1="0" y1="64" x2="200" y2="64" stroke="#EFEBE3" strokeOpacity=".35" />
        {up && <circle cx={x} cy={y} r="6" fill="#FF5B1F" style={{ filter: 'drop-shadow(0 0 8px rgba(255,91,31,.7))' }} />}
      </svg>
      <div className="flex justify-between font-mono text-[11px] uppercase tracking-[.08em] text-dim">
        <span>↑ 05:43</span><span>↓ 18:41</span>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const handleLogout = useLogout();
  const plan = user?.currentPlan || user?.plan || 'FREE';

  return (
    <aside className="sticky top-0 hidden h-[100svh] w-[248px] shrink-0 flex-col gap-8 border-r border-line px-4 py-6 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2" aria-label="GridSense overview">
        <Logo />
        <span className="text-[17px] font-bold" style={{ fontStretch: '110%' }}>GridSense</span>
      </Link>
      <nav aria-label="Main" className="flex flex-col gap-0.5">
        {NAV_LINKS.map((l) => {
          const on = isActive(pathname, l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={on ? 'page' : undefined}
              className={`group relative flex h-11 items-center gap-3.5 rounded-lg px-3.5 text-[15px] font-medium transition-colors ${on ? 'bg-raise text-bone' : 'text-muted hover:text-bone'}`}
            >
              <span className="w-5 font-mono text-[10px] text-dim">{l.ix}</span>
              {l.label}
              <span className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sol transition-transform duration-500 ease-expo ${on ? 'scale-y-100' : 'scale-y-0'}`} />
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-4">
        <SunWidget />
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2A1409] text-sm font-bold text-sol">{initials(user?.name)}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-[.08em] text-sol">{plan}</p>
          </div>
          <button type="button" onClick={handleLogout} aria-label="Sign out" className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-bone/5 hover:text-crit">
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
