'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Download } from 'lucide-react';
import { dashboardApi } from '../../../../lib/api';
import { TopBar, PageTitle } from '../../../../components/app/PageHeader';
import { AnimatedNumber } from '../../../../components/app/AnimatedNumber';
import { ChartTooltip } from '../../../../components/dashboard/EnergyChart';
import { Button } from '../../../../components/ui/Button';
import { Loader } from '../../../../components/ui/Loader';
import { toast } from '../../../../components/ui/Toast';

interface ChartDataPoint {
  date: string;
  energy: number;
  moneySaved: number;
  co2: number;
  [key: string]: string | number;
}

export default function ReportsPage() {
  const [energyData, setEnergyData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalCO2, setTotalCO2] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardApi.getEnergy({ days: 30 });
        const { panelData } = res.data.data;

        const daily: Record<string, { energy: number; money: number; co2: number }> = {};
        const tariffRate = 8.0;

        for (const panel of panelData) {
          for (let i = 1; i < panel.readings.length; i++) {
            const dt = (new Date(panel.readings[i].timestamp).getTime() - new Date(panel.readings[i - 1].timestamp).getTime()) / 3600000;
            const avgPower = (panel.readings[i].power + panel.readings[i - 1].power) / 2;
            const energyKwh = (avgPower * dt) / 1000;
            const date = new Date(panel.readings[i].timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            if (!daily[date]) daily[date] = { energy: 0, money: 0, co2: 0 };
            daily[date].energy += energyKwh;
            daily[date].money += energyKwh * tariffRate;
            daily[date].co2 += energyKwh * 0.82;
          }
        }

        const chartData: ChartDataPoint[] = Object.entries(daily)
          .map(([date, vals]) => ({
            date,
            energy: Math.round(vals.energy * 100) / 100,
            moneySaved: Math.round(vals.money * 100) / 100,
            co2: Math.round(vals.co2 * 100) / 100,
          }))
          .slice(-30);

        setEnergyData(chartData);
        setTotalEnergy(chartData.reduce((s, d) => s + d.energy, 0));
        setTotalMoney(chartData.reduce((s, d) => s + d.moneySaved, 0));
        setTotalCO2(chartData.reduce((s, d) => s + d.co2, 0));
      } catch {
        toast.error('Failed to load report data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportCSV = () => {
    const headers = ['Date', 'Energy (kWh)', 'Money Saved (₹)', 'CO2 Offset (kg)'];
    const rows = energyData.map((d) => [d.date, d.energy, d.moneySaved, d.co2]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gridsense-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  if (isLoading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader size="lg" /></div>;
  }

  const best = energyData.reduce<ChartDataPoint | null>((b, d) => (!b || d.energy > b.energy ? d : b), null);
  const axis = { fill: '#6F6B63', fontSize: 10, fontFamily: 'var(--font-mono)' };
  const stats = [
    { label: 'Total energy', value: totalEnergy, decimals: 1, unit: 'kWh', prefix: '', hot: false },
    { label: 'Money saved', value: totalMoney, decimals: 0, unit: '', prefix: '₹', hot: true },
    { label: 'CO₂ offset', value: totalCO2, decimals: 1, unit: 'kg', prefix: '', hot: false },
  ];

  return (
    <div className="pb-6">
      <TopBar crumbs={[{ label: 'Grid section A' }, { label: 'Reports' }]} />
      <PageTitle
        eyebrow="Last 30 days"
        title="Thirty days"
        sub="What your roof made, saved and spared."
        aside={
          <Button variant="secondary" onClick={exportCSV} disabled={energyData.length === 0}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <dl data-stagger className="mt-10 grid border-y border-bone/15 sm:grid-cols-3">
        {stats.map((st, i) => (
          <div key={st.label} className={`py-6 sm:py-7 ${i > 0 ? 'border-t border-line sm:border-l sm:border-t-0 sm:pl-7' : ''}`}>
            <dt className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">{st.label}</dt>
            <dd className={`mt-3 font-mono text-[44px] leading-none tracking-[-.04em] md:text-[60px] ${st.hot ? 'text-sol' : ''}`}>
              <AnimatedNumber value={st.value} decimals={st.decimals} prefix={st.prefix} duration={1.6} />
              {st.unit && <span className="text-lg text-muted"> {st.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>

      {energyData.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-bone/20 py-16 text-center text-muted">No readings yet for this period — reports fill in as your panels report.</p>
      ) : (
        <>
          <section aria-label="Daily energy generation" className="mt-8 rounded-xl border border-line bg-surface p-5 md:p-7 animate-rise">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold">Daily energy generation</h2>
              <span className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">kWh {best && <>· <span className="text-sol">■</span> best day {best.date}</>}</span>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyData} margin={{ top: 5, right: 6, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(239,235,227,.07)" vertical={false} />
                  <XAxis dataKey="date" tick={axis} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={30} />
                  <YAxis tick={axis} tickLine={false} axisLine={false} width={44} />
                  <Tooltip content={<ChartTooltip unit=" kWh" />} cursor={{ fill: 'rgba(239,235,227,.05)' }} />
                  <Bar dataKey="energy" name="Energy" radius={[3, 3, 0, 0]} maxBarSize={28} animationDuration={1200} animationEasing="ease-out">
                    {energyData.map((d) => <Cell key={d.date} fill={best && d.date === best.date ? '#FF5B1F' : 'rgba(239,235,227,.85)'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section aria-label="Daily money saved" className="rounded-xl border border-line bg-surface p-5 md:p-7 animate-rise [animation-delay:.1s]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Money saved</h2>
                <span className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">₹ / day</span>
              </div>
              <div className="mt-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={energyData} margin={{ top: 5, right: 6, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="money" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#FF5B1F" stopOpacity={0.35} />
                        <stop offset="1" stopColor="#FF5B1F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(239,235,227,.07)" vertical={false} />
                    <XAxis dataKey="date" tick={axis} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={30} />
                    <YAxis tick={axis} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} width={50} />
                    <Tooltip content={<ChartTooltip unit="" />} cursor={{ stroke: 'rgba(239,235,227,.2)' }} />
                    <Area type="monotone" dataKey="moneySaved" name="Saved ₹" stroke="#FF5B1F" strokeWidth={2} fill="url(#money)" animationDuration={1400} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section aria-label="CO2 offset" className="rounded-xl border border-line bg-surface p-5 md:p-7 animate-rise [animation-delay:.18s]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">CO₂ offset</h2>
                <span className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">kg / day</span>
              </div>
              <div className="mt-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyData} margin={{ top: 5, right: 6, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(239,235,227,.07)" vertical={false} />
                    <XAxis dataKey="date" tick={axis} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={30} />
                    <YAxis tick={axis} tickLine={false} axisLine={false} width={40} />
                    <Tooltip content={<ChartTooltip unit=" kg" />} cursor={{ fill: 'rgba(239,235,227,.05)' }} />
                    <Bar dataKey="co2" name="CO₂" fill="#9BE3BF" radius={[3, 3, 0, 0]} maxBarSize={28} animationDuration={1200} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
