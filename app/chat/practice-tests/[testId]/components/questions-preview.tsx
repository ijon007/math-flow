'use client';

import { useState } from 'react';
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
  correctAnswer?: string;
  explanation?: string;
}

interface Answer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
  earnedPoints: number;
}

interface QuestionsPreviewProps {
  questions: Question[];
  answers?: Answer[];
  showResults?: boolean;
}

export function QuestionsPreview({ questions, answers = [], showResults = false }: QuestionsPreviewProps) {
  const [showAll, setShowAll] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }


  const displayedQuestions = showAll ? questions : questions.slice(0, 3);
  const hasMoreQuestions = questions.length > 3;

  const getAnswerForQuestion = (questionId: string) => {
    return answers.find(answer => answer.questionId === questionId);
  };

  return (
    <div className="space-y-2 border rounded-md p-4">
      <h4 className="font-medium mb-2">Questions</h4>
      <div>
        <div className="space-y-4">
          {displayedQuestions.map((question, index) => {
            const userAnswer = getAnswerForQuestion(question.id);
            const isCorrect = userAnswer?.isCorrect || false;
            
            return (
              <div key={question.id} className="rounded-lg border p-4 bg-card">
                <div className="flex items-start gap-3 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium bg-primary text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">{question.question}</p>
                    <div className="flex items-center gap-2 flex-wrap">
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
                  {showResults && (
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs px-2 py-1",
                          isCorrect
                            ? "bg-[#00C48D]/10 text-[#00C48D] border-[#00C48D]"
                            : "bg-[#FFEBEE] text-[#E53935] border-[#E53935]"
                        )}
                      >
                        {isCorrect ? '✓' : '○'}
                      </Badge>
                    </div>
                  )}
                </div>
                {showResults && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">
                        <span>Answer: </span>
                        <span>{question.correctAnswer}</span>
                      </div>
                      <div className="text-xs font-medium">
                        <span className={cn(
                          isCorrect ? "text-[#00C48D]" : "text-red-500"
                        )}>
                          {userAnswer ? `${userAnswer.earnedPoints}/${question.points} pts` : `0/${question.points} pts`}
                        </span>
                      </div>
                    </div>
                    {userAnswer && (
                      <div className={cn("text-sm font-semibold", isCorrect ? "text-[#00C48D]" : "text-red-500")}>
                        <span className="font-medium">Your response: </span>
                        <span>{userAnswer.answer || 'No answer provided'}</span>
                      </div>
                    )}
                    {question.explanation && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Explanation: </span>
                        <span>{question.explanation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
