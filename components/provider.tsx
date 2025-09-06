'use client'

import { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from './convex-clerk-provider'

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
    </ClerkProvider>
  )
}
