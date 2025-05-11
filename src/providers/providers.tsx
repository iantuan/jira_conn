'use client';

import { Provider as JotaiProvider } from 'jotai';
import { SessionProvider } from "next-auth/react";
import { ReactNode } from 'react';
import ConfigInitializer from '@/components/ConfigInitializer';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <JotaiProvider>
        <ConfigInitializer />
        {children}
      </JotaiProvider>
    </SessionProvider>
  );
} 