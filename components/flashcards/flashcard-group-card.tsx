'use client';

import { useState } from 'react';
import { Calendar, MoreHorizontal, Share, Trash2, Edit, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FlashcardComponent } from './flashcard';
import type { Flashcard as FlashcardType, FlashcardCard } from '@/lib/tools';
import type { FlashcardGroup } from '@/constants/flashcards';

interface FlashcardGroupCardProps {
  group: FlashcardGroup;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onStudy: (id: string) => void;
  onEdit: (id: string) => void;
}

export function FlashcardGroupCard({ group, onDelete, onShare, onStudy, onEdit }: FlashcardGroupCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getDifficultyLevel = (difficulty: string): 'easy' | 'medium' | 'hard' => {
    switch (difficulty) {
      case 'Beginner': return 'easy';
      case 'Intermediate': return 'medium';
      case 'Advanced': return 'hard';
      default: return 'medium';
    }
  };

  // Mock flashcard data for demonstration
  const mockFlashcardData: FlashcardType & { cards: FlashcardCard[] } = {
    type: 'flashcards',
    topic: group.title,
    count: group.cardCount,
    difficulty: getDifficultyLevel(group.difficulty),
    cards: [
      {
        id: '1',
        front: 'What is the derivative of x²?',
        back: '2x'
      },
      {
        id: '2', 
        front: 'What is the derivative of sin(x)?',
        back: 'cos(x)'
      },
      {
        id: '3',
        front: 'What is the derivative of e^x?',
        back: 'e^x'
      }
    ]
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
        className="border border-neutral-200 rounded-lg bg-white group cursor-pointer hover:bg-neutral-50 transition-colors p-3"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-neutral-900 truncate mb-1">
              {group.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-neutral-500">
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
              variant="outline" 
              className={`text-xs ${getDifficultyColor(group.difficulty)}`}
            >
              {group.difficulty}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right">
                <DropdownMenuItem onClick={() => onEdit(group.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(group.id)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(group.id)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTitle className="sr-only">{group.title}</DialogTitle>
        <DialogContent className="max-w-fit p-0">
          <div className="p-6">
            <FlashcardComponent data={mockFlashcardData} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
