'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { ShineBorder } from '../magicui/shine-border';
import UpgradeDialog from './pricing-dialog';

export function ProUpgradeCard() {
  const { user } = useUser();
  const currentUser = useQuery(api.auth.getCurrentUser, {
    clerkUserId: user?.id,
  });

  if (currentUser?.isPro) return null;

  if (user && currentUser === undefined) {
    return (
      <Card className="relative gap-0 border-neutral-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-900">
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

  if (currentUser?.isPro) {
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
      <CardContent className="flex w-full flex-col items-center p-2 pt-0">
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
            <Button className="w-full bg-neutral-800 text-white hover:bg-neutral-700">
              Upgrade to Pro
            </Button>
          </UpgradeDialog>
        </SignedIn>
      </CardContent>
    </Card>
  );
}
