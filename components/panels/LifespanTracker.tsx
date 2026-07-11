'use client';

import { Calendar, Shield, Wrench } from 'lucide-react';
import { Panel, Degradation, LifespanProjection } from '../../types';
import { Card, CardHeader, CardTitle } from '../ui/Card';

interface LifespanTrackerProps {
  panel: Panel;
  degradation: Degradation | null;
  lifespan: LifespanProjection[] | null;
}

export function LifespanTracker({ panel, degradation, lifespan }: LifespanTrackerProps) {
  const installDate = new Date(panel.installDate);
  const warrantyEnd = new Date(installDate);
  warrantyEnd.setFullYear(warrantyEnd.getFullYear() + panel.warrantyYears);
  const warrantyRemaining = Math.max(0, Math.round((warrantyEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365.25)));

  const lastCleaning = new Date(installDate);
  const daysSinceInstall = Math.floor((Date.now() - installDate.getTime()) / (1000 * 60 * 60 * 24));
  const cleaningCycle = 90;
  const nextCleaning = new Date(Date.now() + (cleaningCycle - (daysSinceInstall % cleaningCycle)) * 86400000);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            Lifespan Tracker
          </div>
        </CardTitle>
      </CardHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-secondary rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Installed</p>
            <p className="text-sm font-medium text-white">
              {installDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
            <p className="text-xs text-gray-600">{degradation?.yearsElapsed} years ago</p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Degradation</p>
            <p className="text-sm font-medium text-orange-400">-{degradation?.totalDegradationPercent?.toFixed(2)}%</p>
            <p className="text-xs text-gray-600">from rated power</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg border border-bg-border">
          <Shield className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-xs text-gray-500">Warranty</p>
            <p className="text-sm font-medium text-white">{panel.warrantyYears} years total</p>
            <p className="text-xs text-green-400">{warrantyRemaining} years remaining</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">Efficiency Projection</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-bg-border">
                  <th className="text-left py-1.5 text-gray-500 font-medium">Year</th>
                  <th className="text-right py-1.5 text-gray-500 font-medium">Efficiency</th>
                  <th className="text-right py-1.5 text-gray-500 font-medium">Power</th>
                </tr>
              </thead>
              <tbody>
                {lifespan?.map((proj) => (
                  <tr key={proj.year} className="border-b border-bg-border/50">
                    <td className="py-1.5 text-gray-400">+{proj.year} yr</td>
                    <td className="py-1.5 text-right text-white">{proj.efficiency}%</td>
                    <td className="py-1.5 text-right text-gray-400">
                      {((proj.powerOutput / 100) * panel.ratedPower).toFixed(0)}W
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400">Maintenance Schedule</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Wrench className="w-3.5 h-3.5 text-accent" />
            <span>Next cleaning: {nextCleaning.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Wrench className="w-3.5 h-3.5 text-blue-400" />
            <span>Inverter check: every 5 years</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
