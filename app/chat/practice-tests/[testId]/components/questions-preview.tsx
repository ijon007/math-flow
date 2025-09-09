'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  type: string;
  options?: string[];
  points: number;
  difficulty: string;
}

interface QuestionsPreviewProps {
  questions: Question[];
}

export function QuestionsPreview({ questions }: QuestionsPreviewProps) {
  const [showAll, setShowAll] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const displayedQuestions = showAll ? questions : questions.slice(0, 3);
  const hasMoreQuestions = questions.length > 3;

  return (
    <div className="space-y-2 border rounded-md p-4">
      <h4 className="font-medium mb-2">Questions</h4>
      <div>
        <div className="space-y-4">
          {displayedQuestions.map((question, index) => (
            <div key={question.id} className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">{question.question}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{question.points} pts</Badge>
                    <Badge className="text-xs px-1 py-0 bg-[#00C48D]/10 text-[#00C48D]">
                      {question.type.replace('-', ' ')}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-xs px-1 py-0",
                        question.difficulty === 'easy'
                          ? 'bg-[#00C48D]/10 text-[#00C48D]'
                          : question.difficulty === 'medium'
                          ? 'bg-[#FFF3E0] text-[#FB8C00]'
                          : question.difficulty === 'hard'
                          ? 'bg-[#FFEBEE] text-[#E53935]'
                          : 'bg-[#E0E0E0] text-[#616161]'
                      )}
                    >
                      {question.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {hasMoreQuestions && !showAll && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                ... and {questions.length - 3} more questions
              </Button>
            </div>
          )}
          {showAll && hasMoreQuestions && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Show less
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
