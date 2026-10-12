'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Check, Zap, Star, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { paymentApi } from '../../lib/api';
import { toast } from '../ui/Toast';
import { Plan } from '../../types';

interface PlanConfig {
  name: Plan;
  label: string;
  price: number;
  priceDisplay: string;
  icon: React.ElementType;
  color: string;
  features: string[];
}

const PLANS: PlanConfig[] = [
  {
    name: 'STARTER',
    label: 'Starter',
    price: 49900,
    priceDisplay: '₹499',
    icon: Zap,
    color: 'text-blue-400',
    features: [
      'Up to 5 solar panels',
      'Real-time monitoring',
      'Email alerts',
      'Basic analytics',
      '30-day history',
    ],
  },
  {
    name: 'PRO',
    label: 'Pro',
    price: 149900,
    priceDisplay: '₹1,499',
    icon: Star,
    color: 'text-accent',
    features: [
      'Up to 20 solar panels',
      'AI-powered analysis',
      'Priority alerts',
      'Advanced analytics',
      '1-year history',
      'Export reports',
    ],
  },
  {
    name: 'ENTERPRISE',
    label: 'Enterprise',
    price: 499900,
    priceDisplay: '₹4,999',
    icon: Building2,
    color: 'text-purple-400',
    features: [
      'Unlimited panels',
      'AI-powered analysis',
      'Custom alerts',
      'Full analytics suite',
      'Unlimited history',
      'API access',
      'Dedicated support',
    ],
  },
];

declare global {
  interface Window {
    Razorpay: new (options: object) => { open: () => void };
  }
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: Plan;
}

export function UpgradeModal({ isOpen, onClose, currentPlan }: UpgradeModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (plan: PlanConfig) => {
    if (!user) return;
    setLoadingPlan(plan.name);

    try {
      const orderRes = await paymentApi.createOrder(plan.name);
      const order = orderRes.data.data;

      const options = {
        key: order.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'GridSense',
        description: `${plan.label} Plan - 30 days`,
        order_id: order.orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Plan upgraded successfully!');
            onClose();
            router.refresh();
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#F97316' },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Failed to initiate payment. Try again.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/70 backdrop-blur-sm animate-fade" />
      <div className="relative max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-[20px] bg-ink text-bone shadow-2xl animate-sheet sm:rounded-2xl sm:border sm:border-line">
        <div className="flex items-start justify-between gap-4 border-b border-line p-6 md:p-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.08em] text-sol">Upgrade</p>
            <h2 id="upgrade-title" className="mt-2 text-[34px] font-bold leading-none tracking-[-.03em] md:text-[44px]">
              Pick your <span className="font-serif font-normal italic text-sol">array.</span>
            </h2>
            <p className="mt-2 text-sm text-muted">All plans include 30 days of access.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/20 text-muted transition-colors hover:bg-bone hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div data-stagger className="grid gap-3 p-6 md:grid-cols-3 md:p-8">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.name;
            const isLoading = loadingPlan === plan.name;
            const featured = plan.name === 'PRO';

            return (
              <div key={plan.name} className={`relative flex flex-col gap-5 overflow-hidden rounded-xl p-6 ${featured ? 'bg-paper text-ink' : 'border border-line bg-surface'}`}>
                {featured && <span className="absolute inset-x-0 top-0 h-[3px] bg-sol" />}
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-[.08em]">
                  <span className={featured ? 'text-[#5E5A52]' : 'text-muted'}>{plan.label}</span>
                  {isCurrent && <span className={featured ? 'text-sol-deep' : 'text-sol'}>Current</span>}
                </div>
                <p>
                  <span className="text-[64px] font-extrabold leading-[.85]" style={{ fontStretch: '62%' }}>{plan.priceDisplay}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[.08em] opacity-60"> / month</span>
                </p>
                <ul className="flex-1 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 border-t py-2 ${featured ? 'border-ink/10' : 'border-line text-bone/80'}`}>
                      <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${featured ? 'text-sol-deep' : 'text-ok'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isCurrent || isLoading || loadingPlan !== null}
                  className={`h-12 w-full rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                    isCurrent
                      ? featured ? 'bg-ink/10 text-ink/60' : 'bg-bone/10 text-muted'
                      : featured ? 'bg-ink text-bone hover:bg-sol hover:text-ink disabled:opacity-50' : 'bg-sol text-ink hover:bg-[#FF7438] disabled:opacity-50'
                  }`}
                >
                  {isCurrent ? 'Active' : isLoading ? 'Processing…' : `Upgrade to ${plan.label}`}
                </button>
              </div>
            );
          })}
        </div>
        <p className="px-6 pb-6 font-mono text-[10px] uppercase tracking-[.08em] text-dim md:px-8">Payments processed securely by Razorpay</p>
      </div>
    </div>
  );
}
