'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef } from 'react';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { ClockIcon, type ClockIconHandle } from '@/components/ui/clock';
import { ChartSplineIcon, type ChartSplineIconHandle } from '@/components/ui/chart-spline';
import { ChatHeader } from '@/components/chat/chat-header';
import { EmptyState } from '@/components/chat/empty-state';
import { MessageList } from '@/components/chat/message-list';
import { LoadingMessage } from '@/components/chat/loading-message';
import { useTabManagement } from '@/hooks/use-tab-management';
import { copyMessageToClipboard, handleBookmark, handleShare } from '@/lib/chat-utils';

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop, setMessages, regenerate } = useChat();
  const { activeTabs, toggleTab } = useTabManagement();
  
  const clockRef = useRef<ClockIconHandle>(null);
  const chartRef = useRef<ChartSplineIconHandle>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleStepsHover = () => {
    clockRef.current?.startAnimation();
  };

  const handleStepsLeave = () => {
    clockRef.current?.stopAnimation();
  };

  const handleGraphHover = () => {
    chartRef.current?.startAnimation();
  };

  const handleGraphLeave = () => {
    chartRef.current?.stopAnimation();
  };

  const handleCopy = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      copyMessageToClipboard(message);
    }
  };

  return (
    <div className="bg-white flex flex-col h-full rounded-xl">
      <ChatHeader 
        title={messages.length > 0 ? "Math Chat" : "New Thread"}
        hasMessages={messages.length > 0}
        onBookmark={handleBookmark}
        onShare={handleShare}
      />
      {messages.length === 0 && (
        <EmptyState onSuggestionClick={handleSuggestionClick} />
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full px-4 py-4">
            <Conversation>
              <ConversationContent>
                <MessageList 
                  messages={messages}
                  onCopy={handleCopy}
                  onRegenerate={regenerate}
                />
                {status === 'submitted' && <LoadingMessage />}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 z-10 mt-auto flex-shrink-0 bg-white rounded-xl">
        <div className="max-w-4xl mx-auto w-full px-4 py-4">
          <div className="w-full max-w-2xl mx-auto">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Solve a problem..."
              />
              <PromptInputToolbar>
                <PromptInputTools>
                  <PromptInputButton
                    variant="outline"
                    onClick={() => toggleTab('steps')}
                    onMouseEnter={handleStepsHover}
                    onMouseLeave={handleStepsLeave}
                    className={activeTabs.has('steps') ? 'border-[#00C48D] text-[#00C48D] hover:bg-[#00C48D]/10 hover:text-[#00C48D]' : ''}
                  >
                    <ClockIcon ref={clockRef} className="w-4 h-4" />
                    <span>Steps</span>
                  </PromptInputButton>
                  <PromptInputButton
                    variant="outline"
                    onClick={() => toggleTab('graph')}
                    onMouseEnter={handleGraphHover}
                    onMouseLeave={handleGraphLeave}
                    className={activeTabs.has('graph') ? 'border-[#00C48D] text-[#00C48D] hover:bg-[#00C48D]/10 hover:text-[#00C48D]' : ''}
                  >
                    <ChartSplineIcon ref={chartRef} className="w-4 h-4" />
                    <span>Graph</span>
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit
                  disabled={false}
                  status={status}
                  onClick={status === 'streaming' ? stop : undefined}
                  className={
                    status === 'streaming'
                      ? 'bg-destructive hover:bg-destructive/80'
                      : 'bg-[#00C48D] hover:bg-[#00C48D]/80'
                  }
                />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
