'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  extractMathExpressions,
  MathExpression,
} from '@/components/ui/math-expression';
import type { FlashcardCard } from '@/lib/tools';

interface FlashcardCardProps {
  card: FlashcardCard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardCardComponent({
  card,
  isFlipped,
  onFlip,
}: FlashcardCardProps) {
  return (
    <Card
      className="h-80 w-full cursor-pointer transition-all duration-300"
      onClick={onFlip}
    >
      <CardContent className="flex h-full items-center justify-center p-6">
        <div className="relative flex h-full w-full items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {isFlipped ? (
              <motion.div
                animate={{ rotateY: 0, opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-2"
                exit={{ rotateY: -90, opacity: 0 }}
                initial={{ rotateY: -90, opacity: 0 }}
                key="back"
                transition={{ duration: 0.3 }}
              >
                <Badge className="mb-4" variant="default">
                  Answer
                </Badge>
                <div className="break-words px-4 font-medium text-lg leading-relaxed">
                  {extractMathExpressions(card.back).map((part, index) =>
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
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center space-y-2"
                exit={{ rotateY: 90, opacity: 0 }}
                initial={{ rotateY: 0, opacity: 1 }}
                key="front"
                transition={{ duration: 0.3 }}
              >
                <Badge className="mb-4" variant="outline">
                  Question
                </Badge>
                <div className="break-words px-4 font-medium text-lg leading-relaxed">
                  {extractMathExpressions(card.front).map((part, index) =>
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
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
