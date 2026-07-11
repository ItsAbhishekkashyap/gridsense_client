'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { SignupForm } from '../../../components/auth/SignupForm';
import { PageLoader } from '../../../components/ui/Loader';

export default function SignupPage() {
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
      <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
      <p className="text-gray-500 text-sm mb-6">Start monitoring your solar system for free</p>
      <SignupForm />
    </>
  );
}
