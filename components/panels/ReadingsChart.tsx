'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PanelReading } from '../../types';
import { ChartTooltip } from '../dashboard/EnergyChart';

export function ReadingsChart({ readings, title = 'Efficiency History', dataKey = 'efficiency', color = '#FF5B1F', unit = '%' }: {
  readings: PanelReading[];
  title?: string;
  dataKey?: keyof PanelReading;
  color?: string;
  unit?: string;
}) {
  const data = readings.slice(-50).map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    [title]: typeof r[dataKey] === 'number' ? Math.round((r[dataKey] as number) * 10) / 10 : 0,
  }));
  const gid = `g-${String(dataKey)}`;

  return (
    <section aria-label={title} className="rounded-xl border border-line bg-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-dim">Last {Math.min(50, readings.length)} readings</span>
      </div>
      <div className="mt-4 h-52">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[.08em] text-dim">Waiting for readings…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 6, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={color} stopOpacity={0.3} />
                  <stop offset="1" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(239,235,227,.07)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#6F6B63', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={40} />
              <YAxis tick={{ fill: '#6F6B63', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}${unit}`} width={48} />
              <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: 'rgba(239,235,227,.2)' }} />
              <Area type="monotone" dataKey={title} stroke={color} strokeWidth={2} fill={`url(#${gid})`} dot={false} activeDot={{ r: 3, fill: color }} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
