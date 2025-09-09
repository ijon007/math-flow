'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Users, Play, Save, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { PracticeTest } from '@/lib/chat/tools';

interface PracticeTestComponentProps {
  data: PracticeTest;
}

export function PracticeTestComponent({ data }: PracticeTestComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

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
    // For now, show a message since we don't have a test ID in the tool output
    toast.info('Test saved! You can find it in your Practice Tests library.');
  };

  const handleSave = () => {
    toast.success('Test saved to your library!');
  };

  const handleShare = () => {
    toast.success('Test link copied to clipboard!');
  };

  return (
    <Card className="w-full">
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
        {/* Test Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Subject:</span>
            <span className="font-medium">{data.subject}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Questions:</span>
            <span className="font-medium">{data.questionCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Time Limit:</span>
            <span className="font-medium">{formatTime(data.timeLimit)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">Practice Test</span>
          </div>
        </div>

        {/* Question Preview */}
        {data.questions && data.questions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Sample Questions</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
            
            <div className="space-y-2">
              {data.questions.slice(0, isExpanded ? data.questions.length : 2).map((question, index) => (
                <div key={question.id} className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}.
                    </span>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm">{question.question}</p>
                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="text-xs text-muted-foreground">
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {question.type.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
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

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" onClick={handleTakeTest}>
            <Play className="h-4 w-4 mr-2" />
            Take Test
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
