'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import type { Frame, Layout } from './story';

const A: CSSProperties = { position: 'absolute' };
const mono: CSSProperties = { fontFamily: 'var(--font-mono)', letterSpacing: '.08em', textTransform: 'uppercase' };
const serif: CSSProperties = { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-.01em' };
const BLEED = 2400;

function Mask({ shift, children }: { shift: number; children: React.ReactNode }) {
  return (
    <span className="story-mask">
      <span style={{ transform: `translateY(${shift}%)` }}>{children}</span>
    </span>
  );
}

function Copy({ L, f, i, top, width, children }: { L: Layout; f: Frame; i: number; top?: number; width?: number; children: React.ReactNode }) {
  const b = f.b[i];
  return (
    <div
      className="story-copy"
      style={{ ...A, left: L.copyX, top: top ?? L.copyY, width: width ?? L.copyW, opacity: b.o, transform: `translateY(${b.y}px)`, visibility: b.o < 0.001 ? 'hidden' : 'visible' }}
    >
      {children}
    </div>
  );
}

function Kicker({ L, children }: { L: Layout; children: React.ReactNode }) {
  return <p style={{ ...mono, fontSize: L.kick, opacity: 0.65, margin: 0 }}>{children}</p>;
}

function H2({ L, f, i, a, b }: { L: Layout; f: Frame; i: number; a: React.ReactNode; b: React.ReactNode }) {
  return (
    <h2 style={{ margin: `${L.gap}px 0 0`, fontSize: L.h2, fontWeight: 700, letterSpacing: '-.04em', lineHeight: 0.98 }}>
      <Mask shift={f.b[i].m0}>{a}</Mask>
      <Mask shift={f.b[i].m1}>{b}</Mask>
    </h2>
  );
}

function Body({ L, f, i, children }: { L: Layout; f: Frame; i: number; children: React.ReactNode }) {
  return <p style={{ margin: `${L.gap}px 0 0`, fontSize: L.body, lineHeight: 1.5, opacity: f.b[i].sub, maxWidth: L.subW }}>{children}</p>;
}

export function StoryStage({ L, f }: { L: Layout; f: Frame }) {
  const p = f.pan;
  return (
    <>
      {/* sky glow, blueprint grid, stars */}
      <div aria-hidden style={{ ...A, left: -BLEED, right: -BLEED, top: -BLEED, bottom: -BLEED, background: `radial-gradient(${L.glowR}px circle at ${f.sunX + BLEED}px ${f.sunY + BLEED}px, rgba(255,110,40,${f.glowA}), rgba(255,110,40,0) 70%)` }} />
      <div aria-hidden style={{ ...A, left: -BLEED, right: -BLEED, top: -BLEED, bottom: -BLEED, opacity: f.gridO, backgroundImage: 'linear-gradient(rgba(20,20,18,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,18,.07) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      {f.stars.map((s, i) => (
        <i key={i} aria-hidden style={{ ...A, left: s.x, top: s.y, width: s.r, height: s.r, borderRadius: '50%', background: '#EFEBE3', opacity: s.o }} />
      ))}

      {/* sun, clipped by the horizon */}
      <div aria-hidden style={{ ...A, left: -BLEED, top: -BLEED, width: L.W + BLEED * 2, height: L.hz + BLEED, overflow: 'hidden' }}>
        <div style={{ ...A, left: f.sunX + BLEED, top: f.sunY + BLEED, width: L.sun2, height: L.sun2, margin: `${-L.sun2 / 2}px 0 0 ${-L.sun2 / 2}px`, borderRadius: '50%', background: 'radial-gradient(circle, #FFE2C2 0%, #FFB27A 22%, #FF5B1F 55%, rgba(255,91,31,0) 72%)', opacity: f.sunO }} />
      </div>
      <div aria-hidden style={{ ...A, left: -BLEED, right: -BLEED, top: L.hz, bottom: -BLEED, background: `rgba(0,0,0,${f.groundA})` }} />
      <div aria-hidden style={{ ...A, left: -BLEED, right: -BLEED, top: L.hz, height: 1, background: 'currentColor', opacity: f.horO }} />

      {/* photons, data streams, leaders, curve, install line */}
      <svg aria-hidden width={L.W} height={L.H} style={{ ...A, left: 0, top: 0, overflow: 'visible' }}>
        <path d={f.photonD} fill="none" stroke="#FFB27A" strokeWidth={1.2} strokeDasharray="3 22" strokeDashoffset={f.photonOff} opacity={f.photonO} />
        {f.streams.map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke="#141412" strokeOpacity={0.35} strokeWidth={1} strokeDasharray="1200" strokeDashoffset={s.draw} opacity={f.streamO} />
        ))}
        <path d={f.streamAll} fill="none" stroke="#FF5B1F" strokeWidth={2.2} strokeLinecap="round" strokeDasharray="2 26" strokeDashoffset={f.packOff} opacity={f.packO} />
        <path d={f.leadD} fill="none" stroke="#FF7A6E" strokeWidth={1} strokeDasharray="3 3" opacity={f.b[2].o} />
        <path d={f.curveD} fill="none" stroke="#FF5B1F" strokeWidth={2.4} strokeDasharray="2400" strokeDashoffset={f.curveOff} opacity={f.b[7].o} />
        <path d={f.curveGrid} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={1} opacity={f.b[7].o} />
        <path d={f.curveDots} fill="none" stroke="#FF5B1F" strokeWidth={9} strokeLinecap="round" opacity={f.b[7].o} />
        <path d={f.stepLine} fill="none" stroke="#FF5B1F" strokeWidth={2} opacity={f.b[8].o} />
      </svg>

      {/* the rest of the roof */}
      {f.ghosts.map((g) => (
        <div key={g.i} aria-hidden style={{ ...A, left: g.x, top: g.y, width: g.w, height: g.h, opacity: g.o, transform: `translateY(${g.ty}px)`, backgroundColor: '#1A1917', backgroundImage: 'linear-gradient(rgba(239,235,227,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(239,235,227,.18) 1px, transparent 1px)', backgroundSize: `${g.cell}px ${g.cell}px`, border: '1px solid rgba(239,235,227,.3)', boxShadow: `inset 0 0 0 200px rgba(255,140,70,${g.glow})` }} />
      ))}

      {/* install steps along the horizon */}
      {f.steps.map((s) => (
        <div key={s.n} style={{ ...A, left: s.x, top: L.stepY, width: L.stepW, transform: 'translateX(-50%)', textAlign: 'center', opacity: s.o }}>
          <div aria-hidden style={{ width: 14, height: 14, borderRadius: '50%', margin: '-25px auto 10px', background: s.on ? '#FF5B1F' : 'transparent', boxShadow: `0 0 0 6px rgba(255,91,31,${s.on ? 0.25 : 0})` }} />
          <div style={{ ...mono, fontSize: L.kick, color: '#FF5B1F' }}>{s.n}</div>
          <div style={{ fontSize: L.stepT, fontWeight: 600, marginTop: 4 }}>{s.t}</div>
        </div>
      ))}

      {/* THE PANEL — the main character */}
      <div aria-hidden style={{ ...A, left: p.x, top: p.y, width: 304, height: 488, transform: `translate(-50%, -50%) perspective(1600px) rotateY(${p.ry}deg) rotateX(${p.rx}deg) scale(${p.s})` }}>
        <div style={{ ...A, left: 70, top: 470, width: 4, height: 26, background: 'currentColor', opacity: 0.35 }} />
        <div style={{ ...A, right: 70, top: 470, width: 4, height: 26, background: 'currentColor', opacity: 0.35 }} />
        <div style={{ ...A, inset: 0, borderRadius: 4, background: '#2B2925', boxShadow: `0 40px 80px -30px rgba(0,0,0,.6), 0 0 ${f.haloB}px rgba(255,120,50,${f.haloA})` }} />
        {f.cells.map((c, i) => (
          <i key={i} className="story-cell" style={{ left: c.x, top: c.y, background: c.bg }} />
        ))}
        <div style={{ ...A, left: 4, bottom: 4, width: f.shadeW, height: f.shadeH, background: 'linear-gradient(35deg, rgba(0,0,0,.72) 30%, rgba(0,0,0,0) 75%)', borderRadius: '0 0 0 3px' }} />
        {f.specks.map((d, i) => (
          <i key={i} style={{ ...A, left: d.x, top: d.y, width: d.r, height: d.r, borderRadius: '50%', background: '#CFC3AC', opacity: d.o }} />
        ))}
        <div style={{ ...A, left: -6, right: -6, top: f.scanY, height: 2, background: '#FF5B1F', boxShadow: '0 0 18px 4px rgba(255,91,31,.55)', opacity: f.scanO }} />
        <div style={{ ...A, left: 0, top: 284, width: 156, height: 204, border: '1.5px solid #FF5B1F', borderRadius: 3, opacity: f.brkO }}>
          <span style={{ ...A, ...mono, left: -1, top: -22, fontSize: 10, background: '#FF5B1F', color: '#141412', padding: '3px 6px', whiteSpace: 'nowrap' }}>Shade · rows 7–10</span>
        </div>
        <div style={{ ...A, left: 4, top: 4, width: 200, height: 196, border: '1.5px dashed #FF5B1F', borderRadius: 3, opacity: f.brkO }}>
          <span style={{ ...A, ...mono, right: -1, top: -22, fontSize: 10, background: '#141412', color: '#FF5B1F', padding: '3px 6px', whiteSpace: 'nowrap' }}>Soiling 38%</span>
        </div>
        <div style={{ ...A, top: -14, bottom: -14, left: f.wipeX, width: 3, background: '#EFEBE3', boxShadow: '0 0 22px 6px rgba(255,255,255,.7)', opacity: f.wipeO }} />
        <div style={{ ...A, left: 112, top: 446, width: 80, height: 30, border: '2px solid #FF5B1F', borderRadius: 4, background: '#141412', opacity: f.sensO, transform: `translateY(${f.sensY}px)` }}>
          <span style={{ ...A, ...mono, left: 8, top: 8, fontSize: 9, color: '#FF5B1F' }}>ESP32</span>
          <i style={{ ...A, right: 8, top: 11, width: 7, height: 7, borderRadius: '50%', background: '#9BE3BF', opacity: f.blink }} />
        </div>
        <div style={{ ...A, inset: -2, borderRadius: 6, background: '#07070A', opacity: f.panDim }} />
      </div>

      {/* fault tags */}
      {f.tags.map((t) => (
        <div key={t.code} className="story-tag" style={{ left: t.x, top: t.y, width: L.tagW, opacity: t.o, transform: `translateY(${t.ty}px)` }}>
          <div style={{ ...mono, fontSize: 10, color: '#FF7A6E' }}>{t.code}</div>
          <div style={{ fontSize: L.tagT, fontWeight: 600, marginTop: 3 }}>{t.t}</div>
          <div style={{ ...mono, fontSize: 10, color: '#9A958B', marginTop: 3 }}>{t.v}</div>
        </div>
      ))}

      {/* live readings */}
      {f.chips.map((r) => (
        <div key={r.label} className="story-chip" style={{ left: r.x, top: r.y, width: L.chipW, height: L.chipH, opacity: r.o, transform: `translate(-50%, -50%) scale(${r.s})`, visibility: r.o < 0.001 ? 'hidden' : 'visible' }}>
          <div style={{ ...mono, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#5E5A52' }}>
            <span>{r.label}</span><span style={{ color: '#2F7D55', opacity: f.blink }}>● 2s</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: L.chipV, fontWeight: 500, letterSpacing: '-.03em' }}>
            {r.v}<span style={{ fontSize: '.45em', color: '#5E5A52' }}> {r.u}</span>
          </div>
        </div>
      ))}

      {/* copilot orb */}
      <div aria-hidden style={{ ...A, left: f.orb.x, top: f.orb.y, width: 0, height: 0, opacity: f.orb.o, transform: `scale(${f.orb.s})` }}>
        <div style={{ ...A, left: -f.orb.r, top: -f.orb.r, width: f.orb.r * 2, height: f.orb.r * 2, borderRadius: '50%', border: '1px dashed rgba(20,20,18,.35)', transform: `rotate(${f.orb.rot}deg)` }} />
        <div style={{ ...A, left: -f.orb.r * 0.7, top: -f.orb.r * 0.7, width: f.orb.r * 1.4, height: f.orb.r * 1.4, borderRadius: '50%', border: '1px solid rgba(20,20,18,.2)' }} />
        <div style={{ ...A, left: -f.orb.core / 2, top: -f.orb.core / 2, width: f.orb.core, height: f.orb.core, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFB27A, #FF5B1F 45%, #8A2A08)', boxShadow: `0 0 ${f.orb.glow}px rgba(255,91,31,.55)` }} />
        {f.nodes.map((n) => (
          <div key={n.t} className="story-node" style={{ left: n.x, top: n.y }}>
            <i style={{ background: n.fill }} />
            {L.orbLabels && <span style={{ ...mono, fontSize: 10, whiteSpace: 'nowrap', color: '#141412' }}>{n.t}</span>}
          </div>
        ))}
      </div>

      {/* chat */}
      <div style={{ ...A, left: L.chatX, top: L.chatY, width: L.chatW, display: 'flex', flexDirection: 'column', gap: 10, opacity: f.b[5].o, color: '#141412', visibility: f.b[5].o < 0.001 ? 'hidden' : 'visible' }}>
        <div style={{ alignSelf: 'flex-end', background: '#141412', color: '#EFEBE3', borderRadius: '16px 16px 4px 16px', padding: '12px 15px', fontSize: L.chatT, opacity: f.q1, transform: `translateY(${(1 - f.q1) * 16}px)` }}>Why is Delta making less power?</div>
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(20,20,18,.12)', borderRadius: '16px 16px 16px 4px', padding: '14px 15px', fontSize: L.chatT, lineHeight: 1.55, opacity: f.q3 }}>
          {f.ans}
          <span aria-hidden style={{ display: 'inline-block', width: 7, height: 14, background: '#C2410C', verticalAlign: -2, marginLeft: 2, opacity: f.caret ? 1 : 0 }} />
          <div style={{ ...mono, fontSize: 9, color: '#8A857B', marginTop: 10, opacity: f.srcO }}>Sources · telemetry · alerts · cleaning guide p.6</div>
        </div>
      </div>

      {/* alert */}
      <div style={{ ...A, left: L.alX, top: L.alY, width: L.alW, opacity: f.al.o, transform: `perspective(1200px) translateY(${f.al.y}px) rotateX(${f.al.rx}deg)`, transformOrigin: '50% 100%', visibility: f.al.o < 0.001 ? 'hidden' : 'visible' }}>
        <div style={{ background: '#141412', color: '#EFEBE3', borderRadius: 10, padding: L.alP, boxShadow: '0 40px 80px -30px rgba(20,20,18,.6)' }}>
          <div style={{ ...mono, display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 10 }}>
            <span style={{ color: f.al.tagC }}>{f.al.tag}</span><span style={{ color: '#8A857B' }}>15:10:42 · Panel Delta</span>
          </div>
          <div style={{ fontSize: L.alT, fontWeight: 700, fontStretch: '90%', letterSpacing: '-.02em', lineHeight: 1.05, margin: '14px 0 10px' }}>{f.al.title}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(239,235,227,.12)', border: '1px solid rgba(239,235,227,.12)' }}>
            <div style={{ background: '#141412', padding: 12 }}><div style={{ ...mono, fontSize: 9, color: '#8A857B' }}>Action</div><div style={{ fontSize: 14, marginTop: 6 }}>Rinse panel · trim west branch</div></div>
            <div style={{ background: '#141412', padding: 12 }}><div style={{ ...mono, fontSize: 9, color: '#8A857B' }}>{f.al.metaL}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, marginTop: 6, color: f.al.metaC }}>{f.al.meta}</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 46, borderRadius: 999, marginTop: 14, fontWeight: 600, fontSize: 14, background: f.al.btnBg, color: '#141412' }}>{f.al.btn}</div>
        </div>
      </div>

      {/* ───── chapter copy (real text, indexed by search engines) ───── */}
      <div className="story-copy" style={{ ...A, left: L.copyX, top: L.heroY, width: L.heroW, opacity: f.b[0].o, transform: `translateY(${f.b[0].y}px)`, visibility: f.b[0].o < 0.001 ? 'hidden' : 'visible' }}>
        <Kicker L={L}>CH.00 — 05:42 — Sunrise · Lucknow</Kicker>
        <h1 style={{ margin: `${L.gap}px 0 0`, fontSize: L.h1, fontWeight: 800, fontStretch: `${L.h1w}%`, letterSpacing: '-.035em', lineHeight: 0.86, textTransform: 'uppercase' }}>
          <Mask shift={f.b[0].m0}>Every panel</Mask>
          <Mask shift={f.b[0].m1}>has a <span style={{ ...serif, color: '#FF5B1F', textTransform: 'none', fontSize: '1.1em' }}>pulse.</span></Mask>
        </h1>
        <p style={{ margin: `${L.gap}px 0 0`, maxWidth: L.subW, fontSize: L.body, lineHeight: 1.5, opacity: f.b[0].sub }}>
          GridSense listens to every solar panel every two seconds — and an AI copilot tells you what’s wrong, why, and what to do next.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: L.gap, opacity: f.b[0].sub }}>
          <Link href="/signup" className="story-btn" style={{ height: 50, padding: '0 24px', background: '#FF5B1F', color: '#07070A', fontSize: 15 }}>Start free →</Link>
          <Link href="/login" className="story-btn" style={{ height: 50, padding: '0 22px', border: '1px solid rgba(239,235,227,.3)', fontSize: 15 }}>Sign in</Link>
        </div>
      </div>

      <Copy L={L} f={f} i={1}>
        <Kicker L={L}>CH.01 — 08:10 — Harvest</Kicker>
        <H2 L={L} f={f} i={1} a="Sunlight in." b={<><span style={{ ...serif, color: '#FF5B1F' }}>Rupees</span> out.</>} />
        <Body L={L} f={f} i={1}>Panel Delta wakes with the first ray. Every watt it makes is a rupee you don’t pay the grid — <span style={{ color: '#FF5B1F' }}>₹{f.earned}</span> so far today.</Body>
      </Copy>

      <Copy L={L} f={f} i={2}>
        <Kicker L={L}>CH.02 — 13:20 — The fade</Kicker>
        <p style={{ margin: `${L.gap}px 0 0`, fontSize: L.para, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1.08 }}>
          {f.words.map((w, i) => (
            <span key={i} style={{ opacity: w.o, color: w.hot ? '#FF7A6E' : undefined }}>{w.t} </span>
          ))}
        </p>
      </Copy>

      <Copy L={L} f={f} i={3} top={L.b3Y} width={L.b3W}>
        <Kicker L={L}>CH.03 — Thirty days later</Kicker>
        <h2 style={{ margin: `${L.gap}px 0 0`, fontSize: L.giant, fontWeight: 800, fontStretch: `${L.h1w}%`, letterSpacing: '-.045em', lineHeight: 0.84, textTransform: 'uppercase' }}>
          <Mask shift={f.b[3].m0}>Nobody</Mask>
          <Mask shift={f.b[3].m1}>noticed<span style={{ color: '#FF5B1F' }}>.</span></Mask>
        </h2>
        <div style={{ display: 'flex', gap: L.gap, flexWrap: 'wrap', marginTop: L.gap, opacity: f.b[3].sub }}>
          <div><div style={{ ...mono, fontSize: L.kick, opacity: 0.55 }}>Day</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: L.cal }}>{f.day30}<span style={{ opacity: 0.35 }}>/30</span></div></div>
          <div><div style={{ ...mono, fontSize: L.kick, opacity: 0.55 }}>Quietly lost</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: L.cal, color: '#FF7A6E' }}>₹{f.lostMonth}</div></div>
        </div>
        <div style={{ ...mono, fontSize: 10, opacity: 0.4, marginTop: 12 }}>Illustrative · one dusty, shaded panel</div>
      </Copy>

      <Copy L={L} f={f} i={4}>
        <Kicker L={L}>CH.04 — Next morning · 09:30</Kicker>
        <H2 L={L} f={f} i={4} a="Until something" b={<>started <span style={{ ...serif, color: '#C2410C' }}>listening.</span></>} />
      </Copy>

      <Copy L={L} f={f} i={5}>
        <Kicker L={L}>CH.05 — 12:30 — Solar noon</Kicker>
        <H2 L={L} f={f} i={5} a="A copilot that" b={<><span style={{ ...serif, color: '#C2410C' }}>reads</span> the signal.</>} />
      </Copy>

      <Copy L={L} f={f} i={6}>
        <Kicker L={L}>CH.06 — 15:10 — Act</Kicker>
        <H2 L={L} f={f} i={6} a="Fixed before" b={<>the bill <span style={{ ...serif, color: '#C2410C' }}>noticed.</span></>} />
      </Copy>

      <Copy L={L} f={f} i={7}>
        <Kicker L={L}>CH.07 — 17:45 — The long view</Kicker>
        <H2 L={L} f={f} i={7} a="Twenty-five" b={<>years, <span style={{ ...serif, color: '#FF5B1F' }}>watched.</span></>} />
        <div style={{ marginTop: L.gap, opacity: f.b[7].sub }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: L.cal }}>{f.year}</span>
          <span style={{ ...mono, fontSize: L.kick, opacity: 0.6 }}> · efficiency {f.effY}%</span>
        </div>
      </Copy>

      <Copy L={L} f={f} i={8}>
        <Kicker L={L}>CH.08 — 18:41 — Sunset</Kicker>
        <H2 L={L} f={f} i={8} a="We bolt it on." b={<>You watch it <span style={{ ...serif, color: '#FF5B1F' }}>live.</span></>} />
        <Body L={L} f={f} i={8}>A technician installs and pairs every sensor in about half a day — and checks live readings before leaving.</Body>
      </Copy>

      <div className="story-copy" style={{ ...A, left: 0, right: 0, top: L.b9Y, textAlign: 'center', padding: `0 ${L.copyX}px`, opacity: f.b[9].o, transform: `translateY(${f.b[9].y}px)`, visibility: f.b[9].o < 0.001 ? 'hidden' : 'visible' }}>
        <Kicker L={L}>CH.09 — 19:04 — Night · still listening</Kicker>
        <h2 style={{ margin: `${L.gap}px auto 0`, fontSize: L.h2, fontWeight: 600, letterSpacing: '-.04em', lineHeight: 1.02, maxWidth: L.b9W }}>
          <Mask shift={f.b[9].m0}>Tomorrow the sun rises at <span style={{ ...serif, color: '#FF5B1F' }}>05:43.</span></Mask>
          <Mask shift={f.b[9].m1}>Be listening.</Mask>
        </h2>
        <Link href="/signup" className="story-btn" style={{ height: 58, padding: '0 30px', marginTop: L.gap, background: '#FF5B1F', color: '#07070A', fontSize: 16, opacity: f.b[9].sub }}>Start monitoring free →</Link>
      </div>

      {/* heartbeat + HUD */}
      <svg aria-hidden width={L.W} height={L.H} style={{ ...A, left: 0, top: 0, overflow: 'visible' }}>
        <line x1={-BLEED} x2={L.W + BLEED} y1={L.pulseY} y2={L.pulseY} stroke="currentColor" strokeOpacity={0.12} />
        <path d={f.pulseD} fill="none" stroke={f.pulseC} strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx={f.pulseHead[0]} cy={f.pulseHead[1]} r={4} fill={f.pulseC} />
      </svg>
      <div style={{ ...A, ...mono, left: L.hudX, top: L.hudY, fontSize: L.hud, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <span style={{ color: f.pulseC }}>● Panel Delta</span>
        <span>{f.outW} W</span>
        {!L.mobile && <span>Eff {f.eff}%</span>}
        <span style={{ color: f.stateC }}>{f.state}</span>
      </div>
    </>
  );
}
