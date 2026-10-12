import type { Metadata } from 'next';
import { AuthView } from '../../../components/auth/AuthView';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to GridSense to see live telemetry, AI fault diagnosis and alerts for every solar panel on your roof.',
  alternates: { canonical: '/login' },
};

export default function LoginPage() {
  return <AuthView mode="login" />;
}
