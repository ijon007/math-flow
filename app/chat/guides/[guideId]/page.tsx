'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { MermaidChart } from '@/components/study-guides/mermaid-chart';
import { LearningPath } from '@/components/study-guides/learning-path';
import { StepContent } from '@/components/study-guides/step-content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  ArrowLeft, 
  Share2, 
  Clock, 
  Target, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudyGuidePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const guideId = params.guideId as string;

  const studyGuide = useQuery(
    api.studyGuides.getStudyGuide,
    guideId ? { guideId: guideId as any } : 'skip'
  );

  const updateGuideProgress = useMutation(api.studyGuides.updateGuideProgress);
  const markStepComplete = useMutation(api.studyGuides.markStepComplete);

  // Initialize completed steps from the guide data
  useEffect(() => {
    if (studyGuide) {
      const completed = studyGuide.learningPath
        .filter(step => step.completed)
        .map(step => step.id);
      setCompletedSteps(completed);
    }
  }, [studyGuide]);

  const handleStepClick = (stepId: string) => {
    const stepIndex = studyGuide?.learningPath.findIndex(step => step.id === stepId);
    if (stepIndex !== undefined && stepIndex >= 0) {
      setCurrentStepIndex(stepIndex);
      setActiveTab('content');
    }
  };

  const handleStepComplete = async (stepId: string, completed: boolean) => {
    try {
      await markStepComplete({ guideId: guideId as any, stepId, completed });
      
      setCompletedSteps(prev => {
        if (completed) {
          return [...prev, stepId];
        } else {
          return prev.filter(id => id !== stepId);
        }
      });

      // Update overall progress
      if (studyGuide) {
        const newCompletedSteps = completed 
          ? [...completedSteps, stepId]
          : completedSteps.filter(id => id !== stepId);
        
        const progress = Math.round((newCompletedSteps.length / studyGuide.totalSteps) * 100);
        await updateGuideProgress({ 
          guideId: guideId as any, 
          progress, 
          completedSteps: newCompletedSteps.length 
        });
      }

      toast.success(completed ? 'Step marked as complete!' : 'Step marked as incomplete');
    } catch (error) {
      toast.error('Failed to update step status');
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!studyGuide) return;
    
    if (direction === 'prev' && currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else if (direction === 'next' && currentStepIndex < studyGuide.learningPath.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    toast.success('Progress reset');
  };

  const handleShare = () => {
    const guideUrl = `${window.location.origin}/chat/guides/${guideId}`;
    navigator.clipboard.writeText(guideUrl);
    toast.success('Study guide link copied to clipboard!');
  };

  if (!user) {
    return (
      <div className="flex h-full flex-col rounded-xl bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Please sign in to view this study guide.</p>
          </div>
        </div>
      </div>
    );
  }

  if (studyGuide === undefined) {
    return (
      <div className="flex h-full flex-col rounded-xl bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading study guide...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!studyGuide) {
    return (
      <div className="flex h-full flex-col rounded-xl bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Study guide not found.</p>
            <Button 
              onClick={() => router.push('/chat/guides')}
              className="mt-4"
            >
              Back to Guides
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = studyGuide.learningPath[currentStepIndex];
  const progressPercentage = Math.round((completedSteps.length / studyGuide.totalSteps) * 100);


  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      {/* Header */}
      <div className="bg-white p-2">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/chat/guides')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <h1 className="text-xl font-semibold flex items-center">
              {studyGuide.title}
            </h1>
          </div>

          <Button
            variant="ghost"
            className='hover:bg-[#00C48D]/10 hover:text-[#00C48D] transition-all duration-300'
            size="icon"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center overflow-hidden lg:w-3/4 lg:mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col w-full">
          <div className="bg-white px-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Step Content</TabsTrigger>
              <TabsTrigger value="flow">Flow Chart</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* Guide Info */}
              <div className="rounded-md border p-3">
                <div className="space-y-2 mb-4">
                  <span className="text-lg font-semibold">{studyGuide.title}</span>
                  <p className="text-muted-foreground">{studyGuide.description}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Steps:</span>
                    <span className="font-medium">{studyGuide.totalSteps}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium">{completedSteps.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">{progressPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Learning Path */}
              <LearningPath
                steps={studyGuide.learningPath}
                completedSteps={completedSteps}
                currentStep={currentStep?.id}
                onStepClick={handleStepClick}
                onStepComplete={handleStepComplete}
              />
            </TabsContent>

            <TabsContent value="content" className="mt-0">
              {currentStep && (
                <StepContent
                  step={currentStep}
                  stepIndex={currentStepIndex}
                  totalSteps={studyGuide.learningPath.length}
                  isCompleted={completedSteps.includes(currentStep.id)}
                  isCurrent={true}
                  onComplete={(completed) => handleStepComplete(currentStep.id, completed)}
                  onNavigate={handleNavigate}
                  onReset={handleReset}
                />
              )}
            </TabsContent>

            <TabsContent value="flow" className="mt-0">
              {studyGuide.mermaidCode ? (
                <MermaidChart 
                  chart={studyGuide.mermaidCode} 
                  className="w-full min-h-screen border rounded-lg p-4"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
                  <div className="text-muted-foreground">No flowchart available</div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
