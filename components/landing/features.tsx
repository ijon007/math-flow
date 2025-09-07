'use client';

import {
  BookOpen,
  Bot,
  Brain,
  Calculator,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardHeader } from '@/components/ui/card';
import { features } from '@/constants/features';
import { cn } from '@/lib/utils';

export function FeaturesSection() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 text-center">
          <h1 className="text-center text-4xl lg:text-5xl">
            Everything you need to master math
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            AI-powered tools that adapt to your learning style and help you
            understand complex concepts.
          </p>
        </div>
        <div className="mx-auto grid gap-4 lg:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id}>
              <CardHeader className="pb-3">
                <CardHeading
                  description={feature.description}
                  icon={getFeatureIcon(feature.visual)}
                  title={feature.title}
                />
              </CardHeader>

              <div className="relative mb-6 border-t border-dashed sm:mb-0">
                <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,#00C48D50,var(--color-white)_100%)]" />
                <div className="aspect-76/59 p-1 px-6">
                  <FeatureVisual feature={feature} />
                </div>
              </div>
            </FeatureCard>
          ))}

          <FeatureCard className="p-6 lg:col-span-2">
            <p className="mx-auto my-6 max-w-md text-balance text-center font-semibold text-2xl">
              AI-powered math learning with intelligent flashcards and
              visualizations.
            </p>

            <div className="flex justify-center gap-6 overflow-hidden">
              <CircularUI
                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                label="AI Agent"
              />

              <CircularUI
                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                label="Flashcards"
              />

              <CircularUI
                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                label="Graphs"
              />

              <CircularUI
                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                className="hidden sm:block"
                label="Solutions"
              />
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  children: ReactNode;
  className?: string;
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
  <Card
    className={cn('group relative rounded-none shadow-zinc-950/5', className)}
  >
    <CardDecorator />
    {children}
  </Card>
);

const CardDecorator = () => (
  <>
    <span className="-left-px -top-px absolute block size-2 border-primary border-t-2 border-l-2" />
    <span className="-right-px -top-px absolute block size-2 border-primary border-t-2 border-r-2" />
    <span className="-bottom-px -left-px absolute block size-2 border-primary border-b-2 border-l-2" />
    <span className="-bottom-px -right-px absolute block size-2 border-primary border-r-2 border-b-2" />
  </>
);

interface CardHeadingProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
  <div className="p-6">
    <span className="flex items-center gap-2 text-muted-foreground">
      <Icon className="size-4" />
      {title}
    </span>
    <p className="mt-8 font-semibold text-2xl">{description}</p>
  </div>
);

interface FeatureVisualProps {
  feature: {
    id: number;
    title: string;
    description: string;
    visual: string;
  };
}

const getFeatureIcon = (visual: string) => {
  switch (visual) {
    case 'upload':
      return Bot;
    case 'generate':
      return BookOpen;
    case 'edit':
      return Calculator;
    case 'publish':
      return Brain;
    default:
      return Bot;
  }
};

const FeatureVisual = ({ feature }: FeatureVisualProps) => {
  switch (feature.visual) {
    case 'upload':
      return <AIAgentMock />;
    case 'generate':
      return <FlashcardsMock />;
    case 'edit':
      return <GraphsMock />;
    case 'publish':
      return <StepByStepMock />;
    default:
      return <AIAgentMock />;
  }
};

