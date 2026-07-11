'use client';

import { Zap, TrendingUp, Battery, DollarSign, Shield, Moon } from 'lucide-react';
import { DashboardStats } from '../../types';
import { Card } from '../ui/Card';

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  subLabel?: string;
  subColor?: string;
}

function StatCard({ icon: Icon, value, label, color, subLabel, subColor = 'text-gray-600' }: StatCardProps) {
  return (
    <Card className="flex items-center gap-3 min-w-0">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-white truncate">{value}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
        {subLabel && <p className={`text-xs truncate ${subColor}`}>{subLabel}</p>}
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-bg-border rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-bg-border rounded w-16" />
          <div className="h-3 bg-bg-border rounded w-24" />
        </div>
      </div>
    </Card>
  );
}

export function StatsBar({ stats }: { stats: DashboardStats | null }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 5;

  const healthColor =
    stats.systemHealthScore >= 80
      ? 'bg-green-500/10 text-green-400'
      : stats.systemHealthScore >= 60
      ? 'bg-yellow-500/10 text-yellow-400'
      : 'bg-red-500/10 text-red-400';

  const powerValue = isNight && stats.totalPower === 0
    ? '0 kW'
    : `${(stats.totalPower / 1000).toFixed(3)} kW`;

  const powerSub = isNight && stats.totalPower === 0
    ? 'Nighttime — No Generation'
    : stats.totalPower > 0
    ? `${stats.panelCount ?? 6} panels active`
    : 'Awaiting data...';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        icon={isNight && stats.totalPower === 0 ? Moon : Zap}
        value={powerValue}
        label="Live Power"
        color={isNight && stats.totalPower === 0 ? 'bg-gray-500/10 text-gray-400' : 'bg-accent/10 text-accent'}
        subLabel={powerSub}
        subColor={isNight ? 'text-gray-600' : 'text-gray-600'}
      />
      <StatCard
        icon={TrendingUp}
        value={`${stats.systemEfficiency?.toFixed(1)}%`}
        label="System Efficiency"
        color="bg-blue-500/10 text-blue-400"
        subLabel={stats.systemEfficiency > 0 ? 'Normal range' : 'No generation'}
      />
      <StatCard
        icon={Battery}
        value={`${stats.totalEnergyToday?.toFixed(3)} kWh`}
        label="Energy Today"
        color="bg-purple-500/10 text-purple-400"
        subLabel="Since midnight"
      />
      <StatCard
        icon={DollarSign}
        value={`₹${stats.moneySavedToday?.toFixed(2)}`}
        label="Money Saved Today"
        color="bg-green-500/10 text-green-400"
        subLabel="vs grid tariff"
      />
      <StatCard
        icon={Shield}
        value={`${stats.systemHealthScore}/100`}
        label="System Health"
        color={healthColor}
        subLabel={
          stats.activeAlerts > 0
            ? `${stats.activeAlerts} active alert${stats.activeAlerts !== 1 ? 's' : ''}`
            : 'All panels normal'
        }
        subColor={stats.activeAlerts > 0 ? 'text-red-500' : 'text-green-600'}
      />
    </div>
  );
}
