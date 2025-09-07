'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import UpgradeDialog from './pricing-dialog';
import { ShineBorder } from '../magicui/shine-border';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function ProUpgradeCard() {
  const { user } = useUser();

  // Check subscription status once Convex types are regenerated
  const subscription = useQuery(
    api.subscriptions.getSubscriptionByUser,
    user?.id ? { userId: user.id } : "skip"
  );

  // Debug: Get all subscriptions to see what's in the database
  const allSubscriptions = useQuery(api.subscriptions.getAllSubscriptions);

  // Debug logging
  console.log('ProUpgradeCard - User:', user?.id);
  console.log('ProUpgradeCard - Subscription:', subscription);
  console.log('ProUpgradeCard - isPro:', subscription?.isPro);
  console.log('ProUpgradeCard - All subscriptions:', allSubscriptions);

  // Show loading state while fetching subscription data
  if (user && subscription === undefined) {
    return (
      <Card className="relative gap-0 border-neutral-200 bg-white p-0 dark:bg-neutral-900 dark:border-neutral-800">
        <CardHeader className="p-2 px-4">
          <CardTitle className="flex items-center gap-2 font-medium text-sm">
            Loading...
          </CardTitle>
          <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
            Checking subscription status...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Don't show the card if user is already pro
  if (subscription?.isPro) {
    return null;
  }

  return (
    <Card className="relative gap-0 border-neutral-200 bg-white p-0">
      <ShineBorder shineColor={['#A07CFE', '#00C48D']} />
      <CardHeader className="p-2 px-4">
        <CardTitle className="flex items-center gap-2 font-medium text-sm">
          Upgrade to Pro
        </CardTitle>
        <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
          Unlock unlimited agent messages and more.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 w-full flex flex-col items-center">
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              className="w-full bg-neutral-800 text-sm text-white hover:bg-neutral-700"
              type="button"
            >
              Sign in for Pro
            </Button>
          </SignInButton>
        </SignedOut>

         <SignedIn>
           <UpgradeDialog>
             <Button 
               className="w-full bg-neutral-800 text-white hover:bg-neutral-700"
             >
               Upgrade to Pro
             </Button>
           </UpgradeDialog>
         </SignedIn>
      </CardContent>
    </Card>
  );
}
