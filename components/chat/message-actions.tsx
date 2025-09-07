'use client';

import { Action, Actions } from '@/components/ai-elements/actions';
import { Message } from '@/components/ai-elements/message';

interface MessageActionsProps {
  messageId: string;
  onCopy: (messageId: string) => void;
  onRegenerate: () => void;
}

export function MessageActions({
  messageId,
  onCopy,
  onRegenerate,
}: MessageActionsProps) {
  return (
    <div className="mt-1 flex justify-start">
      <Actions>
        <Action label="Copy" onClick={() => onCopy(messageId)} tooltip="Copy">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </Action>
        <Action label="Regenerate" onClick={onRegenerate} tooltip="Regenerate">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </Action>
      </Actions>
    </div>
  );
}
