export const plans: Array<{
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  originalPrice?: string;
  billingNote?: string;
  polarProductId?: string;
}> = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    features: [
      '3 AI messages per day',
      'Flashcards',
      'Graphs',
      'Step-by-step solutions',
    ],
    cta: 'Try it out',
  },
  {
    name: 'Pro',
    price: '10',
    period: '/month',
    features: [
      'Everything in Free',
      'Unlimited AI messages',
      'Unlimited flashcards',
      'Unlimited graphs',
      'Unlimited step-by-step solutions',
      'Priority support',
    ],
    cta: 'Get started',
    polarProductId: 'POLAR_PRODUCT_MONTHLY_ID',
  },
  {
    name: 'Pro Yearly',
    price: '5',
    period: '/month',
    features: [
      'Everything in Free',
      'Unlimited AI messages',
      'Unlimited flashcards',
      'Unlimited graphs',
      'Unlimited step-by-step solutions',
      'Priority support',
    ],
    cta: 'Get started',
    polarProductId: 'POLAR_PRODUCT_YEARLY_ID',
  },
];
