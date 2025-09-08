'use client';

import { useState } from 'react';
import {
  extractMathExpressions,
  MathExpression,
} from '@/components/ui/math-expression';
import type { FlashcardCard, Flashcard as FlashcardType } from '@/lib/chat/tools';
import { FlashcardCardComponent } from './flashcard-card';
import { FlashcardControls } from './flashcard-controls';
import { FlashcardHeader } from './flashcard-header';
import { FlashcardProgress } from './flashcard-progress';

interface FlashcardProps {
  data: FlashcardType & { cards?: FlashcardCard[] };
}

export function FlashcardComponent({ data }: FlashcardProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Handle case where cards haven't been generated yet
  if (!data.cards || data.cards.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>
          Generating {data.count} flashcards for{' '}
          {extractMathExpressions(data.topic).map((part, index) =>
            part.isMath ? (
              <MathExpression
                className="text-inherit"
                expression={part.text}
                inline={true}
                key={index}
              />
            ) : (
              <span key={index}>{part.text}</span>
            )
          )}{' '}
          ({data.difficulty} level)...
        </p>
        <p className="mt-2 text-sm">
          Please wait while the AI creates your study cards.
        </p>
      </div>
    );
  }

  const currentCard = data.cards[currentCardIndex];
  const totalCards = data.cards.length;

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="mx-auto space-y-6">
      <FlashcardHeader
        currentCardIndex={currentCardIndex}
        difficulty={data.difficulty}
        topic={data.topic}
        totalCards={totalCards}
      />

      <FlashcardCardComponent
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />

      <FlashcardControls
        currentCardIndex={currentCardIndex}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onReset={handleReset}
        totalCards={totalCards}
      />

      <FlashcardProgress
        currentCardIndex={currentCardIndex}
        totalCards={totalCards}
      />
    </div>
  );
}
