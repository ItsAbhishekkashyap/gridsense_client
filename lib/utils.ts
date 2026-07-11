export function formatPower(watts: number): string {
  if (watts >= 1000) return `${(watts / 1000).toFixed(2)} kW`;
  return `${watts.toFixed(0)} W`;
}

export function formatEnergy(kwh: number): string {
  return `${kwh.toFixed(2)} kWh`;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatTemp(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return 'text-red-400 bg-red-400/10 border-red-400/30';
    case 'WARNING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    case 'INFO': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    default: return 'text-green-400 bg-green-400/10 border-green-400/30';
  }
}

export function getFaultColor(fault: string): string {
  if (fault === 'NONE') return 'border-green-500/40';
  if (fault === 'DUST' || fault === 'TEMPERATURE_SPIKE') return 'border-red-500/60';
  return 'border-yellow-500/60';
}

export function getEfficiencyColor(efficiency: number): string {
  if (efficiency >= 85) return 'bg-green-500';
  if (efficiency >= 70) return 'bg-yellow-500';
  if (efficiency >= 50) return 'bg-orange-500';
  return 'bg-red-500';
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
