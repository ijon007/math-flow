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
              <div key={question.id} className={cn(
                "rounded-lg border p-4",
                showResults && isCorrect && "border-green-200 bg-green-50",
                showResults && !isCorrect && "border-red-200 bg-red-50"
              )}>
                <div className="flex items-start gap-3">
                  <span className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    showResults 
                      ? isCorrect 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                      : "bg-primary text-primary-foreground"
                  )}>
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
                      {showResults && (
                        <Badge
                          className={cn(
                            "text-xs px-2 py-1",
                            isCorrect 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </Badge>
                      )}
                    </div>
                    
                    {showResults && (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="text-xs">
                          <span className="font-medium text-green-600">Correct Answer: </span>
                          <span className="text-green-700">{question.correctAnswer}</span>
                        </div>
                        {userAnswer && (
                          <div className="text-xs">
                            <span className="font-medium text-blue-600">Your Answer: </span>
                            <span className={cn(
                              isCorrect ? "text-green-700" : "text-red-700"
                            )}>
                              {userAnswer.answer || 'No answer provided'}
                            </span>
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
                </div>
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
