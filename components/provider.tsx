'use client';

import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import ConvexClientProvider from './convex-clerk-provider';
import { Toaster } from './ui/sonner';

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        {children}
        <Toaster style={{
          '--normal-bg': 'var(--popover)',
          '--normal-text': '#00C48D',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties}/>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
