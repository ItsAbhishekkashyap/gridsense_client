'use client';

import Link from 'next/link';
import { Panel, PanelReading, Alert } from '../../types';
import { Badge } from '../ui/Badge';

const FAULT_LABELS: Record<string, string> = {
  DUST: 'Dust / soiling',
  TEMPERATURE_SPIKE: 'Thermal spike',
  PARTIAL_SHADING: 'Partial shading',
  INVERTER_FAULT: 'Inverter sync failure',
  WIRING_ISSUE: 'Wiring anomaly',
};

interface PanelCardProps {
  panel: Panel;
  reading?: PanelReading;
  activeAlert?: Alert | null;
  index?: number;
}

export function PanelCard({ panel, reading, activeAlert, index = 0 }: PanelCardProps) {
  const hasFault = !!panel.currentFault && panel.currentFault !== 'NONE';
  const critical = activeAlert?.severity === 'CRITICAL';
  const efficiency = reading?.efficiency ?? 0;
  const tone = !reading ? 'off' : critical || hasFault ? 'crit' : activeAlert ? 'warn' : 'ok';
  const barColor = { ok: '#9BE3BF', warn: '#F2B441', crit: '#FF7A6E', off: 'transparent' }[tone];

  return (
    <Link
      href={`/dashboard/panels/${panel.id}`}
      className={`panel-tile group relative flex min-h-[220px] flex-col gap-5 rounded-xl border bg-surface p-5 ${tone === 'crit' ? 'hatch border-crit/45' : 'border-line'}`}
      style={{ animationDelay: `${0.3 + index * 0.06}s` }}
      aria-label={`${panel.name}, ${panel.location}${reading ? `, efficiency ${efficiency.toFixed(1)} percent` : ', offline'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold transition-colors group-hover:text-sol">{panel.name}</h3>
          <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-[.08em] text-dim">{panel.location}</p>
        </div>
        {!reading ? (
          <Badge>Offline</Badge>
        ) : activeAlert ? (
          <Badge variant={critical ? 'critical' : 'warning'}>{activeAlert.severity}</Badge>
        ) : (
          <Badge variant="success">Normal</Badge>
        )}
      </div>

      <p className={`font-mono text-[44px] font-medium leading-none tracking-[-.04em] ${tone === 'crit' ? 'text-crit' : tone === 'off' ? 'text-dim' : ''}`}>
        {reading ? efficiency.toFixed(1) : '—'}
        {reading && <span className="text-base text-muted">%</span>}
      </p>

      <div className="h-[3px] overflow-hidden rounded-full bg-bone/10">
        <div className="h-full rounded-full transition-[width] duration-700 ease-expo" style={{ width: `${Math.min(100, Math.max(0, efficiency * (efficiency <= 30 ? 3.33 : 1)))}%`, background: barColor }} />
      </div>

      <div className="mt-auto flex justify-between gap-2 font-mono text-[11px] uppercase tracking-[.08em] text-muted">
        {hasFault ? (
          <span className="truncate text-crit">{FAULT_LABELS[panel.currentFault] || panel.currentFault}</span>
        ) : reading ? (
          <>
            <span>{reading.power.toFixed(0)} W</span>
            <span>{reading.voltage.toFixed(1)} V</span>
            <span>{reading.temperature.toFixed(0)} °C</span>
          </>
        ) : (
          <span className="text-dim">Waiting for sensor</span>
        )}
        <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
