export function LiveIndicator({ isConnected }: { isConnected: boolean }) {
  return (
    <span
      role="status"
      className={`inline-flex h-8 items-center gap-2 rounded-full px-3 font-mono text-[10px] uppercase tracking-[.08em] ${
        isConnected ? 'bg-ok/12 text-ok' : 'bg-crit/12 text-crit'
      }`}
    >
      <span className="relative flex h-2 w-2">
        {isConnected && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${isConnected ? 'bg-ok' : 'bg-crit'}`} />
      </span>
      {isConnected ? 'Live · 2 s' : 'Telemetry offline'}
    </span>
  );
}
