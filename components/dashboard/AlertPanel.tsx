'use client';

import { AlertTriangle, Info, CheckCircle, Bell } from 'lucide-react';
import { Alert } from '../../types';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { timeAgo } from '../../lib/utils';

const severityConfig = {
  CRITICAL: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  WARNING: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  INFO: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

export function AlertPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent" />
            Active Alerts
          </div>
        </CardTitle>
        {alerts.length > 0 && (
          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5">
            {alerts.length}
          </span>
        )}
      </CardHeader>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-80 pr-1">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
            <p className="text-sm text-gray-400">No active alerts</p>
            <p className="text-xs text-gray-600">All panels operating normally</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = severityConfig[alert.severity] || severityConfig.INFO;
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${config.bg} border border-bg-border animate-slide-in`}
              >
                <div className={`mt-0.5 ${config.color} flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-white truncate">{alert.panel?.name || 'Panel'}</p>
                    <span className="text-xs text-gray-600 flex-shrink-0">{timeAgo(alert.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{alert.title}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
