'use client';

import { Message, MessageContent, MessageAvatar } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool';
import { MessageActions } from './message-actions';
interface MessageListProps {
  messages: any[];
  onCopy: (messageId: string) => void;
  onRegenerate: () => void;
}

export function MessageList({ messages, onCopy, onRegenerate }: MessageListProps) {
  return (
    <>
      {messages.map((message) => (
        <div key={message.id} className="w-full">
          <div className={`flex items-end gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && (
              <MessageAvatar 
                src="/ai-avatar.svg" 
                name="AI" 
              />
            )}
            <Message from={message.role}>
              <MessageContent>
                {message.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <Response key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                        {part.text}
                      </Response>
                    );
                  }
                  if (part.type.startsWith('tool-')) {
                    const toolName = part.type.replace('tool-', '') as any;
                    return (
                      <Tool key={`${message.id}-${i}`} defaultOpen>
                        <ToolHeader type={toolName} state={(part as any).state} />
                        <ToolContent>
                          <ToolInput input={(part as any).input} />
                          {(part as any).output && (
                            <ToolOutput 
                              output={(part as any).output} 
                              errorText={(part as any).errorText}
                              toolType={toolName}
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
                src="/user-avatar.svg" 
                name="User" 
              />
            )}
          </div>
          {message.role === 'assistant' && (
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