const AIAgentMock = () => {
  return (
    <div className="relative h-full w-full rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <div className="space-y-3">
        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-xs rounded-lg bg-black p-3 text-white">
            <div className="text-sm">I wanna learn math!</div>
          </div>
        </div>

        {/* AI response */}
        <div className="flex justify-start">
          <div className="max-w-xs rounded-lg bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-black" />
              <span className="text-neutral-600 text-xs">AI Agent</span>
            </div>
            <div className="text-neutral-800 text-sm">
              I'll help you learn math!
            </div>
          </div>
        </div>

        {/* AI working */}
        <div className="flex justify-start">
          <div className="max-w-xs rounded-lg bg-white p-3 shadow-sm">
            <div className="mb-1 text-neutral-800 text-sm">
              Let's start with basic algebra
            </div>
            <div className="mb-1 text-neutral-800 text-sm">2x + 5 = 13</div>
            <div className="text-neutral-800 text-sm">2x = 13 - 5</div>
            <div className="text-neutral-800 text-sm">x = 4</div>
          </div>
        </div>

        {/* User follow-up */}
        <div className="flex justify-end">
          <div className="max-w-xs rounded-lg bg-black p-3 text-white">
            <div className="text-sm">Thanks! Can you graph it too?</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardsMock = () => {
  return (
    <div className="relative h-full w-full rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <div className="space-y-3">
        <div className="rotate-1 transform rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-2 font-semibold text-neutral-800 text-sm">
            What is the derivative of x²?
          </div>
          <div className="text-neutral-600 text-xs">Click to reveal answer</div>
        </div>

        <div className="-rotate-1 transform rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-2 font-semibold text-neutral-800 text-sm">
            Pythagorean theorem
          </div>
          <div className="text-neutral-600 text-xs">a² + b² = c²</div>
        </div>

        <div className="flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#00C48D]" />
          <div className="h-2 w-2 rounded-full bg-neutral-300" />
          <div className="h-2 w-2 rounded-full bg-neutral-300" />
        </div>
      </div>
    </div>
  );
};

const GraphsMock = () => {
  const data = Array.from({ length: 11 }, (_, i) => {
    const x = i - 3;
    const y = x * x - 4 * x + 5;
    return { x, y };
  });

  return (
    <div className="relative h-full w-full rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <div className="h-[300px] rounded-lg bg-white p-4">
        <div>
          <h3 className="font-semibold text-neutral-900 text-sm">
            Quadratic Function
          </h3>
          <p className="text-neutral-600 text-xs">f(x) = x² - 4x + 5</p>
        </div>

        <div className="h-full w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <XAxis
                axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                dataKey="x"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              />
              <YAxis
                axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              />
              <Area
                dataKey="y"
                fill="#00C48D"
                fillOpacity={0.3}
                stroke="#00C48D"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StepByStepMock = () => {
  return (
    <div className="relative h-full w-full rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <div className="h-full space-y-2">
        <div className="h-1/5 rounded-lg border bg-white p-2">
          <div className="mb-1 font-semibold text-[#00C48D] text-sm">
            Step 1: Identify the problem
          </div>
          <div className="font-semibold text-base text-neutral-800">
            Solve: 3x + 7 = 22
          </div>
        </div>

        <div className="h-1/5 rounded-lg border bg-white p-2">
          <div className="mb-1 font-semibold text-[#00C48D] text-sm">
            Step 2: Isolate the variable
          </div>
          <div className="font-semibold text-base text-neutral-800">
            3x = 22 - 7
          </div>
        </div>

        <div className="h-1/5 rounded-lg border bg-white p-2">
          <div className="mb-1 font-semibold text-[#00C48D] text-sm">
            Step 3: Solve
          </div>
          <div className="font-semibold text-base text-neutral-800">
            x = 15 ÷ 3 = 5
          </div>
        </div>

        <div className="h-1/5 rounded-lg border border-[#00C48D] border-l-4 bg-white p-2">
          <div className="mb-1 font-semibold text-[#00C48D] text-sm">
            Answer
          </div>
          <div className="font-semibold text-base text-neutral-800">x = 5</div>
        </div>
      </div>
    </div>
  );
};

interface CircleConfig {
  pattern: 'none' | 'border' | 'primary' | 'blue';
}

interface CircularUIProps {
  label: string;
  circles: CircleConfig[];
  className?: string;
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
  <div className={className}>
    <div className="size-fit rounded-2xl bg-linear-to-b from-border to-transparent p-px">
      <div className="-space-x-4 relative flex aspect-square w-fit items-center rounded-[15px] bg-linear-to-b from-background to-muted/25 p-4">
        {circles.map((circle, i) => (
          <div
            className={cn('size-7 rounded-full border sm:size-8', {
              'border-primary': circle.pattern === 'none',
              'border-primary bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_4px)]':
                circle.pattern === 'border',
              'border-primary bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_1px,transparent_1px,transparent_4px)] bg-background':
                circle.pattern === 'primary',
              'z-1 border-[#00C48D] bg-[repeating-linear-gradient(-45deg,#00C48D,#00C48D_1px,transparent_1px,transparent_4px)] bg-background':
                circle.pattern === 'blue',
            })}
            key={i}
          />
        ))}
      </div>
    </div>
    <span className="mt-1.5 block text-center text-muted-foreground text-sm">
      {label}
    </span>
  </div>
);
