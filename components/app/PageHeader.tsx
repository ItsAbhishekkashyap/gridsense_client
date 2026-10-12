'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { openCopilot } from '../CopilotChat';

/** Desktop top bar: breadcrumb on the left, live status + copilot on the right. */
export function TopBar({ crumbs, right }: { crumbs: { label: string; href?: string }[]; right?: ReactNode }) {
  return (
    <div className="hidden h-[72px] items-center justify-between gap-4 border-b border-line lg:flex">
      <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[.08em] text-dim">
        <ol className="flex items-center gap-2">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2">
              {i > 0 && <span className="opacity-50">/</span>}
              {c.href ? <Link href={c.href} className="hover:text-bone">{c.label}</Link> : <span className="text-bone" aria-current="page">{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <div className="flex items-center gap-2.5">
        {right}
        <button type="button" onClick={openCopilot} className="flex h-10 items-center gap-2 rounded-full border border-bone/20 pl-4 pr-1.5 text-sm transition-colors hover:border-bone/50">
          <Sparkles className="h-4 w-4 text-sol" /> Ask Copilot
          <kbd className="rounded-full bg-raise px-2 py-1 font-mono text-[10px] uppercase text-muted">Ctrl K</kbd>
        </button>
      </div>
    </div>
  );
}

/** Big condensed page title in the GridSense editorial style. */
export function PageTitle({ eyebrow, title, sub, aside }: { eyebrow?: ReactNode; title: ReactNode; sub?: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mt-2 flex flex-wrap items-end justify-between gap-6 lg:mt-11">
      <div className="min-w-0">
        {eyebrow && <p className="font-mono text-[11px] uppercase tracking-[.08em] text-dim">{eyebrow}</p>}
        <h1 className="mt-2 text-[64px] font-extrabold uppercase leading-[.85] tracking-[-.01em] sm:text-[88px] xl:text-[120px]" style={{ fontStretch: '62%' }}>
          {title}
        </h1>
        {sub && <p className="mt-3 text-[15px] text-muted md:text-base">{sub}</p>}
      </div>
      {aside}
    </div>
  );
}
