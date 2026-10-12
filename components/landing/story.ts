// Scroll-story engine for the landing page.
// Everything on the stage is a pure function of (scroll position, ambient time, load progress),
// so the same frame always renders the same way — scrolling back simply reverses the film.

export type Layout = ReturnType<typeof desktopLayout>;

type Cam = [number, number, number, number, number, number];

export function desktopLayout() {
  return {
    mobile: false,
    W: 1440, H: 900, hz: 690, pulseY: 800, amp: 32, hudX: 64, hudY: 746, hud: 11,
    copyX: 64, copyY: 120, copyW: 720, heroY: 118, heroW: 1320, subW: 520, b3Y: 150, b3W: 1300, b9Y: 230, b9W: 1100,
    h1: 140, h1w: 125, h2: 68, body: 19, para: 50, giant: 190, cal: 40, kick: 11, gap: 28,
    sun2: 150, glowR: 760, preT: 220,
    cam: [
      [0, 1010, 548, 0.6, -28, 6], [0.10, 1010, 548, 0.6, -28, 6], [0.16, 1030, 452, 0.98, -20, 4],
      [0.33, 1030, 452, 0.98, -16, 4], [0.37, 1060, 470, 0.9, -12, 4], [0.43, 300, 520, 0.8, 0, 0],
      [0.70, 300, 520, 0.8, 0, 0], [0.76, 300, 520, 0.8, -6, 0], [0.81, 840, 592, 0.4, 0, 0], [1, 840, 592, 0.4, 0, 0],
    ] as Cam[],
    tagW: 210, tagT: 15, tagPos: [[690, 250], [1240, 200], [690, 560]] as [number, number][],
    chipW: 280, chipH: 104, chipV: 34,
    chipPos: [[900, 300], [1200, 300], [900, 422], [1200, 422], [900, 544], [1200, 544]] as [number, number][],
    orb: [860, 470, 140] as [number, number, number], orbLabels: true, chatX: 1090, chatY: 250, chatW: 310, chatT: 15,
    alX: 720, alY: 230, alW: 620, alP: 28, alT: 38,
    curve: [640, 150, 1380, 440] as [number, number, number, number],
    arr: { xs: [420, 560, 700, 840, 980, 1120], w: 122, h: 195 },
    steps: [520, 860, 1200], stepY: 716, stepW: 220, stepT: 16,
    navT: 10, screens: 20,
    fade: 'But panels don’t fail loudly. They fade — dust settles, cells overheat, and a branch starts shading row seven every afternoon.',
    answer: 'Delta is making 40% of what Alpha makes under the same sunlight — so it isn’t weather. The pattern says two things: a dust film across the top half, and a branch shading rows 7–10 after 2 PM. Rinse the panel and trim the branch.',
  };
}

export function mobileLayout(): Layout {
  return {
    mobile: true,
    W: 390, H: 844, hz: 600, pulseY: 736, amp: 22, hudX: 20, hudY: 684, hud: 9,
    copyX: 20, copyY: 84, copyW: 350, heroY: 86, heroW: 350, subW: 350, b3Y: 110, b3W: 350, b9Y: 170, b9W: 350,
    h1: 44, h1w: 100, h2: 36, body: 15, para: 30, giant: 64, cal: 26, kick: 10, gap: 16,
    sun2: 96, glowR: 380, preT: 96,
    cam: [
      [0, 195, 497, 0.42, -22, 6], [0.10, 195, 497, 0.42, -22, 6], [0.16, 195, 456, 0.62, -16, 4],
      [0.33, 195, 456, 0.62, -14, 4], [0.37, 200, 470, 0.6, -10, 4], [0.43, 110, 560, 0.5, 0, 0],
      [0.70, 110, 560, 0.5, 0, 0], [0.76, 110, 560, 0.5, -6, 0], [0.81, 225, 558, 0.171, 0, 0], [1, 225, 558, 0.171, 0, 0],
    ],
    tagW: 118, tagT: 12, tagPos: [[14, 300], [258, 286], [14, 560]],
    chipW: 168, chipH: 50, chipV: 18,
    chipPos: [[284, 352], [284, 410], [284, 468], [284, 526], [284, 584], [284, 642]],
    orb: [292, 540, 58], orbLabels: false, chatX: 20, chatY: 192, chatW: 350, chatT: 13,
    alX: 20, alY: 186, alW: 350, alP: 16, alT: 22,
    curve: [20, 300, 370, 470],
    arr: { xs: [45, 105, 165, 225, 285, 345], w: 52, h: 83 },
    steps: [65, 195, 325], stepY: 616, stepW: 120, stepT: 12,
    navT: 9, screens: 20,
    fade: 'But panels don’t fail loudly. They fade.',
    answer: 'Delta is at 40% of its neighbours under the same sun — not weather. Dust plus a shaded corner after 2 PM. Rinse it and trim the branch.',
  };
}

