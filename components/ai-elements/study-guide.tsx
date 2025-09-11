'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Clock, 
  Play, 
  ChevronRight, 
  Circle,
  Target,
  Calculator,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { StudyGuide } from '@/lib/chat/tools';

interface StudyGuideComponentProps {
  data: StudyGuide;
  threadId?: string;
}

export function StudyGuideComponent({ data, threadId }: StudyGuideComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  
  const studyGuides = useQuery(
    api.studyGuides.getStudyGuidesByUser,
    user?.id ? { userId: user.id } : 'skip'
  );

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'concept':
        return <Target className="h-4 w-4" />;
      case 'example':
        return <Calculator className="h-4 w-4" />;
      case 'practice':
        return <Play className="h-4 w-4" />;
      case 'visualization':
        return <Eye className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const handleStartGuide = () => {
    if (studyGuides && studyGuides.length > 0) {
      const guideId = studyGuides[0]._id;
      router.push(`/chat/guides/${guideId}`);
    } else {
      toast.error('Study guide not found');
    }
  };

  const handleViewFullGuide = () => {
    if (studyGuides && studyGuides.length > 0) {
      const guideId = studyGuides[0]._id;
      router.push(`/chat/guides/${guideId}`);
    } else {
      toast.error('Study guide not found');
    }
  };

  const totalSteps = data.learningPath.length;
  const estimatedTime = data.estimatedTotalTime || data.learningPath.reduce((sum, step) => sum + step.estimatedTime, 0);

  return (
    <Card className="w-full lg:min-w-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#00C48D]" />
              {data.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {data.description || `Comprehensive study guide for ${data.topic}`}
            </CardDescription>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(estimatedTime)}
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            {totalSteps} steps
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Learning Path</h4>
            <Button variant="outline" onClick={handleViewFullGuide} className='h-7 text-xs'>
              View Full Guide
            </Button>
          </div>
          <div className="space-y-2">
            {data.learningPath.slice(0, isExpanded ? totalSteps : 3).map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-3 p-2 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {getStepIcon(step.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{step.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {step.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {step.estimatedTime}m
                </div>
              </div>
            ))}
            
            {!isExpanded && totalSteps > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="w-full text-xs"
              >
                Show {totalSteps - 3} more steps
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {data.mermaidCode && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Learning Flow</h4>
            <div className="p-3 rounded-md bg-muted/30 border-2 border-dashed border-muted-foreground/20">
              <div className="text-center text-sm text-muted-foreground">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Interactive Mermaid flowchart available in full guide
              </div>
            </div>
          </div>
        )}

        <Button onClick={handleStartGuide} className="flex w-full h-7 bg-[#00C48D] hover:bg-[#00C48D]/90 border-none">
          <Play className="h-4 w-4 mr-2" />
          Start Learning
        </Button>
      </CardContent>
    </Card>
  );
}
