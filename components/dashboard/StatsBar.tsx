'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DashboardStats } from '../../types';
import { AnimatedNumber } from '../app/AnimatedNumber';

function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) {
    return (
      <div className="mt-4 flex h-[120px] items-center">
        <div className="h-px w-full bg-bone/15" />
      </div>
    );
  }
  const max = Math.max(...points, 1), min = Math.min(...points, 0);
  const W = 600, H = 120;
  const xy = points.map((p, i) => [(i / (points.length - 1)) * W, H - 8 - ((p - min) / (max - min || 1)) * (H - 24)]);
  const line = 'M' + xy.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
  const last = xy[xy.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-4 h-[120px] w-full" aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FF5B1F" stopOpacity=".35" />
          <stop offset="1" stopColor="#FF5B1F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="url(#spark-fill)" />
      <path d={line} fill="none" stroke="#FF5B1F" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="4" fill="#FF5B1F" />
    </svg>
  );
}

function HealthRing({ score }: { score: number }) {
  const c = 2 * Math.PI * 62;
  const color = score >= 80 ? '#9BE3BF' : score >= 60 ? '#F2B441' : '#FF7A6E';
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={`Health score ${score} of 100`} className="shrink-0">
      <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(239,235,227,.1)" strokeWidth="10" />
      <circle
        cx="75" cy="75" r="62" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${(c * Math.max(0, Math.min(100, score))) / 100} ${c}`}
        transform="rotate(-90 75 75)"
        style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.16,1,.3,1)' }}
      />
      <text x="75" y="85" textAnchor="middle" fill="#EFEBE3" fontFamily="var(--font-mono)" fontSize="34">{score}</text>
    </svg>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-surface ${className}`} />;
}

export function StatsBar({ stats, history = [] }: { stats: DashboardStats | null; history?: number[] }) {
  if (!stats) {
    return (
      <div className="mt-9 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-[290px]" />
        <Skeleton className="h-[290px]" />
      </div>
    );
  }

  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 5;
  const asleep = isNight && stats.totalPower === 0;
  const health = stats.systemHealthScore;
  const healthLabel = health >= 80 ? 'All systems nominal' : health >= 60 ? 'Mostly healthy' : 'Needs attention';
  const powerSub = asleep ? 'Night-time — standby' : stats.totalPower > 0 ? `${stats.panelCount ?? 6} arrays reporting` : 'Connecting live telemetry…';

  const kpis = [
    { label: 'Grid efficiency', node: <AnimatedNumber value={stats.systemEfficiency ?? 0} decimals={1} />, unit: '%', sub: stats.systemEfficiency > 0 ? 'Optimal peak' : 'Zero irradiance', subC: 'text-ok' },
    { label: 'Generated today', node: <AnimatedNumber value={stats.totalEnergyToday ?? 0} decimals={3} />, unit: 'kWh', sub: 'Cumulative', subC: 'text-dim' },
    { label: 'Saved today', node: <AnimatedNumber value={stats.moneySavedToday ?? 0} decimals={2} prefix="₹" />, unit: '', sub: 'vs utility rate', subC: 'text-dim' },
    { label: 'Active faults', node: <AnimatedNumber value={stats.activeAlerts ?? 0} />, unit: '', sub: stats.activeAlerts > 0 ? 'Open in alerts' : 'None', subC: stats.activeAlerts > 0 ? 'text-crit' : 'text-ok', hot: stats.activeAlerts > 0 },
  ];

  return (
    <>
      <div className="mt-9 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <section aria-label="Live array output" className="relative overflow-hidden rounded-xl border border-line bg-surface p-6 md:p-7">
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-[.08em] text-muted">
            <span>Live array output</span>
            <span>{powerSub}</span>
          </div>
          <p className="mt-4 flex items-baseline gap-3">
            <AnimatedNumber value={stats.totalPower / 1000} decimals={3} className="font-mono text-[64px] font-medium leading-[.9] tracking-[-.04em] sm:text-[96px] xl:text-[120px]" />
            <span className="font-mono text-2xl text-muted">kW</span>
          </p>
          <Sparkline points={history} />
          <div className="mt-2 flex justify-between font-mono text-[11px] uppercase tracking-[.08em] text-dim">
            <span>Last {Math.max(history.length, 0)} readings</span><span>Now</span>
          </div>
        </section>

        <section aria-label="System health" className="flex flex-col justify-between gap-5 rounded-xl border border-line bg-surface p-6 md:p-7">
          <p className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">System health</p>
          <div className="flex items-center gap-6">
            <HealthRing score={health} />
            <div>
              <p className="text-[22px] font-semibold leading-tight">{healthLabel}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {stats.activeAlerts > 0 ? `${stats.activeAlerts} active fault${stats.activeAlerts !== 1 ? 's' : ''} pull the score down.` : 'Every panel is inside its expected band.'}
              </p>
            </div>
          </div>
          <Link href="/dashboard/alerts" className="group flex items-center justify-between border-t border-line pt-4 text-sm hover:text-sol">
            Review faults <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
          </Link>
        </section>
      </div>

      <div className="mt-4 grid grid-cols-2 border-y border-line lg:grid-cols-4">
        {kpis.map((k, i) => (
          <div key={k.label} className={`px-1 py-5 sm:px-5 ${i % 2 === 1 ? 'border-l border-line' : ''} ${i >= 2 ? 'border-t border-line lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''} ${i === 0 ? 'lg:pl-0' : ''}`}>
            <p className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">{k.label}</p>
            <p className={`mt-2.5 font-mono text-[28px] font-medium tracking-[-.03em] sm:text-[36px] ${k.hot ? 'text-crit' : ''}`}>
              {k.node}{k.unit && <span className="text-base text-muted"> {k.unit}</span>}
            </p>
            <p className={`mt-1 font-mono text-[11px] uppercase tracking-[.08em] ${k.subC}`}>{k.sub}</p>
          </div>
        ))}
      </div>
    </>
  );
}
