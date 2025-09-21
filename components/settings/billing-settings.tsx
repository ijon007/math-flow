'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { plans } from '@/constants/pricing';
import { api } from '@/convex/_generated/api';
import PricingCards from '../pricing-cards';

export function BillingSettings() {
  const { user } = useUser();
  const currentUser = useQuery(api.auth.getCurrentUser, {
    clerkUserId: user?.id,
  });

  const userPlan = currentUser?.isPro ? 'Pro' : 'Free';
  const currentPlan = plans.find((plan) => plan.name === userPlan);

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
          <div className="text-muted-foreground text-sm">
            Loading subscription status...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 overflow-scroll p-3 h-full scrollbar-hide">
      <div>
        <Card>
          <CardContent className="flex flex-row items-center justify-between pt-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {currentPlan?.name} Plan
                </CardTitle>
                <CardDescription>
                  {userPlan === 'Free'
                    ? 'Basic features for learning math'
                    : 'Unlimited access to all features'}
                </CardDescription>
              </div>
            </div>
            {userPlan === 'Pro' && (
              <Button onClick={handleManageBilling} size="sm">
                Manage Billing
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="">
        <PricingCards currentPlan={userPlan} isSettings={true} />
      </div>
    </div>
  );
}
