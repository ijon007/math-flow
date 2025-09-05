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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
