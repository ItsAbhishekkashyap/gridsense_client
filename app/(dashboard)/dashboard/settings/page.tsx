'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { systemApi } from '../../../../lib/api';
import { TopBar, PageTitle } from '../../../../components/app/PageHeader';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Loader } from '../../../../components/ui/Loader';
import { toast } from '../../../../components/ui/Toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState({ systemName: '', location: '', tariffRate: '', totalCapacity: '' });
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await systemApi.getConfig();
        const c = res.data.data.config;
        setConfig({
          systemName: c.systemName,
          location: c.location,
          tariffRate: String(c.tariffRate),
          totalCapacity: String(c.totalCapacity),
        });
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
    if (user) {
      setProfileForm({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await systemApi.updateConfig({
        systemName: config.systemName,
        location: config.location,
        tariffRate: parseFloat(config.tariffRate),
        totalCapacity: parseFloat(config.totalCapacity),
      });
      toast.success('System configuration saved');
    } catch {
      toast.error('Failed to save configuration');
    } finally {
      setIsSavingConfig(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader size="lg" /></div>;
  }

  const plan = user?.currentPlan || user?.plan || 'FREE';
  const section = 'grid gap-6 border-t border-line py-10 md:grid-cols-[260px_1fr] md:gap-12';

  return (
    <div className="pb-6">
      <TopBar crumbs={[{ label: 'Account' }, { label: 'Settings' }]} />
      <PageTitle title="Settings" sub="Manage your account and system preferences." />

      <Link href="/dashboard/billing" className="group mt-8 flex items-center justify-between rounded-xl bg-paper p-5 text-ink lg:hidden">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.08em] text-[#5E5A52]">Plan</p>
          <p className="mt-1 text-[32px] font-extrabold uppercase leading-none" style={{ fontStretch: '62%' }}>{plan}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[.08em] text-sol-deep">Billing & payments</p>
        </div>
        <ArrowRight className="h-5 w-5 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
      </Link>

      <div data-stagger className="mt-8 max-w-5xl">
        <section aria-labelledby="s-system" className={section}>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.08em] text-sol">01</p>
            <h2 id="s-system" className="mt-2 text-2xl font-bold">System</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">Used for savings maths and the reports you receive.</p>
          </div>
          <form onSubmit={handleSaveConfig} className="flex flex-col gap-7">
            <Input label="System name" value={config.systemName} onChange={(e) => setConfig({ ...config, systemName: e.target.value })} />
            <Input label="Location" value={config.location} onChange={(e) => setConfig({ ...config, location: e.target.value })} />
            <div className="grid gap-7 sm:grid-cols-2">
              <Input label="Tariff rate (₹/kWh)" type="number" step="0.1" inputMode="decimal" value={config.tariffRate} onChange={(e) => setConfig({ ...config, tariffRate: e.target.value })} />
              <Input label="Total capacity (kW)" type="number" step="0.1" inputMode="decimal" value={config.totalCapacity} onChange={(e) => setConfig({ ...config, totalCapacity: e.target.value })} />
            </div>
            <div>
              <Button type="submit" isLoading={isSavingConfig}>Save configuration</Button>
            </div>
          </form>
        </section>

        <section aria-labelledby="s-profile" className={section}>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.08em] text-sol">02</p>
            <h2 id="s-profile" className="mt-2 text-2xl font-bold">Profile</h2>
          </div>
          <dl className="grid gap-7 sm:grid-cols-2">
            <div><dt className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">Name</dt><dd className="mt-2 text-lg">{user?.name}</dd></div>
            <div className="min-w-0"><dt className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">Email</dt><dd className="mt-2 truncate text-lg">{user?.email}</dd></div>
            <div><dt className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">Plan</dt><dd className="mt-2 text-lg uppercase text-sol">{user?.plan}</dd></div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[.08em] text-muted">Member since</dt>
              <dd className="mt-2 text-lg">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '--'}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="s-password" className={`${section} border-b`}>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.08em] text-sol">03</p>
            <h2 id="s-password" className="mt-2 text-2xl font-bold">Password</h2>
          </div>
          <div className="flex flex-col gap-7">
            <Input label="Current password" type="password" autoComplete="current-password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
            <div className="grid gap-7 sm:grid-cols-2">
              <Input label="New password" type="password" autoComplete="new-password" value={passwordForm.newPass} onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })} />
              <Input label="Confirm new password" type="password" autoComplete="new-password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
            </div>
            <div>
              <Button variant="secondary" onClick={() => toast.success('Password change coming soon')}>Update password</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
