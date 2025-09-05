'use client';

import { Badge } from '@/components/ui/badge';
import { getDifficultyColor } from '@/lib/flashcard-utils';

interface FlashcardHeaderProps {
  topic: string;
  difficulty: string;
  currentCardIndex: number;
  totalCards: number;
}

export function FlashcardHeader({ topic, difficulty, currentCardIndex, totalCards }: FlashcardHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <h3 className="text-xl font-semibold">{topic}</h3>
      <div className="flex items-center justify-center gap-2">
        <Badge className={getDifficultyColor(difficulty)}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {currentCardIndex + 1} of {totalCards} cards
        </span>
      </div>
    </div>
  );
}
