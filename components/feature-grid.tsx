import { Calendar, type LucideIcon, MapIcon } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Features() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">
        <div className="mx-auto grid gap-4 lg:grid-cols-2">
          <FeatureCard>
            <CardHeader className="pb-3">
              <CardHeading
                description="Advanced tracking system, Instantly locate all your assets."
                icon={MapIcon}
                title="Real time location tracking"
              />
            </CardHeader>

            <div className="relative mb-6 border-t border-dashed sm:mb-0">
              <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-600),var(--color-white)_100%)]" />
              <div className="aspect-76/59 p-1 px-6">
                <DualModeImage
                  alt="payments illustration"
                  darkSrc="/payments.png"
                  height={929}
                  lightSrc="/payments-light.png"
                  width={1207}
                />
              </div>
            </div>
          </FeatureCard>

          <FeatureCard>
            <CardHeader className="pb-3">
              <CardHeading
                description="Scheduling system, Instantly locate all your assets."
                icon={Calendar}
                title="Advanced Scheduling"
              />
            </CardHeader>

            <CardContent>
              <div className="relative mb-6 sm:mb-0">
                <div className="-inset-6 absolute [background:radial-gradient(50%_50%_at_75%_50%,transparent,var(--color-background)_100%)]" />
                <div className="aspect-76/59 border">
                  <DualModeImage
                    alt="calendar illustration"
                    darkSrc="/origin-cal-dark.png"
                    height={929}
                    lightSrc="/origin-cal.png"
                    width={1207}
                  />
                </div>
              </div>
            </CardContent>
          </FeatureCard>

          <FeatureCard className="p-6 lg:col-span-2">
            <p className="mx-auto my-6 max-w-md text-balance text-center font-semibold text-2xl">
              Smart scheduling with automated reminders for maintenance.
            </p>

            <div className="flex justify-center gap-6 overflow-hidden">
              <CircularUI
                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                label="Inclusion"
              />

              <CircularUI
                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                label="Inclusion"
              />

              <CircularUI
                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                label="Join"
              />

              <CircularUI
                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                className="hidden sm:block"
                label="Exclusion"
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

interface DualModeImageProps {
  darkSrc: string;
  lightSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const DualModeImage = ({
  darkSrc,
  lightSrc,
  alt,
  width,
  height,
  className,
}: DualModeImageProps) => (
  <>
    <Image
      alt={`${alt} dark`}
      className={cn('hidden dark:block', className)}
      height={height}
      src={darkSrc}
      width={width}
    />
    <Image
      alt={`${alt} light`}
      className={cn('shadow dark:hidden', className)}
      height={height}
      src={lightSrc}
      width={width}
    />
  </>
);

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
              'z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,var(--color-blue-500),var(--color-blue-500)_1px,transparent_1px,transparent_4px)] bg-background':
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
