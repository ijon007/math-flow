'use client';

import { use } from 'react';
import { useQuery } from 'convex/react';
import { notFound } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { SharedThread } from '@/components/shared/shared-thread';
import { SharedFlashcard } from '@/components/shared/shared-flashcard';
import { SharedGraph } from '@/components/shared/shared-graph';
import { SharedPracticeTest } from '@/components/shared/shared-practice-test';
import { SharedStudyGuide } from '@/components/shared/shared-study-guide';

type ShareableType = 'thread' | 'flashcard' | 'graph' | 'practiceTest' | 'studyGuide';

interface SharedPageProps {
  params: Promise<{
    type: ShareableType;
    id: string;
  }>;
}

export default function SharedPage({ params }: SharedPageProps) {
  const { type, id } = use(params);

  const sharedItem = useQuery(api.sharing.getSharedItem, {
    itemType: type,
    itemId: id,
  });

  if (sharedItem === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00C48D] border-t-transparent"></div>
          <p className="mt-2 text-neutral-600">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (sharedItem === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Content Not Found</h1>
          <p className="text-neutral-600 mb-4">
            This shared content may have been removed or is no longer available.
          </p>
          <p className="text-sm text-neutral-500">
            The content might not be shared or the link may be incorrect.
          </p>
        </div>
      </div>
    );
  }

  const renderSharedContent = () => {
    switch (type) {
      case 'thread':
        return <SharedThread thread={sharedItem} />;
      case 'flashcard':
        return <SharedFlashcard flashcard={sharedItem} />;
      case 'graph':
        return <SharedGraph graph={sharedItem} />;
      case 'practiceTest':
        return <SharedPracticeTest practiceTest={sharedItem} />;
      case 'studyGuide':
        return <SharedStudyGuide studyGuide={sharedItem} />;
      default:
        return <div>Unsupported content type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-4 pt-2">
        {renderSharedContent()}
      </div>
    </div>
  );
}
