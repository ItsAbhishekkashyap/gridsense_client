'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Panel, PanelReading, Alert, Degradation, LifespanProjection, AIAnalysis } from '../../../../../types';
import { panelApi } from '../../../../../lib/api';
import { useAuth } from '../../../../../hooks/useAuth';
import { useSocket } from '../../../../../hooks/useSocket';
import { PanelDetail } from '../../../../../components/panels/PanelDetail';
import { ReadingsChart } from '../../../../../components/panels/ReadingsChart';
import { AIAnalysisCard } from '../../../../../components/panels/AIAnalysisCard';
import { LifespanTracker } from '../../../../../components/panels/LifespanTracker';
import { AlertHistory } from '../../../../../components/panels/AlertHistory';
import { Button } from '../../../../../components/ui/Button';
import { Loader } from '../../../../../components/ui/Loader';
import { TopBar } from '../../../../../components/app/PageHeader';

export default function PanelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();
  const { isConnected, on } = useSocket(accessToken);

  const [panel, setPanel] = useState<Panel | null>(null);
  const [currentReading, setCurrentReading] = useState<PanelReading | undefined>();
  const [readings, setReadings] = useState<PanelReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [degradation, setDegradation] = useState<Degradation | null>(null);
  const [lifespan, setLifespan] = useState<LifespanProjection[] | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [panelRes, analysisRes] = await Promise.all([
          panelApi.getById(id),
          panelApi.getAnalysis(id),
        ]);
        const { panel: p, degradation: d, lifespan: l } = panelRes.data.data;
        setPanel(p);
        setDegradation(d);
        setLifespan(l);
        // API returns newest-first; charts (and live socket appends) need oldest → newest
        const history: PanelReading[] = [...(p.readings || [])].sort(
          (a: PanelReading, b: PanelReading) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setReadings(history);
        setAlerts(p.alerts || []);
        setCurrentReading(history[history.length - 1]);
        setAnalysis(analysisRes.data.data.analysis);
      } catch (err) {
        console.error('Failed to load panel:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const unsub1 = on('panel:reading', (data: unknown) => {
      const { panelId, reading } = data as { panelId: string; reading: PanelReading };
      if (panelId !== id) return;
      setCurrentReading(reading);
      setReadings((prev) => {
        const next = [...prev, reading];
        return next.slice(-50);
      });
    });

    const unsub2 = on('panel:analysis', (data: unknown) => {
      const { panelId, analysis: a } = data as { panelId: string; analysis: AIAnalysis };
      if (panelId !== id) return;
      setAnalysis(a);
    });

    const unsub3 = on('panel:alert', (data: unknown) => {
      const { panelId, alert, action } = data as { panelId: string; alert: Alert; action: string };
      if (panelId !== id) return;
      if (action === 'created') {
        setAlerts((prev) => [alert, ...prev]);
      } else if (action === 'resolved') {
        setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, resolved: true, resolvedAt: alert.resolvedAt } : a)));
      }
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [on, id]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Loader size="lg" />
        <p className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">Reading panel…</p>
      </div>
    );
  }

  if (!panel) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-[56px] font-extrabold uppercase leading-none" style={{ fontStretch: '62%' }}>Panel not found</p>
        <p className="text-muted">It may have been removed, or the link is wrong.</p>
        <Button variant="secondary" onClick={() => router.back()} className="mt-2">Go back</Button>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <TopBar
        crumbs={[{ label: 'Overview', href: '/dashboard' }, { label: panel.location || 'Roof' }, { label: panel.name.replace(/^Panel\s+/i, '') }]}
      />
      <button
        onClick={() => router.back()}
        className="mt-1 inline-flex h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[.08em] text-muted transition-colors hover:text-bone lg:mt-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Roof plan
      </button>

      <PanelDetail panel={panel} reading={currentReading} alerts={alerts} isConnected={isConnected} />

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <ReadingsChart readings={readings} title="Efficiency history" dataKey="efficiency" color="#FF5B1F" unit="%" />
        <ReadingsChart readings={readings} title="Power output" dataKey="power" color="#EFEBE3" unit="W" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <AIAnalysisCard analysis={analysis} />
        <LifespanTracker panel={panel} degradation={degradation} lifespan={lifespan} />
      </div>

      <AlertHistory alerts={alerts} />
    </div>
  );
}
