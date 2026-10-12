'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useAuth } from '../../hooks/useAuth';
import { BEATS, CHAPTERS, computeFrame, desktopLayout, mobileLayout, roundFrame } from './story';
import { StoryStage } from './StoryStage';
import { Logo } from '../ui/Logo';
import { Pricing } from './Pricing';
import { SiteFooter } from './SiteFooter';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP = desktopLayout();
const MOBILE = mobileLayout();

export function Landing() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Signed-in visitors go straight to their dashboard (unchanged behaviour).
  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [user, isLoading, router]);

  const trackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const [t, setT] = useState({ P: 0, tm: 3.3, load: 0, past: false, total: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 0 && window.innerHeight > 0) setVp({ w: window.innerWidth, h: window.innerHeight });
    };
    onResize();
    window.addEventListener('resize', onResize);
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lenis smooth scroll + one GSAP ticker drives the whole film.
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;
    if (!prefersReduced) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
      lenis.on('scroll', ScrollTrigger.update);
      lenisRef.current = lenis;
    }
    if (prefersReduced) document.documentElement.classList.add('gs-ready');
    window.scrollTo(0, 0);
    const t0 = performance.now();
    const tick = (time: number) => {
      lenis?.raf(time * 1000);
      const now = performance.now();
      const track = trackRef.current;
      const vh = window.innerHeight;
      // background tabs can report a 0px viewport; keep the maths finite
      const story = Math.max(1, track ? track.offsetHeight - vh : 1);
      const y = window.scrollY;
      const load = prefersReduced ? 1.3 : Math.min(1.3, (now - t0) / 1900);
      if (load >= 1.25) document.documentElement.classList.add('gs-ready');
      setT({
        P: Math.max(0, Math.min(1, y / story)),
        tm: prefersReduced ? 3.3 : (now - t0) / 1000,
        load,
        past: y > story + 10,
        total: Math.max(0, Math.min(1, y / Math.max(1, document.documentElement.scrollHeight - vh))),
      });
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove('gs-ready');
    };
  }, []);

  // Lock scrolling while the preloader plays.
  useEffect(() => {
    const locked = t.load < 1.2;
    if (locked) lenisRef.current?.stop(); else lenisRef.current?.start();
    document.documentElement.style.overflow = locked ? 'hidden' : '';
  }, [t.load < 1.2]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pick the composition for this screen and scale it to fit.
  const portrait = vp.w / vp.h < 1 || vp.w < 700;
  const L = portrait ? MOBILE : DESKTOP;
  const scale = Math.min(vp.w / L.W, vp.h / L.H);
  const ext = Math.max(0, (vp.w / scale - L.W) / 2);
  const ease = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
  const intro = ease((t.load - 1.02) / 0.26);
  const f = useMemo(() => roundFrame(computeFrame(L, t.P, t.tm, intro, ext)), [L, t.P, t.tm, intro, ext]);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const story = track.offsetHeight - window.innerHeight;
    const y = (i === 0 ? 0 : BEATS[i] + 0.012) * story + 4;
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y });
  }, []);

  const pre = ease((t.load - 1) / 0.28);
  const hzPx = vp.h / 2 + (L.hz - L.H / 2) * scale;
  const headC = t.past ? '#EFEBE3' : f.fg;
  const count = String(Math.floor(ease(t.load) * 100)).padStart(3, '0');

  return (
    <div className="landing" style={{ background: '#07070A' }}>
      {/* fixed header */}
      <header
        className={`fixed inset-x-0 top-0 z-40 flex h-16 md:h-[72px] items-center justify-between px-5 md:px-16 pointer-events-none transition-[background-color,backdrop-filter] duration-500 ${t.past ? 'bg-ink/75 backdrop-blur-md' : ''}`}
        style={{ color: headC }}
      >
        <Link href="/" className="pointer-events-auto flex items-center gap-2.5" aria-label="GridSense home">
          <Logo />
          <span className="text-[17px] font-bold" style={{ fontStretch: '110%' }}>GridSense</span>
        </Link>
        <div className="hidden sm:flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.08em] opacity-75">
          <span className="text-sol" style={{ opacity: f.blink }}>●</span>
          <span>IST {f.clock}</span>
          <span className="hidden md:inline">/ {CHAPTERS[f.ci].name}</span>
        </div>
        <nav className="pointer-events-auto flex items-center gap-2" aria-label="Account">
          <Link href="/login" className="hidden sm:inline-flex h-10 items-center px-3 text-sm hover:text-sol transition-colors">Sign in</Link>
          <Link href="/signup" className="inline-flex h-10 items-center rounded-full bg-sol px-4 text-sm font-semibold text-ink hover:scale-[1.03] transition-transform">Start free</Link>
        </nav>
      </header>

      {/* scroll progress rail */}
      <div aria-hidden className="fixed right-2 top-24 bottom-24 z-40 w-0.5" style={{ background: headC, opacity: 0.14 }} />
      <div aria-hidden className="fixed right-2 top-24 z-40 w-0.5 bg-sol" style={{ height: `calc((100vh - 12rem) * ${t.total})` }} />

      {/* the pinned film */}
      <section ref={trackRef} aria-label="The GridSense story" className="relative" style={{ height: `${L.screens * 100}svh` }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden" style={{ background: f.bg, color: f.fg }}>
          <div className="absolute left-1/2 top-1/2" style={{ width: L.W, height: L.H, transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: '50% 50%' }}>
            <StoryStage L={L} f={f} />
          </div>

          {/* scroll hint */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[.08em] text-bone" style={{ bottom: portrait ? 110 : 140, opacity: intro * Math.max(0, 1 - t.P * 60) }}>
            <span>Scroll to rise</span>
            <i className="block w-px bg-bone" style={{ height: Math.round(30 + 20 * Math.abs(Math.sin(t.tm * 1.6))) }} />
          </div>

          {/* chapter timeline */}
          <nav aria-label="Chapters" className="absolute inset-x-5 md:inset-x-16 bottom-0 h-11 md:h-[52px]">
            <div className="absolute inset-x-0 top-0 h-px bg-current opacity-20" />
            <div className="absolute left-0 -top-px h-0.5 bg-sol" style={{ width: `${t.P * 100}%` }} />
            <ol className="flex h-full items-center justify-between">
              {CHAPTERS.map((c, i) => (
                <li key={c.name}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Jump to chapter ${i}: ${c.name}`}
                    aria-current={i === f.ci ? 'step' : undefined}
                    className="h-11 font-mono text-[9px] md:text-[10px] uppercase tracking-[.06em] transition-opacity hover:opacity-100"
                    style={{ opacity: i === f.ci ? 1 : 0.45 }}
                  >
                    <span className="hidden lg:inline">{c.time} {c.name}</span>
                    <span className="lg:hidden">{i === f.ci ? c.time : '·'}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <Pricing />
      <SiteFooter onTop={() => goTo(0)} />

      {/* preloader: the horizon opens */}
      {!reduced && pre < 1 && (
        <div aria-hidden className="preloader">
          <div className="fixed inset-x-0 top-0 z-50 bg-ink text-bone" style={{ height: hzPx, transform: `translateY(${-100 * pre}%)` }}>
            <p className="absolute left-5 md:left-16 top-7 font-mono text-[11px] uppercase tracking-[.08em] opacity-60">Calibrating sensors</p>
            <p className="absolute left-5 md:left-16 bottom-4 font-mono leading-none tracking-[-.05em]" style={{ fontSize: Math.min(220, vp.w * 0.22) }}>{count}</p>
            <p className="absolute right-5 md:right-16 bottom-5 font-mono text-[11px] uppercase tracking-[.08em] opacity-60">05:41 · before sunrise</p>
            <div className="absolute left-0 bottom-0 h-px bg-sol" style={{ width: `${ease(t.load) * 100}%` }} />
          </div>
          <div className="fixed inset-x-0 bottom-0 z-50 bg-ink" style={{ top: hzPx, transform: `translateY(${100 * pre}%)` }} />
        </div>
      )}
    </div>
  );
}
