'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { LoadingState } from './components/loading-state';
import { NotFoundState } from './components/not-found-state';
import { PreviewState } from './components/preview-state';
import { TakingState } from './components/taking-state';
import { CompletedState } from './components/completed-state';

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

  const handleTestStarted = (attemptId: string) => {
    setTestAttemptId(attemptId);
    setTestState('taking');
    setJustSaved(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuestionTimes({});
    setCurrentQuestionTime(0);
    setTestStartTime(Date.now());
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleQuestionTimeUpdate = (questionId: string, timeSpent: number) => {
    setQuestionTimes(prev => ({
      ...prev,
      [questionId]: timeSpent,
    }));
  };

  const handleNext = () => {
    if (practiceTest && currentQuestionIndex < practiceTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentQuestionTime(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setCurrentQuestionTime(0);
    }
  };

  const handleTestCompleted = () => {
    setTestState('completed');
  };

  const handleTestQuit = () => {
    setTestState('preview');
    setTestAttemptId(null);
  };

  const handleTestSaved = () => {
    setJustSaved(true);
    setTestState('preview');
  };

  const handleTimeUp = () => {
    setTestState('completed');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!practiceTest) {
    return <NotFoundState />;
  }

  if (testState === 'preview') {
    return (
      <PreviewState
        practiceTest={practiceTest}
        completedAttempt={completedAttempt}
        testId={testId}
        error={error}
        onDismissError={() => setError(null)}
        isSubmitting={isSubmitting}
        user={user}
        onTestStarted={handleTestStarted}
        onError={setError}
        onSetSubmitting={setIsSubmitting}
        onViewAnswers={() => setTestState('completed')}
      />
    );
  }

  if (testState === 'taking' && practiceTest.questions) {
    const currentQuestion = practiceTest.questions[currentQuestionIndex];

    return (
      <TakingState
        practiceTest={practiceTest}
        currentQuestionIndex={currentQuestionIndex}
        currentQuestion={currentQuestion}
        userAnswers={userAnswers}
        currentQuestionTime={currentQuestionTime}
        error={error}
        isSubmitting={isSubmitting}
        testAttemptId={testAttemptId}
        onDismissError={() => setError(null)}
        onAnswerChange={handleAnswerChange}
        onQuestionTimeUpdate={handleQuestionTimeUpdate}
        onTestCompleted={handleTestCompleted}
        onTestQuit={handleTestQuit}
        onTestSaved={handleTestSaved}
        onError={setError}
        onSetSubmitting={setIsSubmitting}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onTimeUp={handleTimeUp}
      />
    );
  }

  if (testState === 'completed') {
    const latestAttempt = completedAttempt?.find(attempt => 
      attempt.testId === testId && attempt.status === 'completed'
    );

    return (
      <CompletedState
        practiceTest={practiceTest}
        completedAttempt={completedAttempt}
        testId={testId}
        latestAttempt={latestAttempt}
        onViewAnswers={() => setTestState('completed')}
        onRetake={() => {
          setTestState('preview');
        }}
        onTestStarted={handleTestStarted}
        onError={setError}
        onSetSubmitting={setIsSubmitting}
        user={user}
        isSubmitting={isSubmitting}
      />
    );
  }

  return <LoadingState />;
}