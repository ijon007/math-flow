'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className={cn("space-y-6", className)}>
      {/* Step Header */}
      <Card className={cn(
        "transition-all duration-200",
        isCompleted && "ring-2 ring-green-200 bg-green-50/50",
        isCurrent && "ring-2 ring-blue-200 bg-blue-50/50"
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm",
                  getStatusColor()
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span>{stepIndex + 1}</span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold">{step.title}</h1>
                    <Badge className={cn("text-xs", getStepColor(step.type))}>
                      {step.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {step.estimatedTime} minutes
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Step {stepIndex + 1} of {totalSteps}
                </div>
                {step.prerequisites.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" />
                    {step.prerequisites.length} prerequisite{step.prerequisites.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onComplete && (
                <Button
                  variant={isCompleted ? "outline" : "default"}
                  onClick={() => onComplete(!isCompleted)}
                  className={cn(
                    isCompleted && "text-green-600 hover:text-green-700 border-green-300"
                  )}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none">
            <div className="text-base leading-relaxed text-foreground">
              {step.content.explanation}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples Section */}
      {step.content.examples && step.content.examples.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step.content.examples.map((example, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Example {index + 1}
                  </Badge>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm leading-relaxed">
                    {example}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Formulas Section */}
      {step.content.formulas && step.content.formulas.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Key Formulas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {step.content.formulas.map((formula, index) => (
              <div key={index} className="space-y-2">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-mono text-sm">
                    <MathExpression expression={formula} inline={false} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Practice Problems Section */}
      {step.content.practiceProblems && step.content.practiceProblems.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="h-5 w-5" />
              Practice Problems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step.content.practiceProblems.map((problem, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Problem {index + 1}
                  </Badge>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-sm leading-relaxed">
                    {problem}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Prerequisites Section */}
      {step.prerequisites.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Prerequisites
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Make sure you understand these concepts before proceeding
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {step.prerequisites.map((prereq, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {prereq}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onReset && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="text-muted-foreground"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Progress
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onNavigate && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('prev')}
                    disabled={stepIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => onNavigate('next')}
                    disabled={stepIndex === totalSteps - 1}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
