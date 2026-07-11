'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, Filter } from 'lucide-react';
import { Alert } from '../../../../types';
import { alertApi } from '../../../../lib/api';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Loader } from '../../../../components/ui/Loader';
import { toast } from '../../../../components/ui/Toast';
import { timeAgo } from '../../../../lib/utils';

const SEVERITY_OPTIONS = ['ALL', 'CRITICAL', 'WARNING', 'INFO'];
const CATEGORY_OPTIONS = ['ALL', 'DUST', 'TEMPERATURE', 'SHADING', 'INVERTER', 'WIRING'];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [severity, setSeverity] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [showResolved, setShowResolved] = useState(false);
  const [total, setTotal] = useState(0);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { limit: 50 };
      if (severity !== 'ALL') params.severity = severity;
      if (category !== 'ALL') params.category = category;
      if (showResolved) params.resolved = true;
      const res = await alertApi.getAll(params);
      setAlerts(res.data.data.alerts);
      setTotal(res.data.data.pagination.total);
    } catch {
      toast.error('Failed to load alerts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, [severity, category, showResolved]);

  const handleResolve = async (alertId: string) => {
    setLoadingId(alertId);
    try {
      await alertApi.resolve(alertId);
      setAlerts((prev) => prev.map((a) =>
        a.id === alertId ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a
      ));
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
      setAlerts((prev) => prev.map((a) =>
        a.id === alertId ? { ...a, resolved: false, resolvedAt: undefined } : a
      ));
      toast.success('Alert marked as unresolved');
    } catch {
      toast.error('Failed to unresolve alert');
    } finally {
      setLoadingId(null);
    }
  };

  const severityBadge = (s: string) => {
    if (s === 'CRITICAL') return 'critical';
    if (s === 'WARNING') return 'warning';
    return 'info';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Alerts</h1>
        <p className="text-sm text-gray-500">{total} total alerts</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {SEVERITY_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  severity === s ? 'bg-accent/10 border-accent text-accent' : 'border-bg-border text-gray-400 hover:border-gray-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  category === c ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'border-bg-border text-gray-400 hover:border-gray-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="w-3 h-3"
            />
            Show Resolved
          </label>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-white font-medium">No alerts found</p>
          <p className="text-sm text-gray-500 mt-1">All panels are operating normally</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`${alert.resolved ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {alert.severity === 'CRITICAL' || alert.severity === 'WARNING' ? (
                    <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${alert.severity === 'CRITICAL' ? 'text-red-400' : 'text-yellow-400'}`} />
                  ) : (
                    <Info className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{alert.title}</span>
                      <Badge variant={severityBadge(alert.severity) as 'critical' | 'warning' | 'info'}>{alert.severity}</Badge>
                      <Badge variant="default">{alert.category}</Badge>
                      {alert.resolved && <Badge variant="success">Resolved</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {alert.panel?.name} · {timeAgo(alert.createdAt)}
                      {alert.resolved && alert.resolvedAt && ` · Resolved ${timeAgo(alert.resolvedAt)}`}
                    </p>
                    <p className="text-sm text-gray-400">{alert.message}</p>
                    {!alert.resolved && (
                      <p className="text-xs text-accent mt-1">{alert.actionRequired}</p>
                    )}
                    {alert.estimatedLoss && alert.estimatedLoss > 0 && (
                      <p className="text-xs text-red-400 mt-1">Est. loss: ₹{alert.estimatedLoss}/day</p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {!alert.resolved ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResolve(alert.id)}
                      disabled={loadingId === alert.id}
                      className="text-orange-400 border border-orange-400/40 hover:bg-orange-400/10"
                    >
                      {loadingId === alert.id ? 'Saving…' : 'Resolve'}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnresolve(alert.id)}
                      disabled={loadingId === alert.id}
                      className="text-gray-400 border border-gray-600 hover:bg-gray-700/30"
                    >
                      {loadingId === alert.id ? 'Saving…' : 'Mark Unresolved'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