/** Chapter start positions (0–1 of the story track). */
export const BEATS = [0, 0.10, 0.205, 0.335, 0.405, 0.52, 0.66, 0.76, 0.86, 0.935, 1];

export const CHAPTERS: { time: string; name: string; minutes: number }[] = [
  { time: '05:42', name: 'Dawn', minutes: 342 },
  { time: '08:10', name: 'Harvest', minutes: 490 },
  { time: '13:20', name: 'The fade', minutes: 800 },
  { time: '+30 d', name: 'Nobody noticed', minutes: -1 },
  { time: '09:30', name: 'Listening', minutes: 570 },
  { time: '12:30', name: 'Solar noon', minutes: 750 },
  { time: '15:10', name: 'Act', minutes: 910 },
  { time: '17:45', name: 'Long view', minutes: 1065 },
  { time: '18:41', name: 'Sunset', minutes: 1121 },
  { time: '19:04', name: 'Night', minutes: 1144 },
];

type RGB = [number, number, number];

const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => 1 - Math.pow(1 - cl(x), 3);
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const hash = (a: number, b: number) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };
const hexrgb = (c: string): RGB => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) as RGB;
const mixc = (a: string | RGB, b: string | RGB, u: number): RGB => {
  const A = typeof a === 'string' ? hexrgb(a) : a;
  const B = typeof b === 'string' ? hexrgb(b) : b;
  return A.map((x, i) => x + (B[i] - x) * cl(u)) as RGB;
};
export const css = (r: RGB) => `rgb(${r.map(Math.round).join(',')})`;
const ramp = (stops: [number, string][], p: number): RGB => {
  let k = 0; while (k < stops.length - 2 && p > stops[k + 1][0]) k++;
  const u = (p - stops[k][0]) / ((stops[k + 1][0] - stops[k][0]) || 1);
  return mixc(stops[k][1], stops[k + 1][1], sm(u));
};
const num = (stops: [number, number][], p: number) => {
  let k = 0; while (k < stops.length - 2 && p > stops[k + 1][0]) k++;
  const u = (p - stops[k][0]) / ((stops[k + 1][0] - stops[k][0]) || 1);
  return lerp(stops[k][1], stops[k + 1][1], sm(u));
};
const pad = (n: number) => String(n).padStart(2, '0');
const r2 = (n: number) => Math.round(n * 100) / 100;

export interface Beat { o: number; y: number; l: number; m0: number; m1: number; sub: number }

function beatAt(P: number, a: number, b: number, last: boolean): Beat {
  const l = (P - a) / (b - a);
  const ein = ease(l / 0.18);
  const eout = last ? 0 : sm((l - 0.86) / 0.14);
  const o = P < a - 0.001 || (!last && P > b) ? 0 : Math.min(ein, 1 - eout);
  const mk = (i: number) => (1 - ease((l - 0.02 - i * 0.05) / 0.2)) * 110;
  return { o, y: -eout * 60, l, m0: mk(0), m1: mk(1), sub: ease((l - 0.16) / 0.15) };
}

