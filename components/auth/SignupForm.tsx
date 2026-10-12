'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Check, Circle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from '../ui/Toast';

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${met ? 'text-[#2F7D55]' : 'text-[#5E5A52]'}`}>
      {met ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
      {label}
    </span>
  );
}

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rules = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
  };
  const strength = [rules.length, rules.uppercase, rules.number].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name || form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email) newErrors.email = 'Email is required';
    if (!rules.length || !rules.uppercase || !rules.number) newErrors.password = 'Password does not meet requirements';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await signup(form.name.trim(), form.email, form.password);
      router.push('/dashboard');
      toast.success('Account created! Welcome to GridSense.');
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data;
      if (errData?.errors?.length) {
        toast.error(errData.errors[0]);
      } else {
        toast.error(errData?.message || 'Signup failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input tone="light" label="Full name" type="text" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} autoComplete="name" />
      <Input tone="light" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} autoComplete="email" />
      <div>
        <Input
          tone="light"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          autoComplete="new-password"
          trailing={
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="flex h-11 w-11 items-center justify-center text-[#5E5A52] hover:text-ink">
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          }
        />
        <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-[3px] rounded-full transition-colors duration-500 ${i < strength ? (strength === 3 ? 'bg-[#2F7D55]' : 'bg-sol') : 'bg-ink/10'}`} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-4">
          <PasswordRule met={rules.length} label="8+ chars" />
          <PasswordRule met={rules.uppercase} label="Uppercase" />
          <PasswordRule met={rules.number} label="Number" />
        </div>
      </div>
      <Input tone="light" label="Confirm password" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} autoComplete="new-password" />
      <Button type="submit" variant="ink" isLoading={isLoading} size="lg" className="w-full justify-between pl-7 pr-2">
        Create account
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sol text-ink transition-transform duration-500 ease-expo group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </Button>
      <p className="text-[15px] text-[#5E5A52]">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-sol-deep underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
