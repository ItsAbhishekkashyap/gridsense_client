'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { LoginForm } from '../../../components/auth/LoginForm';
import { PageLoader } from '../../../components/ui/Loader';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
      <p className="text-gray-500 text-sm mb-6">Sign in to your GridSense account</p>
      <LoginForm />
    </>
  );
}
