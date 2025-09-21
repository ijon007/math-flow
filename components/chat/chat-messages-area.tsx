import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { EmptyState } from '@/components/chat/empty-state';
import { LoadingMessage } from '@/components/chat/loading-message';
import { MessageList } from '@/components/chat/message-list';

interface ChatMessagesAreaProps {
  messages: any[];
  status: string;
  onCopy: (messageId: string) => void;
  onRegenerate: () => void;
  onSuggestionClick: (value: string) => void;
  user: any;
  threadId?: string;
}

export function ChatMessagesArea({
  messages,
  status,
  onCopy,
  onRegenerate,
  onSuggestionClick,
  user,
  threadId,
}: ChatMessagesAreaProps) {
  if (messages.length === 0) {
    return <EmptyState onSuggestionClick={onSuggestionClick} />;
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="mx-auto w-full max-w-4xl px-0 py-4 lg:px-4">
        <Conversation>
          <ConversationContent className="px-2 lg:px-4">
            <MessageList
              messages={messages}
              onCopy={onCopy}
              onRegenerate={onRegenerate}
              user={user}
              threadId={threadId}
            />
            {status === 'submitted' && <LoadingMessage />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
    </div>
  );
}
