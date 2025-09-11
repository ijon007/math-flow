'use client';

import { MathResponse } from '@/components/ai-elements/math-response';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ai-elements/message';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';
import { MessageActions } from './message-actions';

interface MessageListProps {
  messages: any[];
  onCopy?: (messageId: string) => void;
  onRegenerate?: () => void;
  user?: any;
  threadId?: string;
  isShared?: boolean;
  showActions?: boolean;
}

export function MessageList({
  messages,
  onCopy,
  onRegenerate,
  user,
  threadId,
  isShared = false,
  showActions = true,
}: MessageListProps) {
  return (
    <>
      {messages.map((message, index) => (
        <div className="w-full" key={message._id || message.id || index}>
          <div
            className={`flex items-end gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <MessageAvatar name="AI" src="/logo.svg" />
            )}
            <Message from={message.role}>
              <MessageContent>
                {message.parts.map((part: any, i: number) => {
                  if (part.type === 'text') {
                    return (
                      <MathResponse
                        className="whitespace-pre-wrap"
                        key={`${message._id || message.id || index}-${i}`}
                      >
                        {part.text}
                      </MathResponse>
                    );
                  }
                  if (part.type.startsWith('tool-')) {
                    const toolName = part.type.replace('tool-', '') as any;
                    return (
                      <Tool defaultOpen key={`${message.id}-${i}`}>
                        <ToolHeader
                          state={(part as any).state}
                          type={toolName}
                        />
                        <ToolContent>
                          <ToolInput input={(part as any).input} />
                          {(part as any).output && (
                            <ToolOutput
                              errorText={(part as any).errorText}
                              output={(part as any).output}
                              toolType={toolName}
                              threadId={threadId}
                            />
                          )}
                        </ToolContent>
                      </Tool>
                    );
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
            {message.role === 'user' && (
              <MessageAvatar
                name={user?.fullName || user?.name || 'User'}
                src={user?.imageUrl || '/fx.svg'}
              />
            )}
          </div>
          {message.role === 'assistant' && showActions && onCopy && onRegenerate && (
            <MessageActions
              messageId={message.id}
              onCopy={onCopy}
              onRegenerate={onRegenerate}
            />
          )}
        </div>
      ))}
    </>
  );
}
