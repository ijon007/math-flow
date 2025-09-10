'use client';

import { useQuery, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { TestHeader } from './components/test-header';
import { TestInfoTable } from './components/test-info-table';
import { QuestionsPreview } from './components/questions-preview';
import { ActionButtons } from './components/action-buttons';
import { LoadingState } from './components/loading-state';
import { NotFoundState } from './components/not-found-state';
import { Question } from './components/question';
import { Navigation } from './components/navigation';
import { Timer } from './components/timer';
import { Results } from './components/results';

type TestState = 'preview' | 'taking' | 'completed';

export default function PracticeTestPage() {
  const params = useParams();
  const testId = params.testId as string;
  const { user } = useUser();

  const practiceTest = useQuery(
    api.practiceTests.getPracticeTest,
    testId ? { testId: testId as any } : 'skip'
  );

  const activeAttempt = useQuery(
    api.practiceTests.getActiveTestAttempt,
    testId && user ? { testId: testId as any, userId: user.id } : 'skip'
  );

  const completedAttempt = useQuery(
    api.practiceTests.getTestAttemptsByUser,
    user ? { userId: user.id } : 'skip'
  );

  // Debug logging for completedAttempt
  useEffect(() => {
    console.log('completedAttempt updated:', completedAttempt);
    if (completedAttempt) {
      console.log('Filtered attempts for this test:', completedAttempt.filter(attempt => attempt.testId === testId));
    }
  }, [completedAttempt, testId]);

  const startTestAttempt = useMutation(api.practiceTests.startTestAttempt);
  const submitAnswer = useMutation(api.practiceTests.submitAnswer);
  const submitTest = useMutation(api.practiceTests.submitTest);
  const quitTestAttempt = useMutation(api.practiceTests.quitTestAttempt);
  const saveTestAttempt = useMutation(api.practiceTests.saveTestAttempt);

  const [isLoading, setIsLoading] = useState(true);
  const [testState, setTestState] = useState<TestState>('preview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  const [testAttemptId, setTestAttemptId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (practiceTest !== undefined) {
      setIsLoading(false);
    }
  }, [practiceTest]);

  useEffect(() => {
    if (activeAttempt && !justSaved) {
      setTestState('taking');
      setTestAttemptId(activeAttempt._id);
      const answers: Record<string, string> = {};
      activeAttempt.answers.forEach(answer => {
        answers[answer.questionId] = answer.answer;
      });
      setUserAnswers(answers);
    }
  }, [activeAttempt, justSaved]);

  useEffect(() => {
    if (testState === 'taking' && testStartTime) {
      const interval = setInterval(() => {
        setCurrentQuestionTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [testState, testStartTime]);

  const handleStartTest = async () => {
    if (!user || !practiceTest) {
      setError('User not authenticated or test not found');
      return;
    }

    if (!practiceTest.questions || practiceTest.questions.length === 0) {
      setError('Test has no questions available');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      const attemptId = await startTestAttempt({
        testId: testId as any,
        userId: user.id,
      });
      setTestAttemptId(attemptId);
      setTestState('taking');
      setJustSaved(false);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setQuestionTimes({});
      setCurrentQuestionTime(0);
      setTestStartTime(Date.now());
      toast.success('Test started!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start test';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error starting test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = async (answer: string) => {
    if (!practiceTest || !testAttemptId) return;

    const currentQuestion = practiceTest.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));

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
      setQuestionTimes(prev => ({
        ...prev,
        [currentQuestion.id]: timeSpent,
      }));
    }
  };

  const handleNext = () => {
    if (practiceTest && currentQuestionIndex < practiceTest.questions.length - 1) {
      if (practiceTest.questions[currentQuestionIndex]) {
        handleTimeUpdate(currentQuestionTime);
      }
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentQuestionTime(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      if (practiceTest && practiceTest.questions[currentQuestionIndex]) {
        handleTimeUpdate(currentQuestionTime);
      }
      setCurrentQuestionIndex(prev => prev - 1);
      setCurrentQuestionTime(0);
    }
  };

  const handleFinishTest = async () => {
    if (!testAttemptId) {
      setError('No active test attempt found');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      
      if (practiceTest && practiceTest.questions[currentQuestionIndex]) {
        handleTimeUpdate(currentQuestionTime);
      }
      
      await submitTest({ attemptId: testAttemptId as any });
      setTestState('completed');
      toast.success('Test completed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit test';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error submitting test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    handleFinishTest();
    toast.warning('Time is up! Test submitted automatically.');
  };

  const handleRetake = async () => {
    if (!user || !practiceTest) {
      setError('User not authenticated or test not found');
      return;
    }

    if (!practiceTest.questions || practiceTest.questions.length === 0) {
      setError('Test has no questions available');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      const attemptId = await startTestAttempt({
        testId: testId as any,
        userId: user.id,
      });
      setTestAttemptId(attemptId);
      setTestState('taking');
      setJustSaved(false);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setQuestionTimes({});
      setCurrentQuestionTime(0);
      setTestStartTime(Date.now());
      toast.success('Test started!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start test';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error starting test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuitTest = async () => {
    if (!testAttemptId) {
      setError('No active test attempt found');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      
      await quitTestAttempt({ attemptId: testAttemptId as any });
      setTestState('preview');
      setTestAttemptId(null);
      toast.success('Test quit successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to quit test';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error quitting test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTest = async () => {
    if (!testAttemptId) {
      setError('No active test attempt found');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      
      if (practiceTest && practiceTest.questions[currentQuestionIndex]) {
        handleTimeUpdate(currentQuestionTime);
      }
      
      console.log('Calling saveTestAttempt with attemptId:', testAttemptId);
      await saveTestAttempt({ attemptId: testAttemptId as any });
      console.log('saveTestAttempt completed, setting testState to preview');
      
      setJustSaved(true);
      setTestState('preview');
      toast.success('Test saved successfully! You can retake it anytime.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save test';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error saving test:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  if (testState === 'preview') {
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
                  onClick={() => setError(null)}
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
              onViewAnswers={(attempt) => {
                setTestState('completed');
              }}
              onRetake={(attempt) => {
                handleRetake();
              }}
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

  if (testState === 'taking' && practiceTest.questions) {
    const currentQuestion = practiceTest.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === practiceTest.questions.length - 1;

    if (!currentQuestion) {
      return (
        <div className="flex h-full flex-col items-center justify-center">
          <p className="text-red-600">Error: Question not found</p>
          <button
            onClick={() => setTestState('preview')}
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
              onTimeUp={handleTimeUp}
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
                  onClick={() => setError(null)}
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
              onAnswerChange={handleAnswerChange}
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

  if (testState === 'completed') {
    console.log('Completed state - testState:', testState);
    console.log('Completed state - completedAttempt:', completedAttempt);
    console.log('Completed state - testId:', testId);
    
    const latestAttempt = completedAttempt?.find(attempt => 
      attempt.testId === testId && attempt.status === 'completed'
    );
    
    console.log('Completed state - latestAttempt:', latestAttempt);

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
              onViewAnswers={(attempt) => {
                setTestState('completed');
              }}
              onRetake={(attempt) => {
                handleRetake();
              }}
            />

            <QuestionsPreview 
              questions={practiceTest.questions || []} 
              answers={latestAttempt.answers}
              showResults={true}
            />

            <Results
              score={latestAttempt.score}
              grade={latestAttempt.grade || 'F'}
              totalPoints={latestAttempt.totalPoints}
              earnedPoints={latestAttempt.earnedPoints}
              timeSpent={latestAttempt.timeSpent}
              questions={practiceTest.questions || []}
              answers={latestAttempt.answers}
              onRetake={handleRetake}
              onReview={() => setTestState('taking')}
            />
          </div>
        </div>
      </div>
    );
  }

  return <LoadingState />;
}