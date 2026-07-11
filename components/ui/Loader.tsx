import { cn } from '../../lib/utils';

export function Loader({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={cn('border-2 border-bg-border border-t-accent rounded-full animate-spin', sizes[size], className)} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-bg-border border-t-accent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading GridSense...</p>
      </div>
    </div>
  );
}
