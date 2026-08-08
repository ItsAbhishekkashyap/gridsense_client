'use client';

import { AlertTriangle, Info, CheckCircle2, Bell, ShieldAlert } from 'lucide-react';
import { Alert } from '../../types';
import { timeAgo } from '../../lib/utils';

const severityConfig = {
  CRITICAL: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  WARNING: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  INFO: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
};

export function AlertPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full border border-slate-800">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Bell className="w-4 h-4 text-orange-400" />
          </div>
          <h3 className="font-bold text-base text-slate-100 tracking-tight">Active Fault Feed</h3>
        </div>
        {alerts.length > 0 ? (
          <span className="text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full px-2.5 py-0.5 animate-pulse">
            {alerts.length} Active
          </span>
        ) : (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
            0 Faults
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[420px] pr-1">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 shadow-lg shadow-emerald-950/40">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-slate-200">Grid Nominal — No Faults</p>
            <p className="text-xs text-slate-400 mt-1">All solar panel arrays operating at optimal efficiency.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = severityConfig[alert.severity] || severityConfig.INFO;
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl ${config.bg} border backdrop-blur-md transition-all hover:translate-x-1 duration-200`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${config.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-200 truncate">{alert.panel?.name || 'Panel Array'}</span>
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">{timeAgo(alert.createdAt)}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-300 line-clamp-2 leading-relaxed">{alert.title}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
