'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { ArrowLeft, Clock, Play, Save, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/convex/_generated/api';

export default function PracticeTestPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!practiceTest) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Test Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The practice test you're looking for doesn't exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/chat/practice-tests">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Practice Tests
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return 'No time limit';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/chat/practice-tests">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{practiceTest.title}</h1>
              {practiceTest.description && (
                <p className="text-sm text-muted-foreground">
                  {practiceTest.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(practiceTest.difficulty)}>
              {practiceTest.difficulty.charAt(0).toUpperCase() + practiceTest.difficulty.slice(1)}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          {/* Test Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Test Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-lg font-semibold">{practiceTest.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Questions</p>
                  <p className="text-lg font-semibold">{practiceTest.questionCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Limit</p>
                  <p className="text-lg font-semibold">{formatTime(practiceTest.timeLimit)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attempts</p>
                  <p className="text-lg font-semibold">{practiceTest.attempts}</p>
                </div>
              </div>
              {practiceTest.attempts > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-lg font-semibold">{practiceTest.averageScore.toFixed(1)}%</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Questions Preview */}
          {practiceTest.questions && practiceTest.questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questions Preview</CardTitle>
                <CardDescription>
                  Here's a preview of the questions in this test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practiceTest.questions.slice(0, 3).map((question, index) => (
                    <div key={question.id} className="rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          {index + 1}
                        </span>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium">{question.question}</p>
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="text-xs text-muted-foreground">
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {question.type.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {question.points} pts
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {question.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {practiceTest.questions.length > 3 && (
                    <p className="text-center text-sm text-muted-foreground">
                      ... and {practiceTest.questions.length - 3} more questions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <Button size="lg" className="px-8" onClick={handleStartTest}>
              <Play className="mr-2 h-4 w-4" />
              Start Test
            </Button>
            <Button variant="outline" size="lg" onClick={handleSaveForLater}>
              <Save className="mr-2 h-4 w-4" />
              Save for Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
