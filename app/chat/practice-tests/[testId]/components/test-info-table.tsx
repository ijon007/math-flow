'use client';

import { FlaskIcon } from '@/components/ui/flask';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
  status: 'in_progress' | 'completed' | 'abandoned';
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

export function TestInfoTable({ 
  questionCount, 
  timeLimit, 
  attempts, 
  averageScore,
  difficulty,
  testAttempts = [],
  questions = [],
  onViewAnswers
}: TestInfoTableProps) {
  const completedAttempts = testAttempts.filter(attempt => attempt.status === 'completed');

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

          {completedAttempts.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Attempt History</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedAttempts.map((attempt) => (
                    <TableRow key={attempt._id}>
                      <TableCell className="font-medium">
                        {formatDate(attempt.completedAt || attempt.startedAt)}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{attempt.score.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{attempt.grade || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        {formatDuration(attempt.timeSpent)}
                      </TableCell>
                      <TableCell>
                        {attempt.earnedPoints}/{attempt.totalPoints}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => onViewAnswers?.(attempt)}
                          className="text-xs h-7 px-1"
                        >
                          View Answers
                        </Button>
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
