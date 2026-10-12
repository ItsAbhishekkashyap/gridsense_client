// Shown instantly when a panel tile is clicked, while the route and its data load.
export default function PanelLoading() {
  return (
    <div className="pb-6" role="status" aria-label="Loading panel">
      <div className="hidden h-[72px] border-b border-line lg:block" />
      <div className="mt-6 lg:mt-12">
        <div className="h-3 w-40 animate-pulse rounded bg-surface" />
        <div className="mt-4 h-[72px] w-2/3 max-w-[520px] animate-pulse rounded-lg bg-surface sm:h-[110px]" />
        <div className="mt-5 flex gap-2.5">
          <div className="h-6 w-20 animate-pulse rounded bg-surface" />
          <div className="h-6 w-32 animate-pulse rounded bg-surface" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-px border-y border-line sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="py-5 pr-4">
            <div className="h-3 w-16 animate-pulse rounded bg-surface" />
            <div className="mt-3 h-9 w-24 animate-pulse rounded bg-surface" style={{ animationDelay: `${i * 0.08}s` }} />
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="h-[290px] animate-pulse rounded-xl bg-surface" />
        <div className="h-[290px] animate-pulse rounded-xl bg-surface" />
      </div>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[.08em] text-muted">Reading panel…</p>
    </div>
  );
}
