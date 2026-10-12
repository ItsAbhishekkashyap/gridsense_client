'use client';

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  /** 'dark' for app surfaces, 'light' for the paper-coloured auth panel */
  tone?: 'dark' | 'light';
  /** element rendered inside the field, on the right (e.g. a show-password toggle) */
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, tone = 'dark', trailing, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const light = tone === 'light';

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className={cn('font-mono text-[11px] uppercase tracking-[.08em]', light ? 'text-[#5E5A52]' : 'text-muted')}>
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center border-b transition-colors duration-300',
            error ? 'border-crit' : light ? 'border-ink/30 focus-within:border-sol' : 'border-bone/20 focus-within:border-sol',
          )}
        >
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'h-[52px] w-full min-w-0 bg-transparent text-[17px] font-medium outline-none placeholder:font-normal',
              light ? 'text-ink placeholder:text-ink/35' : 'text-bone placeholder:text-bone/30',
              className,
            )}
            {...props}
          />
          {trailing}
        </div>
        {error && <p id={`${inputId}-error`} className="text-xs text-crit" role="alert">{error}</p>}
        {helperText && !error && <p className={cn('text-xs', light ? 'text-[#5E5A52]' : 'text-muted')}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
