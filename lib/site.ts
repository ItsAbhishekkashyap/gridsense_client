// Single source of truth for public site details (SEO, footer, structured data).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://gridsenseai.vercel.app').replace(/\/$/, '');
export const SITE_NAME = 'GridSense';
export const SITE_TAGLINE = 'AI solar panel monitoring';
export const SITE_DESCRIPTION =
  'GridSense monitors every solar panel every two seconds and an AI copilot explains what’s wrong, why, and what to do next — dust, heat, shading, inverter and wiring faults, caught early.';
export const CONTACT_EMAIL = 'abhi47025@gmail.com';
export const CONTACT_CITY = 'Lucknow, India';
export const KEYWORDS = [
  'solar panel monitoring',
  'solar monitoring India',
  'AI solar fault detection',
  'solar panel efficiency',
  'rooftop solar monitoring',
  'ESP32 solar sensor',
  'solar inverter fault',
  'solar panel dust detection',
  'solar telemetry dashboard',
  'GridSense',
];
