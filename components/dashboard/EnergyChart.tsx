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
import { Panel, PanelReading } from '../../types';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Loader } from '../ui/Loader';

const PANEL_COLORS = ['#F97316', '#3B82F6', '#22C55E', '#A855F7', '#F59E0B', '#EC4899'];

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
      <div className="bg-bg-card border border-bg-border rounded-lg p-3 shadow-xl text-xs">
        <p className="text-gray-400 mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 mb-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-gray-300">{entry.name}</span>
            </div>
            <span className="font-medium text-white">{entry.value}W</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Power Output</CardTitle>
        <span className="text-xs text-gray-500">Last 20 readings per panel</span>
      </CardHeader>

      {!hasData ? (
        <div className="h-56 flex flex-col items-center justify-center gap-3">
          <Loader size="md" />
          <p className="text-sm text-gray-500">Waiting for live data...</p>
          <p className="text-xs text-gray-600">Updates every 2 seconds</p>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="time"
                tick={{ fill: '#6B7280', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}W`}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }}
                iconType="circle"
                iconSize={8}
              />
              {panels.map((panel, i) => (
                <Line
                  key={panel.id}
                  type="monotone"
                  dataKey={panel.name}
                  stroke={PANEL_COLORS[i % PANEL_COLORS.length]}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
