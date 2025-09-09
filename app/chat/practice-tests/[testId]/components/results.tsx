'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Target, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  type: string;
  correctAnswer: string;
  explanation?: string;
  points: number;
  difficulty: string;
}

interface Answer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
  earnedPoints: number;
}

interface ResultsProps {
  score: number;
  grade: string;
  totalPoints: number;
  earnedPoints: number;
  timeSpent: number;
  questions: Question[];
  answers: Answer[];
  onRetake: () => void;
  onReview: () => void;
}

export function Results({
  score,
  grade,
  totalPoints,
  earnedPoints,
  timeSpent,
  questions,
  answers,
  onRetake,
  onReview,
}: ResultsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50 border-green-200';
      case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'F': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{score}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className={cn(
                "text-3xl font-bold px-3 py-1 rounded-md border",
                getGradeColor(grade)
              )}>
                {grade}
              </div>
              <div className="text-sm text-muted-foreground">Grade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Points Earned</span>
              <span className="font-medium">{earnedPoints} / {totalPoints}</span>
            </div>
            <Progress value={(earnedPoints / totalPoints) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Time Spent:</span>
              <span className="font-medium">{formatTime(timeSpent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Average per Question:</span>
              <span className="font-medium">{formatTime(Math.floor(timeSpent / totalQuestions))}</span>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onReview}>
          Review Answers
        </Button>
        <Button onClick={onRetake} className="bg-[#00C48D] hover:bg-[#00C48D]/90 text-primary-foreground border-none">
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Test
        </Button>
      </div>
    </div>
  );
}
