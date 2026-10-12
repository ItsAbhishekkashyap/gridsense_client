'use client';

import { Panel, PanelReading, Alert } from '../../types';
import { PanelCard } from './PanelCard';

interface PanelGridProps {
  panels: Panel[];
  readings: Record<string, PanelReading>;
  alerts: Alert[];
}

export function PanelGrid({ panels, readings, alerts }: PanelGridProps) {
  return (
    <section aria-labelledby="roof-plan">
      <div className="flex items-end justify-between">
        <h2 id="roof-plan" className="text-2xl font-bold tracking-[-.02em]" style={{ fontStretch: '95%' }}>Roof plan</h2>
        <p className="font-mono text-[11px] uppercase tracking-[.08em] text-dim">{panels.length} panels · tap for diagnostics</p>
      </div>
      <div data-stagger className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {panels.map((panel, i) => {
          const activeAlert = alerts.find((a) => a.panelId === panel.id && !a.resolved) || null;
          return <PanelCard key={panel.id} panel={panel} reading={readings[panel.id]} activeAlert={activeAlert} index={i} />;
        })}
      </div>
    </section>
  );
}
