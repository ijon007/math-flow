import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { plans } from '@/constants/pricing'

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
                    <h1 className="text-center text-4xl lg:text-5xl">Pricing</h1>
                    <p>Choose the perfect plan for your AI-powered math learning experience.</p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
                    {transformedPlans.map((plan, index) => (
                        <Card key={index} className={plan.name === 'Pro' ? 'relative py-5' : 'flex flex-col py-5'}>
                            {plan.name === 'Pro' && (
                                <span className="bg-linear-to-br/decreasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-[#00C48D] px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                                    Popular
                                </span>
                            )}
                            
                            <CardHeader>
                                <CardTitle className="font-medium">{plan.name}</CardTitle>
                                <div className="my-3 h-20 flex flex-col justify-center">
                                    {plan.originalPrice ? (
                                        <div className="space-y-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-semibold">
                                                    ${plan.price}
                                                </span>
                                                <span className="text-lg text-muted-foreground">
                                                    {plan.period}
                                                </span>
                                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                                    Save 50%
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="line-through">${plan.originalPrice}/month</span>
                                                <span>•</span>
                                                <span>${(parseInt(plan.price) * 12)}/year</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-semibold">
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
                                    variant={plan.name === 'Free' ? 'outline' : 'default'}
                                    className="mt-4 w-full">
                                    <Link href="/chat">{plan.cta}</Link>
                                </Button>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <hr className="border-dashed" />
                                <ul className="list-outside space-y-3 text-sm">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-2">
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
    )
}
