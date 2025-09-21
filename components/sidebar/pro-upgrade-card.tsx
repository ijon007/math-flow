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
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Brain, BarChart3, Calculator, BookOpen, FileText } from 'lucide-react';

const featureIcons = {
  aiMessages: MessageSquare,
  flashcards: Brain,
  graphs: BarChart3,
  stepByStep: Calculator,
  practiceTests: FileText,
  studyGuides: BookOpen,
};

const featureLabels = {
  aiMessages: 'AI Messages',
};

export function ProUpgradeCard() {
  const { user } = useUser();
  const currentUser = useQuery(api.auth.getCurrentUser, {
    clerkUserId: user?.id,
  });
  const { usageLimits, isLoading: usageLoading } = useUsageLimits();

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
          Unlock unlimited messages and more.
        </CardDescription>
      </CardHeader>
      
      {/* Usage Display - Only AI Messages */}
      {usageLimits && !usageLoading && (
        <div className="px-4 pb-2">
          <div className="space-y-2">
            {(() => {
              const { current, limit, hasReachedLimit } = usageLimits.aiMessages;
              const percentage = limit === Infinity ? 0 : (current / limit) * 100;
              const Icon = MessageSquare;

              return (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3 w-3 text-neutral-500" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        AI Messages
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {current}/{limit === Infinity ? '∞' : limit}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-1 ${hasReachedLimit ? 'bg-red-200' : ''}`}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      )}

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
            <Button className="w-full bg-neutral-800 text-white hover:bg-neutral-700 h-7">
              Upgrade to Pro
            </Button>
          </UpgradeDialog>
        </SignedIn>
      </CardContent>
    </Card>
  );
}
