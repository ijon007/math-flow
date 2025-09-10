'use client';

import { FlaskIcon } from '@/components/ui/flask';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, RotateCcw, TimerReset } from 'lucide-react';

interface TestAttempt {
  _id: string;
  testId: string;
  userId: string;
  startedAt: number;
  completedAt?: number;
  timeSpent: number;
  score: number;
  totalPoints: number;
  earnedPoints: number;
  status: 'in_progress' | 'completed' | 'abandoned' | 'saved';
  grade?: string;
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeSpent: number;
    points: number;
    earnedPoints: number;
  }>;
}

interface TestInfoTableProps {
  questionCount: number;
  timeLimit?: number;
  attempts: number;
  averageScore: number;
  difficulty: string;
  testAttempts?: TestAttempt[];
  questions?: Array<{
    id: string;
    question: string;
    type: string;
    options?: string[];
    points: number;
    difficulty: string;
    correctAnswer?: string;
    explanation?: string;
  }>;
  onViewAnswers?: (attempt: TestAttempt) => void;
  onRetake?: (attempt: TestAttempt) => void;
}

const formatTime = (minutes?: number) => {
  if (!minutes) return 'No time limit';
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getGradeBadgeStyle = (grade: string) => {
  const gradeUpper = grade.toUpperCase();
  if (gradeUpper === 'A+' || gradeUpper === 'A') return 'bg-green-500/10 text-green-500';
  if (gradeUpper === 'A-') return 'bg-green-400/10 text-green-400';
  if (gradeUpper === 'B+' || gradeUpper === 'B') return 'bg-blue-500/10 text-blue-500';
  if (gradeUpper === 'B-') return 'bg-blue-400/10 text-blue-400';
  if (gradeUpper === 'C+' || gradeUpper === 'C') return 'bg-yellow-500/10 text-yellow-500';
  if (gradeUpper === 'C-') return 'bg-yellow-400/10 text-yellow-400';
  if (gradeUpper === 'D+' || gradeUpper === 'D') return 'bg-orange-500/10 text-orange-500';
  if (gradeUpper === 'F') return 'bg-red-500/10 text-red-500';
  return 'bg-gray-500/10 text-gray-500';
};

export function TestInfoTable({
  questionCount,
  timeLimit, 
  attempts, 
  averageScore,
  difficulty,
  testAttempts = [],
  questions = [],
  onViewAnswers,
  onRetake
}: TestInfoTableProps) {
  const completedAttempts = testAttempts.filter(attempt => attempt.status === 'completed');
  const abandonedAttempts = testAttempts.filter(attempt => attempt.status === 'abandoned');
  const inProgressAttempts = testAttempts.filter(attempt => attempt.status === 'in_progress');
  const savedAttempts = testAttempts.filter(attempt => attempt.status === 'saved');
  const allAttempts = [...completedAttempts, ...abandonedAttempts, ...savedAttempts, ...inProgressAttempts].sort((a, b) => 
    (b.completedAt || b.startedAt) - (a.completedAt || a.startedAt)
  );

  return (
    <div className="mb-6 rounded-md border p-3">
      <div>
        <div className="flex flex-row items-center gap-2 font-medium mb-2">
          <FlaskIcon className="h-5 w-5" />
          <span>Test Information</span>
        </div>
      </div>
      <div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Questions:</span>
              <span className="ml-2 font-semibold">{questionCount}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Time Limit:</span>
              <span className="ml-2 font-semibold">{formatTime(timeLimit)}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Difficulty:</span>
              <span className="ml-2 font-semibold">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Total Attempts:</span>
              <span className="ml-2 font-semibold">{attempts}</span>
            </div>
          </div>

          {allAttempts.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Attempt History</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAttempts.map((attempt) => (
                    <TableRow key={attempt._id}>
                      <TableCell className="font-medium">
                        {formatDate(attempt.completedAt || attempt.startedAt)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={attempt.status === 'completed' ? 'default' : 'secondary'}
                          className={attempt.status === 'completed' ? 'bg-green-100 text-green-800' : attempt.status === 'abandoned' ? 'bg-red-100 text-red-800' : attempt.status === 'saved' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}
                        >
                          {attempt.status === 'completed' ? 'Completed' : attempt.status === 'abandoned' ? 'Not Finished' : attempt.status === 'saved' ? 'Saved' : 'In Progress'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{attempt.score.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell>
                        {attempt.grade ? (
                          <Badge className={`${getGradeBadgeStyle(attempt.grade)} border-0 w-10`}>
                            {attempt.grade}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {attempt.earnedPoints}/{attempt.totalPoints}
                      </TableCell>
                      <TableCell>
                        {formatDuration(attempt.timeSpent)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {attempt.status === 'completed' ? (
                            <Button
                              variant="outline"
                              onClick={() => onViewAnswers?.(attempt)}
                              className="text-xs h-7 w-20"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          ) : attempt.status === 'in_progress' ? (
                            <Button
                              variant="outline"
                              onClick={() => onRetake?.(attempt)}
                              className="text-xs h-7 w-20"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Resume
                            </Button>
                          ) : attempt.status === 'saved' ? (
                            <Button
                              variant="outline"
                              onClick={() => onRetake?.(attempt)}
                              className="text-xs h-7 w-20"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Resume
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => onRetake?.(attempt)}
                              className="text-xs h-7 w-20"
                            >
                              <TimerReset className="h-4 w-4" />
                              Retake
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
