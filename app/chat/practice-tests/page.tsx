'use client';

import { BookOpen } from 'lucide-react';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import { usePracticeTestsData } from './use-practice-tests-data';
import { PracticeTestsGrid } from './practice-tests-grid';

export default function PracticeTestsPage() {
  const {
    searchQuery,
    filteredGroups,
    handleSearch,
    handleDelete,
    handleShare,
    handleTakeTest,
  } = usePracticeTestsData();

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <PageHeader
        count={filteredGroups.length}
        countLabel="tests"
        icon={BookOpen}
        title="Practice Tests"
      />

      <PageSearch
        onChange={handleSearch}
        placeholder="Search practice tests..."
        value={searchQuery}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {filteredGroups.length === 0 ? (
          <PageEmptyState
            description="Create practice tests to assess your mathematical knowledge and prepare for exams."
            hasSearch={!!searchQuery}
            icon={BookOpen}
            title={
              searchQuery
                ? 'No practice tests found'
                : 'No practice tests yet'
            }
          />
        ) : (
          <PracticeTestsGrid
            groups={filteredGroups}
            onTakeTest={handleTakeTest}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
