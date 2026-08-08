export function LiveIndicator({ isConnected }: { isConnected: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all shadow-sm ${
      isConnected 
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
    }`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
          isConnected ? 'bg-emerald-400' : 'bg-rose-400'
        }`} />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
          isConnected ? 'bg-emerald-500' : 'bg-rose-500'
        }`} />
      </span>
      <span className="text-xs font-bold uppercase tracking-wider">
        {isConnected ? 'Grid Socket Online' : 'Telemetry Disconnected'}
      </span>
    </div>
  );
}
