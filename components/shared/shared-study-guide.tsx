'use client';

import { BookOpen, Clock, Share2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SharedStudyGuideProps {
  studyGuide: any; // StudyGuide type from Convex
}

export function SharedStudyGuide({ studyGuide }: SharedStudyGuideProps) {
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

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-neutral-900">
              {studyGuide.title}
            </CardTitle>
            {studyGuide.description && (
              <p className="text-neutral-600">{studyGuide.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{studyGuide.totalSteps} steps</span>
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
              className={`text-xs ${getDifficultyColor(studyGuide.difficulty)}`}
              variant="outline"
            >
              {studyGuide.difficulty === 'easy'
                ? 'Easy'
                : studyGuide.difficulty === 'medium'
                  ? 'Medium'
                  : 'Hard'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {studyGuide.subject}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {studyGuide.topic}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
              <span className="text-sm text-neutral-600">Steps</span>
              <span className="font-medium">
                {studyGuide.completedSteps}/{studyGuide.totalSteps}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
              <span className="text-sm text-neutral-600">Progress</span>
              <span className="font-medium">{studyGuide.progress}%</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
              <span className="text-sm text-neutral-600">Estimated Time</span>
              <span className="font-medium">
                {formatTime(
                  studyGuide.learningPath.reduce(
                    (total: number, step: any) => total + step.estimatedTime,
                    0
                  )
                )}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Learning Progress</span>
              <span className="font-medium">{studyGuide.progress}%</span>
            </div>
            <Progress value={studyGuide.progress} className="h-2" />
          </div>

          {studyGuide.learningPath && studyGuide.learningPath.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-neutral-900">Learning Path</h4>
              <div className="space-y-2">
                {studyGuide.learningPath.slice(0, 5).map((step: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00C48D] text-xs font-medium text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-neutral-900">
                        {step.title}
                      </h5>
                      <p className="text-sm text-neutral-600">
                        {step.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(step.estimatedTime)}</span>
                    </div>
                  </div>
                ))}
                {studyGuide.learningPath.length > 5 && (
                  <p className="text-center text-sm text-neutral-500">
                    +{studyGuide.learningPath.length - 5} more steps
                  </p>
                )}
              </div>
            </div>
          )}

          {studyGuide.tags && studyGuide.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {studyGuide.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <BookOpen className="h-6 w-6 text-neutral-600" />
            </div>
            <h3 className="mb-2 font-semibold text-neutral-900">
              Study Guide Preview
            </h3>
            <p className="mb-4 text-sm text-neutral-600">
              This is a shared study guide from Math Flow. Sign in to access the full learning path and save it to your library.
            </p>
            <Button
              onClick={() => {
                // Store the shared item info in localStorage for after sign-in
                localStorage.setItem('sharedItem', JSON.stringify({
                  type: 'studyGuide',
                  id: studyGuide._id,
                  redirectTo: `/chat/guides/${studyGuide._id}`
                }));
                // Redirect to sign in
                window.location.href = '/chat';
              }}
              className="bg-[#00C48D] hover:bg-[#00C48D]/90 text-white border-none"
            >
              Sign In to Start Learning
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            This study guide was shared from Math Flow
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
