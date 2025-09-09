'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  timeLimit?: number;
}

interface QuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer?: string;
  onAnswerChange: (answer: string) => void;
  timeSpent: number;
  showCorrectAnswer?: boolean;
  isGraded?: boolean;
}

export function Question({
  question,
  questionNumber,
  totalQuestions,
  userAnswer = '',
  onAnswerChange,
  timeSpent,
  showCorrectAnswer = false,
  isGraded = false,
}: QuestionProps) {
  const [localAnswer, setLocalAnswer] = useState(userAnswer);

  useEffect(() => {
    setLocalAnswer(userAnswer);
  }, [userAnswer]);

  const handleAnswerChange = (answer: string) => {
    setLocalAnswer(answer);
    onAnswerChange(answer);
  };

  const isCorrect = isGraded && localAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={localAnswer}
            onValueChange={handleAnswerChange}
            disabled={isGraded}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`}
                  className={cn(
                    "flex-1 cursor-pointer p-2 rounded-md transition-colors",
                    isGraded && option === question.correctAnswer && "bg-green-50 border border-green-200",
                    isGraded && localAnswer === option && !isCorrect && "bg-red-50 border border-red-200"
                  )}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true-false':
        return (
          <div className="flex gap-4">
            <Button
              variant={localAnswer === 'true' ? 'default' : 'outline'}
              onClick={() => handleAnswerChange('true')}
              disabled={isGraded}
              className={cn(
                "flex-1",
                isGraded && question.correctAnswer === 'true' && "bg-green-600 hover:bg-green-600",
                isGraded && localAnswer === 'true' && !isCorrect && "bg-red-600 hover:bg-red-600"
              )}
            >
              True
            </Button>
            <Button
              variant={localAnswer === 'false' ? 'default' : 'outline'}
              onClick={() => handleAnswerChange('false')}
              disabled={isGraded}
              className={cn(
                "flex-1",
                isGraded && question.correctAnswer === 'false' && "bg-green-600 hover:bg-green-600",
                isGraded && localAnswer === 'false' && !isCorrect && "bg-red-600 hover:bg-red-600"
              )}
            >
              False
            </Button>
          </div>
        );

      case 'fill-in-blank':
        return (
          <Input
            value={localAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            disabled={isGraded}
            className={cn(
              isGraded && isCorrect && "border-green-500 bg-green-50",
              isGraded && !isCorrect && "border-red-500 bg-red-50"
            )}
          />
        );

      case 'short-answer':
        return (
          <Textarea
            value={localAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            disabled={isGraded}
            className={cn(
              "min-h-[100px]",
              isGraded && isCorrect && "border-green-500 bg-green-50",
              isGraded && !isCorrect && "border-red-500 bg-red-50"
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{question.points} pts</Badge>
            <Badge
              className={cn(
                "text-xs px-2 py-1",
                question.difficulty === 'easy'
                  ? 'bg-[#00C48D]/10 text-[#00C48D]'
                  : question.difficulty === 'medium'
                  ? 'bg-[#FFF3E0] text-[#FB8C00]'
                  : 'bg-[#FFEBEE] text-[#E53935]'
              )}
            >
              {question.difficulty}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Time spent: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-base font-medium">
          {question.question}
        </div>
        
        <div className="space-y-2">
          {renderQuestionInput()}
        </div>

        {isGraded && (
          <div className="space-y-2 p-4 rounded-md bg-muted/50">
            <div className="flex items-center gap-2">
              <span className="font-medium">Correct Answer:</span>
              <span className="text-green-600 font-medium">{question.correctAnswer}</span>
            </div>
            {question.explanation && (
              <div>
                <span className="font-medium">Explanation:</span>
                <p className="text-sm text-muted-foreground mt-1">{question.explanation}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-medium">Your Answer:</span>
              <span className={cn(
                "font-medium",
                isCorrect ? "text-green-600" : "text-red-600"
              )}>
                {localAnswer || 'No answer provided'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
