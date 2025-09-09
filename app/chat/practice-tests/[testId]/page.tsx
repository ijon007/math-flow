'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { TestHeader } from './components/test-header';
import { TestInfoCard } from './components/test-info-card';
import { QuestionsPreview } from './components/questions-preview';
import { ActionButtons } from './components/action-buttons';
import { LoadingState } from './components/loading-state';
import { NotFoundState } from './components/not-found-state';

export default function PracticeTestPage() {
  const params = useParams();
  const testId = params.testId as string;

  const practiceTest = useQuery(
    api.practiceTests.getPracticeTest,
    testId ? { testId: testId as any } : 'skip'
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (practiceTest !== undefined) {
      setIsLoading(false);
    }
  }, [practiceTest]);

  const handleStartTest = () => {
    toast.info('Test taking interface coming soon!');
  };

  const handleSaveForLater = () => {
    toast.success('Test saved for later!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Test link copied to clipboard!');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!practiceTest) {
    return <NotFoundState />;
  }

  return (
    <div className="flex h-full flex-col">
      <TestHeader
        title={practiceTest.title}
        description={practiceTest.description}
        onShare={handleShare}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          <TestInfoCard
            questionCount={practiceTest.questionCount}
            timeLimit={practiceTest.timeLimit}
            attempts={practiceTest.attempts}
            averageScore={practiceTest.averageScore}
            difficulty={practiceTest.difficulty}
          />

          <QuestionsPreview questions={practiceTest.questions || []} />

          <ActionButtons
            onStartTest={handleStartTest}
            onSaveForLater={handleSaveForLater}
          />
        </div>
      </div>
    </div>
  );
}