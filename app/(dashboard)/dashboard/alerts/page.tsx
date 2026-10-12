'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Alert } from '../../../../types';
import { alertApi } from '../../../../lib/api';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { TopBar, PageTitle } from '../../../../components/app/PageHeader';
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

  const COLOR: Record<string, string> = { CRITICAL: '#FF7A6E', WARNING: '#F2B441', INFO: '#8FB8FF' };
  const counts = (['CRITICAL', 'WARNING', 'INFO'] as const).map((k) => ({ k, n: alerts.filter((a) => a.severity === k && !a.resolved).length }));
  const chip = (on: boolean) =>
    `h-10 shrink-0 rounded-full px-4 text-[13px] font-medium transition-colors ${on ? 'bg-bone text-ink' : 'border border-bone/20 text-muted hover:border-bone/50 hover:text-bone'}`;
  const label = (v: string) => (v === 'ALL' ? 'All' : v.charAt(0) + v.slice(1).toLowerCase());

  return (
    <div className="pb-6">
      <TopBar crumbs={[{ label: 'Grid section A' }, { label: 'Alerts' }]} />
      <PageTitle
        title="Alerts"
        sub={`${total} total · every fault the copilot has raised, newest first.`}
        aside={
          <dl className="flex rounded-xl border border-line">
            {counts.map((c, i) => (
              <div key={c.k} className={`px-4 py-3 sm:px-5 sm:py-4 ${i > 0 ? 'border-l border-line' : ''}`}>
                <dd className="font-mono text-[26px] sm:text-[32px]" style={{ color: COLOR[c.k] }}>{c.n}</dd>
                <dt className="font-mono text-[10px] uppercase tracking-[.08em] text-muted">{label(c.k)}</dt>
              </div>
            ))}
          </dl>
        }
      />

      <div className="mt-8 flex flex-col gap-3 border-t border-bone/15 pt-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Severity">
          {SEVERITY_OPTIONS.map((s) => (
            <button key={s} type="button" aria-pressed={severity === s} onClick={() => setSeverity(s)} className={chip(severity === s)}>{label(s)}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Category">
            {CATEGORY_OPTIONS.map((c) => (
              <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={`h-9 shrink-0 rounded-full px-3 font-mono text-[10px] uppercase tracking-[.08em] transition-colors ${category === c ? 'bg-sol text-ink' : 'text-muted hover:text-bone'}`}>
                {c}
              </button>
            ))}
          </div>
          <label className="flex h-10 cursor-pointer items-center gap-2.5 text-[13px] text-muted">
            <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} className="h-4 w-4 accent-[#FF5B1F]" />
            Show resolved
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader size="lg" /></div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center animate-rise">
          <CheckCircle className="mb-4 h-12 w-12 text-ok" strokeWidth={1.4} />
          <p className="text-lg font-semibold">No alerts found</p>
          <p className="mt-1 text-sm text-muted">All panels are operating normally.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 hidden grid-cols-[6px_1.4fr_1fr_120px_110px_140px] gap-6 pb-2 font-mono text-[10px] uppercase tracking-[.08em] text-dim xl:grid">
            <span /><span>Alert</span><span>Action required</span><span>Est. loss</span><span>Raised</span><span />
          </div>
          <ul data-stagger className="border-b border-line">
            {alerts.map((alert) => (
              <li key={alert.id} className={`grid grid-cols-[4px_1fr] gap-x-4 gap-y-3 border-t border-line py-5 xl:grid-cols-[6px_1.4fr_1fr_120px_110px_140px] xl:items-center xl:gap-6 ${alert.resolved ? 'opacity-55' : ''}`}>
                <span className="row-span-3 h-full min-h-[44px] rounded-sm xl:row-span-1" style={{ background: alert.resolved ? '#6F6B63' : COLOR[alert.severity] ?? COLOR.INFO }} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={severityBadge(alert.severity) as 'critical' | 'warning' | 'info'}>{alert.severity}</Badge>
                    <Badge variant="default">{alert.category}</Badge>
                    {alert.resolved && <Badge variant="success">Resolved</Badge>}
                  </div>
                  <p className="mt-2 text-[17px] font-semibold leading-snug">{alert.title}</p>
                  <p className="mt-1 text-sm text-muted">{alert.panel?.name}{alert.message ? ` · ${alert.message}` : ''}</p>
                </div>
                <p className="col-start-2 text-sm leading-relaxed text-bone/80 xl:col-start-auto">
                  {!alert.resolved && alert.actionRequired ? <><span className="mr-1.5 font-mono text-[10px] uppercase tracking-[.08em] text-sol xl:hidden">Action</span>{alert.actionRequired}</> : <span className="text-dim">—</span>}
                </p>
                <p className="col-start-2 flex flex-wrap items-center justify-between gap-3 xl:contents">
                  <span className="font-mono text-lg xl:text-xl">{alert.estimatedLoss && alert.estimatedLoss > 0 ? `₹${alert.estimatedLoss}/day` : '—'}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">
                    {timeAgo(alert.createdAt)}
                    {alert.resolved && alert.resolvedAt && <span className="block normal-case text-dim">fixed {timeAgo(alert.resolvedAt)}</span>}
                  </span>
                  <span className="xl:text-right">
                    {!alert.resolved ? (
                      <Button variant="secondary" size="sm" onClick={() => handleResolve(alert.id)} disabled={loadingId === alert.id}>
                        {loadingId === alert.id ? 'Saving…' : 'Resolve'}
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => handleUnresolve(alert.id)} disabled={loadingId === alert.id}>
                        {loadingId === alert.id ? 'Saving…' : 'Mark unresolved'}
                      </Button>
                    )}
                  </span>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between font-mono text-[10px] uppercase tracking-[.08em] text-dim">
            <span>Showing {alerts.length} of {total}</span>
            <span>Auto-resolves when readings normalise</span>
          </p>
        </>
      )}
    </div>
  );
}
