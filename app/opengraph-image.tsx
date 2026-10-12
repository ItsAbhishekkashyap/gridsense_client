import { ImageResponse } from 'next/og';

export const alt = 'GridSense — every panel has a pulse';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'radial-gradient(90% 70% at 50% 100%, #3A1A0A 0%, #07070A 62%)', color: '#EFEBE3', padding: 64, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: 3, opacity: 0.7 }}>
          <span>GRIDSENSE</span>
          <span>05:42 · SUNRISE · LUCKNOW</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 104, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4 }}>
          <span>EVERY PANEL</span>
          <span style={{ display: 'flex' }}>HAS A&nbsp;<span style={{ color: '#FF5B1F' }}>PULSE.</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 28, maxWidth: 700, color: '#C9C4B9' }}>AI solar panel monitoring — readings every 2 seconds, and a copilot that tells you what’s wrong.</span>
          <div style={{ width: 220, height: 110, borderRadius: '220px 220px 0 0', background: 'radial-gradient(circle at 50% 100%, #FFE2C2 0%, #FF8A4C 30%, #FF5B1F 60%, rgba(255,91,31,0) 100%)' }} />
        </div>
      </div>
    ),
    size,
  );
}
