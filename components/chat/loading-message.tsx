'use client';

import { Message, MessageContent } from '@/components/ai-elements/message';

export function LoadingMessage() {
  return (
    <Message from="assistant">
      <MessageContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-400" />
          <span>Thinking...</span>
        </div>
      </MessageContent>
    </Message>
  );
}
