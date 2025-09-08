'use client';

import {
  BookOpen,
  Calendar,
  Edit,
  MoreHorizontal,
  Share,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  extractMathExpressions,
  MathExpression,
} from '@/components/ui/math-expression';
import type { FlashcardGroup } from '@/constants/flashcards';
import type {
  FlashcardCard,
  Flashcard as FlashcardType,
} from '@/lib/chat/tools';
import { FlashcardComponent } from './flashcard';

interface FlashcardGroupCardProps {
  group: FlashcardGroup;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onStudy: (id: string) => void;
  onEdit: (id: string) => void;
}

export function FlashcardGroupCard({
  group,
  onDelete,
  onShare,
  onStudy,
  onEdit,
}: FlashcardGroupCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Advanced':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getDifficultyLevel = (
    difficulty: string
  ): 'easy' | 'medium' | 'hard' => {
    switch (difficulty) {
      case 'Beginner':
        return 'easy';
      case 'Intermediate':
        return 'medium';
      case 'Advanced':
        return 'hard';
      default:
        return 'medium';
    }
  };

  // Use actual flashcard data from database, fallback to mock if not available
  const flashcardData: FlashcardType & { cards: FlashcardCard[] } =
    group.flashcardData || {
      type: 'flashcards',
      topic: group.title,
      count: group.cardCount,
      difficulty: getDifficultyLevel(group.difficulty),
      cards: [
        {
          id: '1',
          front: 'What is the derivative of $x^2$?',
          back: '$2x$',
        },
        {
          id: '2',
          front: 'What is the derivative of $\\sin(x)$?',
          back: '$\\cos(x)$',
        },
        {
          id: '3',
          front: 'What is the derivative of $e^x$?',
          back: '$e^x$',
        },
      ],
    };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open dialog if clicking on dropdown menu
    if ((e.target as HTMLElement).closest('[role="menu"]')) {
      return;
    }
    setIsDialogOpen(true);
  };

  return (
    <>
      <div
        className="group cursor-pointer rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate font-medium text-neutral-900 text-sm">
              {extractMathExpressions(group.title).map((part, index) =>
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
            </h3>
            <div className="flex items-center gap-3 text-neutral-500 text-xs">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{group.createdAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{group.cardCount}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`text-xs ${getDifficultyColor(group.difficulty)}`}
              variant="outline"
            >
              {group.difficulty}
            </Badge>
            <Button
              className="size-7 transition-colors duration-200 hover:bg-red-500/20 hover:text-red-500 group-hover:opacity-100 lg:opacity-0"
              onClick={() => onDelete(group.id)}
              size="icon"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogTitle className="sr-only">{group.title}</DialogTitle>
        <DialogContent className="max-w-fit p-0">
          <div className="p-6">
            <FlashcardComponent data={flashcardData} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
