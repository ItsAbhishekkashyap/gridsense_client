import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'critical' | 'warning' | 'info' | 'success' | 'normal' | 'default';
  className?: string;
}

const variants = {
  critical: 'bg-crit/15 text-crit',
  warning: 'bg-warn/15 text-warn',
  info: 'bg-info/15 text-info',
  success: 'bg-ok/12 text-ok',
  normal: 'bg-ok/12 text-ok',
  default: 'bg-bone/[.06] text-muted',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded px-2 font-mono text-[10px] uppercase tracking-[.08em]', variants[variant], className)}>
      {children}
    </span>
  );
}
