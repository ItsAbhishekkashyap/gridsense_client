'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { paymentApi } from '../../../../lib/api';
import { useAuth } from '../../../../hooks/useAuth';
import { Card, CardHeader, CardTitle } from '../../../../components/ui/Card';
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
      <div className="flex justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-sm text-gray-500">Manage your plan and payment history</p>
      </div>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" />
            Current Plan
          </CardTitle>
        </CardHeader>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">{currentPlan}</span>
              <Badge variant={isPaid ? 'success' : 'default'}>
                {subscription ? 'Active' : 'Free Tier'}
              </Badge>
            </div>

            {subscription ? (
              <>
                <p className="text-sm text-gray-400">
                  Expires on <span className="text-white">{formatDate(subscription.endDate)}</span>
                </p>
                <div className="w-48">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{daysRemaining} days left</span>
                    <span>30 days</span>
                  </div>
                  <div className="h-2 bg-bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${daysRemaining <= 5 ? 'bg-red-400' : 'bg-accent'}`}
                      style={{ width: `${expiryProgress}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Upgrade to unlock full monitoring features</p>
            )}
          </div>

          <div className="flex gap-2">
            {isPaid && (
              <Button variant="ghost" size="sm" onClick={() => setUpgradeOpen(true)}>
                <RefreshCw className="w-4 h-4 mr-1" /> Renew
              </Button>
            )}
            <Button size="sm" onClick={() => setUpgradeOpen(true)}>
              {isPaid ? 'Upgrade Plan' : 'Upgrade to Pro'}
            </Button>
          </div>
        </div>

        {daysRemaining > 0 && daysRemaining <= 3 && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">
              Your plan expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. Renew now to avoid interruption.
            </p>
          </div>
        )}
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
        </CardHeader>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['FREE', 'STARTER', 'PRO', 'ENTERPRISE'] as Plan[]).map((plan) => (
            <div
              key={plan}
              className={`rounded-xl border p-4 ${
                currentPlan === plan ? 'border-accent bg-accent/5' : 'border-bg-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">{plan}</span>
                {currentPlan === plan && (
                  <span className="text-xs text-accent font-medium">Current</span>
                )}
              </div>
              <ul className="space-y-1.5">
                {PLAN_FEATURES[plan].map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-gray-400">
                    <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 mt-4">No payments yet</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-bg-border">
                  <th className="text-left pb-2">Date</th>
                  <th className="text-left pb-2">Plan</th>
                  <th className="text-left pb-2">Amount</th>
                  <th className="text-left pb-2">Status</th>
                  <th className="text-left pb-2">Order ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {history.map((item) => (
                  <tr key={item.id} className="text-gray-300">
                    <td className="py-3">{formatDate(item.createdAt)}</td>
                    <td className="py-3 font-medium text-white">{item.plan}</td>
                    <td className="py-3">₹{item.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <Badge variant={STATUS_BADGE[item.status] ?? 'default'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-xs text-gray-500 font-mono truncate max-w-[120px]">
                      {item.razorpayOrderId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => { setUpgradeOpen(false); fetchData(); }}
        currentPlan={currentPlan}
      />
    </div>
  );
}
