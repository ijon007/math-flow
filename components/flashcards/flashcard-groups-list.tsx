'use client';

import type { FlashcardGroup } from '@/constants/flashcards';
import { FlashcardGroupCard } from './flashcard-group-card';

interface FlashcardGroupsListProps {
  groups: FlashcardGroup[];
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onStudy: (id: string) => void;
  onEdit: (id: string) => void;
}

export function FlashcardGroupsList({
  groups,
  onDelete,
  onShare,
  onStudy,
  onEdit,
}: FlashcardGroupsListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <FlashcardGroupCard
          group={group}
          key={group.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onShare={onShare}
          onStudy={onStudy}
        />
      ))}
    </div>
  );
}
