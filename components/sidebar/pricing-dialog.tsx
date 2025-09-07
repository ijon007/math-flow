'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Check, Rocket, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { getCheckoutURL } from '@/actions/billing';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { plans } from '@/constants/pricing';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { ShineBorder } from '../magicui/shine-border';

interface UpgradeDialogProps {
  children?: React.ReactNode;
  className?: string;
}

export default function UpgradeDialog({
  children,
  className,
}: UpgradeDialogProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const subscription = useQuery(
    api.subscriptions.getSubscriptionByUser,
    user?.id ? { userId: user.id } : 'skip'
  );

  if (subscription?.isPro) return null;

  const handleUpgrade = async () => {
    if (!user?.id) {
      toast.error('Please sign in to upgrade');
      return;
    }

    try {
      const productId = isYearly
        ? process.env.NEXT_PUBLIC_YEARLY_ID!
        : process.env.NEXT_PUBLIC_MONTHLY_ID!;

      const checkoutUrl = await getCheckoutURL(productId, {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      });

      console.log('Checkout URL:', checkoutUrl);

      if (checkoutUrl) {
        router.push(checkoutUrl);
      } else {
        toast.error('Failed to create checkout URL');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error creating checkout', {
        description: 'Please try again later.',
      });
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={cn(
              'h-8 w-full rounded-sm bg-neutral-800 text-left text-white text-xs hover:bg-neutral-700',
              className
            )}
            onClick={() => {
              console.log('Dialog trigger clicked');
              setIsOpen(true);
            }}
            type="button"
          >
            <Sparkles className="h-3 w-3 text-white" />
            Get Caly Pro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="max-w-md rounded-xl border bg-card p-0"
        showCloseButton={true}
      >
        <ShineBorder borderWidth={3} shineColor={['#A07CFE', '#00C48D']} />
        <DialogTitle className="sr-only">Upgrade to Pro</DialogTitle>
        <div className="relative p-6">
          <div className="mb-5 flex items-center justify-between">
            <Image alt="logo" height={20} src="/fx.svg" width={20} />

            <div className="text-right">
              <div className="flex items-center gap-3">
                <Switch
                  checked={isYearly}
                  className="cursor-pointer focus:ring-0 dark:data-[state=checked]:bg-white"
                  onCheckedChange={setIsYearly}
                />
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium text-sm ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    Billed Annually
                  </span>
                  <span className="rounded-md bg-green-100 px-2 py-0.5 font-medium text-green-700 text-xs">
                    50% off
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-baseline gap-1">
              <span className="font-bold text-4xl">
                ${isYearly ? '5' : '10'}
              </span>
              <span className="text-muted-foreground">per month</span>
            </div>
            {isYearly && (
              <p className="font-medium text-base text-black dark:text-white">
                Billed annually at $60
              </p>
            )}
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              For students who want to supercharge their learning and achieve
              their goals in math.
            </p>
          </div>

          <ul className="mb-8 space-y-3">
            {plans[1].features.map((feature, index) => (
              <li className="flex items-start gap-3" key={index}>
                <div className="mt-0.5 flex-shrink-0">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-foreground text-sm leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <Button
            className="w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200"
            onClick={handleUpgrade}
            size="lg"
          >
            <Rocket className="h-4 w-4 transition-transform duration-300" />
            Upgrade to Pro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
