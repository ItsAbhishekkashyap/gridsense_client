'use client';

import { Zap, TrendingUp, Battery, DollarSign, Shield, Moon } from 'lucide-react';
import { DashboardStats } from '../../types';

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  gradient: string;
  iconColor: string;
  subLabel?: string;
  subColor?: string;
}

function StatCard({ icon: Icon, value, label, gradient, iconColor, subLabel, subColor = 'text-slate-400' }: StatCardProps) {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-4 flex items-center gap-3.5 relative overflow-hidden group">
      {/* Background Radial Glow */}
      <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${gradient}`} />

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 ${gradient} shadow-md`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-extrabold text-slate-100 tracking-tight truncate">{value}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate mt-0.5">{label}</p>
        {subLabel && <p className={`text-[11px] font-medium truncate mt-0.5 ${subColor}`}>{subLabel}</p>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-panel rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 bg-slate-800/80 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-800/80 rounded-md w-20" />
          <div className="h-3 bg-slate-800/80 rounded-md w-24" />
        </div>
      </div>
    </div>
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
      ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10'
      : stats.systemHealthScore >= 60
      ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10'
      : 'bg-gradient-to-br from-rose-500/20 to-red-500/10';

  const healthText =
    stats.systemHealthScore >= 80
      ? 'text-emerald-400'
      : stats.systemHealthScore >= 60
      ? 'text-amber-400'
      : 'text-rose-400';

  const powerValue = isNight && stats.totalPower === 0
    ? '0.00 kW'
    : `${(stats.totalPower / 1000).toFixed(3)} kW`;

  const powerSub = isNight && stats.totalPower === 0
    ? 'Nighttime — Standby'
    : stats.totalPower > 0
    ? `${stats.panelCount ?? 6} Active Solar Array`
    : 'Connecting live telemetry...';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        icon={isNight && stats.totalPower === 0 ? Moon : Zap}
        value={powerValue}
        label="Live Power Output"
        gradient={isNight && stats.totalPower === 0 ? 'bg-slate-800/60' : 'bg-gradient-to-br from-orange-500/20 to-amber-500/10'}
        iconColor={isNight && stats.totalPower === 0 ? 'text-slate-400' : 'text-orange-400'}
        subLabel={powerSub}
        subColor={isNight ? 'text-slate-500' : 'text-orange-400'}
      />
      <StatCard
        icon={TrendingUp}
        value={`${stats.systemEfficiency?.toFixed(1)}%`}
        label="Grid Efficiency"
        gradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/10"
        iconColor="text-blue-400"
        subLabel={stats.systemEfficiency > 0 ? 'Optimal Peak Operating' : 'Zero Solar Irradiance'}
        subColor="text-blue-400"
      />
      <StatCard
        icon={Battery}
        value={`${stats.totalEnergyToday?.toFixed(3)} kWh`}
        label="Total Generation"
        gradient="bg-gradient-to-br from-purple-500/20 to-indigo-500/10"
        iconColor="text-purple-400"
        subLabel="Cumulative Today"
      />
      <StatCard
        icon={DollarSign}
        value={`₹${stats.moneySavedToday?.toFixed(2)}`}
        label="Estimated Savings"
        gradient="bg-gradient-to-br from-emerald-500/20 to-teal-500/10"
        iconColor="text-emerald-400"
        subLabel="v/s Standard Utility Rate"
        subColor="text-emerald-400"
      />
      <StatCard
        icon={Shield}
        value={`${stats.systemHealthScore}/100`}
        label="System Health"
        gradient={healthColor}
        iconColor={healthText}
        subLabel={
          stats.activeAlerts > 0
            ? `${stats.activeAlerts} Active Fault${stats.activeAlerts !== 1 ? 's' : ''}`
            : 'All Systems Nominal'
        }
        subColor={stats.activeAlerts > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}
      />
    </div>
  );
}
