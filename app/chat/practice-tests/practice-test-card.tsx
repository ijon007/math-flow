'use client';

import { Button } from '@/components/ui/button';
import { PracticeTestGroup } from './types';
import { Share2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PracticeTestCardProps {
  group: PracticeTestGroup;
  onTakeTest: (groupId: string) => void;
  onShare: (groupId: string) => void;
  onDelete: (groupId: string) => void;
}

export function PracticeTestCard({
  group,
  onTakeTest,
  onShare,
  onDelete,
}: PracticeTestCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground transition-all">
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">
              {group.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {group.description}
            </p>
          </div>
          <div className='flex items-center'>
            <Button
              className='bg-transparent hover:bg-red-500/30 text-red-500 border-none'
              onClick={() => onDelete(group.id)}
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className='hover:bg-[#00C48D]/10 hover:text-[#00C48D] transition-all duration-300'
              onClick={() => onShare(group.id)}
              size="icon"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              className={`inline-flex items-center text-xs font-medium ${
                group.difficulty === 'Easy'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : group.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}
            >
              {group.difficulty}
            </Badge>
          </div>
          {group.timeLimit && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Time Limit:</span>
              <span className="font-medium">
                {group.timeLimit < 60
                  ? `${group.timeLimit} min`
                  : `${Math.floor(group.timeLimit / 60)}h ${group.timeLimit % 60}m`}
              </span>
            </div>
          )}
          {group.attempts > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average Score:</span>
              <span className="font-medium">{group.averageScore.toFixed(1)}%</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1 rounded-md bg-[#00C48D] px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#00C48D]/90 border-none"
            onClick={() => onTakeTest(group.id)}
          >
            Take Test
          </Button>
        </div>
      </div>
    </div>
  );
}
