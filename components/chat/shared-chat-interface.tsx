'use client';

import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChatMessagesArea } from '@/components/chat/chat-messages-area';
import { ChatLoadingState } from '@/components/chat/chat-loading-state';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface SharedChatInterfaceProps {
  threadId: Id<'threads'>;
}

export function SharedChatInterface({ threadId }: SharedChatInterfaceProps) {
  const [conversationTitle, setConversationTitle] = useState('Shared Thread');
  const router = useRouter();

  const thread = useQuery(api.threads.getSharedThread, { threadId });
  const threadMessages = useQuery(
    api.messages.getMessagesByThread,
    threadId ? { threadId } : 'skip'
  );

  useEffect(() => {
    if (thread === null) {
      router.push('/chat');
    }
  }, [thread, router]);

  useEffect(() => {
    if (thread?.title) {
      setConversationTitle(thread.title);
    }
  }, [thread?.title]);

  // Show loading state while thread is being fetched
  if (thread === undefined) {
    return <ChatLoadingState />;
  }

  // Don't render if thread is null (will redirect)
  if (thread === null) {
    return null;
  }

  // Format messages for display
  const messages = threadMessages?.map((msg) => ({
    id: msg._id,
    role: msg.role as 'user' | 'assistant' | 'system',
    parts: msg.parts as any,
    createdAt: new Date(msg.createdAt),
  })) || [];

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');  
  }

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl bg-white px-4 py-2 border-b">
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex items-center gap-2">
            <Image 
              src="/fx.svg" 
              width={32}
              height={32}
              alt="Math Flow" 
              className="h-8 w-8"
            />
            <span className="font-bold text-black text-lg leading-none">Math Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-lg text-neutral-900">
              {conversationTitle}
            </h1>
            <Badge className="bg-[#00C48D]/10 text-[#00C48D]">
              Shared
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopyLink}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area - Read Only */}
      <ChatMessagesArea
        messages={messages}
        status="ready"
        onCopy={() => {}}
        onRegenerate={() => {}}
        onSuggestionClick={() => {}}
        user={null}
      />

      {/* Read-only notice */}
      <div className="fixed bottom-0 left-0 w-full border-t px-4 py-3 z-20">
        <p className="text-center text-sm text-[#00C48D]">
          This is a shared thread. You can view the conversation but cannot interact with it.
        </p>
      </div>
    </div>
  );
}
