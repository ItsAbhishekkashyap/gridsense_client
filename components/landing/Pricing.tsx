'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PLANS = [
  {
    name: 'Free',
    tag: 'Prototype',
    price: '₹0',
    features: ['6 simulated solar panels', 'Real-time simulated monitoring', 'AI-powered fault detection', 'System health scoring', 'Live alerts & notifications'],
    note: 'Simulated data — connect real ESP32 sensors on a paid plan.',
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Starter',
    tag: 'Up to 10 panels',
    price: '₹499',
    features: ['Up to 10 real solar panels', 'Live ESP32 sensor data', 'Advanced AI analysis', 'Email & WhatsApp alerts', 'Monthly reports · CSV export'],
    note: 'Hardware ₹2,999 / panel, one-time — ESP32 kit, current clamp, mounting.',
    cta: 'Get Starter →',
    featured: true,
  },
  {
    name: 'Pro',
    tag: 'Unlimited',
    price: '₹1,499',
    features: ['Unlimited panels', 'Priority AI analysis', 'Custom sensor integration', 'API access for custom dashboards', 'Dedicated support · SLA'],
    note: 'Hardware ₹2,499 / panel, one-time — bulk discounts from 20+ panels.',
    cta: 'Get Pro',
    featured: false,
  },
];

export function Pricing() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-rise]', {
        y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 75%' },
      });
      gsap.from('[data-plan]', {
        y: 110, opacity: 0, rotateX: -12, duration: 1.3, ease: 'expo.out', stagger: 0.14,
        scrollTrigger: { trigger: '[data-plans]', start: 'top 85%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={ref} aria-labelledby="pricing-title" className="relative bg-ink text-bone px-5 md:px-16 py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p data-rise className="font-mono text-[11px] uppercase tracking-[.08em] text-sol">Plans</p>
          <h2 id="pricing-title" data-rise className="mt-4 text-[44px] md:text-[76px] font-bold leading-[.98] tracking-[-.04em]">
            Pick your <span className="font-serif italic font-normal text-sol">array.</span>
          </h2>
        </div>
        <p data-rise className="max-w-sm text-base md:text-lg leading-relaxed text-muted">
          Start free with six simulated panels. Upgrade when your real sensors go in.
        </p>
      </div>

      <div data-plans className="mt-14 md:mt-20 grid gap-3 md:gap-4 md:grid-cols-3" style={{ perspective: 1200 }}>
        {PLANS.map((p) => (
          <article
            key={p.name}
            data-plan
            className={`group relative flex flex-col gap-5 overflow-hidden rounded-xl border p-6 md:p-8 transition-transform duration-500 hover:-translate-y-1.5 ${
              p.featured ? 'bg-bone text-ink border-bone' : 'bg-surface border-line'
            }`}
          >
            {p.featured && <div className="absolute inset-x-0 top-0 h-[3px] bg-sol" />}
            <div className="flex justify-between font-mono text-[11px] uppercase tracking-[.08em] opacity-75">
              <span>{p.name} · {p.tag}</span>
              {p.featured && <span className="text-sol-deep">Most chosen</span>}
            </div>
            <p>
              <span className="text-[72px] md:text-[96px] font-extrabold leading-[.85]" style={{ fontStretch: '62%' }}>{p.price}</span>
              <span className="font-mono text-[11px] uppercase tracking-[.08em] opacity-60"> / month</span>
            </p>
            <ul className="text-[15px]">
              {p.features.map((f) => (
                <li key={f} className={`border-t py-2.5 ${p.featured ? 'border-ink/10' : 'border-bone/10'}`}>{f}</li>
              ))}
            </ul>
            <p className="text-[13px] leading-relaxed opacity-65">{p.note}</p>
            <Link
              href="/signup"
              className={`mt-auto inline-flex h-12 items-center justify-center rounded-full text-[15px] font-semibold transition-colors ${
                p.featured ? 'bg-ink text-bone hover:bg-sol hover:text-ink' : 'border border-bone/30 hover:bg-bone hover:text-ink'
              }`}
            >
              {p.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
