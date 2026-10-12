'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'gridsense_sim_banner_dismissed';

export function SimulatedBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-dashed border-bone/20 py-2 pl-4 pr-1 animate-rise">
      <p className="text-[13px] leading-relaxed text-muted">
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-bone">Simulated data</span>
        <span className="mx-2 text-dim">·</span>
        You’re watching demo panels. Connect ESP32 sensors to see your own roof.
      </p>
      <button onClick={dismiss} aria-label="Dismiss" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-bone/5 hover:text-bone">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
