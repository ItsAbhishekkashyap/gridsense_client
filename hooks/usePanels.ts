'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Panel, PanelReading, Alert, DashboardStats } from '../types';
import { panelApi, dashboardApi } from '../lib/api';

export function usePanels(on: (event: string, handler: (...args: unknown[]) => void) => () => void) {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [readings, setReadings] = useState<Record<string, PanelReading>>({});
  const [readingsHistory, setReadingsHistory] = useState<Record<string, PanelReading[]>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPanels = useCallback(async () => {
    try {
      const res = await panelApi.getAll();
      const data: Panel[] = res.data.data.panels;
      setPanels(data);

      const alertsRes = await dashboardApi.getAlerts();
      setAlerts(alertsRes.data.data.alerts || []);

      const statsRes = await dashboardApi.getStats();
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch panels:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPanels();
  }, [fetchPanels]);

  useEffect(() => {
    const unsubReading = on('panel:reading', (data: unknown) => {
      const { panelId, reading } = data as { panelId: string; reading: PanelReading };
      setReadings((prev) => ({ ...prev, [panelId]: reading }));
      setReadingsHistory((prev) => {
        const history = [...(prev[panelId] || []), reading];
        if (history.length > 50) history.shift();
        return { ...prev, [panelId]: history };
      });
    });

    const unsubAlert = on('panel:alert', (data: unknown) => {
      const { alert, action } = data as { panelId: string; alert: Alert; action: string };
      if (action === 'created') {
        setAlerts((prev) => [alert, ...prev.slice(0, 49)]);
      } else if (action === 'resolved') {
        setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      }
    });

    const unsubStats = on('dashboard:stats', (data: unknown) => {
      setStats(data as DashboardStats);
    });

    const unsubInitial = on('alerts:initial', (data: unknown) => {
      const { alerts: initialAlerts } = data as { alerts: Alert[] };
      setAlerts(initialAlerts || []);
    });

    return () => {
      unsubReading();
      unsubAlert();
      unsubStats();
      unsubInitial();
    };
  }, [on]);

  return {
    panels,
    readings,
    readingsHistory,
    alerts,
    stats,
    isLoading,
    refetch: fetchPanels,
  };
}
