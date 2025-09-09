'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  isGraded?: boolean;
}

export function Navigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onFinish,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
  isGraded = false,
}: NavigationProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{currentQuestion} of {totalQuestions}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isGraded}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {isLastQuestion ? (
            <Button
              onClick={onFinish}
              disabled={isGraded}
              className="bg-[#00C48D] hover:bg-[#00C48D]/90 text-primary-foreground border-none"
            >
              Finish Test
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!canGoNext || isGraded}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
