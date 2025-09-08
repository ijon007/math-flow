'use client';

import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { plans } from '@/constants/pricing';
import { BorderBeam } from '../magicui/border-beam';
import PricingCards from '../pricing-cards';

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const monthlyPlans = plans.filter((plan) => plan.name !== 'Pro Yearly');
  const yearlyPlans = plans
    .filter((plan) => plan.name !== 'Pro')
    .map((plan) => {
      if (plan.name === 'Pro Yearly') {
        return {
          ...plan,
          name: 'Pro',
          price: '5',
          period: '/month',
          originalPrice: '10',
          billingNote: 'billed yearly',
        };
      }
      return plan;
    });

  return (
    <section
      className="relative overflow-hidden bg-white py-32 text-black"
      id="pricing"
    >
      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <PricingCards />
      </div>
    </section>
  );
}
