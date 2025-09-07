'use server';

import { polar } from '@/lib/polar';

export async function getCheckoutURL(
  productId: string,
  user: { userId: string; email?: string | null }
) {
  const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;
  const polarServer = process.env.POLAR_SERVER;

  if (!process.env.POLAR_SUCCESS_URL)
    throw new Error('Missing POLAR_SUCCESS_URL.');
  if (!user?.userId) throw new Error('User is not authenticated.');
  if (!polarAccessToken) throw new Error('Missing POLAR_ACCESS_TOKEN.');
  if (!polarServer) throw new Error('Missing POLAR_SERVER.');
  if (!productId) throw new Error('Missing productId.');

  try {
    console.log('Creating checkout with:', {
      productId,
      successUrl: process.env.POLAR_SUCCESS_URL,
      userId: user.userId,
      email: user.email,
    });

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: process.env.POLAR_SUCCESS_URL,
      customerEmail: user.email || undefined,
      metadata: {
        userId: user.userId,
        clerkUserId: user.userId, // Add this for clarity
      },
    });

    console.log('Checkout created successfully:', checkout);
    return checkout.url;
  } catch (error) {
    console.error('Polar checkout error:', error);
    throw new Error(
      `Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getCustomerPortalURL(customerId: string) {
  if (!customerId) throw new Error('Missing customerId.');

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (!appUrl) throw new Error('Missing NEXT_PUBLIC_APP_URL.');

    return `${appUrl}/api/polar/customer-portal?customer_id=${customerId}`;
  } catch (error) {
    throw new Error('Failed to create customer portal URL');
  }
}
