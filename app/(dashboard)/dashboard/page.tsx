'use client';

import { useEffect, useState } from 'react';
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
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SimulatedBanner />

      {/* Subscription expiry banners */}
      {planExpired && (
        <div className="flex items-center justify-between gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">
              Your plan has expired. You are now on the Free plan.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="flex-shrink-0 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg transition-colors"
          >
            Renew Now
          </Link>
        </div>
      )}

      {!planExpired && expiryNotice && (
        <div className="flex items-center justify-between gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-300">{expiryNotice.message}</p>
          </div>
          <Link
            href="/dashboard/billing"
            className="flex-shrink-0 text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-1.5 rounded-lg transition-colors"
          >
            Renew Now
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Solar Dashboard</h1>
          <p className="text-sm text-gray-500">{panels.length} panels monitored</p>
        </div>
        <LiveIndicator isConnected={isConnected} />
      </div>

      <StatsBar stats={stats} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PanelGrid panels={panels} readings={readings} alerts={alerts} />
          <EnergyChart panels={panels} readingsHistory={readingsHistory} />
        </div>
        <div>
          <AlertPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
