import { Check, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { plans } from '@/constants/pricing';
import { cn } from '@/lib/utils';

export default function Pricing({ 
  isSettings = false, 
  currentPlan 
}: { 
  isSettings?: boolean;
  currentPlan?: string;
}) {
  // Transform the plans to show yearly plan as "Pro Yearly" with proper pricing
  const transformedPlans = plans.map((plan) => {
    if (plan.name === 'Pro Yearly') {
      return {
        ...plan,
        name: 'Pro Yearly',
        price: '5',
        period: '/month',
        originalPrice: '10',
        billingNote: 'billed yearly',
      };
    }
    return plan;
  });

  return (
    <section className={`${isSettings ? '' : 'py-16 md:py-32'}`}>
      <div className={`${!isSettings ? 'max-w-6xl px-6 mx-auto' : 'w-full'}`}>
        {!isSettings && (
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-linear-to-br/decreasing from-purple-400 to-[#00C48D]  px-6 py-2 text-white text-sm font-semibold">
              <GraduationCap className="h-4 w-4 mr-2" />
              Back to School Special
            </div>
            <h1 className="text-center text-4xl lg:text-5xl">50% Off All Pro Plans</h1>
            <p>
              Choose the perfect plan for your AI-powered math learning
              experience.
            </p>
          </div>
        )}

        <div className={`${isSettings ? 'w-full flex justify-center' : 'mt-8 md:mt-20'} grid gap-6 ${isSettings ? 'grid-cols-2 max-w-2xl' : 'md:grid-cols-3'}`}>
          {transformedPlans
            .filter(plan => {
              // Hide free tier if user is on pro plan
              if (currentPlan === 'Pro' && plan.name === 'Free') {
                return false;
              }
              return true;
            })
            .map((plan, index) => {
            const isCurrentPlan = currentPlan === plan.name;
            return (
            <Card
              className={`${
                plan.name === 'Pro' ? 'relative py-5' : 'flex flex-col py-5'
              } ${
                isCurrentPlan ? 'ring-2 ring-[#00C48D] bg-blue-50 dark:bg-[#00C48D50]' : ''
              }`}
              key={index}
            >
              {plan.name === 'Pro' && !isCurrentPlan && (
                <span className="-top-3 absolute inset-x-0 mx-auto flex h-6 w-fit items-center rounded-full bg-linear-to-br/decreasing from-purple-400 to-[#00C48D] px-3 py-1 font-medium text-amber-950 text-xs ring-1 ring-white/20 ring-inset ring-offset-1 ring-offset-gray-950/5">
                  Popular
                </span>
              )}

              <CardHeader>
                <CardTitle className="font-medium">{plan.name}</CardTitle>
                <div className="my-3 flex h-20 flex-col justify-center">
                  {plan.originalPrice ? (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-2xl">
                          ${plan.price}
                        </span>
                        <span className="text-lg text-muted-foreground">
                          {plan.period}
                        </span>
                        {/* <span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                          Save 50%
                        </span> */}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span className="line-through">
                          ${plan.originalPrice}/month
                        </span>
                        <span>•</span>
                        <span>${Number.parseInt(plan.price) * 12}/year</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-2xl">
                        ${plan.price}
                      </span>
                      <span className="text-lg text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  asChild
                  className={cn("mt-4 w-full", isCurrentPlan && 'bg-[#00C48D] text-white border-none hover:bg-[#00C48D]/80')}
                  variant={plan.name === 'Free' ? 'outline' : 'default'}
                >
                  <Link href="/chat">{isCurrentPlan ? 'Current Plan' : plan.cta}</Link>
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {plan.features.map((feature, featureIndex) => (
                    <li className="flex items-center gap-2" key={featureIndex}>
                      <Check className="size-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
