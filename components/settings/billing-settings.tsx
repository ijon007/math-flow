'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { plans } from '@/constants/pricing';
import { api } from '@/convex/_generated/api';
import PricingCards from '../pricing-cards';
import { useRouter } from 'next/navigation';

export function BillingSettings() {
  const { user } = useUser();
  const router = useRouter();
  const currentUser = useQuery(api.auth.getCurrentUser, {
    clerkUserId: user?.id,
  });

  const userPlan = currentUser?.isPro ? 'Pro' : 'Free';
  const currentPlan = plans.find(plan => plan.name === userPlan);

  const handleManageBilling = () => {
    if (currentUser?.polarCustomerId) {
      const portalUrl = `/api/polar/portal?customer_id=${currentUser.polarCustomerId}`;
      window.open(portalUrl, '_blank');
    }
  };

  if (user && currentUser === undefined) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading subscription status...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto max-h-[80vh] lg:max-h-[70vh] scrollbar-hide space-y-4 p-4">
      <div>
        <h3 className="mb-2 font-medium text-lg">Current Plan</h3>
        <Card>
          <CardContent className="flex flex-row items-center justify-between pt-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{currentPlan?.name} Plan</CardTitle>
                <CardDescription>
                  {userPlan === 'Free' ? 'Basic features for learning math' : 'Unlimited access to all features'}
                </CardDescription>
              </div>
            </div>
            {userPlan === 'Pro' && (
              <Button size="sm" onClick={handleManageBilling}>
                Manage Billing
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="container relative z-10 mx-auto">
        <PricingCards isSettings={true} currentPlan={userPlan} />
      </div>
    </div>
  );
}
