'use client';

interface FlashcardProgressProps {
  currentCardIndex: number;
  totalCards: number;
}

export function FlashcardProgress({ currentCardIndex, totalCards }: FlashcardProgressProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{ 
          width: `${((currentCardIndex + 1) / totalCards) * 100}%`,
          backgroundColor: '#00C48D'
        }}
      />
    </div>
  );
}
