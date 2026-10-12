'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/** Tweens to each new value with GSAP so live telemetry glides instead of jumping. */
export function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', duration = 0.9, className }: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const state = useRef({ v: 0 });
  const fmt = (n: number) => `${prefix}${n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(value)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      state.current.v = value;
      el.textContent = fmt(value);
      return;
    }
    const tween = gsap.to(state.current, {
      v: value, duration, ease: 'expo.out',
      onUpdate: () => { el.textContent = fmt(state.current.v); },
    });
    return () => { tween.kill(); };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref} className={className}>{fmt(Number.isFinite(value) ? value : 0)}</span>;
}
