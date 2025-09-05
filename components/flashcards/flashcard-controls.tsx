'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon } from 'lucide-react';

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
  onReset 
}: FlashcardControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentCardIndex === 0}
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Previous
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          <RotateCcwIcon className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentCardIndex === totalCards - 1}
      >
        Next
        <ChevronRightIcon className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
