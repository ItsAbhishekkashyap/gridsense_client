'use client';

import { useRouter } from 'next/navigation';
import { Thermometer, Zap, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { Panel, PanelReading, Alert } from '../../types';
import { Badge } from '../ui/Badge';
import { getFaultColor, getEfficiencyColor } from '../../lib/utils';

const FAULT_LABELS: Record<string, string> = {
  DUST:              'Dust Detected',
  TEMPERATURE_SPIKE: 'Temp Spike',
  PARTIAL_SHADING:   'Partial Shading',
  INVERTER_FAULT:    'Inverter Fault',
  WIRING_ISSUE:      'Wiring Issue',
};

interface PanelCardProps {
  panel: Panel;
  reading?: PanelReading;
  activeAlert?: Alert | null;
}

export function PanelCard({ panel, reading, activeAlert }: PanelCardProps) {
  const router = useRouter();
  const faultBorder = getFaultColor(panel.currentFault || 'NONE');
  const hasAlert    = !!activeAlert;
  const hasFault    = panel.currentFault && panel.currentFault !== 'NONE';

  const efficiency      = reading?.efficiency ?? 0;
  const efficiencyColor = getEfficiencyColor(efficiency);

  const statusBadge = hasAlert ? (
    <Badge variant={activeAlert.severity === 'CRITICAL' ? 'critical' : 'warning'}>
      <AlertTriangle className="w-3 h-3 mr-1" />
      {activeAlert.severity}
    </Badge>
  ) : (
    <Badge variant="success">
      <CheckCircle className="w-3 h-3 mr-1" />
      Normal
    </Badge>
  );

  return (
    <div
      onClick={() => router.push(`/dashboard/panels/${panel.id}`)}
      className={`bg-bg-card border-2 ${faultBorder} rounded-xl p-4 cursor-pointer hover:border-accent/60 transition-all duration-200 hover:shadow-lg hover:shadow-accent/5 select-none`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{panel.name}</h3>
          <p className="text-xs text-gray-500">{panel.location}</p>
        </div>
        {statusBadge}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Efficiency</span>
          <span className="text-xs font-medium text-white">
            {reading ? `${efficiency.toFixed(1)}%` : '--'}
          </span>
        </div>
        <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
          <div
            className={`h-full ${efficiencyColor} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(0, efficiency))}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Zap className="w-3 h-3 text-accent" />
            <span className="text-xs text-gray-500">Power</span>
          </div>
          <p className="text-sm font-medium text-white">
            {reading ? `${reading.power.toFixed(0)}W` : '--'}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Activity className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-gray-500">Voltage</span>
          </div>
          <p className="text-sm font-medium text-white">
            {reading ? `${reading.voltage.toFixed(1)}V` : '--'}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Thermometer className="w-3 h-3 text-orange-400" />
            <span className="text-xs text-gray-500">Temp</span>
          </div>
          <p className="text-sm font-medium text-white">
            {reading ? `${reading.temperature.toFixed(1)}°C` : '--'}
          </p>
        </div>
      </div>

      {hasFault && (
        <div className="mt-2.5 pt-2.5 border-t border-bg-border flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span className="text-xs text-red-400 font-medium">
            {FAULT_LABELS[panel.currentFault] || panel.currentFault}
          </span>
        </div>
      )}

      {!hasFault && hasAlert && (
        <div className="mt-2.5 pt-2.5 border-t border-bg-border">
          <p className="text-xs text-yellow-400 truncate">{activeAlert.title}</p>
        </div>
      )}

      <div className="mt-2 flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${reading ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
        <span className="text-xs text-gray-500">{reading ? 'Live' : 'Connecting...'}</span>
      </div>
    </div>
  );
}
