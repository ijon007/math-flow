// portal/route.ts
import { CustomerPortal } from '@polar-sh/nextjs';
import type { NextRequest } from 'next/server';

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  getCustomerId: (req: NextRequest) => Promise.resolve(''),
  server: process.env.POLAR_SERVER as 'sandbox' | 'production',
});
