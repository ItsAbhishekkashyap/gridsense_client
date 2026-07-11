export function LiveIndicator({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}
      />
      <span className={`text-xs font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
        {isConnected ? 'LIVE' : 'OFFLINE'}
      </span>
    </div>
  );
}
