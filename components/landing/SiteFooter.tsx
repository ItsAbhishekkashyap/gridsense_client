'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT_EMAIL, CONTACT_CITY } from '../../lib/site';

gsap.registerPlugin(ScrollTrigger);

const TICKER = ['● Alpha 78 W', '● Beta 31 W', '● Gamma 61 W', '● Delta 77 W · recovered', '● Epsilon 77 W', '● Zeta asleep', '2 s sampling', 'AI scan every 90 s'];

export function SiteFooter({ onTop }: { onTop: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const sunRef = useRef<SVGCircleElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // the sun sets behind the wordmark as the footer scrolls into view
      ScrollTrigger.create({
        trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true,
        onUpdate: (st) => {
          const e = 1 - Math.pow(1 - st.progress, 3);
          sunRef.current?.setAttribute('cy', String(10 + 230 * e));
          if (clockRef.current) {
            const m = Math.round(1121 + 20 * st.progress);
            clockRef.current.textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
          }
        },
      });
      gsap.from('[data-frise]', {
        y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-bone/10 bg-ink text-bone">
      <div aria-hidden className="flex h-[52px] items-center overflow-hidden whitespace-nowrap border-b border-bone/10 font-mono text-[11px] uppercase tracking-[.08em] text-muted">
        <div className="ticker flex gap-12 pl-6">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className={t.includes('Delta') ? 'text-sol' : undefined}>{t}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-10 px-5 md:px-16 pt-12 md:pt-16">
        <div>
          <p data-frise className="text-[40px] md:text-[64px] font-bold leading-none tracking-[-.04em]">
            Ready when the <span className="font-serif italic font-normal text-sol">sun</span> is.
          </p>
          <div data-frise className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/signup" className="inline-flex h-[52px] items-center rounded-full bg-bone px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-sol">Start free →</Link>
            <a href={`mailto:${CONTACT_EMAIL}?subject=GridSense%20site%20survey`} className="inline-flex h-[52px] items-center rounded-full border border-bone/30 px-6 text-[15px] transition-colors hover:bg-bone hover:text-ink">Book a site survey</a>
          </div>
        </div>
        <div data-frise className="flex gap-12 text-sm text-muted">
          <nav aria-label="Footer" className="flex flex-col gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[.08em] text-dim">Product</span>
            <button type="button" onClick={onTop} className="text-left hover:text-bone">Story</button>
            <a href="#pricing" className="hover:text-bone">Pricing</a>
            <Link href="/login" className="hover:text-bone">Sign in</Link>
          </nav>
          <address className="flex flex-col gap-2.5 not-italic">
            <span className="font-mono text-[10px] uppercase tracking-[.08em] text-dim">Contact</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-bone">{CONTACT_EMAIL}</a>
            <span>{CONTACT_CITY}</span>
          </address>
        </div>
      </div>

      {/* the sun sets behind the name — sized by viewBox so it always fits */}
      <svg viewBox="0 0 1000 210" role="img" aria-label="GridSense" className="mx-5 md:mx-16 mt-16 md:mt-24 block w-[calc(100%-2.5rem)] md:w-[calc(100%-8rem)]">
        <defs>
          <clipPath id="above-horizon"><rect x="0" y="0" width="1000" height="186" /></clipPath>
          <radialGradient id="footer-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#FFE2C2" />
            <stop offset=".35" stopColor="#FF8A4C" />
            <stop offset=".7" stopColor="#FF5B1F" />
            <stop offset="1" stopColor="#FF5B1F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g clipPath="url(#above-horizon)"><circle ref={sunRef} cx="500" cy="10" r="120" fill="url(#footer-sun)" /></g>
        <text x="0" y="186" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="#07070A" stroke="#EFEBE3" strokeWidth="1.1" style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontStretch: '125%', fontSize: 236 }}>GRIDSENSE</text>
        <line x1="0" x2="1000" y1="186" y2="186" stroke="#EFEBE3" strokeOpacity=".5" />
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-16 py-6 font-mono text-[10px] uppercase tracking-[.08em] text-dim">
        <span>© {new Date().getFullYear()} GridSense · {CONTACT_CITY}</span>
        <span>Sunset <span ref={clockRef}>18:41</span> IST · Next sunrise 05:43</span>
        <button type="button" onClick={onTop} className="text-bone hover:text-sol">↑ Back to sunrise</button>
      </div>
    </footer>
  );
}
