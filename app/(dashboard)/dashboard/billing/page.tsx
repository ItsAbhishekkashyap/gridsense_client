'use client';

import { useState, useEffect } from 'react';
import { Check, RefreshCw, AlertCircle } from 'lucide-react';
import { paymentApi } from '../../../../lib/api';
import { useAuth } from '../../../../hooks/useAuth';
import { TopBar } from '../../../../components/app/PageHeader';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Loader } from '../../../../components/ui/Loader';
import { UpgradeModal } from '../../../../components/payment/UpgradeModal';
import { toast } from '../../../../components/ui/Toast';
import { Subscription, PaymentHistoryItem, Plan } from '../../../../types';

const PLAN_FEATURES: Record<Plan, string[]> = {
  FREE: ['1 solar panel', 'Basic monitoring', '7-day history'],
  STARTER: ['5 panels', 'Real-time monitoring', 'Email alerts', '30-day history'],
  PRO: ['20 panels', 'AI analysis', 'Advanced analytics', '1-year history', 'Export reports'],
  ENTERPRISE: ['Unlimited panels', 'AI analysis', 'API access', 'Unlimited history', 'Dedicated support'],
};

const STATUS_BADGE: Record<string, 'success' | 'critical' | 'warning' | 'default'> = {
  CAPTURED: 'success',
  FAILED: 'critical',
  PENDING: 'warning',
  REFUNDED: 'default',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subRes, histRes] = await Promise.all([
        paymentApi.getSubscription(),
        paymentApi.getHistory(),
      ]);
      setSubscription(subRes.data.data.subscription);
      setDaysRemaining(subRes.data.data.daysRemaining);
      setHistory(histRes.data.data.history);
    } catch {
      toast.error('Failed to load billing info');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const currentPlan: Plan = user?.currentPlan || user?.plan || 'FREE';
  const isPaid = currentPlan !== 'FREE';
  const expiryProgress = subscription
    ? Math.min(100, Math.max(0, (daysRemaining / 30) * 100))
    : 0;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const cycleDays = 30;
  const used = subscription ? Math.max(0, Math.min(cycleDays, cycleDays - daysRemaining)) : 0;

  return (
    <div className="pb-6">
      <TopBar crumbs={[{ label: 'Account' }, { label: 'Billing' }]} />

      {daysRemaining > 0 && daysRemaining <= 3 && (
        <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-warn/10 px-4 py-3 animate-rise">
          <p className="flex items-center gap-2.5 text-sm text-warn">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Your plan expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. Renew now to avoid interruption.
          </p>
          <button type="button" onClick={() => setUpgradeOpen(true)} className="inline-flex h-9 items-center rounded-full bg-warn px-4 text-[13px] font-semibold text-ink">Renew</button>
        </div>
      )}

      <div className="mt-2 grid items-end gap-8 lg:mt-10 xl:grid-cols-[1.3fr_1fr]">
        <div className="animate-rise">
          <p className="font-mono text-[11px] uppercase tracking-[.08em] text-dim">Current plan</p>
          <h1 className="mt-2 text-[80px] font-extrabold uppercase leading-[.82] sm:text-[120px] xl:text-[170px]" style={{ fontStretch: '62%' }}>{currentPlan}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge variant={isPaid ? 'success' : 'default'}>{subscription ? 'Active' : 'Free tier'}</Badge>
            <span className="text-[15px] text-muted">
              {subscription ? <>Renews / expires on <span className="text-bone">{formatDate(subscription.endDate)}</span></> : 'Upgrade to unlock full monitoring features'}
            </span>
          </div>
        </div>

        <section aria-label="Billing cycle" className="rounded-xl border border-line bg-surface p-6 animate-rise [animation-delay:.1s]">
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-[.08em] text-muted">
            <span>Cycle</span>
            <span className={daysRemaining <= 5 && subscription ? 'text-warn' : ''}>{subscription ? `${daysRemaining} days left` : 'No active cycle'}</span>
          </div>
          <div className="mt-5 grid grid-cols-[repeat(30,minmax(0,1fr))] gap-[3px]" role="img" aria-label={`${used} of ${cycleDays} days used`}>
            {Array.from({ length: cycleDays }).map((_, i) => (
              <i
                key={i}
                className="block h-7 rounded-[1px] animate-[rise_.6s_cubic-bezier(.16,1,.3,1)_both]"
                style={{ animationDelay: `${0.2 + i * 0.02}s`, background: !subscription ? 'rgba(239,235,227,.1)' : i < used ? 'rgba(239,235,227,.7)' : daysRemaining <= 5 ? '#F2B441' : '#FF5B1F' }}
              />
            ))}
          </div>
          <div className="mt-2.5 flex justify-between font-mono text-[11px] uppercase tracking-[.08em] text-dim">
            <span>Day 1</span><span>Day {cycleDays}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button className="flex-1" onClick={() => setUpgradeOpen(true)}>{isPaid ? 'Upgrade plan' : 'Upgrade to Pro'}</Button>
            {isPaid && (
              <Button variant="secondary" className="flex-1" onClick={() => setUpgradeOpen(true)}>
                <RefreshCw className="h-4 w-4" /> Renew
              </Button>
            )}
          </div>
        </section>
      </div>

      <section aria-labelledby="plans-title" className="mt-14">
        <h2 id="plans-title" className="text-2xl font-bold tracking-[-.02em]">Plans</h2>
        <div data-stagger className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {(['FREE', 'STARTER', 'PRO', 'ENTERPRISE'] as Plan[]).map((plan) => {
            const on = currentPlan === plan;
            return (
              <div key={plan} className={`relative overflow-hidden rounded-xl p-6 ${on ? 'bg-paper text-ink' : 'border border-line bg-surface'}`}>
                {on && <span className="absolute inset-x-0 top-0 h-[3px] bg-sol" />}
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-[.08em]">
                  <span className={on ? 'text-[#5E5A52]' : 'text-muted'}>{plan}</span>
                  {on && <span className="text-sol-deep">Current</span>}
                </div>
                <ul className="mt-4 text-sm">
                  {PLAN_FEATURES[plan].map((f) => (
                    <li key={f} className={`flex items-start gap-2 border-t py-2.5 ${on ? 'border-ink/10' : 'border-line text-bone/80'}`}>
                      <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${on ? 'text-sol-deep' : 'text-ok'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="history-title" className="mt-14">
        <h2 id="history-title" className="text-2xl font-bold tracking-[-.02em]">Payment history</h2>
        {history.length === 0 ? (
          <p className="mt-4 border-t border-line py-8 text-sm text-muted">No payments yet</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="font-mono text-[10px] uppercase tracking-[.08em] text-dim">
                  <th className="pb-3 text-left font-normal">Date</th>
                  <th className="pb-3 text-left font-normal">Plan</th>
                  <th className="pb-3 text-left font-normal">Amount</th>
                  <th className="pb-3 text-left font-normal">Status</th>
                  <th className="pb-3 text-left font-normal">Order ID</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-t border-line">
                    <td className="py-4">{formatDate(item.createdAt)}</td>
                    <td className="py-4 font-medium">{item.plan}</td>
                    <td className="py-4 font-mono">₹{item.amount.toLocaleString('en-IN')}</td>
                    <td className="py-4">
                      <Badge variant={STATUS_BADGE[item.status] ?? 'default'}>{item.status}</Badge>
                    </td>
                    <td className="max-w-[160px] truncate py-4 font-mono text-xs text-muted">{item.razorpayOrderId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[.08em] text-dim">Payments processed securely by Razorpay</p>
      </section>

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => { setUpgradeOpen(false); fetchData(); }}
        currentPlan={currentPlan}
      />
    </div>
  );
}
