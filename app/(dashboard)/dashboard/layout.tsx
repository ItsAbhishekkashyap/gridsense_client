import type { Metadata } from 'next';

// The app lives behind a login: keep it out of search results.
export const metadata: Metadata = {
  title: { default: 'Overview', template: '%s · GridSense' },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function DashboardSegmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
