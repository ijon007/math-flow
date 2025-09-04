'use client';

import { FlashcardGroupCard } from './flashcard-group-card';
import type { FlashcardGroup } from '@/constants/flashcards';

interface FlashcardGroupsListProps {
  groups: FlashcardGroup[];
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onStudy: (id: string) => void;
  onEdit: (id: string) => void;
}

export function FlashcardGroupsList({ groups, onDelete, onShare, onStudy, onEdit }: FlashcardGroupsListProps) {
  return (
    <div className="grid gap-4 max-w-4xl mx-auto">
      {groups.map((group) => (
        <FlashcardGroupCard
          key={group.id}
          group={group}
          onDelete={onDelete}
          onShare={onShare}
          onStudy={onStudy}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
