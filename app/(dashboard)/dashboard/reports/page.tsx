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
  Legend,
} from 'recharts';
import { Download, TrendingUp, Leaf } from 'lucide-react';
import { dashboardApi, panelApi } from '../../../../lib/api';
import { Card, CardHeader, CardTitle } from '../../../../components/ui/Card';
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

  const tooltipStyle = {
    contentStyle: { background: '#112240', border: '1px solid #1E3A5F', borderRadius: '8px', fontSize: '12px', color: '#fff' },
  };

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-sm text-gray-500">Last 30 days performance</p>
        </div>
        <Button variant="secondary" size="sm" onClick={exportCSV}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Energy', value: `${totalEnergy.toFixed(1)} kWh`, icon: TrendingUp, color: 'text-accent' },
          { label: 'Money Saved', value: `₹${totalMoney.toFixed(0)}`, icon: TrendingUp, color: 'text-green-400' },
          { label: 'CO2 Offset', value: `${totalCO2.toFixed(1)} kg`, icon: Leaf, color: 'text-emerald-400' },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Energy Generation (kWh)</CardTitle>
        </CardHeader>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} width={40} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v} kWh`, 'Energy']} />
              <Bar dataKey="energy" fill="#F97316" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Money Saved (₹)</CardTitle>
        </CardHeader>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} width={50} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`₹${v}`, 'Money Saved']} />
              <Bar dataKey="moneySaved" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              CO2 Offset (kg)
            </div>
          </CardTitle>
        </CardHeader>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v} kg`, 'CO2 Offset']} />
              <Bar dataKey="co2" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