function ecg(ph: number) {
  if (ph < 0.08) return 0;
  if (ph < 0.16) return 0.12 * Math.sin(((ph - 0.08) / 0.08) * Math.PI);
  if (ph < 0.24) return 0;
  if (ph < 0.27) return (-0.18 * (ph - 0.24)) / 0.03;
  if (ph < 0.30) return -0.18 + (1.18 * (ph - 0.27)) / 0.03;
  if (ph < 0.34) return 1 - (1.45 * (ph - 0.30)) / 0.04;
  if (ph < 0.37) return -0.45 + (0.45 * (ph - 0.34)) / 0.03;
  if (ph < 0.50) return 0;
  if (ph < 0.66) return 0.22 * Math.sin(((ph - 0.5) / 0.16) * Math.PI);
  return 0;
}

/**
 * @param P     story progress 0–1
 * @param tm    ambient seconds (idle motion: heartbeat, shimmer, orbits)
 * @param intro 0–1 entrance after the preloader
 */
export function computeFrame(L: Layout, P: number, tm: number, intro: number, ext = 0) {
  if (!Number.isFinite(P)) P = 0;
  if (!Number.isFinite(intro)) intro = 1;
  if (!Number.isFinite(ext) || ext < 0) ext = 0;
  ext = Math.min(ext, 4000);
  // sky
  const sky = ramp([[0, '#07070A'], [0.05, '#1E110B'], [0.10, '#1B130E'], [0.20, '#16120F'], [0.26, '#0E0D0C'], [0.34, '#09090A'], [0.40, '#09090A'], [0.455, '#EFEBE3'], [0.68, '#EFEBE3'], [0.76, '#EAD4B8'], [0.83, '#C98B5E'], [0.875, '#3A2014'], [0.93, '#120C0A'], [1, '#07070A']], P);
  const lum = (0.299 * sky[0] + 0.587 * sky[1] + 0.114 * sky[2]) / 255;
  const fg = mixc('#EFEBE3', '#141412', (lum - 0.42) / 0.16);
  const day = sm((P - 0.42) / 0.04) * (1 - sm((P - 0.72) / 0.06));

  // beats
  const b = BEATS.slice(0, 10).map((a, i) => beatAt(P, a, BEATS[i + 1], i === 9));
  b[0].o = P > 0.1 ? 0 : Math.min(intro, 1 - sm((P - 0.085) / 0.015));
  b[0].y = -sm((P - 0.085) / 0.015) * 60;
  b[0].m0 = (1 - ease(intro * 1.3)) * 110;
  b[0].m1 = (1 - ease(intro * 1.3 - 0.2)) * 110;
  b[0].sub = ease(intro * 2 - 0.9);

  // camera
  const keys = L.cam; let k = 0; while (k < keys.length - 2 && P > keys[k + 1][0]) k++;
  const u = sm((P - keys[k][0]) / ((keys[k + 1][0] - keys[k][0]) || 1));
  const cam = [1, 2, 3, 4, 5].map((i) => lerp(keys[k][i], keys[k + 1][i], u));
  const breathe = Math.sin(tm * 0.8) * 1.2;
  const pan = { x: cam[0], y: cam[1] + breathe * (1 - day), s: cam[2], ry: cam[3] + Math.sin(tm * 0.4) * 1.5 * (1 - day), rx: cam[4] };
  const toStage = (px: number, py: number): [number, number] => [pan.x + (px - 152) * pan.s, pan.y + (py - 244) * pan.s];

  // the panel: light, dust, heat, shade, cleaning
  const lit = (r: number) => ease((P - 0.004 - (9 - r) * 0.0045) / 0.03) * cl(intro * 1.4) * (1 - sm((P - 0.9) / 0.05));
  const D = ease((P - 0.212) / 0.05);
  const wp = cl((b[6].l - 0.34) / 0.3);
  const wipeX = wp * 304;
  const Heat = ease((P - 0.255) / 0.04) * (1 - sm((P - 0.7) / 0.05));
  const Sh = ease((P - 0.285) / 0.045) * (1 - sm((P - 0.705) / 0.05));
  const cells: { x: number; y: number; bg: string }[] = [];
  for (let r = 0; r < 10; r++) for (let c = 0; c < 6; c++) {
    const x = 8 + c * 48, y = 8 + r * 48, hh = hash(r, c);
    const clean = cl((wipeX - x - 22) / 26);
    const dust = D * (0.3 + 0.7 * hh) * (1 - clean);
    const heat = Heat * cl(1 - Math.hypot(r - 1, c - 5) / 4.2);
    const shade = Sh * (r >= 6 && c <= 2 ? 1 : 0);
    const L1 = lit(r);
    const shimmer = 0.5 + 0.5 * Math.sin(tm * 1.6 + c * 0.7 + r * 0.45);
    let col = mixc('#121110', '#2B2823', L1);
    col = mixc(col, '#FF8A4C', L1 * (0.18 + 0.1 * shimmer) * (1 - dust) * (1 - shade * 0.9));
    col = mixc(col, '#B9AD96', dust * 0.78);
    col = mixc(col, '#FF4A3D', heat * (0.55 + 0.15 * shimmer));
    col = mixc(col, '#050505', shade * 0.6);
    cells.push({ x, y, bg: css(col) });
  }
  const specks: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const h1 = hash(i, 1), h2 = hash(i, 2), h3 = hash(i, 3), h4 = hash(i, 4);
    const tx = 8 + h1 * 288, ty = 8 + h2 * 472;
    const f = ease((P - 0.212 - h3 * 0.025) / 0.03);
    const clean = cl((wipeX - tx) / 20);
    specks.push({ x: r2(tx), y: r2(lerp(ty - 360 - h3 * 240, ty, f)), r: r2(1.4 + h4 * 2.2), o: r2((P > 0.21 ? f : 0) * (1 - clean) * 0.9) });
  }

  // health → heartbeat
  const hl = num([[0, 0], [0.07, 1], [0.215, 1], [0.33, 0.4], [0.36, 0.3], [0.405, 0.38], [0.70, 0.4], [0.745, 1], [0.86, 1], [0.93, 0.22], [1, 0.2]], P) * Math.max(0.15, intro);
  const outW = Math.round(77 * hl + Math.sin(tm * 3.1) * 1.4 * hl);
  const cyc = L.W / 3.1;
  // the heartbeat spans the full viewport, including letterbox bands (ext) on wide screens
  const span = L.W + ext * 2;
  const vis = span * ease(intro);
  const pts: string[] = [];
  let hx = 0, hy = L.pulseY;
  for (let i = 0; i <= 260; i++) {
    const x = (i / 260) * vis - ext;
    let ph = (x / cyc - tm * 0.85) % 1; if (ph < 0) ph += 1;
    const amp = L.amp * (0.18 + 0.82 * hl);
    const noise = (1 - hl) * L.amp * 0.22 * Math.sin(x * 0.09 + tm * 9) * Math.sin(x * 0.013 + tm);
    const y = L.pulseY - amp * ecg(ph) + noise;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`); hx = x; hy = y;
  }
  const pulseC = css(mixc('#FF7A6E', '#FF5B1F', (hl - 0.5) / 0.4));

  // sun & stars
  const sp = cl((P + 0.02) / 0.9), ang = Math.PI * (1 - sp);
  const sunX = L.W * (0.5 - 0.44 * Math.cos(ang));
  const sunY = L.hz - (L.hz - 120) * Math.sin(ang) + L.sun2 * (1 - intro) * 0.7;
  const night = Math.max(1 - sm(P / 0.05), sm((P - 0.9) / 0.06));
  const stars: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < 40; i++) stars.push({ x: r2(hash(i, 9) * L.W), y: r2(hash(i, 8) * (L.hz - 100) + 20), r: r2(1 + hash(i, 7) * 1.6), o: r2(night * (0.35 + 0.65 * Math.abs(Math.sin(tm * (0.6 + hash(i, 6)) + i)))) });

  // photons
  const photonO = sm((P - 0.06) / 0.04) * (1 - sm((P - 0.2) / 0.02)) * 0.75;
  let photonD = '';
  for (let i = 0; i < 12; i++) { const [tx, ty] = toStage(30 + hash(i, 11) * 244, 30 + hash(i, 12) * 420); photonD += `M${sunX.toFixed(0)} ${sunY.toFixed(0)} L${tx.toFixed(0)} ${ty.toFixed(0)} `; }

  // fault tags
  const tgt: [number, number][] = [[90, 110], [250, 70], [70, 420]];
  const tagData = [['F-01 · Soiling', 'Dust settles', 'Efficiency −38%'], ['F-02 · Heat', 'Cells overheat', '46.2 °C'], ['F-03 · Shade', 'A branch, 2–5 PM', 'Rows 7–10']];
  const tagStart = [0.215, 0.258, 0.29];
  const tags = tagData.map((t, i) => { const e = ease((P - tagStart[i]) / 0.02) * b[2].o; return { code: t[0], t: t[1], v: t[2], x: L.tagPos[i][0], y: L.tagPos[i][1], o: e, ty: (1 - e) * 16 }; });
  let leadD = '';
  tags.forEach((t, i) => { if (t.o > 0.01) { const [sx, sy] = toStage(tgt[i][0], tgt[i][1]); const ax = t.x < sx ? t.x + L.tagW : t.x; leadD += `M${ax} ${t.y + 24} L${sx.toFixed(0)} ${sy.toFixed(0)} `; } });

  // sensor, streams, chips
  const l4 = b[4].l, l5 = b[5].l;
  const sensO = sm((P - 0.425) / 0.02);
  const [sx, sy] = toStage(152, 470);
  const conv = (i: number) => ease((l5 - 0.04 - i * 0.025) / 0.16);
  const [ox, oy, Rr] = L.orb;
  const chipBase: [string, string, number, number, number][] = [['Voltage', 'V', 33.1, 0.4, 1], ['Current', 'A', 0.94, 0.03, 2], ['Power', 'W', 0, 0, 0], ['Temp', '°C', 44.6, 0.5, 1], ['Irradiance', 'W/m²', 812, 6, 0], ['Humidity', '%', 41.2, 0.4, 1]];
  const step2 = Math.floor(tm / 2);
  const chips = chipBase.map((c, i) => {
    const [gx, gy] = L.chipPos[i];
    const e = ease((l4 - 0.18 - i * 0.05) / 0.16) * (P > 0.405 ? 1 : 0);
    const cv = conv(i) * (P > 0.52 ? 1 : 0);
    const v = i === 2 ? String(outW) : (c[2] + Math.sin(step2 * 1.7 + i) * c[3]).toFixed(c[4]);
    return { label: c[0], u: c[1], v, x: lerp(lerp(sx, gx, e), ox, cv), y: lerp(lerp(sy, gy, e), oy, cv), s: lerp(lerp(0.6, 1, e), 0.2, cv), o: e * (1 - cv) * (P < 0.52 ? b[4].o : 1) };
  });
  const streams = L.chipPos.map(([gx, gy], i) => {
    const ex = gx - L.chipW / 2;
    return { d: `M${sx.toFixed(0)} ${sy.toFixed(0)} C${(sx + (ex - sx) * 0.55).toFixed(0)} ${sy.toFixed(0)} ${(sx + (ex - sx) * 0.45).toFixed(0)} ${gy} ${ex} ${gy}`, draw: 1200 * (1 - ease((l4 - 0.12 - i * 0.05) / 0.18)) };
  });
  const streamO = b[4].o * (1 - conv(0)) * (P < 0.6 ? 1 : 0);

  // copilot orb + scan
  const orbIn = ease((l5 - 0.1) / 0.15) * b[5].o;
  const toolsN = ['getSystemStatus', 'getPanelTelemetry', 'getActiveAlerts', 'searchManuals'];
  const nodes = toolsN.map((t, i) => {
    const a = ((-90 + i * 90 + tm * 10) * Math.PI) / 180;
    const on = l5 > 0.28 + i * 0.07, run = !on && l5 > 0.21 + i * 0.07;
    return { t: on ? `✓ ${t}` : t, x: Math.cos(a) * Rr, y: Math.sin(a) * Rr, fill: on ? '#FF5B1F' : run && Math.sin(tm * 12) > 0 ? '#FF5B1F' : '#EFEBE3' };
  });
  const pulseK = 1 + 0.04 * Math.sin(tm * 4);
  const orb = { x: ox, y: oy, o: orbIn, s: lerp(0.6, 1, orbIn), rot: tm * 24, r: Rr, core: Rr * 0.5 * pulseK, glow: 30 + 20 * Math.sin(tm * 3) };
  const scanT = cl((l5 - 0.3) / 0.26);
  const brkO = ease((l5 - 0.56) / 0.06) * (P < 0.66 ? b[5].o : 1 - wp);
  const an = Math.floor(L.answer.length * cl((l5 - 0.6) / 0.3));

  // alert
  const alIn = ease(b[6].l / 0.16);
  const fixed = wp >= 1;
  const al = {
    o: b[6].o * alIn, y: (1 - alIn) * 80, rx: (1 - alIn) * 25,
    tag: fixed ? '✓ Resolved · auto' : wp > 0 ? '● Fixing…' : '■ Warning · Shading + soiling',
    tagC: fixed ? '#9BE3BF' : '#F2B441', title: fixed ? 'Delta is back. +46 W.' : 'Delta is losing 60% of its output',
    metaL: fixed ? 'Recovered' : 'Est. loss / day', meta: fixed ? '+46 W' : '₹38.40', metaC: fixed ? '#9BE3BF' : '#FF5B1F',
    btn: fixed ? 'Resolved ✓' : wp > 0 ? 'Cleaning…' : 'Mark as fixing', btnBg: fixed ? '#9BE3BF' : wp > 0 ? '#EFEBE3' : '#FF5B1F',
  };

  // long view
  const [cx0, cy0, cx1, cy1] = L.curve;
  const effs = [95, 93.3, 90.5, 87, 83.5, 80, 76.5], yrs = [0, 1, 5, 10, 15, 20, 25];
  const cpt = yrs.map((y, i) => [cx0 + ((cx1 - cx0) * y) / 25, cy0 + ((cy1 - cy0) * (95 - effs[i])) / 18.5]);
  const curveD = 'M' + cpt.map((p) => `${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(' L');
  const cd = ease((b[7].l - 0.22) / 0.4);
  let curveDots = '';
  cpt.forEach((p, i) => { if (cd * 25 >= yrs[i]) curveDots += `M${p[0].toFixed(0)} ${p[1].toFixed(0)} l0.01 0 `; });
  const curveGrid = `M${cx0} ${cy1} L${cx1} ${cy1} M${cx0} ${cy0} L${cx0} ${cy1}`;
  const yrNow = Math.round(cd * 25);
  let effNow = 95;
  for (let i = 0; i < yrs.length - 1; i++) if (yrNow >= yrs[i]) effNow = lerp(effs[i], effs[i + 1], (yrNow - yrs[i]) / (yrs[i + 1] - yrs[i]));
  const arrIn = ease((P - 0.775) / 0.04);
  const ghosts = L.arr.xs.map((x, i) => ({
    i, x: x - L.arr.w / 2, y: L.hz - L.arr.h, w: L.arr.w, h: L.arr.h, cell: L.arr.w / 6,
    o: i === 3 ? 0 : arrIn * (0.9 - 0.5 * sm((P - 0.9) / 0.05)), ty: (1 - ease((P - 0.775 - i * 0.008) / 0.04)) * 40,
    glow: 0.18 * (1 - sm((P - 0.87) / 0.04)),
  })).filter((g) => g.i !== 3);

  // install steps
  const l8 = b[8].l;
  const stepsT = [['01', 'Survey & install'], ['02', 'Pair & verify'], ['03', 'Live from sunrise']];
  const steps = L.steps.map((x, i) => {
    const on = l8 > 0.2 + i * 0.2; const e = ease((l8 - 0.1 - i * 0.2) / 0.1);
    return { x, n: stepsT[i][0], t: stepsT[i][1], o: b[8].o * (0.35 + 0.65 * e), on };
  });
  const sl = ease((l8 - 0.15) / 0.5);
  const stepLine = `M${L.steps[0]} ${L.hz} L${lerp(L.steps[0], L.steps[2], sl).toFixed(0)} ${L.hz}`;

  // words
  const wl = L.fade.split(' ');
  const words = wl.map((w, i) => ({ t: w, o: 0.14 + 0.86 * cl((b[2].l * 1.7 - 0.05 - i / wl.length) * 5), hot: /fade/.test(w) }));

  // HUD
  let state = 'Waking', stateC = '#9A958B';
  if (P > 0.06) { state = 'Healthy'; stateC = '#9BE3BF'; }
  if (P > 0.215) { state = 'Degrading'; stateC = '#FF7A6E'; }
  if (P > 0.405) { state = 'Listening'; stateC = '#2F7D55'; }
  if (P > 0.53) { state = 'Diagnosing'; stateC = '#C2410C'; }
  if (P > 0.66) { state = fixed ? 'Recovered' : 'Fixing'; stateC = fixed ? '#2F7D55' : '#C2410C'; }
  if (P > 0.76) { state = 'Healthy · 6 panels'; stateC = '#2F7D55'; }
  if (P > 0.9) { state = 'Asleep · listening'; stateC = '#9A958B'; }

  let ci = 0; BEATS.slice(0, 10).forEach((a, i) => { if (P >= a) ci = i; });
  let clock = CHAPTERS[ci].time;
  if (CHAPTERS[ci].minutes > 0 && ci < 9 && CHAPTERS[ci + 1].minutes > CHAPTERS[ci].minutes) {
    const m = Math.round(lerp(CHAPTERS[ci].minutes, CHAPTERS[ci + 1].minutes, cl((P - BEATS[ci]) / (BEATS[ci + 1] - BEATS[ci]))));
    clock = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  }

  return {
    bg: css(sky), fg: css(fg), day, night, ci, clock,
    gridO: day * 0.9, glowA: (0.32 * (1 - day) + 0.1) * (1 - night * 0.8) * (P < 0.95 ? 1 : 0),
    stars, sunX, sunY, sunO: P > 0.94 ? 0 : 1, groundA: 0.28 * (1 - day), horO: 0.45 * (1 - day),
    photonD, photonO, photonOff: -tm * 70, packOff: -tm * 60,
    streams, streamAll: streams.map((s) => s.d).join(' '), packO: streamO * ease((l4 - 0.45) / 0.1), streamO,
    leadD, tags, curveD, curveOff: 2400 * (1 - cd), curveGrid, curveDots, stepLine,
    ghosts, steps,
    pan, haloB: 60 * hl * (1 - day), haloA: 0.25 * hl * (1 - day) * (1 - night),
    cells, shadeW: 228 * Sh, shadeH: 300 * Sh, specks,
    scanY: scanT * 488, scanO: scanT > 0 && scanT < 1 ? 1 : 0, brkO, wipeX, wipeO: wp > 0 && wp < 1 ? 1 : 0,
    sensO, sensY: (1 - sensO) * 40, blink: Math.sin(tm * 6) > 0 ? 1 : 0.4, panDim: b[3].o * 0.72,
    chips, orb, nodes,
    q1: ease((l5 - 0.16) / 0.06), q3: ease((l5 - 0.58) / 0.05), ans: L.answer.slice(0, an), caret: an < L.answer.length && Math.sin(tm * 8) > 0, srcO: an >= L.answer.length ? 1 : 0,
    al, b,
    words, earned: (P * 220).toFixed(2), day30: pad(1 + Math.floor(29 * ease(b[3].l * 1.4))), lostMonth: Math.round(1240 * ease(b[3].l * 1.4)).toLocaleString('en-IN'),
    year: 2026 + yrNow, effY: effNow.toFixed(1),
    pulseD: 'M' + pts.join(' L'), pulseC, pulseHead: [hx, hy] as [number, number], outW, eff: (25.7 * hl).toFixed(1), state, stateC,
  };
}

export type Frame = ReturnType<typeof computeFrame>;

/**
 * Round every number in a frame to 2 decimals. Server (Node) and browser V8 builds can differ in the
 * last bits of Math.sin/cos, which would otherwise surface as hydration mismatches in inline styles.
 */
export function roundFrame<T>(v: T): T {
  if (typeof v === 'number') return (Math.round(v * 100) / 100) as unknown as T;
  if (Array.isArray(v)) return v.map(roundFrame) as unknown as T;
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) out[k] = roundFrame(x);
    return out as T;
  }
  return v;
}
