'use client';

import { FlaskIcon } from '@/components/ui/flask';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestInfoCardProps {
  questionCount: number;
  timeLimit?: number;
  attempts: number;
  averageScore: number;
  difficulty: string;
}

const formatTime = (minutes?: number) => {
  if (!minutes) return 'No time limit';
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export function TestInfoCard({ 
  questionCount, 
  timeLimit, 
  attempts, 
  averageScore,
  difficulty
}: TestInfoCardProps) {
  return (
    <Card className="mb-6 rounded-md py-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskIcon className="h-5 w-5" />
          Test Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Questions</p>
            <p className="text-base font-semibold">{questionCount}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Time Limit</p>
            <p className="text-base font-semibold">{formatTime(timeLimit)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Difficulty</p>
            <p className="text-base font-semibold capitalize">{difficulty}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Attempts</p>
            <p className="text-base font-semibold">{attempts}</p>
          </div>
        </div>
        {attempts > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground">Average Score</p>
            <p className="text-base font-semibold">{averageScore.toFixed(1)}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
