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
        setReadings(p.readings || []);
        setAlerts(p.alerts || []);
        setCurrentReading(p.readings?.[0]);
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
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (!panel) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Panel not found</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <PanelDetail panel={panel} reading={currentReading} alerts={alerts} isConnected={isConnected} />

      <div className="grid lg:grid-cols-2 gap-6">
        <ReadingsChart readings={readings} title="Efficiency History" dataKey="efficiency" color="#F97316" unit="%" />
        <ReadingsChart readings={readings} title="Power Output" dataKey="power" color="#3B82F6" unit="W" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AIAnalysisCard analysis={analysis} />
        <LifespanTracker panel={panel} degradation={degradation} lifespan={lifespan} />
      </div>

      <AlertHistory alerts={alerts} />
    </div>
  );
}
