'use client';

import { useMemo } from 'react';
import { Panel, PanelReading, Alert } from '../../types';
import { Badge } from '../ui/Badge';
import { LiveIndicator } from '../ui/LiveIndicator';
import { AnimatedNumber } from '../app/AnimatedNumber';

interface PanelDetailProps {
  panel: Panel;
  reading?: PanelReading;
  alerts: Alert[];
  isConnected: boolean;
}

/** Blueprint drawing of the panel, with the sensor highlighted. */
function PanelFigure({ live }: { live: boolean }) {
  return (
    <figure className="relative hidden h-[260px] w-full max-w-[360px] border border-bone/15 md:block" aria-hidden>
      {[['-left-1.5 -top-1.5'], ['-right-1.5 -top-1.5'], ['-left-1.5 -bottom-1.5'], ['-right-1.5 -bottom-1.5']].map(([p]) => (
        <span key={p} className={`absolute ${p} h-3 w-3 before:absolute before:left-[5px] before:top-0 before:h-3 before:w-px before:bg-bone/50 after:absolute after:left-0 after:top-[5px] after:h-px after:w-3 after:bg-bone/50`} />
      ))}
      <figcaption className="absolute left-3.5 top-3 font-mono text-[10px] uppercase tracking-[.08em] text-dim">Fig. — Sensor position</figcaption>
      <svg viewBox="0 0 300 460" className="absolute left-1/2 top-10 h-[200px] -translate-x-1/2">
        <defs>
          <pattern id="pcells" width="50" height="46" patternUnits="userSpaceOnUse"><rect width="50" height="46" fill="none" stroke="#EFEBE3" strokeOpacity=".45" strokeWidth="1.4" /></pattern>
        </defs>
        <rect width="300" height="460" fill="url(#pcells)" stroke="#EFEBE3" strokeWidth="3" className="draw-line" />
        <rect x="110" y="400" width="80" height="34" rx="3" fill="#07070A" stroke="#FF5B1F" strokeWidth="3" />
      </svg>
      <span className={`absolute bottom-3 right-3.5 font-mono text-[10px] uppercase tracking-[.08em] ${live ? 'text-sol' : 'text-dim'}`}>ESP32 · {live ? 'online' : 'waiting'}</span>
    </figure>
  );
}

export function PanelDetail({ panel, reading, alerts, isConnected }: PanelDetailProps) {
  const unresolved = useMemo(() => alerts.filter((a) => !a.resolved), [alerts]);

  const statusBadge = useMemo(() => {
    const hasCritical = unresolved.some((a) => a.severity === 'CRITICAL');
    const hasWarning = unresolved.some((a) => a.severity === 'WARNING');

    if (hasCritical) return { variant: 'critical' as const, label: 'Critical' };
    if (hasWarning) return { variant: 'warning' as const, label: 'Warning' };
    return { variant: 'success' as const, label: 'Healthy' };
  }, [unresolved]);

  const efficiency = reading?.efficiency ?? 0;
  const metrics: { label: string; value: number | null; decimals: number; unit: string; hot?: boolean }[] = [
    { label: 'Power', value: reading?.power ?? null, decimals: 0, unit: 'W', hot: true },
    { label: 'Voltage', value: reading?.voltage ?? null, decimals: 1, unit: 'V' },
    { label: 'Current', value: reading?.current ?? null, decimals: 2, unit: 'A' },
    { label: 'Temperature', value: reading?.temperature ?? null, decimals: 1, unit: '°C' },
    { label: 'Irradiance', value: reading?.irradiance ?? null, decimals: 0, unit: 'W/m²' },
    { label: 'Humidity', value: reading?.humidity ?? null, decimals: 1, unit: '%' },
  ];
  // efficiency ruler runs 0–30% for real-world panel efficiency, 0–100% otherwise
  const scaleMax = efficiency > 30 ? 100 : 30;

  return (
    <div>
      <div className="mt-2 grid items-end gap-8 md:grid-cols-[1.5fr_1fr] lg:mt-10">
        <div className="min-w-0 animate-rise">
          <p className="font-mono text-[11px] uppercase tracking-[.08em] text-dim">Panel · {panel.ratedPower} W rated</p>
          <h1 className="mt-2 break-words text-[72px] font-extrabold uppercase leading-[.82] tracking-[-.02em] sm:text-[110px] xl:text-[170px]" style={{ fontStretch: '62%' }}>
            {panel.name.replace(/^Panel\s+/i, '')}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            <span className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">{panel.location}</span>
            <LiveIndicator isConnected={isConnected} />
          </div>
        </div>
        <PanelFigure live={!!reading} />
      </div>

      <dl data-stagger className="mt-10 grid grid-cols-2 border-y border-bone/15 sm:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m, i) => (
          <div key={m.label} className={`flex flex-col gap-2 py-5 pr-4 ${i % 2 === 1 ? 'border-l border-line pl-4 sm:border-l-0 sm:pl-0' : ''} sm:[&:not(:nth-child(3n+1))]:border-l sm:[&:not(:nth-child(3n+1))]:pl-4 xl:[&:not(:first-child)]:border-l xl:[&:not(:first-child)]:pl-5 ${i >= 2 ? 'border-t border-line sm:border-t-0' : ''} ${i >= 3 ? 'sm:border-t xl:border-t-0' : ''}`}>
            <dt className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">{m.label}</dt>
            <dd className={`font-mono text-[30px] font-medium tracking-[-.03em] sm:text-[38px] ${m.hot ? 'text-sol' : ''}`}>
              {m.value === null ? '--' : <AnimatedNumber value={m.value} decimals={m.decimals} />}
              <small className="text-sm text-muted"> {m.unit}</small>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto]">
        <section aria-label="Efficiency">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">Efficiency</span>
            <span className="font-mono text-[28px]">{reading ? `${efficiency.toFixed(1)}%` : '--'}</span>
          </div>
          <div className="relative mt-3 h-11" role="meter" aria-valuemin={0} aria-valuemax={scaleMax} aria-valuenow={efficiency} aria-label="Panel efficiency">
            <div className="absolute inset-x-0 top-5 h-px bg-bone/30" />
            <div className="absolute left-0 top-[19px] h-[3px] bg-sol transition-[width] duration-1000 ease-expo" style={{ width: `${Math.min(100, (efficiency / scaleMax) * 100)}%` }} />
            <div className="absolute top-2 h-[26px] w-0.5 bg-sol transition-[left] duration-1000 ease-expo" style={{ left: `${Math.min(100, (efficiency / scaleMax) * 100)}%` }} />
            <div className="absolute inset-x-0 top-[30px] flex justify-between font-mono text-[10px] text-dim">
              {[0, 1, 2, 3].map((k) => <span key={k}>{Math.round((scaleMax / 3) * k)}{k === 3 ? '%' : ''}</span>)}
            </div>
          </div>
        </section>
        <section aria-label="Active alerts" className="min-w-[240px] md:border-l md:border-line md:pl-6">
          <p className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">Active alerts</p>
          {unresolved.length === 0 ? (
            <p className="mt-2 text-sm font-medium text-ok">No active alerts</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {unresolved.slice(0, 2).map((a) => (
                <li key={a.id} className={`truncate text-sm font-medium ${a.severity === 'CRITICAL' ? 'text-crit' : 'text-warn'}`}>{a.title}</li>
              ))}
              {unresolved.length > 2 && <li className="text-xs text-muted">+{unresolved.length - 2} more</li>}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
