'use client';

import { useRouter } from 'next/navigation';
import { Thermometer, Zap, AlertTriangle, CheckCircle2, Activity, ArrowUpRight } from 'lucide-react';
import { Panel, PanelReading, Alert } from '../../types';
import { Badge } from '../ui/Badge';
import { getFaultColor } from '../../lib/utils';

const FAULT_LABELS: Record<string, string> = {
  DUST:              'Critical Efficiency Drop - Dust/Soiling',
  TEMPERATURE_SPIKE: 'Overheating - Thermal Spike',
  PARTIAL_SHADING:   'Partial Shading Detected',
  INVERTER_FAULT:    'Inverter AC/DC Sync Failure',
  WIRING_ISSUE:      'Wiring/Resistance Anomaly',
};

interface PanelCardProps {
  panel: Panel;
  reading?: PanelReading;
  activeAlert?: Alert | null;
}

export function PanelCard({ panel, reading, activeAlert }: PanelCardProps) {
  const router = useRouter();
  const hasAlert = !!activeAlert;
  const hasFault = panel.currentFault && panel.currentFault !== 'NONE';

  const efficiency = reading?.efficiency ?? 0;

  // Custom bar gradient based on efficiency
  const getGradient = (eff: number) => {
    if (eff >= 80) return 'from-emerald-500 to-teal-400';
    if (eff >= 50) return 'from-amber-500 to-yellow-400';
    return 'from-rose-600 to-red-500';
  };

  const statusBadge = hasAlert ? (
    <Badge variant={activeAlert.severity === 'CRITICAL' ? 'critical' : 'warning'} className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm">
      <AlertTriangle className="w-3 h-3 mr-1 animate-pulse" />
      {activeAlert.severity}
    </Badge>
  ) : (
    <Badge variant="success" className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
      Normal
    </Badge>
  );

  return (
    <div
      onClick={() => router.push(`/dashboard/panels/${panel.id}`)}
      className={`group relative glass-panel rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10 select-none overflow-hidden ${
        hasFault ? 'border-red-500/50 bg-red-950/20' : ''
      }`}
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-slate-100 group-hover:text-orange-400 transition-colors tracking-tight">
              {panel.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-xs font-medium text-slate-400 tracking-wide mt-0.5">{panel.location}</p>
        </div>
        {statusBadge}
      </div>

      {/* Efficiency Bar */}
      <div className="mb-4 relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Efficiency</span>
          <span className={`text-sm font-extrabold tracking-tight ${efficiency >= 80 ? 'text-emerald-400' : efficiency >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
            {reading ? `${efficiency.toFixed(1)}%` : '0.0%'}
          </span>
        </div>
        <div className="h-2 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full bg-gradient-to-r ${getGradient(efficiency)} rounded-full transition-all duration-700 shadow-sm`}
            style={{ width: `${Math.min(100, Math.max(0, efficiency))}%` }}
          />
        </div>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2 relative z-10 bg-slate-950/40 border border-slate-800/80 rounded-xl p-2.5">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Power</span>
          </div>
          <p className="text-sm font-bold text-slate-100">
            {reading ? `${reading.power.toFixed(0)}W` : '0W'}
          </p>
        </div>
        <div className="text-center border-x border-slate-800/60">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Voltage</span>
          </div>
          <p className="text-sm font-bold text-slate-100">
            {reading ? `${reading.voltage.toFixed(1)}V` : '0.0V'}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Temp</span>
          </div>
          <p className="text-sm font-bold text-slate-100">
            {reading ? `${reading.temperature.toFixed(1)}°C` : '--'}
          </p>
        </div>
      </div>

      {/* Fault / Alert Banner */}
      {hasFault && (
        <div className="mt-3 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
          <span className="text-xs text-rose-300 font-semibold truncate">
            {FAULT_LABELS[panel.currentFault] || panel.currentFault}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${reading ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {reading ? 'Live Monitoring' : 'Offline'}
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-500 group-hover:text-blue-400 transition-colors">
          View Diagnostics →
        </span>
      </div>
    </div>
  );
}
