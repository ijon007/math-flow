'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import type { FlashcardCard } from '@/lib/tools';

interface FlashcardCardProps {
  card: FlashcardCard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardCardComponent({ card, isFlipped, onFlip }: FlashcardCardProps) {
  return (
    <Card 
      className="w-full h-80 cursor-pointer transition-all duration-300"
      onClick={onFlip}
    >
      <CardContent className="h-full flex items-center justify-center p-6">
        <div className="w-full h-full flex items-center justify-center text-center relative">
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              <motion.div
                key="front"
                initial={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 absolute inset-0 flex flex-col items-center justify-center"
              >
                <Badge variant="outline" className="mb-4">Question</Badge>
                <p className="text-lg font-medium leading-relaxed px-4 break-words">
                  {card.front}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 absolute inset-0 flex flex-col items-center justify-center"
              >
                <Badge variant="default" className="mb-4">Answer</Badge>
                <p className="text-lg font-medium leading-relaxed px-4 break-words">
                  {card.back}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
