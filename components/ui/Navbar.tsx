'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, BarChart3, CreditCard, LogOut, Settings, Sunrise } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from './Logo';
import { initials, isActive, useLogout } from './Sidebar';

const TABS = [
  { href: '/dashboard', label: 'Overview', icon: Sunrise },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Account', icon: Settings },
];

/** Mobile + tablet chrome: a top bar with an account menu and a bottom tab bar. */
export function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const handleLogout = useLogout();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const plan = user?.currentPlan || user?.plan || 'FREE';

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-line bg-ink/85 px-4 backdrop-blur-md lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2" aria-label="GridSense overview">
          <Logo size={24} />
          <span className="font-bold" style={{ fontStretch: '110%' }}>GridSense</span>
        </Link>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="Account menu"
            className="flex h-11 items-center gap-2 rounded-full pl-1 pr-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A1409] text-[13px] font-bold text-sol">{initials(user?.name)}</span>
            <span className="font-mono text-[10px] uppercase tracking-[.08em] text-sol">{plan}</span>
          </button>
          {open && (
            <div role="menu" className="absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl animate-[rise_.35s_cubic-bezier(.16,1,.3,1)_both]">
              <div className="border-b border-line px-4 py-3">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
              </div>
              <Link role="menuitem" href="/dashboard/billing" className="flex h-12 items-center gap-2.5 px-4 text-sm text-muted hover:bg-bone/5 hover:text-bone"><CreditCard className="h-4 w-4" /> Billing</Link>
              <Link role="menuitem" href="/dashboard/settings" className="flex h-12 items-center gap-2.5 px-4 text-sm text-muted hover:bg-bone/5 hover:text-bone"><Settings className="h-4 w-4" /> Settings</Link>
              <button role="menuitem" type="button" onClick={handleLogout} className="flex h-12 w-full items-center gap-2.5 px-4 text-left text-sm text-crit hover:bg-bone/5"><LogOut className="h-4 w-4" /> Log out</button>
            </div>
          )}
        </div>
      </header>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        {TABS.map((t) => {
          const on = isActive(pathname, t.href) || (t.href === '/dashboard/settings' && pathname.startsWith('/dashboard/billing'));
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} aria-current={on ? 'page' : undefined} className={`relative flex h-16 flex-1 flex-col items-center justify-center gap-1 transition-colors ${on ? 'text-bone' : 'text-dim'}`}>
              <Icon className="h-5 w-5" strokeWidth={1.6} />
              <span className="font-mono text-[9px] uppercase tracking-[.08em]">{t.label}</span>
              <span className={`absolute top-0 h-0.5 w-8 rounded-full bg-sol transition-transform duration-500 ease-expo ${on ? 'scale-x-100' : 'scale-x-0'}`} />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
