'use client';

import { AIAnalysis } from '../../types';
import { timeAgo } from '../../lib/utils';
import { openCopilot } from '../CopilotChat';

const SEVERITY_C: Record<string, string> = { CRITICAL: '#C2410C', WARNING: '#A16207', INFO: '#1D4ED8' };

export function AIAnalysisCard({ analysis }: { analysis: AIAnalysis | null }) {
  return (
    <section aria-label="Copilot analysis" className="rounded-xl bg-paper p-6 text-ink md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[.08em]">
        <span className="text-sol-deep">✳ Copilot analysis</span>
        <span className="text-[#5E5A52]">{analysis?.updatedAt ? `Updated ${timeAgo(analysis.updatedAt)}` : 'Scans every 90 s'}</span>
      </div>

      {!analysis ? (
        <div className="py-10">
          <p className="text-[28px] font-bold leading-tight tracking-[-.02em]">Listening…</p>
          <p className="mt-2 text-[15px] text-[#3A3832]">Analysis pending — the copilot reviews every panel every 90 seconds.</p>
        </div>
      ) : (
        <>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[.08em]" style={{ color: SEVERITY_C[analysis.severity] ?? '#2F7D55' }}>{analysis.severity}</p>
          <h2 className="mt-2 text-[30px] font-bold leading-[1.05] tracking-[-.02em] md:text-[34px]" style={{ fontStretch: '92%' }}>{analysis.title}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#3A3832]">{analysis.message}</p>

          <div className="mt-5 rounded-lg border border-ink/15 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[.08em] text-sol-deep">Recommended action</p>
            <p className="mt-1.5 text-[15px]">{analysis.actionRequired}</p>
          </div>

          <dl className="mt-5 grid grid-cols-2 border-t border-ink/15">
            <div className="pr-3 pt-4">
              <dt className="font-mono text-[10px] uppercase tracking-[.08em] text-[#5E5A52]">Confidence</dt>
              <dd className="mt-2 flex items-center gap-3">
                <span className="font-mono text-2xl">{analysis.confidence}%</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10"><span className="block h-full rounded-full bg-ink transition-[width] duration-1000 ease-expo" style={{ width: `${analysis.confidence}%` }} /></span>
              </dd>
            </div>
            <div className="border-l border-ink/15 pl-4 pt-4">
              <dt className="font-mono text-[10px] uppercase tracking-[.08em] text-[#5E5A52]">Est. daily loss</dt>
              <dd className={`mt-2 font-mono text-2xl ${analysis.estimatedDailyLoss > 0 ? 'text-sol-deep' : ''}`}>₹{analysis.estimatedDailyLoss}</dd>
            </div>
          </dl>
        </>
      )}

      <button type="button" onClick={openCopilot} className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-bone transition-colors hover:bg-[#26241f]">
        Ask the copilot about this panel →
      </button>
    </section>
  );
}
