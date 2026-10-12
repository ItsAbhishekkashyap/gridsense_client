/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#07070A',
        surface: '#111110',
        raise: '#1A1917',
        bone: '#EFEBE3',
        paper: '#EFEBE3',
        sol: { DEFAULT: '#FF5B1F', deep: '#C2410C', soft: '#FFB27A' },
        muted: '#9A958B',
        dim: '#6F6B63',
        line: 'rgba(239,235,227,0.12)',
        ok: '#9BE3BF',
        warn: '#F2B441',
        crit: '#FF7A6E',
        info: '#8FB8FF',
        // legacy aliases so any untouched markup still lands on the new palette
        bg: { primary: '#07070A', secondary: '#111110', card: '#111110', border: 'rgba(239,235,227,0.12)' },
        accent: { DEFAULT: '#FF5B1F', hover: '#E8521C', light: '#FFB27A' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(22px)' }, to: { opacity: '1', transform: 'none' } },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        drawer: { from: { transform: 'translateX(48px)', opacity: '0' }, to: { transform: 'none', opacity: '1' } },
        sheet: { from: { transform: 'translateY(60px)', opacity: '0' }, to: { transform: 'none', opacity: '1' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '.25' } },
      },
      animation: {
        rise: 'rise .8s cubic-bezier(0.16,1,0.3,1) both',
        fade: 'fade .5s ease both',
        drawer: 'drawer .6s cubic-bezier(0.16,1,0.3,1) both',
        sheet: 'sheet .6s cubic-bezier(0.16,1,0.3,1) both',
        blink: 'blink 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
