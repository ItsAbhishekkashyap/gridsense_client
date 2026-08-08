'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Sparkles, Activity } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader size="lg" />
        <p className="text-sm font-semibold text-slate-400 animate-pulse">Initializing GridSense Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      <SimulatedBanner />

      {/* Subscription expiry banners */}
      {planExpired && (
        <div className="flex items-center justify-between gap-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl backdrop-blur-md shadow-lg shadow-rose-950/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <p className="text-sm font-semibold text-rose-200">
              Your plan has expired. You are currently on the Free plan tier.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="shrink-0 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl transition-all shadow-md shadow-rose-950/40"
          >
            Upgrade Plan
          </Link>
        </div>
      )}

      {!planExpired && expiryNotice && (
        <div className="flex items-center justify-between gap-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-sm font-semibold text-amber-200">{expiryNotice.message}</p>
          </div>
          <Link
            href="/dashboard/billing"
            className="shrink-0 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl transition-all shadow-md"
          >
            Renew Subscription
          </Link>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Solar Telemetry Dashboard</h1>
            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              REAL-TIME
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Monitoring <span className="text-slate-200 font-bold">{panels.length} active solar arrays</span> across grid section A.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <LiveIndicator isConnected={isConnected} />
        </div>
      </div>

      {/* Metrics Row */}
      <StatsBar stats={stats} />

      {/* Main Grid Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PanelGrid panels={panels} readings={readings} alerts={alerts} />
          <EnergyChart panels={panels} readingsHistory={readingsHistory} />
        </div>
        <div className="lg:col-span-1">
          <AlertPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
