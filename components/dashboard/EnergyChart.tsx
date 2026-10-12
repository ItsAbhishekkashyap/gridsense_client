'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Panel, PanelReading } from '../../types';
import { Loader } from '../ui/Loader';

export const PANEL_COLORS = ['#EFEBE3', '#FF7A6E', '#F2B441', '#9BE3BF', '#8FB8FF', '#FF5B1F'];

interface EnergyChartProps {
  panels: Panel[];
  readingsHistory: Record<string, PanelReading[]>;
}

export function ChartTooltip({ active, payload, label, unit = 'W' }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[150px] rounded-lg bg-paper px-3 py-2.5 text-ink shadow-2xl">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[.08em] text-[#5E5A52]">{label}</p>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center justify-between gap-4 text-[13px]">
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: e.color === '#EFEBE3' ? '#141412' : e.color }} />{e.name}</span>
          <span className="font-mono font-medium">{e.value}{unit}</span>
        </div>
      ))}
    </div>
  );
}

export function EnergyChart({ panels, readingsHistory }: EnergyChartProps) {
  const hasData = panels.some((p) => (readingsHistory[p.id]?.length ?? 0) > 0);

  const chartData = useMemo(() => {
    if (!hasData || panels.length === 0) return [];

    const firstPanelHistory = readingsHistory[panels[0].id] || [];
    const len = Math.min(firstPanelHistory.length, 20);
    if (len === 0) return [];

    const offset = firstPanelHistory.length - len;

    return firstPanelHistory.slice(-20).map((r, i) => {
      const point: Record<string, unknown> = {
        time: new Date(r.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      for (const panel of panels) {
        const hist = readingsHistory[panel.id] || [];
        const reading = hist[offset + i];
        if (reading) point[panel.name] = Math.round(reading.power * 10) / 10;
      }
      return point;
    });
  }, [panels, readingsHistory, hasData]);

  return (
    <section aria-labelledby="power-chart" className="rounded-xl border border-line bg-surface p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="power-chart" className="text-xl font-bold tracking-[-.01em]">Power, per panel</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[.08em] text-dim">Last 20 readings · 2 s</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[.08em] text-muted">
          {panels.map((p, i) => (
            <span key={p.id} className="flex items-center gap-1.5"><i className="h-0.5 w-3.5" style={{ background: PANEL_COLORS[i % PANEL_COLORS.length] }} />{p.name.replace(/^Panel\s+/i, '')}</span>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Loader size="md" />
          <p className="text-sm font-semibold text-muted">Synchronising power curves…</p>
          <p className="font-mono text-[11px] uppercase tracking-[.08em] text-dim">Live readings arrive every 2 seconds</p>
        </div>
      ) : (
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 6, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="rgba(239,235,227,.07)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#6F6B63', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={40} />
              <YAxis tick={{ fill: '#6F6B63', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}W`} width={48} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(239,235,227,.2)' }} />
              {panels.map((panel, i) => (
                <Line key={panel.id} type="monotone" dataKey={panel.name} stroke={PANEL_COLORS[i % PANEL_COLORS.length]} strokeWidth={1.8} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
