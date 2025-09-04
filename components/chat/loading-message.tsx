'use client';

import { Message, MessageContent } from '@/components/ai-elements/message';

export function LoadingMessage() {
  return (
    <Message from="assistant">
      <MessageContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
          <span>Thinking...</span>
        </div>
      </MessageContent>
    </Message>
  );
}
