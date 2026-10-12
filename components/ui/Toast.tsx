'use client';

import { Toaster, toast } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#EFEBE3',
          color: '#141412',
          border: '0',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 500,
          padding: '12px 16px',
          boxShadow: '0 24px 48px -20px rgba(0,0,0,.6)',
        },
        success: { iconTheme: { primary: '#2F7D55', secondary: '#EFEBE3' } },
        error: { iconTheme: { primary: '#C2410C', secondary: '#EFEBE3' } },
      }}
    />
  );
}

export { toast };
