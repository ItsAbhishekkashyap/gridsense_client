'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert } from '../../types';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { alertApi } from '../../lib/api';
import { toast } from '../ui/Toast';
import { timeAgo } from '../../lib/utils';

interface AlertHistoryProps {
  alerts: Alert[];
  onAlertsChange?: (updatedAlerts: Alert[]) => void;
}

export function AlertHistory({ alerts, onAlertsChange }: AlertHistoryProps) {
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(alerts);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const updateAlerts = (updated: Alert[]) => {
    setLocalAlerts(updated);
    onAlertsChange?.(updated);
  };

  const handleResolve = async (alertId: string) => {
    setLoadingId(alertId);
    try {
      await alertApi.resolve(alertId);
      const updated = localAlerts.map((a) =>
        a.id === alertId ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a
      );
      updateAlerts(updated);
      toast.success('Alert marked as resolved');
    } catch {
      toast.error('Failed to resolve alert');
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnresolve = async (alertId: string) => {
    setLoadingId(alertId);
    try {
      await alertApi.unresolve(alertId);
      const updated = localAlerts.map((a) =>
        a.id === alertId ? { ...a, resolved: false, resolvedAt: undefined } : a
      );
      updateAlerts(updated);
      toast.success('Alert marked as unresolved');
    } catch {
      toast.error('Failed to unresolve alert');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert History</CardTitle>
        <span className="text-xs text-gray-500">{localAlerts.length} alerts</span>
      </CardHeader>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {localAlerts.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-500">No alerts recorded</div>
        ) : (
          localAlerts.map((alert) => {
            const Icon = alert.severity === 'CRITICAL' || alert.severity === 'WARNING' ? AlertTriangle : Info;
            const color = alert.resolved ? 'text-gray-500' : alert.severity === 'CRITICAL' ? 'text-red-400' : 'text-yellow-400';
            return (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg">
                <div className={`mt-0.5 ${color}`}>
                  {alert.resolved ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-xs font-medium ${alert.resolved ? 'text-gray-500' : 'text-white'}`}>
                      {alert.title}
                    </p>
                    <Badge variant={alert.resolved ? 'default' : alert.severity === 'CRITICAL' ? 'critical' : 'warning'}>
                      {alert.resolved ? 'Resolved' : alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {timeAgo(alert.createdAt)}
                    {alert.resolved && alert.resolvedAt && ` · Resolved ${timeAgo(alert.resolvedAt)}`}
                  </p>
                  <div className="mt-1.5">
                    {!alert.resolved ? (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        disabled={loadingId === alert.id}
                        className="text-xs text-orange-400 border border-orange-400/40 rounded px-2 py-0.5 hover:bg-orange-400/10 disabled:opacity-50 transition-colors"
                      >
                        {loadingId === alert.id ? 'Saving…' : 'Resolve'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnresolve(alert.id)}
                        disabled={loadingId === alert.id}
                        className="text-xs text-gray-400 border border-gray-600 rounded px-2 py-0.5 hover:bg-gray-700/30 disabled:opacity-50 transition-colors"
                      >
                        {loadingId === alert.id ? 'Saving…' : 'Mark Unresolved'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
