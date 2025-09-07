'use client';

import { ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashcardControlsProps {
  currentCardIndex: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
}

export function FlashcardControls({
  currentCardIndex,
  totalCards,
  onPrevious,
  onNext,
  onReset,
}: FlashcardControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        disabled={currentCardIndex === 0}
        onClick={onPrevious}
        size="sm"
        variant="outline"
      >
        <ChevronLeftIcon className="mr-1 h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <Button onClick={onReset} size="sm" variant="outline">
          <RotateCcwIcon className="mr-1 h-4 w-4" />
          Reset
        </Button>
      </div>

      <Button
        disabled={currentCardIndex === totalCards - 1}
        onClick={onNext}
        size="sm"
        variant="outline"
      >
        Next
        <ChevronRightIcon className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
