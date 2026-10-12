import type { Metadata } from 'next';
import { AuthView } from '../../../components/auth/AuthView';

export const metadata: Metadata = {
  title: 'Create a free account',
  description: 'Start monitoring solar panels for free with GridSense — six simulated panels, live telemetry every two seconds and AI fault detection. No card required.',
  alternates: { canonical: '/signup' },
};

export default function SignupPage() {
  return <AuthView mode="signup" />;
}
