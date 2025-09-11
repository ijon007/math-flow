'use client';

import { useSharedItemRedirect } from '@/hooks/use-shared-item-redirect';

export function SharedItemRedirectHandler() {
  useSharedItemRedirect();
  return null; // This component doesn't render anything
}
