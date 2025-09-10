'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, LogOut, Save } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  onQuit: () => void;
  onSave: () => void;
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
  onQuit,
  onSave,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
  isGraded = false,
}: NavigationProps) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  const handleQuitClick = () => {
    setShowQuitDialog(true);
  };

  const handleQuitConfirm = () => {
    onQuit();
    setShowQuitDialog(false);
  };

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

      {!isGraded && (
        <div className="flex items-center justify-center gap-3 pt-4 border-t">
          <Button
            onClick={onSave}
            className="text-[#00C48D] bg-[#00C48D]/10 hover:bg-[#00C48D]/20 border-none"
          >
            <Save className="h-4 w-4" />
            Save & Exit
          </Button>
          <Button
            onClick={handleQuitClick}
            className="text-red-500 bg-red-500/10 hover:bg-red-500/20 border-none"
          >
            <LogOut className="h-4 w-4" />
            Quit Test
          </Button>
        </div>
      )}

      <Dialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quit Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to quit this test? Your progress will be lost and this attempt will be marked as abandoned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowQuitDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleQuitConfirm}
            >
              Quit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
