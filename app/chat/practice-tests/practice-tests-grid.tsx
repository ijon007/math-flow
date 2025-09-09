'use client';

import { PracticeTestGroup } from './types';
import { PracticeTestCard } from './practice-test-card';

interface PracticeTestsGridProps {
  groups: PracticeTestGroup[];
  onTakeTest: (groupId: string) => void;
  onShare: (groupId: string) => void;
  onDelete: (groupId: string) => void;
}

export function PracticeTestsGrid({
  groups,
  onTakeTest,
  onShare,
  onDelete,
}: PracticeTestsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <PracticeTestCard
          key={group.id}
          group={group}
          onTakeTest={onTakeTest}
          onShare={onShare}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
