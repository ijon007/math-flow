"use client"

import { Card, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Brain, Bot, Calculator, BookOpen, LucideIcon, ChartArea } from 'lucide-react'
import { features } from '@/constants/features'
import { ReactNode } from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export function FeaturesSection() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto grid gap-4 lg:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id}>
              <CardHeader className="pb-3">
                <CardHeading
                  icon={getFeatureIcon(feature.visual)}
                  title={feature.title}
                  description={feature.description}
                />
              </CardHeader>

              <div className="relative mb-6 border-t border-dashed sm:mb-0">
                <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,#00C48D50,var(--color-white)_100%)]"></div>
                <div className="aspect-76/59 p-1 px-6">
                  <FeatureVisual feature={feature} />
                </div>
              </div>
            </FeatureCard>
          ))}

          <FeatureCard className="p-6 lg:col-span-2">
            <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">
              AI-powered math learning with intelligent flashcards and visualizations.
            </p>

            <div className="flex justify-center gap-6 overflow-hidden">
              <CircularUI
                label="AI Agent"
                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
              />

              <CircularUI
                label="Flashcards"
                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
              />

              <CircularUI
                label="Graphs"
                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
              />

              <CircularUI
                label="Solutions"
                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                className="hidden sm:block"
              />
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  children: ReactNode
  className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
  <Card className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
    <CardDecorator />
    {children}
  </Card>
)

const CardDecorator = () => (
  <>
    <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
    <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
    <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
    <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
  </>
)

interface CardHeadingProps {
  icon: LucideIcon
  title: string
  description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
  <div className="p-6">
    <span className="text-muted-foreground flex items-center gap-2">
      <Icon className="size-4" />
      {title}
    </span>
    <p className="mt-8 text-2xl font-semibold">{description}</p>
  </div>
)

interface FeatureVisualProps {
  feature: {
    id: number
    title: string
    description: string
    visual: string
  }
}

const getFeatureIcon = (visual: string) => {
  switch (visual) {
    case 'upload':
      return Bot
    case 'generate':
      return BookOpen
    case 'edit':
      return Calculator
    case 'publish':
      return Brain
    default:
      return Bot
  }
}

const FeatureVisual = ({ feature }: FeatureVisualProps) => {
  switch (feature.visual) {
    case 'upload':
      return <AIAgentMock />
    case 'generate':
      return <FlashcardsMock />
    case 'edit':
      return <GraphsMock />
    case 'publish':
      return <StepByStepMock />
    default:
      return <AIAgentMock />
  }
}

const AIAgentMock = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg p-4">
      <div className="space-y-3">
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-black text-white rounded-lg p-3 max-w-xs">
            <div className="text-sm">I wanna learn math!</div>
          </div>
        </div>
        
        {/* AI response */}
        <div className="flex justify-start">
          <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <span className="text-xs text-neutral-600">AI Agent</span>
            </div>
            <div className="text-sm text-neutral-800">I'll help you learn math!</div>
          </div>
        </div>
        
        {/* AI working */}
        <div className="flex justify-start">
          <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
            <div className="text-sm text-neutral-800 mb-1">Let's start with basic algebra</div>
            <div className="text-sm text-neutral-800 mb-1">2x + 5 = 13</div>
            <div className="text-sm text-neutral-800">2x = 13 - 5</div>
            <div className="text-sm text-neutral-800">x = 4</div>
          </div>
        </div>
        
        {/* User follow-up */}
        <div className="flex justify-end">
          <div className="bg-black text-white rounded-lg p-3 max-w-xs">
            <div className="text-sm">Thanks! Can you graph it too?</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FlashcardsMock = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg p-4">
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-4 shadow-sm transform rotate-1">
          <div className="text-sm font-semibold text-neutral-800 mb-2">What is the derivative of x²?</div>
          <div className="text-xs text-neutral-600">Click to reveal answer</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm transform -rotate-1">
          <div className="text-sm font-semibold text-neutral-800 mb-2">Pythagorean theorem</div>
          <div className="text-xs text-neutral-600">a² + b² = c²</div>
        </div>
        
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#00C48D] rounded-full" />
          <div className="w-2 h-2 bg-neutral-300 rounded-full" />
          <div className="w-2 h-2 bg-neutral-300 rounded-full" />
        </div>
      </div>
    </div>
  )
}

const GraphsMock = () => {
  const data = Array.from({ length: 11 }, (_, i) => {
    const x = i - 3
    const y = x * x - 4 * x + 5
    return { x, y }
  })

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg p-4">
      <div className="bg-white rounded-lg p-4 h-[300px]">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Quadratic Function</h3>
          <p className="text-xs text-neutral-600">f(x) = x² - 4x + 5</p>
        </div>
        
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <XAxis 
                dataKey="x" 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="y" 
                stroke="#00C48D"
                fill="#00C48D"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

const StepByStepMock = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg p-4">
      <div className="space-y-2 h-full">
        <div className="bg-white rounded-lg p-2 border h-1/5">
          <div className="text-sm text-[#00C48D] font-semibold mb-1">Step 1: Identify the problem</div>
          <div className="text-base text-neutral-800 font-semibold">Solve: 3x + 7 = 22</div>
        </div>
        
        <div className="bg-white rounded-lg p-2 border h-1/5">
          <div className="text-sm text-[#00C48D] font-semibold mb-1">Step 2: Isolate the variable</div>
          <div className="text-base text-neutral-800 font-semibold">3x = 22 - 7</div>
        </div>
        
        <div className="bg-white rounded-lg p-2 border h-1/5">
          <div className="text-sm text-[#00C48D] font-semibold mb-1">Step 3: Solve</div>
          <div className="text-base text-neutral-800 font-semibold">x = 15 ÷ 3 = 5</div>
        </div>
        
        <div className="bg-white rounded-lg p-2 border border-l-4 border-[#00C48D] h-1/5">
          <div className="text-sm text-[#00C48D] font-semibold mb-1">Answer</div>
          <div className="text-base text-neutral-800 font-semibold">x = 5</div>
        </div>
      </div>
    </div>
  )
}

interface CircleConfig {
  pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
  label: string
  circles: CircleConfig[]
  className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
  <div className={className}>
    <div className="bg-linear-to-b from-border size-fit rounded-2xl to-transparent p-px">
      <div className="bg-linear-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
        {circles.map((circle, i) => (
          <div
            key={i}
            className={cn('size-7 rounded-full border sm:size-8', {
              'border-primary': circle.pattern === 'none',
              'border-primary bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
              'border-primary bg-background bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
              'bg-background z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,var(--color-blue-500),var(--color-blue-500)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
            })}></div>
        ))}
      </div>
    </div>
    <span className="text-muted-foreground mt-1.5 block text-center text-sm">{label}</span>
  </div>
)