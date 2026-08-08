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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary border border-bg-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-bg-border">
          <div>
            <h2 className="text-xl font-bold text-white">Upgrade Your Plan</h2>
            <p className="text-sm text-gray-500 mt-0.5">All plans include 30 days of access</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-bg-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.name;
            const isLoading = loadingPlan === plan.name;

            return (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-5 flex flex-col gap-4 transition-colors ${
                  isCurrent
                    ? 'border-accent bg-accent/5'
                    : 'border-bg-border bg-bg-card hover:border-gray-600'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                    Current Plan
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${plan.color}`} />
                  <span className="font-semibold text-white">{plan.label}</span>
                </div>

                <div>
                  <span className="text-3xl font-bold text-white">{plan.priceDisplay}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>

                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isCurrent || isLoading || loadingPlan !== null}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-accent/20 text-accent cursor-default'
                      : 'bg-accent hover:bg-accent/90 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {isCurrent ? 'Active' : isLoading ? 'Processing…' : `Upgrade to ${plan.label}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
