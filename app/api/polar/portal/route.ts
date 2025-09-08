// portal/route.ts
import { CustomerPortal } from '@polar-sh/nextjs';
import type { NextRequest } from 'next/server';

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  getCustomerId: async (req: NextRequest) => {
    const customerId = req.nextUrl.searchParams.get('customer_id');
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    return customerId;
  },
  server: process.env.POLAR_SERVER as 'sandbox' | 'production',
});
