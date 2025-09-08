'use client';

import { Badge } from '@/components/ui/badge';
import { getDifficultyColor } from '@/lib/chat/flashcard-utils';

interface FlashcardHeaderProps {
  topic: string;
  difficulty: string;
  currentCardIndex: number;
  totalCards: number;
}

export function FlashcardHeader({
  topic,
  difficulty,
  currentCardIndex,
  totalCards,
}: FlashcardHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <h3 className="font-semibold text-xl">{topic}</h3>
      <div className="flex items-center justify-center gap-2">
        <Badge className={getDifficultyColor(difficulty)}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
        <span className="text-muted-foreground text-sm">
          {currentCardIndex + 1} of {totalCards} cards
        </span>
      </div>
    </div>
  );
}
