'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { PracticeTest } from '@/lib/chat/tools';

interface PracticeTestComponentProps {
  data: PracticeTest;
  threadId?: string;
}

export function PracticeTestComponent({ data, threadId }: PracticeTestComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  
  // Get the most recent practice test for this thread
  const practiceTests = useQuery(
    api.practiceTests.getPracticeTestsByThread,
    threadId ? { threadId: threadId as any } : 'skip'
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return 'No time limit';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const handleTakeTest = () => {
    if (!practiceTests || practiceTests.length === 0) {
      toast.error('Test not found. Please try again.');
      return;
    }
    
    // Find the most recent test that matches this data
    const matchingTest = practiceTests
      .filter(test => test.title === data.title && test.questionCount === data.questionCount)
      .sort((a, b) => b.createdAt - a.createdAt)[0];
    
    if (matchingTest) {
      router.push(`/chat/practice-tests/${matchingTest._id}`);
    } else {
      toast.error('Test not found. Please try again.');
    }
  };

  return (
    <Card className="w-full lg:min-w-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{data.title}</CardTitle>
            {data.description && (
              <CardDescription className="text-sm">
                {data.description}
              </CardDescription>
            )}
          </div>
          <Badge className={getDifficultyColor(data.difficulty)}>
            {data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{data.questionCount} questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatTime(data.timeLimit)}</span>
          </div>
        </div>

        {data.questions && data.questions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium">Questions</h4>
              <Button
                variant="outline"
                className="text-xs h-7"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
            
            <div className="space-y-1">
              {data.questions.slice(0, isExpanded ? data.questions.length : 2).map((question, index) => (
                <div key={question.id} className="p-2 border rounded bg-muted/20">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {index + 1}.
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs">{question.question}</p>
                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-0.5">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="text-xs text-muted-foreground">
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Badge className="text-xs px-1 py-0 bg-[#00C48D]/10 text-[#00C48D]">
                          {question.type.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {question.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button 
            className="flex-1 bg-[#00C48D] hover:bg-[#00C48D]/80 border-none h-7" 
            onClick={handleTakeTest}
          >
            <Play className="h-4 w-4 mr-2" />
            Take Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
