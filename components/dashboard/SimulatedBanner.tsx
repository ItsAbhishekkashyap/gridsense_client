'use client';

import { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';

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
    <div className="flex items-start justify-between gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-300 leading-relaxed">
          <span className="font-semibold">Simulated Data Mode — </span>
          You are viewing simulated solar data for demonstration purposes. Connect real ESP32 sensors to see live readings from your actual panels.
        </p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="text-blue-400 hover:text-white transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
