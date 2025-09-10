'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Target,
  Calculator,
  Play,
  Eye,
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Star,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MathExpression } from '@/components/ui/math-expression';
import type { StudyGuideStep } from '@/lib/chat/tools';

interface StepContentProps {
  step: StudyGuideStep;
  stepIndex: number;
  totalSteps: number;
  isCompleted: boolean;
  isCurrent: boolean;
  onComplete?: (completed: boolean) => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  onReset?: () => void;
  className?: string;
}

export function StepContent({
  step,
  stepIndex,
  totalSteps,
  isCompleted,
  isCurrent,
  onComplete,
  onNavigate,
  onReset,
  className
}: StepContentProps) {
  const [showHint, setShowHint] = useState(false);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'concept':
        return <Target className="h-5 w-5" />;
      case 'example':
        return <Calculator className="h-5 w-5" />;
      case 'practice':
        return <Play className="h-5 w-5" />;
      case 'visualization':
        return <Eye className="h-5 w-5" />;
      default:
        return <Circle className="h-5 w-5" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'concept':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'example':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'practice':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'visualization':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-500 text-white border-green-600';
    if (isCurrent) return 'bg-blue-500 text-white border-blue-600';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Step Header */}
      <div className={cn(
        "border rounded-md p-6 transition-all duration-200",
        isCompleted && "ring-2 ring-green-200 bg-green-50/50",
        isCurrent && "ring-2 ring-blue-200 bg-blue-50/50"
      )}>
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium text-sm",
                getStatusColor()
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span>{stepIndex + 1}</span>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">{step.title}</h1>
                  <Badge className={cn("text-xs", getStepColor(step.type))}>
                    {step.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {step.estimatedTime} min
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {stepIndex + 1}/{totalSteps}
              </div>
              {step.prerequisites.length > 0 && (
                <div className="flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  {step.prerequisites.length} prereq{step.prerequisites.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onComplete && (
              <Button
                variant={isCompleted ? "outline" : "default"}
                size="sm"
                onClick={() => onComplete(!isCompleted)}
                className={cn(
                  isCompleted && "text-green-600 hover:text-green-700 border-green-300"
                )}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Done
                  </>
                ) : (
                  <>
                    <Circle className="h-3 w-3 mr-1" />
                    Complete
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="border rounded-md p-4">
        <div className="text-sm leading-relaxed text-foreground">
          {step.content.explanation}
        </div>
      </div>

      {/* Examples Section */}
      {step.content.examples && step.content.examples.length > 0 && (
        <div className="border rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-4 w-4" />
            <h3 className="text-sm font-medium">Examples</h3>
          </div>
          <div className="space-y-3">
            {step.content.examples.map((example, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
                <div className="p-3 bg-muted/30 rounded border-l-2 border-orange-300">
                  <div className="text-xs leading-relaxed">
                    {example}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulas Section */}
      {step.content.formulas && step.content.formulas.length > 0 && (
        <div className="border rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4" />
            <h3 className="text-sm font-medium">Key Formulas</h3>
          </div>
          <div className="space-y-2">
            {step.content.formulas.map((formula, index) => (
              <div key={index} className="p-3 bg-blue-50/50 rounded border-l-2 border-blue-400">
                <div className="font-mono text-xs">
                  <MathExpression expression={formula} inline={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Problems Section */}
      {step.content.practiceProblems && step.content.practiceProblems.length > 0 && (
        <div className="border rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <Play className="h-4 w-4" />
            <h3 className="text-sm font-medium">Practice Problems</h3>
          </div>
          <div className="space-y-3">
            {step.content.practiceProblems.map((problem, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
                <div className="p-3 bg-orange-50/50 rounded border-l-2 border-orange-400">
                  <div className="text-xs leading-relaxed">
                    {problem}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites Section */}
      {step.prerequisites.length > 0 && (
        <div className="border rounded-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4" />
            <h3 className="text-sm font-medium">Prerequisites</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Make sure you understand these concepts before proceeding
          </p>
          <div className="flex flex-wrap gap-1">
            {step.prerequisites.map((prereq, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {prereq}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('prev')}
                disabled={stepIndex === 0}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Prev
              </Button>
              <Button
                size="sm"
                onClick={() => onNavigate('next')}
                disabled={stepIndex === totalSteps - 1}
              >
                Next
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
