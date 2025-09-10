'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Target,
  Calculator,
  Play,
  Eye,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowDown,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StudyGuideStep } from '@/lib/chat/tools';

interface LearningPathProps {
  steps: StudyGuideStep[];
  completedSteps: string[];
  currentStep?: string;
  onStepClick?: (stepId: string) => void;
  onStepComplete?: (stepId: string, completed: boolean) => void;
  className?: string;
}

export function LearningPath({ 
  steps, 
  completedSteps, 
  currentStep,
  onStepClick,
  onStepComplete,
  className 
}: LearningPathProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'concept':
        return <Target className="h-4 w-4" />;
      case 'example':
        return <Calculator className="h-4 w-4" />;
      case 'practice':
        return <Play className="h-4 w-4" />;
      case 'visualization':
        return <Eye className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (currentStep === stepId) return 'current';
    return 'pending';
  };

  const getStepColor = (status: string, type: string) => {
    if (status === 'completed') return 'bg-green-500 text-white border-green-600';
    if (status === 'current') return 'bg-blue-500 text-white border-blue-600';
    
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

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const handleStepClick = (stepId: string) => {
    if (onStepClick) {
      onStepClick(stepId);
    }
  };

  const handleStepComplete = (stepId: string, completed: boolean) => {
    if (onStepComplete) {
      onStepComplete(stepId, completed);
    }
  };

  const totalSteps = steps.length;
  const completedCount = completedSteps.length;
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  const visibleSteps = showAll ? steps : steps.slice(0, 5);
  const hasMoreSteps = steps.length > 5;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Path
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {completedCount}/{totalSteps} completed
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Steps List */}
      <div className="space-y-3">
        {visibleSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isExpanded = expandedSteps.has(step.id);
          const isLast = index === visibleSteps.length - 1;
          const isClickable = !!onStepClick;

          return (
            <Card 
              key={step.id}
              className={cn(
                "transition-all duration-200",
                status === 'completed' && "ring-2 ring-green-200 bg-green-50/50",
                status === 'current' && "ring-2 ring-blue-200 bg-blue-50/50",
                isClickable && "cursor-pointer hover:shadow-md"
              )}
              onClick={() => isClickable && handleStepClick(step.id)}
            >
              <Collapsible open={isExpanded} onOpenChange={() => toggleStepExpansion(step.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer">
                    <div className="flex items-start gap-3">
                      {/* Step Number & Icon */}
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium text-sm",
                          getStepColor(status, step.type)
                        )}>
                          {status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        
                        {/* Connection Line */}
                        {!isLast && (
                          <div className="flex flex-col items-center">
                            <div className="w-0.5 h-4 bg-muted-foreground/20"></div>
                            <ArrowDown className="h-3 w-3 text-muted-foreground/40" />
                            <div className="w-0.5 h-4 bg-muted-foreground/20"></div>
                          </div>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm truncate">{step.title}</h3>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  getStepColor(status, step.type)
                                )}
                              >
                                {step.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {step.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {step.estimatedTime} min
                              </div>
                              {step.prerequisites.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Lightbulb className="h-3 w-3" />
                                  {step.prerequisites.length} prerequisite{step.prerequisites.length !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 ml-2">
                            {status !== 'completed' && onStepComplete && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStepComplete(step.id, true);
                                }}
                                className="text-xs"
                              >
                                Mark Complete
                              </Button>
                            )}
                            
                            {status === 'completed' && onStepComplete && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStepComplete(step.id, false);
                                }}
                                className="text-xs text-green-600 hover:text-green-700"
                              >
                                Undo
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Main Content */}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm leading-relaxed">{step.content.explanation}</p>
                      </div>

                      {/* Examples */}
                      {step.content.examples && step.content.examples.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            Examples
                          </h4>
                          <div className="space-y-2">
                            {step.content.examples.map((example, idx) => (
                              <div key={idx} className="p-3 bg-muted/50 rounded-md text-sm">
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Formulas */}
                      {step.content.formulas && step.content.formulas.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Key Formulas
                          </h4>
                          <div className="space-y-2">
                            {step.content.formulas.map((formula, idx) => (
                              <div key={idx} className="p-3 bg-blue-50 rounded-md text-sm font-mono">
                                {formula}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Practice Problems */}
                      {step.content.practiceProblems && step.content.practiceProblems.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            Practice Problems
                          </h4>
                          <div className="space-y-2">
                            {step.content.practiceProblems.map((problem, idx) => (
                              <div key={idx} className="p-3 bg-orange-50 rounded-md text-sm">
                                {problem}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prerequisites */}
                      {step.prerequisites.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Prerequisites
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {step.prerequisites.map((prereq, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}

        {/* Show More/Less Button */}
        {hasMoreSteps && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="text-sm"
            >
              {showAll ? 'Show Less' : `Show ${steps.length - 5} More Steps`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
