'use client';

import { Clock, Share2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SharedPracticeTestProps {
  practiceTest: any; // PracticeTest type from Convex
}

export function SharedPracticeTest({ practiceTest }: SharedPracticeTestProps) {
  const formatTime = (minutes?: number) => {
    if (!minutes) return 'No time limit';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-neutral-900">
              {practiceTest.title}
            </CardTitle>
            {practiceTest.description && (
              <p className="text-neutral-600">{practiceTest.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{practiceTest.questionCount} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>Shared</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            variant="outline"
            size="sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              className={`text-xs ${getDifficultyColor(practiceTest.difficulty)}`}
              variant="outline"
            >
              {practiceTest.difficulty === 'easy'
                ? 'Easy'
                : practiceTest.difficulty === 'medium'
                  ? 'Medium'
                  : 'Hard'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {practiceTest.subject}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
              <span className="text-sm text-neutral-600">Questions</span>
              <span className="font-medium">{practiceTest.questionCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
              <span className="text-sm text-neutral-600">Time Limit</span>
              <span className="font-medium">
                {formatTime(practiceTest.timeLimit)}
              </span>
            </div>
          </div>

          {practiceTest.tags && practiceTest.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {practiceTest.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <Target className="h-6 w-6 text-neutral-600" />
            </div>
            <h3 className="mb-2 font-semibold text-neutral-900">
              Practice Test Preview
            </h3>
            <p className="mb-4 text-sm text-neutral-600">
              This is a shared practice test from Math Flow. Sign in to take the test and save it to your library.
            </p>
            <Button
              onClick={() => {
                // Store the shared item info in localStorage for after sign-in
                localStorage.setItem('sharedItem', JSON.stringify({
                  type: 'practiceTest',
                  id: practiceTest._id,
                  redirectTo: `/chat/practice-tests/${practiceTest._id}`
                }));
                // Redirect to sign in
                window.location.href = '/chat';
              }}
              className="bg-[#00C48D] hover:bg-[#00C48D]/90 text-white border-none"
            >
              Sign In to Take Test
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            This practice test was shared from Math Flow
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
