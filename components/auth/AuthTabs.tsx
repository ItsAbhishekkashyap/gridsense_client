'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/login', label: 'Sign in' },
  { href: '/signup', label: 'Create account' },
];

export function AuthTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="flex">
      {TABS.map((t) => {
        const on = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={on ? 'page' : undefined}
            className={`relative h-12 flex-1 text-center text-[15px] font-semibold leading-[48px] transition-colors ${on ? 'text-ink' : 'text-[#5E5A52] hover:text-ink'}`}
          >
            {t.label}
            <span className={`absolute inset-x-0 bottom-0 h-px bg-ink/15`} />
            <span className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-ink transition-transform duration-500 ease-expo ${on ? 'scale-x-100' : 'scale-x-0'}`} />
          </Link>
        );
      })}
    </nav>
  );
}
