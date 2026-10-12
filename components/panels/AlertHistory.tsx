'use client';

import { useState } from 'react';
import { Alert } from '../../types';
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
    <section aria-labelledby="alert-history" className="mt-10">
      <div className="flex items-end justify-between">
        <h2 id="alert-history" className="text-2xl font-bold tracking-[-.02em]">Alert history</h2>
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-dim">{localAlerts.length} records</span>
      </div>
      {localAlerts.length === 0 ? (
        <p className="mt-4 border-t border-line py-8 text-center text-sm text-muted">No alerts recorded</p>
      ) : (
        <ul data-stagger className="mt-4 border-b border-line">
          {localAlerts.map((alert) => (
            <li key={alert.id} className={`grid gap-3 border-t border-line py-4 sm:grid-cols-[110px_1fr_160px_130px] sm:items-center ${alert.resolved ? 'opacity-60' : ''}`}>
              <span>
                <Badge variant={alert.resolved ? 'success' : alert.severity === 'CRITICAL' ? 'critical' : alert.severity === 'WARNING' ? 'warning' : 'info'}>
                  {alert.resolved ? 'Resolved' : alert.severity}
                </Badge>
              </span>
              <div className="min-w-0">
                <p className="font-medium">{alert.title}</p>
                {alert.actionRequired && !alert.resolved && <p className="mt-0.5 text-[13px] text-muted">{alert.actionRequired}</p>}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">
                {timeAgo(alert.createdAt)}
                {alert.resolved && alert.resolvedAt && ` · fixed ${timeAgo(alert.resolvedAt)}`}
              </p>
              <div className="sm:text-right">
                <button
                  type="button"
                  onClick={() => (alert.resolved ? handleUnresolve(alert.id) : handleResolve(alert.id))}
                  disabled={loadingId === alert.id}
                  className={`h-9 rounded-full px-4 text-[13px] font-semibold transition-colors disabled:opacity-50 ${alert.resolved ? 'border border-bone/20 text-muted hover:text-bone' : 'border border-bone/25 hover:bg-bone hover:text-ink'}`}
                >
                  {loadingId === alert.id ? 'Saving…' : alert.resolved ? 'Mark unresolved' : 'Resolve'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
