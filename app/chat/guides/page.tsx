'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { StudyGuidesList } from '@/components/study-guides/study-guides-list';
import { PageHeader } from '@/components/ui/page-header';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { BookOpen, Plus } from 'lucide-react';

export default function GuidesLibraryPage() {
  const { user } = useUser();
  const router = useRouter();
  
  const studyGuides = useQuery(
    api.studyGuides.getStudyGuidesByUser,
    user?.id ? { userId: user.id } : 'skip'
  );
  
  const deleteStudyGuide = useMutation(api.studyGuides.deleteStudyGuide);

  const handleStartGuide = (guideId: string) => {
    router.push(`/chat/guides/${guideId}`);
  };

  const handleShare = (guideId: string) => {
    const guideUrl = `${window.location.origin}/chat/guides/${guideId}`;
    navigator.clipboard.writeText(guideUrl);
    toast.success('Study guide link copied to clipboard!');
  };

  const handleDelete = async (guideId: string) => {
    try {
      await deleteStudyGuide({ guideId: guideId as any });
      toast.success('Study guide deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete study guide');
    }
  };

  const handleCreateNew = () => {
    // Navigate to chat to create a new study guide
    router.push('/chat?mode=guide');
  };

  if (!user) {
    return (
      <div className="flex h-full flex-col rounded-xl bg-white">
        <PageHeader
          count={0}
          countLabel="guides"
          icon={BookOpen}
          title="Study Guides"
        />
        <div className="flex-1 flex items-center justify-center">
          <PageEmptyState
            description="Please sign in to view your study guides."
            hasSearch={false}
            icon={BookOpen}
            title="Sign in required"
          />
        </div>
      </div>
    );
  }

  if (studyGuides === undefined) {
    return (
      <div className="flex h-full flex-col rounded-xl bg-white">
        <PageHeader
          count={0}
          countLabel="guides"
          icon={BookOpen}
          title="Study Guides"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading study guides...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <PageHeader
        count={studyGuides.length}
        countLabel="guides"
        icon={BookOpen}
        title="Study Guides"
      />

      <div className="flex-1 overflow-y-auto p-4">
        {studyGuides.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <PageEmptyState
              description="Create comprehensive study guides with learning paths, flow charts, and step-by-step content for any math topic."
              hasSearch={false}
              icon={BookOpen}
              title="No study guides yet"
            />
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 rounded-md bg-[#00C48D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#00C48D]/90"
            >
              <Plus className="h-4 w-4" />
              Create Study Guide
            </button>
          </div>
        ) : (
          <StudyGuidesList
            onCreateNew={handleCreateNew}
          />
        )}
      </div>
    </div>
  );
}
