import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target,
  Calculator,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MathExpression, extractMathExpressions } from '@/components/ui/math-expression';
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
    <div className={cn("space-y-5", className)}>
      {/* Compact Step Header */}
      <div className={cn(
        "border rounded-lg p-4 transition-all duration-200",
        isCompleted && "ring-2 ring-green-200 bg-green-50/50",
        isCurrent && "ring-2 ring-blue-200 bg-blue-50/50"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full border-2 font-medium text-sm",
              getStatusColor()
            )}>
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <span>{stepIndex + 1}</span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-base font-semibold">{step.title}</h1>
                <Badge className={cn("text-xs px-2 py-0.5", getStepColor(step.type))}>
                  {step.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {step.prerequisites.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lightbulb className="h-3 w-3 text-yellow-600" />
                  <span>Prereq:</span>
                  <div className="flex gap-1">
                    {step.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300 size-5 rounded-sm">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {stepIndex + 1}/{totalSteps}
              </div>
            </div>
            {onComplete && (
              <Button
                variant={isCompleted ? "outline" : "default"}
                size="sm"
                onClick={() => onComplete(!isCompleted)}
                className={cn(
                  "ml-2",
                  isCompleted && "text-green-600 hover:text-green-700 border-green-300"
                )}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </>
                ) : (
                  <>
                    <Circle className="h-3 w-3" />
                    Complete
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>


      {/* Main Content - Inline with other sections */}
      <div className="bg-muted/80 rounded-lg p-4 border-l-4 border-l-blue-400">
        <div className="text-sm leading-relaxed text-foreground">
          {extractMathExpressions(step.content.explanation).map((part, index) =>
            part.isMath ? (
              <MathExpression
                key={index}
                expression={part.text}
                inline={true}
                className="text-inherit"
              />
            ) : (
              <span key={index}>{part.text}</span>
            )
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-3">
        {/* Examples Section */}
        {step.content.examples && step.content.examples.length > 0 && (
          <div className="bg-orange-50/80 rounded-lg p-3 border-l-4 border-orange-400">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-orange-600" />
              <h3 className="text-sm font-medium text-orange-800">Examples</h3>
            </div>
            <div className="space-y-2">
              {step.content.examples.map((example, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs mt-0.5 bg-orange-100 text-orange-700 border-orange-300">
                    {index + 1}
                  </Badge>
                  <div className="text-sm leading-relaxed flex-1">
                    {extractMathExpressions(example).map((part, partIndex) =>
                      part.isMath ? (
                        <MathExpression
                          key={partIndex}
                          expression={part.text}
                          inline={true}
                          className="text-inherit"
                        />
                      ) : (
                        <span key={partIndex}>{part.text}</span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulas Section */}
        {step.content.formulas && step.content.formulas.length > 0 && (
          <div className="bg-blue-50/80 rounded-lg p-3 border-l-4 border-blue-400">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Key Formulas</h3>
            </div>
            <div className="space-y-2">
              {step.content.formulas.map((formula, index) => (
                <div key={index} className="bg-white/50 rounded p-2">
                  <div className="text-sm">
                    <MathExpression expression={formula} inline={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice Problems Section */}
        {step.content.practiceProblems && step.content.practiceProblems.length > 0 && (
          <div className="bg-red-100/50 rounded-lg p-3 border-l-4 border-red-400 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Play className="h-4 w-4 text-red-600" />
              <h3 className="text-sm font-medium text-red-800">Practice Problems</h3>
            </div>
            <div className="space-y-2">
              {step.content.practiceProblems.map((problem, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs mt-0.5 bg-red-100 text-red-700 border-red-300">
                    {index + 1}
                  </Badge>
                  <div className="text-sm leading-relaxed flex-1">
                    {extractMathExpressions(problem).map((part, partIndex) =>
                      part.isMath ? (
                        <MathExpression
                          key={partIndex}
                          expression={part.text}
                          inline={true}
                          className="text-inherit"
                        />
                      ) : (
                        <span key={partIndex}>{part.text}</span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground"
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
                className="disabled:opacity-50"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Prev
              </Button>
              <Button
                size="sm"
                onClick={() => onNavigate('next')}
                disabled={stepIndex === totalSteps - 1}
                className="disabled:opacity-50"
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
