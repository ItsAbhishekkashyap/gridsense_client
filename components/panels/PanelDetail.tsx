'use client';

import { useMemo } from 'react';
import { Zap, Thermometer, Droplets, Sun, Activity } from 'lucide-react';
import { Panel, PanelReading, Alert } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LiveIndicator } from '../ui/LiveIndicator';
import { getEfficiencyColor } from '../../lib/utils';

interface MetricBoxProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

function MetricBox({ icon: Icon, label, value, color }: MetricBoxProps) {
  return (
    <Card className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </Card>
  );
}

interface PanelDetailProps {
  panel: Panel;
  reading?: PanelReading;
  alerts: Alert[];
  isConnected: boolean;
}

export function PanelDetail({ panel, reading, alerts, isConnected }: PanelDetailProps) {
  const unresolved = useMemo(() => alerts.filter((a) => !a.resolved), [alerts]);

  const statusBadge = useMemo(() => {
    const hasCritical = unresolved.some((a) => a.severity === 'CRITICAL');
    const hasWarning  = unresolved.some((a) => a.severity === 'WARNING');

    if (hasCritical) return { variant: 'critical' as const, label: 'Critical' };
    if (hasWarning)  return { variant: 'warning'  as const, label: 'Warning'  };
    return            { variant: 'success'  as const, label: 'Healthy'  };
  }, [unresolved]);

  const efficiency = reading?.efficiency ?? 0;
  const efficiencyBarColor = getEfficiencyColor(efficiency);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{panel.name}</h1>
          <p className="text-gray-400">{panel.location}</p>
          <p className="text-xs text-gray-600 mt-1">Rated: {panel.ratedPower}W</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator isConnected={isConnected} />
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricBox
          icon={Zap}
          label="Power"
          value={reading ? `${reading.power.toFixed(0)}W` : '--'}
          color="bg-accent/10 text-accent"
        />
        <MetricBox
          icon={Activity}
          label="Voltage"
          value={reading ? `${reading.voltage.toFixed(1)}V` : '--'}
          color="bg-blue-500/10 text-blue-400"
        />
        <MetricBox
          icon={Activity}
          label="Current"
          value={reading ? `${reading.current.toFixed(2)}A` : '--'}
          color="bg-purple-500/10 text-purple-400"
        />
        <MetricBox
          icon={Thermometer}
          label="Temperature"
          value={reading ? `${reading.temperature.toFixed(1)}°C` : '--'}
          color="bg-red-500/10 text-red-400"
        />
        <MetricBox
          icon={Sun}
          label="Irradiance"
          value={reading ? `${reading.irradiance.toFixed(0)} W/m²` : '--'}
          color="bg-yellow-500/10 text-yellow-400"
        />
        <MetricBox
          icon={Droplets}
          label="Humidity"
          value={reading ? `${reading.humidity.toFixed(1)}%` : '--'}
          color="bg-cyan-500/10 text-cyan-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">Efficiency</p>
            <p className="text-2xl font-bold text-white">
              {reading ? `${efficiency.toFixed(1)}%` : '--'}
            </p>
          </div>
          <div className="w-20 flex-shrink-0">
            <div className="h-2 bg-bg-border rounded-full overflow-hidden">
              <div
                className={`h-full ${efficiencyBarColor} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, efficiency))}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1 text-right">{efficiency.toFixed(0)}%</p>
          </div>
        </Card>

        <Card>
          <p className="text-xs text-gray-500 mb-1">Active Alerts</p>
          {unresolved.length === 0 ? (
            <p className="text-sm font-medium text-green-400">No active alerts</p>
          ) : (
            <div className="space-y-1">
              {unresolved.slice(0, 2).map((a) => (
                <p key={a.id} className={`text-xs font-medium truncate ${a.severity === 'CRITICAL' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {a.title}
                </p>
              ))}
              {unresolved.length > 2 && (
                <p className="text-xs text-gray-500">+{unresolved.length - 2} more</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
