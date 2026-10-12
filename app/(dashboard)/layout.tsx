'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Navbar } from '../../components/ui/Navbar';
import { Sidebar } from '../../components/ui/Sidebar';
import { PageLoader } from '../../components/ui/Loader';
import { CopilotChat } from '../../components/CopilotChat';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <PageLoader />;
  if (!user) return <PageLoader />;

  return (
    <div className="flex min-h-[100svh] bg-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main key={pathname} className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-16 lg:pt-0">
          {children}
        </main>
      </div>
      <CopilotChat />
    </div>
  );
}
