import { Check, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { plans } from '@/constants/pricing';

export default function Pricing() {
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
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
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

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          {transformedPlans.map((plan, index) => (
            <Card
              className={
                plan.name === 'Pro' ? 'relative py-5' : 'flex flex-col py-5'
              }
              key={index}
            >
              {plan.name === 'Pro' && (
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
                  className="mt-4 w-full"
                  variant={plan.name === 'Free' ? 'outline' : 'default'}
                >
                  <Link href="/chat">{plan.cta}</Link>
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
          ))}
        </div>
      </div>
    </section>
  );
}
