'use client';

import { Panel, Degradation, LifespanProjection } from '../../types';

interface LifespanTrackerProps {
  panel: Panel;
  degradation: Degradation | null;
  lifespan: LifespanProjection[] | null;
}

function ProjectionCurve({ lifespan }: { lifespan: LifespanProjection[] }) {
  if (lifespan.length < 2) return null;
  const W = 1000, H = 220;
  const maxY = Math.max(...lifespan.map((p) => p.year), 1);
  const effs = lifespan.map((p) => p.efficiency);
  const hi = Math.max(...effs), lo = Math.min(...effs);
  const pts = lifespan.map((p) => [20 + (p.year / maxY) * (W - 40), 16 + ((hi - p.efficiency) / (hi - lo || 1)) * (H - 40)]);
  const d = 'M' + pts.map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join(' L');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 h-[130px] w-full" preserveAspectRatio="none" aria-hidden>
      <line x1="0" x2={W} y1={H - 4} y2={H - 4} stroke="#EFEBE3" strokeOpacity=".15" />
      <path d={d} fill="none" stroke="#FF5B1F" strokeWidth="2.5" vectorEffect="non-scaling-stroke" className="draw-line" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#111110" stroke="#FF5B1F" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
    </svg>
  );
}

export function LifespanTracker({ panel, degradation, lifespan }: LifespanTrackerProps) {
  const installDate = new Date(panel.installDate);
  const warrantyEnd = new Date(installDate);
  warrantyEnd.setFullYear(warrantyEnd.getFullYear() + panel.warrantyYears);
  const warrantyRemaining = Math.max(0, Math.round((warrantyEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365.25)));

  const daysSinceInstall = Math.floor((Date.now() - installDate.getTime()) / (1000 * 60 * 60 * 24));
  const cleaningCycle = 90;
  const nextCleaning = new Date(Date.now() + (cleaningCycle - (daysSinceInstall % cleaningCycle)) * 86400000);
  const used = panel.warrantyYears ? Math.min(100, ((panel.warrantyYears - warrantyRemaining) / panel.warrantyYears) * 100) : 0;

  return (
    <section aria-label="Lifespan" className="rounded-xl border border-line bg-surface p-6 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Lifespan</h2>
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-ok">{warrantyRemaining} of {panel.warrantyYears} yrs warranty left</span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bone/10">
        <div className="h-full rounded-full bg-bone transition-[width] duration-1000 ease-expo" style={{ width: `${used}%` }} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[.08em] text-muted">Installed</dt>
          <dd className="mt-1 text-[15px]">{installDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</dd>
          <dd className="text-xs text-dim">{degradation?.yearsElapsed} years ago</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[.08em] text-muted">Degradation</dt>
          <dd className="mt-1 font-mono text-[15px] text-sol">-{degradation?.totalDegradationPercent?.toFixed(2)}%</dd>
          <dd className="text-xs text-dim">from rated power</dd>
        </div>
      </dl>

      {lifespan && <ProjectionCurve lifespan={lifespan} />}
      <div className="overflow-x-auto">
        <table className="mt-3 w-full min-w-[300px] text-[13px]">
          <caption className="sr-only">Efficiency projection</caption>
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[.08em] text-dim">
              <th className="py-1.5 text-left font-normal">Year</th>
              <th className="py-1.5 text-right font-normal">Efficiency</th>
              <th className="py-1.5 text-right font-normal">Power</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {lifespan?.map((proj) => (
              <tr key={proj.year} className="border-t border-line">
                <td className="py-1.5 text-muted">+{proj.year} yr</td>
                <td className="py-1.5 text-right">{proj.efficiency}%</td>
                <td className="py-1.5 text-right text-muted">{((proj.powerOutput / 100) * panel.ratedPower).toFixed(0)}W</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Next cleaning</dt><dd>{nextCleaning.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Inverter check</dt><dd>Every 5 years</dd></div>
      </dl>
    </section>
  );
}
