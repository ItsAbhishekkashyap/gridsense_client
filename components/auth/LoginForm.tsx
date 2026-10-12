'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from '../ui/Toast';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!form.email) { setErrors({ email: 'Email is required' }); return; }
    if (!form.password) { setErrors({ password: 'Password is required' }); return; }

    setIsLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
      toast.success('Welcome back!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Input
        tone="light"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        tone="light"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        error={errors.password}
        autoComplete="current-password"
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="flex h-11 w-11 items-center justify-center text-[#5E5A52] hover:text-ink"
          >
            {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        }
      />
      <Button type="submit" variant="ink" isLoading={isLoading} size="lg" className="w-full justify-between pl-7 pr-2">
        Sign in
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sol text-ink transition-transform duration-500 ease-expo group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </Button>
      <p className="text-[15px] text-[#5E5A52]">
        New to GridSense?{' '}
        <Link href="/signup" className="font-medium text-sol-deep underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
