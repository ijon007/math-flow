'use client';

import { useState } from 'react';
import type { Flashcard as FlashcardType, FlashcardCard } from '@/lib/tools';
import { FlashcardCardComponent } from './flashcard-card';
import { FlashcardControls } from './flashcard-controls';
import { FlashcardProgress } from './flashcard-progress';
import { FlashcardHeader } from './flashcard-header';
import { MathExpression, extractMathExpressions } from '@/components/ui/math-expression';

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
          Generating {data.count} flashcards for {extractMathExpressions(data.topic).map((part, index) => 
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
          )} ({data.difficulty} level)...
        </p>
        <p className="text-sm mt-2">Please wait while the AI creates your study cards.</p>
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
        topic={data.topic}
        difficulty={data.difficulty}
        currentCardIndex={currentCardIndex}
        totalCards={totalCards}
      />
      
      <FlashcardCardComponent
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />
      
      <FlashcardControls
        currentCardIndex={currentCardIndex}
        totalCards={totalCards}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onReset={handleReset}
      />
      
      <FlashcardProgress
        currentCardIndex={currentCardIndex}
        totalCards={totalCards}
      />
    </div>
  );
}
