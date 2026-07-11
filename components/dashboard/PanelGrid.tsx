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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {panels.map((panel) => {
        const activeAlert = alerts.find((a) => a.panelId === panel.id && !a.resolved) || null;
        return (
          <PanelCard
            key={panel.id}
            panel={panel}
            reading={readings[panel.id]}
            activeAlert={activeAlert}
          />
        );
      })}
    </div>
  );
}
