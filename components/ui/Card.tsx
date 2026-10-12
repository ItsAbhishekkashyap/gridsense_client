import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-line bg-surface p-5 md:p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-5 flex flex-wrap items-center justify-between gap-3', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-lg font-bold tracking-[-.01em] text-bone', className)}>{children}</h2>;
}

/** Mono uppercase micro-label used across the app. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('font-mono text-[11px] uppercase tracking-[.08em] text-muted', className)}>{children}</p>;
}
