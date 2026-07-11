'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sun, Zap, Brain, Shield, CheckCircle, Info, Wrench, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from '../components/ui/Loader';
import { Button } from '../components/ui/Button';

const features = [
  {
    icon: Zap,
    title: 'Real-Time Monitoring',
    desc: 'Live power, voltage, current, temperature readings every 2 seconds via WebSocket.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'Groq AI analyzes panel health every 90 seconds, detecting dust, shading, and faults automatically.',
  },
  {
    icon: Shield,
    title: 'Instant Alerts',
    desc: 'Smart threshold-based alerting with auto-resolution when conditions normalize.',
  },
];

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/month',
    subtitle: 'Perfect for testing & prototype',
    highlight: false,
    note: 'Uses simulated data — connect real ESP32 sensors in Pro plan',
    hardwareBox: null,
    features: [
      '6 simulated solar panels',
      'Real-time simulated data monitoring',
      'AI-powered fault detection',
      'Basic performance analytics',
      'System health scoring',
      'Live alerts & notifications',
    ],
  },
  {
    name: 'Starter',
    price: '₹499',
    period: '/month',
    subtitle: 'For real installations up to 10 panels',
    highlight: true,
    note: null,
    hardwareBox: {
      label: 'Hardware (one-time)',
      perPanel: '₹2,999 / panel',
      includes: 'ESP32 sensor kit, current clamp, mounting hardware',
      note: 'Up to 10 panels — bulk pricing available',
    },
    features: [
      'Up to 10 real solar panels',
      'Live sensor data (ESP32 compatible)',
      'Advanced AI analysis',
      'Email & WhatsApp alerts',
      'Monthly performance reports',
      'CSV data export',
    ],
  },
  {
    name: 'Pro',
    price: '₹1,499',
    period: '/month',
    subtitle: 'For large installations & businesses',
    highlight: false,
    note: null,
    hardwareBox: {
      label: 'Hardware (one-time)',
      perPanel: '₹2,499 / panel',
      includes: 'ESP32 sensor kit, current clamp, mounting hardware',
      note: 'Unlimited panels — bulk discounts from 20+ panels',
    },
    features: [
      'Unlimited panels',
      'Priority AI analysis',
      'Custom sensor integration',
      'API access for custom dashboards',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
];

const installSteps = [
  {
    icon: Wrench,
    step: '01',
    title: 'Site Survey & Hardware Install',
    desc: 'Our technician visits your site, mounts ESP32 sensors on each panel, and runs wiring — typically completed in half a day.',
  },
  {
    icon: UserCheck,
    step: '02',
    title: 'Account Setup & Pairing',
    desc: 'We create your GridSense account, pair every sensor to your dashboard, and verify live readings before we leave.',
  },
  {
    icon: Zap,
    step: '03',
    title: 'Go Live — Monitor Instantly',
    desc: 'From day one you get real-time data, AI fault detection, and instant alerts. No configuration needed on your end.',
  },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <PageLoader />;
  if (user) return <PageLoader />;

  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="border-b border-bg-border sticky top-0 bg-bg-secondary/80 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">GridSense</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-sm text-accent mb-6">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          AI-Powered Solar Monitoring
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Monitor Your Solar Panels
          <br />
          <span className="text-accent">With Intelligence</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          Real-time health monitoring, AI fault detection, instant alerts, and detailed analytics for your solar energy system.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup">
            <Button size="lg">Start Free — No Credit Card</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">Sign In</Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-bg-card border border-bg-border rounded-xl p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-3">Simple Pricing</h2>
        <p className="text-gray-500 text-center text-sm mb-12">Start free with simulated data, upgrade for real sensor integration</p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-bg-card border rounded-xl p-6 flex flex-col ${plan.highlight ? 'border-accent ring-1 ring-accent/20' : 'border-bg-border'}`}
            >
              {plan.highlight && (
                <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-3">Most Popular</div>
              )}
              <h3 className="text-xl font-bold text-white mb-0.5">{plan.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{plan.subtitle}</p>
              <div className="flex items-end gap-1 mb-5">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-gray-500 mb-1">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.hardwareBox && (
                <div className="bg-bg-secondary border border-bg-border rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">{plan.hardwareBox.label}</p>
                  <p className="text-base font-bold text-white mb-1">{plan.hardwareBox.perPanel}</p>
                  <p className="text-xs text-gray-400 mb-1">{plan.hardwareBox.includes}</p>
                  <p className="text-xs text-gray-600 italic">{plan.hardwareBox.note}</p>
                </div>
              )}
              {plan.note && (
                <div className="flex items-start gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 mb-4">
                  <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-300">{plan.note}</p>
                </div>
              )}
              <Link href="/signup">
                <Button variant={plan.highlight ? 'primary' : 'secondary'} className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-3">Professional Installation</h2>
        <p className="text-gray-500 text-center text-sm mb-12">We Handle Everything</p>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {installSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="bg-bg-card border border-bg-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-xs font-bold text-accent tracking-widest">STEP {s.step}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <a href="mailto:hello@gridsense.in">
            <Button variant="secondary" size="lg">Request Free Site Survey</Button>
          </a>
        </div>
      </section>

      <footer className="border-t border-bg-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-600 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-accent" />
            <span className="text-white font-medium">GridSense</span>
          </div>
          <p>AI-Powered Solar Panel Health Monitoring</p>
        </div>
      </footer>
    </div>
  );
}
