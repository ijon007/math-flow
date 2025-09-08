'use client';

interface FlashcardProgressProps {
  currentCardIndex: number;
  totalCards: number;
}

export function FlashcardProgress({
  currentCardIndex,
  totalCards,
}: FlashcardProgressProps) {
  return (
    <div className="h-2 w-full rounded-full bg-neutral-200">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{
          width: `${((currentCardIndex + 1) / totalCards) * 100}%`,
          backgroundColor: '#00C48D',
        }}
      />
    </div>
  );
}
