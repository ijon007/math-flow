'use client';

import {
  Calculator,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  Lightbulb,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { MathExpression } from '@/components/ui/math-expression';
import type { Step, StepByStep } from '@/lib/chat/tools';
import { cn } from '@/lib/utils';

interface StepCardProps {
  step: Step;
  isLast?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function StepCard({
  step,
  isLast = false,
  isExpanded,
  onToggle,
}: StepCardProps) {
  return (
    <div
      className={cn(
        'rounded border border-l-4 bg-white transition-all duration-200',
        isLast ? 'border-l-green-500' : 'border-l-blue-500'
      )}
    >
      <Collapsible onOpenChange={onToggle} open={isExpanded}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer p-2 transition-colors hover:bg-neutral-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full font-semibold text-xs',
                    isLast
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  )}
                  variant="secondary"
                >
                  {step.stepNumber}
                </Badge>
                <div className="text-left">
                  <h4 className="font-medium text-neutral-900 text-sm">
                    {step.description}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isLast && <CheckCircle className="h-4 w-4 text-green-600" />}
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                )}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="space-y-2 px-2 pb-2">
            {/* Equation Display */}
            <div className="rounded border bg-neutral-50 p-2">
              <div className="mb-1 flex items-center gap-1">
                <Calculator className="h-3 w-3 text-neutral-600" />
                <span className="font-medium text-neutral-600 text-xs uppercase tracking-wide">
                  Equation
                </span>
              </div>
              <div className="text-neutral-900 text-sm">
                <MathExpression expression={step.equation} inline={false} />
              </div>
            </div>

            {/* Tip Section */}
            {step.tip && (
              <div className="rounded border border-amber-200 bg-amber-50 p-2">
                <div className="flex items-start gap-1">
                  <Lightbulb className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-600" />
                  <div>
                    <span className="font-medium text-amber-800 text-xs uppercase tracking-wide">
                      Tip
                    </span>
                    <p className="mt-0.5 text-amber-700 text-sm">{step.tip}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Highlight Section */}
            {step.highlight && (
              <div className="rounded border border-blue-200 bg-blue-50 p-2">
                <div className="mb-0.5 font-medium text-blue-800 text-xs uppercase tracking-wide">
                  Key Change
                </div>
                <p className="text-blue-700 text-sm">{step.highlight}</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

interface StepByStepContainerProps {
  data: StepByStep;
}

export function StepByStepContainer({ data }: StepByStepContainerProps) {
  const [stepStates, setStepStates] = useState<boolean[]>(
    data.steps.map(() => true)
  );

  const handleCopySolution = async () => {
    // Copy only the equations from each step
    const equationsText = data.steps.map((step) => step.equation).join('\n');

    try {
      await navigator.clipboard.writeText(equationsText);
      toast.success('Equations copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy equations:', err);
      toast.error('Failed to copy equations');
    }
  };

  const toggleAllSteps = () => {
    const allExpanded = stepStates.every((state) => state);
    setStepStates(stepStates.map(() => !allExpanded));
  };

  const toggleStep = (index: number) => {
    setStepStates((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  const allExpanded = stepStates.every((state) => state);

  return (
    <div className="min-w-xl space-y-3">
      {/* Header */}
      <div className="rounded border bg-neutral-50 p-2">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-neutral-900">
            Step-by-Step Solution
          </h3>
          <div className="flex gap-1">
            <Button
              className="h-6 px-2 text-xs"
              onClick={toggleAllSteps}
              size="sm"
              variant="outline"
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
            <Button
              className="h-6 px-2 text-xs"
              onClick={handleCopySolution}
              size="sm"
              variant="outline"
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-neutral-600">Problem:</span>
            <code className="rounded bg-white px-1 py-0.5 text-neutral-900">
              {data.problem}
            </code>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-neutral-600">Method:</span>
            <Badge className="text-xs" variant="secondary">
              {data.method}
            </Badge>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {data.steps.map((step, index) => (
          <StepCard
            isExpanded={stepStates[index]}
            isLast={index === data.steps.length - 1}
            key={step.stepNumber}
            onToggle={() => toggleStep(index)}
            step={step}
          />
        ))}
      </div>

      {/* Final Solution */}
      <div className="rounded border border-green-200 bg-green-50 p-2">
        <div className="mb-1 flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-600" />
          <span className="font-medium text-green-800 text-xs uppercase tracking-wide">
            Final Solution
          </span>
        </div>
        <div className="font-semibold text-green-900 text-sm">
          <MathExpression expression={data.solution} inline={false} />
        </div>
      </div>
    </div>
  );
}
