import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { ToastProvider } from '../components/ui/Toast';

export const metadata: Metadata = {
  title: 'GridSense - AI Solar Monitoring',
  description: 'AI-powered solar panel health monitoring SaaS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-bg-primary text-white antialiased font-sans selection:bg-accent/30 selection:text-white">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
