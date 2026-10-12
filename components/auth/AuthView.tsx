'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

/** Shared shell for /login and /signup: signed-in users are sent to the dashboard (unchanged behaviour). */
export function AuthView({ mode }: { mode: 'login' | 'signup' }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [user, isLoading, router]);

  const login = mode === 'login';
  return (
    <div key={mode} className="animate-rise">
      <p className="font-mono text-[11px] uppercase tracking-[.08em] text-sol-deep">{login ? 'Welcome back' : 'Six simulated panels · free'}</p>
      <h1 className="mt-3 mb-8 text-[40px] font-bold leading-none tracking-[-.03em] md:text-[44px]" style={{ fontStretch: '95%' }}>
        {login ? 'Good to see you.' : 'Start listening.'}
      </h1>
      {login ? <LoginForm /> : <SignupForm />}
    </div>
  );
}
