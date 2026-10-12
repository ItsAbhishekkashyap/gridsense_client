'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'group inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 ease-expo active:scale-[.98] disabled:opacity-45 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-sol text-ink hover:bg-[#FF7438] hover:-translate-y-0.5',
    secondary: 'border border-bone/25 text-bone hover:bg-bone hover:text-ink',
    ghost: 'text-muted hover:text-bone hover:bg-bone/5',
    danger: 'border border-crit/40 text-crit hover:bg-crit hover:text-ink',
    ink: 'bg-ink text-bone hover:bg-[#26241f]',
  };

  const sizes = {
    sm: 'h-9 px-4 text-[13px] gap-1.5',
    md: 'h-11 px-5 text-sm gap-2',
    lg: 'h-14 px-7 text-base gap-2.5',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || isLoading} aria-busy={isLoading || undefined} {...props}>
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Working…
        </>
      ) : (
        children
      )}
    </button>
  );
}
