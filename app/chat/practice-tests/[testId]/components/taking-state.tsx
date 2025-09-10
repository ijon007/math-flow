'use client';

import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { Timer } from './timer';
import { Question } from './question';
import { Navigation } from './navigation';

interface TakingStateProps {
  practiceTest: any;
  currentQuestionIndex: number;
  currentQuestion: any;
  userAnswers: Record<string, string>;
  currentQuestionTime: number;
  error: string | null;
  isSubmitting: boolean;
  testAttemptId: string | null;
  onDismissError: () => void;
  onAnswerChange: (questionId: string, answer: string) => void;
  onQuestionTimeUpdate: (questionId: string, timeSpent: number) => void;
  onTestCompleted: () => void;
  onTestQuit: () => void;
  onTestSaved: () => void;
  onError: (error: string) => void;
  onSetSubmitting: (submitting: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function TakingState({
  practiceTest,
  currentQuestionIndex,
  currentQuestion,
  userAnswers,
  currentQuestionTime,
  error,
  isSubmitting,
  testAttemptId,
  onDismissError,
  onAnswerChange,
  onQuestionTimeUpdate,
  onTestCompleted,
  onTestQuit,
  onTestSaved,
  onError,
  onSetSubmitting,
  onNext,
  onPrevious,
}: TakingStateProps) {
  const submitAnswer = useMutation(api.practiceTests.submitAnswer);
  const submitTest = useMutation(api.practiceTests.submitTest);
  const quitTestAttempt = useMutation(api.practiceTests.quitTestAttempt);
  const saveTestAttempt = useMutation(api.practiceTests.saveTestAttempt);

  const handleAnswerChange = async (answer: string) => {
    if (!practiceTest || !testAttemptId) return;

    const currentQuestion = practiceTest.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    onAnswerChange(currentQuestion.id, answer);

    try {
      await submitAnswer({
        attemptId: testAttemptId as any,
        questionId: currentQuestion.id,
        answer,
        timeSpent: currentQuestionTime,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save answer';
      console.error('Error submitting answer:', error);
      toast.error(errorMessage);
    }
  };

  const handleTimeUpdate = (timeSpent: number) => {
    if (practiceTest) {
      const currentQuestion = practiceTest.questions[currentQuestionIndex];
      onQuestionTimeUpdate(currentQuestion.id, timeSpent);
    }
  };

  const handleNext = () => {
    if (practiceTest && currentQuestionIndex < practiceTest.questions.length - 1) {
      if (practiceTest.questions[currentQuestionIndex]) {
        handleTimeUpdate(currentQuestionTime);
      }
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      if (practiceTest && practiceTest.questions[currentQuestionIndex]) {
        handleTimeUpdate(currentQuestionTime);
      }
      onPrevious();
    }
  };

  const handleFinishTest = async () => {
    if (!testAttemptId) {
      onError('No active test attempt found');
      return;
    }

    try {
      onError('');
      onSetSubmitting(true);
      
      if (practiceTest && practiceTest.questions[currentQuestionIndex]) {
        handleTimeUpdate(currentQuestionTime);
      }
      
      await submitTest({ attemptId: testAttemptId as any });
      onTestCompleted();
      toast.success('Test completed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit test';
      onError(errorMessage);
      toast.error(errorMessage);
      console.error('Error submitting test:', error);
    } finally {
      onSetSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    handleFinishTest();
    toast.warning('Time is up! Test submitted automatically.');
  };

  const handleQuitTest = async () => {
    if (!testAttemptId) {
      onError('No active test attempt found');
      return;
    }

    try {
      onError('');
      onSetSubmitting(true);
      
      await quitTestAttempt({ attemptId: testAttemptId as any });
      onTestQuit();
      toast.success('Test quit successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to quit test';
      onError(errorMessage);
      toast.error(errorMessage);
      console.error('Error quitting test:', error);
    } finally {
      onSetSubmitting(false);
    }
  };

  const handleSaveTest = async () => {
    if (!testAttemptId) {
      onError('No active test attempt found');
      return;
    }

    try {
      onError('');
      onSetSubmitting(true);
      
      if (practiceTest && practiceTest.questions[currentQuestionIndex]) {
        handleTimeUpdate(currentQuestionTime);
      }
      
      await saveTestAttempt({ attemptId: testAttemptId as any });
      onTestSaved();
      toast.success('Test saved successfully! You can retake it anytime.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save test';
      onError(errorMessage);
      toast.error(errorMessage);
      console.error('Error saving test:', error);
    } finally {
      onSetSubmitting(false);
    }
  };
  const isLastQuestion = currentQuestionIndex === practiceTest.questions.length - 1;

  if (!currentQuestion) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-red-600">Error: Question not found</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Return to Preview
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-xl font-semibold">{practiceTest.title}</h1>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {practiceTest.questions.length}
          </p>
        </div>
        {practiceTest.timeLimit && (
          <Timer
            timeLimit={practiceTest.timeLimit}
            onTimeUp={onTimeUp}
            isActive={true}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
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

          <Question
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={practiceTest.questions.length}
            userAnswer={userAnswers[currentQuestion.id] || ''}
            onAnswerChange={onAnswerChange}
            timeSpent={currentQuestionTime}
          />

          <Navigation
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={practiceTest.questions.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onFinish={handleFinishTest}
            onQuit={handleQuitTest}
            onSave={handleSaveTest}
            canGoPrevious={currentQuestionIndex > 0}
            canGoNext={currentQuestionIndex < practiceTest.questions.length - 1}
            isLastQuestion={isLastQuestion}
          />

          {isSubmitting && (
            <div className="text-center text-muted-foreground">
              <p>Submitting test...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
