'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, ChevronDown, ChevronRight, Copy, Lightbulb, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { StepByStep, Step } from '@/lib/tools';
import { MathExpression } from '@/components/ui/math-expression';

interface StepCardProps {
  step: Step;
  isLast?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function StepCard({ step, isLast = false, isExpanded, onToggle }: StepCardProps) {

  return (
    <div className={cn(
      "border-l-4 transition-all duration-200 rounded border bg-white",
      isLast ? "border-l-green-500" : "border-l-blue-500"
    )}>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="p-2 cursor-pointer hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                    isLast ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}
                >
                  {step.stepNumber}
                </Badge>
                <div className="text-left">
                  <h4 className="font-medium text-sm text-gray-900">
                    {step.description}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isLast && <CheckCircle className="w-4 h-4 text-green-600" />}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-2 pb-2 space-y-2">
            {/* Equation Display */}
            <div className="bg-gray-50 rounded p-2 border">
              <div className="flex items-center gap-1 mb-1">
                <Calculator className="w-3 h-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Equation
                </span>
              </div>
              <div className="text-sm text-gray-900">
                <MathExpression 
                  expression={step.equation}
                  inline={false}
                />
              </div>
            </div>

            {/* Tip Section */}
            {step.tip && (
              <div className="bg-amber-50 rounded p-2 border border-amber-200">
                <div className="flex items-start gap-1">
                  <Lightbulb className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-amber-800 uppercase tracking-wide">
                      Tip
                    </span>
                    <p className="text-sm text-amber-700 mt-0.5">
                      {step.tip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Highlight Section */}
            {step.highlight && (
              <div className="bg-blue-50 rounded p-2 border border-blue-200">
                <div className="text-xs font-medium text-blue-800 uppercase tracking-wide mb-0.5">
                  Key Change
                </div>
                <p className="text-sm text-blue-700">
                  {step.highlight}
                </p>
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
  const [stepStates, setStepStates] = useState<boolean[]>(data.steps.map(() => true));

  const handleCopySolution = async () => {
    // Copy only the equations from each step
    const equationsText = data.steps.map(step => step.equation).join('\n');
    
    try {
      await navigator.clipboard.writeText(equationsText);
      toast.success('Equations copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy equations:', err);
      toast.error('Failed to copy equations');
    }
  };

  const toggleAllSteps = () => {
    const allExpanded = stepStates.every(state => state);
    setStepStates(stepStates.map(() => !allExpanded));
  };

  const toggleStep = (index: number) => {
    setStepStates(prev => prev.map((state, i) => i === index ? !state : state));
  };

  const allExpanded = stepStates.every(state => state);

  return (
    <div className="min-w-xl space-y-3">
      {/* Header */}
      <div className="bg-gray-50 rounded border p-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">Step-by-Step Solution</h3>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllSteps}
              className="text-xs h-6 px-2"
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySolution}
              className="text-xs h-6 px-2"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Problem:</span>
            <code className="bg-white px-1 py-0.5 rounded text-gray-900">
              {data.problem}
            </code>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Method:</span>
            <Badge variant="secondary" className="text-xs">
              {data.method}
            </Badge>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {data.steps.map((step, index) => (
          <StepCard
            key={step.stepNumber}
            step={step}
            isLast={index === data.steps.length - 1}
            isExpanded={stepStates[index]}
            onToggle={() => toggleStep(index)}
          />
        ))}
      </div>

      {/* Final Solution */}
      <div className="bg-green-50 rounded border border-green-200 p-2">
        <div className="flex items-center gap-1 mb-1">
          <CheckCircle className="w-3 h-3 text-green-600" />
          <span className="text-xs font-medium text-green-800 uppercase tracking-wide">Final Solution</span>
        </div>
        <div className="text-sm font-semibold text-green-900">
          <MathExpression 
            expression={data.solution}
            inline={false}
          />
        </div>
      </div>
    </div>
  );
}
