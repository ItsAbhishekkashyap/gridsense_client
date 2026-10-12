'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';
import { usePanels } from '../../../hooks/usePanels';
import { StatsBar } from '../../../components/dashboard/StatsBar';
import { PanelGrid } from '../../../components/dashboard/PanelGrid';
import { AlertPanel } from '../../../components/dashboard/AlertPanel';
import { EnergyChart } from '../../../components/dashboard/EnergyChart';
import { SimulatedBanner } from '../../../components/dashboard/SimulatedBanner';
import { LiveIndicator } from '../../../components/ui/LiveIndicator';
import { Loader } from '../../../components/ui/Loader';
import { TopBar } from '../../../components/app/PageHeader';

interface ExpiryNotice {
  message: string;
  plan: string;
  expiresAt: string;
  hoursRemaining: number;
}

export default function DashboardPage() {
  const { accessToken, user } = useAuth();
  const { isConnected, on } = useSocket(accessToken);
  const { panels, readings, readingsHistory, alerts, stats, isLoading } = usePanels(on);
  const [expiryNotice, setExpiryNotice] = useState<ExpiryNotice | null>(null);
  const [planExpired, setPlanExpired] = useState(false);

  // Check expiry on load
  useEffect(() => {
    if (!user?.planExpiresAt) return;

    const expiresAt = new Date(user.planExpiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const hoursRemaining = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffMs <= 0) {
      setPlanExpired(true);
    } else if (hoursRemaining <= 24) {
      setExpiryNotice({
        message: `Your ${user.currentPlan || user.plan} plan expires in ${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''}. Renew to avoid interruption.`,
        plan: user.currentPlan || user.plan,
        expiresAt: user.planExpiresAt,
        hoursRemaining,
      });
    }
  }, [user]);

  // Listen for real-time expiry notification
  useEffect(() => {
    return on('subscription:expiring', (data: unknown) => {
      const notice = data as ExpiryNotice;
      setExpiryNotice(notice);
    });
  }, [on]);

  const outputHistory = useMemo(() => {
    const series = panels.map((p) => readingsHistory[p.id] || []);
    const len = Math.max(0, ...series.map((h) => h.length));
    const totals: number[] = [];
    for (let i = 0; i < len; i++) {
      totals.push(series.reduce((sum, h) => sum + (h[h.length - len + i]?.power ?? 0), 0));
    }
    return totals;
  }, [panels, readingsHistory]);

  const firstName = user?.name?.split(/\s+/)[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Still up' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const attention = alerts.length;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Loader size="lg" />
        <p className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">Initialising telemetry…</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <TopBar crumbs={[{ label: 'Grid section A' }, { label: 'Overview' }]} right={<LiveIndicator isConnected={isConnected} />} />
      <SimulatedBanner />

      {/* Subscription expiry banners */}
      {planExpired && (
        <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-crit/10 px-4 py-3 animate-rise">
          <p className="flex items-center gap-2.5 text-sm text-crit">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Your plan has expired. You are currently on the Free plan tier.
          </p>
          <Link href="/dashboard/billing" className="inline-flex h-9 items-center rounded-full bg-crit px-4 text-[13px] font-semibold text-ink">
            Upgrade plan
          </Link>
        </div>
      )}

      {!planExpired && expiryNotice && (
        <div role="status" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-warn/10 px-4 py-3 animate-rise">
          <p className="flex items-center gap-2.5 text-sm text-warn">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {expiryNotice.message}
          </p>
          <Link href="/dashboard/billing" className="inline-flex h-9 items-center rounded-full bg-warn px-4 text-[13px] font-semibold text-ink">
            Renew subscription
          </Link>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 lg:mt-11 animate-rise">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.08em] text-dim" suppressHydrationWarning>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
          <h1 className="mt-2 text-[40px] font-bold leading-none tracking-[-.03em] sm:text-[52px] xl:text-[64px]" style={{ fontStretch: '95%' }}>
            {greeting}, <span className="font-serif font-normal italic text-sol">{firstName}.</span>
          </h1>
          <p className="mt-3 text-[15px] text-muted md:text-base">
            {panels.length} arrays reporting{attention > 0 ? ` · ${attention} need${attention === 1 ? 's' : ''} you` : ' · all calm'}.
          </p>
        </div>
        <div className="lg:hidden"><LiveIndicator isConnected={isConnected} /></div>
      </div>

      <StatsBar stats={stats} history={outputHistory} />

      <div className="mt-10 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <PanelGrid panels={panels} readings={readings} alerts={alerts} />
          <EnergyChart panels={panels} readingsHistory={readingsHistory} />
        </div>
        <div className="xl:pt-[52px]">
          <AlertPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
