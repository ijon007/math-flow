'use client';

import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { TestHeader } from './test-header';
import { TestInfoTable } from './test-info-table';
import { QuestionsPreview } from './questions-preview';

interface CompletedStateProps {
  practiceTest: any;
  completedAttempt: any[] | undefined;
  testId: string;
  latestAttempt: any;
  onViewAnswers: (attempt: any) => void;
  onRetake: (attempt: any) => void;
  onTestStarted: (attemptId: string) => void;
  onError: (error: string) => void;
  onSetSubmitting: (submitting: boolean) => void;
  user: any;
  isSubmitting: boolean;
}

export function CompletedState({
  practiceTest,
  completedAttempt,
  testId,
  latestAttempt,
  onViewAnswers,
  onRetake,
  onTestStarted,
  onError,
  onSetSubmitting,
  user,
  isSubmitting,
}: CompletedStateProps) {
  const startTestAttempt = useMutation(api.practiceTests.startTestAttempt);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Test link copied to clipboard!');
  };

  const handleTakeTest = async () => {
    if (!user || !practiceTest) {
      onError('User not authenticated or test not found');
      return;
    }

    if (!practiceTest.questions || practiceTest.questions.length === 0) {
      onError('Test has no questions available');
      return;
    }

    try {
      onError('');
      onSetSubmitting(true);
      const attemptId = await startTestAttempt({
        testId: testId as any,
        userId: user.id,
      });
      onTestStarted(attemptId);
      toast.success('Test started!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start test';
      onError(errorMessage);
      toast.error(errorMessage);
      console.error('Error starting test:', error);
    } finally {
      onSetSubmitting(false);
    }
  };

  if (!latestAttempt) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Loading test results...</p>
          <p className="text-sm text-muted-foreground mt-2">Please wait while we process your test.</p>
          {completedAttempt && (
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Debug: Found {completedAttempt.length} attempts</p>
              <p>Test ID: {testId}</p>
              <p>Attempts for this test: {completedAttempt.filter(a => a.testId === testId).length}</p>
              <p>All attempts: {JSON.stringify(completedAttempt.map(a => ({ testId: a.testId, status: a.status })), null, 2)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <TestHeader
        title={practiceTest.title}
        description={practiceTest.description}
        onShare={handleShare}
        showTakeTest={true}
        onTakeTest={handleTakeTest}
        isSubmitting={isSubmitting}
        disabled={!user || !practiceTest?.questions?.length}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <TestInfoTable
            questionCount={practiceTest.questionCount}
            timeLimit={practiceTest.timeLimit}
            attempts={practiceTest.attempts}
            averageScore={practiceTest.averageScore}
            difficulty={practiceTest.difficulty}
            testAttempts={completedAttempt?.filter(attempt => attempt.testId === testId) || []}
            questions={practiceTest.questions || []}
            onViewAnswers={onViewAnswers}
            onRetake={onRetake}
          />

          <QuestionsPreview 
            questions={practiceTest.questions || []} 
            answers={latestAttempt.answers}
            showResults={true}
          />
        </div>
      </div>
    </div>
  );
}
