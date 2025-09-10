'use client';

import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { TestHeader } from './test-header';
import { TestInfoTable } from './test-info-table';
import { QuestionsPreview } from './questions-preview';
import { ActionButtons } from './action-buttons';

interface PreviewStateProps {
  practiceTest: any;
  completedAttempt: any[] | undefined;
  testId: string;
  error: string | null;
  onDismissError: () => void;
  isSubmitting: boolean;
  user: any;
  onTestStarted: (attemptId: string) => void;
  onError: (error: string) => void;
  onSetSubmitting: (submitting: boolean) => void;
  onViewAnswers: (attempt: any) => void;
}

export function PreviewState({
  practiceTest,
  completedAttempt,
  testId,
  error,
  onDismissError,
  isSubmitting,
  user,
  onTestStarted,
  onError,
  onSetSubmitting,
  onViewAnswers,
}: PreviewStateProps) {
  const startTestAttempt = useMutation(api.practiceTests.startTestAttempt);

  const handleStartTest = async () => {
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

  const handleRetake = async () => {
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

  const handleSaveForLater = () => {
    toast.success('Test saved for later!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Test link copied to clipboard!');
  };
  return (
    <div className="flex h-full flex-col">
      <TestHeader
        title={practiceTest.title}
        description={practiceTest.description}
        onShare={handleShare}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={onDismissError}
                className="text-red-600 text-xs underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          <TestInfoTable
            questionCount={practiceTest.questionCount}
            timeLimit={practiceTest.timeLimit}
            attempts={practiceTest.attempts}
            averageScore={practiceTest.averageScore}
            difficulty={practiceTest.difficulty}
            testAttempts={completedAttempt?.filter(attempt => attempt.testId === testId) || []}
            questions={practiceTest.questions || []}
            onViewAnswers={onViewAnswers}
            onRetake={handleRetake}
          />

          <QuestionsPreview 
            questions={practiceTest.questions || []} 
            answers={[]}
            showResults={false}
          />

          <ActionButtons
            onStartTest={handleStartTest}
            onSaveForLater={handleSaveForLater}
            isLoading={isSubmitting}
            disabled={!user || !practiceTest?.questions?.length}
          />
        </div>
      </div>
    </div>
  );
}
