// api/webhook/polar/route.ts
import { Webhooks } from '@polar-sh/nextjs';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const getPlanFromInterval = (interval: string): 'monthly' | 'yearly' => {
  return interval === 'year' ? 'yearly' : 'monthly';
};

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log('Polar webhook payload:', payload);
  },
  onSubscriptionCreated: async (payload) => {
    console.log('Subscription created:', payload);

    try {
      const subscription = payload.data;
      const customer = subscription.customer;

      // Get the Clerk user ID from metadata, fallback to customer ID if not available
      const userId =
        customer.metadata?.clerkUserId ||
        customer.metadata?.userId ||
        customer.id;

      console.log('Webhook - Customer metadata:', customer.metadata);
      console.log('Webhook - Customer ID:', customer.id);
      console.log(
        'Webhook - Clerk user ID from metadata:',
        customer.metadata?.clerkUserId
      );
      console.log('Webhook - Using userId:', userId);

      await convex.mutation(api.subscriptions.createOrUpdateSubscription, {
        userId: String(userId),
        customerId: customer.id,
        isPro: subscription.status === 'active',
        plan: getPlanFromInterval(
          subscription.prices[0]?.recurringInterval || 'month'
        ),
        status: subscription.status,
        subscriptionId: subscription.id,
      });
    } catch (error) {
      console.error('Error handling subscription created:', error);
    }
  },
  onSubscriptionUpdated: async (payload) => {
    console.log('Subscription updated:', payload);

    try {
      const subscription = payload.data;
      const customer = subscription.customer;

      const userId =
        customer.metadata?.clerkUserId ||
        customer.metadata?.userId ||
        customer.id;

      await convex.mutation(api.subscriptions.createOrUpdateSubscription, {
        userId: String(userId),
        customerId: customer.id,
        isPro: subscription.status === 'active',
        plan: getPlanFromInterval(
          subscription.prices[0]?.recurringInterval || 'month'
        ),
        status: subscription.status,
        subscriptionId: subscription.id,
      });
    } catch (error) {
      console.error('Error handling subscription updated:', error);
    }
  },
});
