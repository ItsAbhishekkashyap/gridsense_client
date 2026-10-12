'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Alert } from '../../types';
import { timeAgo } from '../../lib/utils';
import { Badge } from '../ui/Badge';

const DOT: Record<string, string> = { CRITICAL: '#FF7A6E', WARNING: '#F2B441', INFO: '#8FB8FF' };

export function AlertPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <section aria-labelledby="fault-feed" className="flex h-full flex-col rounded-xl border border-line bg-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 id="fault-feed" className="text-xl font-bold tracking-[-.01em]">Fault feed</h2>
        {alerts.length > 0 ? <Badge variant="critical">{alerts.length} active</Badge> : <Badge variant="success">0 faults</Badge>}
      </div>

      <div className="mt-4 max-h-[460px] flex-1 overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center py-14 text-center">
            <svg width="80" height="40" viewBox="0 0 80 40" aria-hidden className="mb-4">
              <path d="M4 36 A36 36 0 0 1 76 36" fill="none" stroke="#9BE3BF" strokeWidth="1.5" strokeDasharray="3 4" />
              <circle cx="40" cy="36" r="9" fill="#9BE3BF" />
              <line x1="0" y1="36" x2="80" y2="36" stroke="#EFEBE3" strokeOpacity=".4" />
            </svg>
            <p className="font-semibold">Grid nominal — no faults</p>
            <p className="mt-1 text-sm text-muted">Every panel is operating inside its expected band.</p>
          </div>
        ) : (
          <ol data-stagger>
            {alerts.map((alert) => (
              <li key={alert.id} className="grid grid-cols-[10px_1fr_auto] gap-3 border-t border-line py-4 first:border-t-0">
                <span className="mt-1.5 h-2 w-2 rounded-sm" style={{ background: DOT[alert.severity] ?? DOT.INFO }} />
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-snug">{alert.title}</p>
                  <p className="mt-1 truncate text-[13px] text-muted">{alert.panel?.name || 'Panel array'} · {alert.category?.toLowerCase()}</p>
                </div>
                <span className="font-mono text-[11px] uppercase text-dim">{timeAgo(alert.createdAt)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <Link href="/dashboard/alerts" className="group mt-2 flex items-center justify-between border-t border-line pt-4 text-sm hover:text-sol">
        All alerts <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
