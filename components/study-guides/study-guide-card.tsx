'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock, 
  Target, 
  Play, 
  Share2, 
  Trash2, 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StudyGuideCardProps {
  guide: {
    _id: string;
    title: string;
    description?: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    progress: number;
    totalSteps: number;
    completedSteps: number;
    createdAt: number;
    lastAccessed?: number;
    estimatedTotalTime?: number;
    tags: string[];
    isPublic: boolean;
  };
  onStartGuide: (guideId: string) => void;
  onShare: (guideId: string) => void;
  onDelete: (guideId: string) => void;
}

export function StudyGuideCard({
  guide,
  onStartGuide,
  onShare,
  onDelete,
}: StudyGuideCardProps) {
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
    if (!minutes) return 'No time estimate';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressText = (progress: number) => {
    if (progress === 0) return 'Not started';
    if (progress === 100) return 'Completed';
    return `${progress}% complete`;
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-all">
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold leading-none tracking-tight truncate">
              {guide.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {guide.description || `Study guide for ${guide.topic}`}
            </p>
          </div>
          <div className="flex items-center ml-2">
            <Button
              className="bg-transparent hover:bg-red-500/30 text-red-500 border-none"
              onClick={() => onDelete(guide._id)}
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-[#00C48D]/10 hover:text-[#00C48D] transition-all duration-300"
              onClick={() => onShare(guide._id)}
              size="icon"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {guide.isPublic && (
              <Badge variant="secondary" className="text-xs">
                Public
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" />
                Steps
              </span>
              <span className="font-medium">
                {guide.completedSteps}/{guide.totalSteps}
              </span>
            </div>

            {guide.estimatedTotalTime && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Duration
                </span>
                <span className="font-medium">
                  {formatTime(guide.estimatedTotalTime)}
                </span>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-xs">
                  {getProgressText(guide.progress)}
                </span>
              </div>
              <Progress 
                value={guide.progress} 
                className="h-2"
                // @ts-ignore - Custom color prop
                color={getProgressColor(guide.progress)}
              />
            </div>
          </div>

          {guide.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {guide.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {guide.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{guide.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Created {formatDistanceToNow(new Date(guide.createdAt), { addSuffix: true })}
            {guide.lastAccessed && (
              <span className="block">
                Last accessed {formatDistanceToNow(new Date(guide.lastAccessed), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1 rounded-md bg-[#00C48D] px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#00C48D]/90 border-none"
            onClick={() => onStartGuide(guide._id)}
          >
            <Play className="h-4 w-4 mr-2" />
            {guide.progress === 0 ? 'Start Learning' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
