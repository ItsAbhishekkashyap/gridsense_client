'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Activity, Sparkles } from 'lucide-react';
import { Panel, PanelReading } from '../../types';
import { Loader } from '../ui/Loader';

const PANEL_COLORS = ['#F97316', '#3B82F6', '#10B981', '#A855F7', '#F59E0B', '#EC4899'];

interface EnergyChartProps {
  panels: Panel[];
  readingsHistory: Record<string, PanelReading[]>;
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
        time: new Date(r.timestamp).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
      for (const panel of panels) {
        const hist = readingsHistory[panel.id] || [];
        const reading = hist[offset + i];
        if (reading) {
          point[panel.name] = Math.round(reading.power * 10) / 10;
        }
      }
      return point;
    });
  }, [panels, readingsHistory, hasData]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-panel border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1.5 min-w-[140px]">
        <p className="text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1 uppercase tracking-wider">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: entry.color }} />
              <span className="font-semibold text-slate-300">{entry.name}</span>
            </div>
            <span className="font-extrabold text-white">{entry.value}W</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 tracking-tight">Live Array Power Telemetry</h3>
            <p className="text-xs text-slate-400">Real-time wattage outputs across active solar panels</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
          2s Frequency
        </span>
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader size="md" />
          <p className="text-sm font-semibold text-slate-400">Synchronizing Power Curves...</p>
          <p className="text-xs text-slate-500">Live readings update every 2 seconds</p>
        </div>
      ) : (
        <div className="h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}W`}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }}
                iconType="circle"
                iconSize={8}
              />
              {panels.map((panel, i) => (
                <Line
                  key={panel.id}
                  type="monotone"
                  dataKey={panel.name}
                  stroke={PANEL_COLORS[i % PANEL_COLORS.length]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
