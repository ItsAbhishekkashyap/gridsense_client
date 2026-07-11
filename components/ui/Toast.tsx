'use client';

import { Toaster, toast } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#112240',
          color: '#ffffff',
          border: '1px solid #1E3A5F',
          borderRadius: '8px',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#22C55E', secondary: '#112240' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#112240' },
        },
      }}
    />
  );
}

export { toast };
