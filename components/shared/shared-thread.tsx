'use client';

import Link from 'next/link';
import { MessageSquare, Share2 } from 'lucide-react';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/convex/_generated/api';
import { MessageList } from '@/components/chat/message-list';

interface SharedThreadProps {
  thread: any;
}

export function SharedThread({ thread }: SharedThreadProps) {
  const messages = useQuery(api.messages.getMessagesByThread, {
    threadId: thread._id,
  });

  return (
    <div className="w-full h-svh flex flex-col bg-neutral-50">
      {/* Header with branding */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              alt="Math Flow" 
              height={32} 
              src="/logo.svg" 
              width={32} 
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-neutral-900">Math Flow</h1>
            </div>
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            variant="outline"
            size="sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>

      {/* Thread info */}
      <div className="bg-white px-6 py-2 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-neutral-900">
              {thread.title}
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{thread.messageCount} messages</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>Shared</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {thread.tags && thread.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 flex-shrink-0">
            {thread.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Show the full conversation */}
        <div className="rounded-lg  bg-white flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4">
            {messages ? (
              <MessageList 
                messages={messages} 
                isShared={true}
                showActions={false}
              />
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00C48D] border-t-transparent"></div>
                  <p className="mt-2 text-sm text-neutral-600">Loading conversation...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 py-4 border-t bg-white text-center flex-shrink-0">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Image 
                alt="Math Flow" 
                height={16} 
                src="/logo.svg" 
                width={16} 
                className="rounded"
              />
              <p className="text-sm text-neutral-500">
                This conversation was shared from <span className="font-semibold text-neutral-700">Math Flow</span>
              </p>
            </div>
            <p className="flex flex-row text-xs text-neutral-500 mt-1">
              <span>AI-powered math assistance •{' '}</span>
              <Link href="/" target="_blank" className="font-semibold text-[#00C48D] underline ml-1">Try it out</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
