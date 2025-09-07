'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

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
  const [conversationTitle, setConversationTitle] = useState('New Thread');
  const [currentThreadId, setCurrentThreadId] = useState<Id<"threads"> | null>(null);
  const { messages, sendMessage, status, stop, setMessages, regenerate } = useChat();
  const { activeTabs, toggleTab } = useTabManagement();
  const { user } = useUser();
  const savedMessageIds = useRef<Set<string>>(new Set());


  const createThread = useMutation(api.threads.createThread);
  const addMessage = useMutation(api.messages.addMessage);
  const toggleBookmark = useMutation(api.threads.toggleBookmark);
  const saveGraph = useMutation(api.graphs.saveGraph);
  const saveFlashcards = useMutation(api.flashcards.saveFlashcards);
  const saveStepByStep = useMutation(api.stepByStep.saveStepByStep);
  
  const thread = useQuery(api.threads.getThread, currentThreadId ? { threadId: currentThreadId } : "skip");
  const threadMessages = useQuery(api.messages.getMessagesByThread, currentThreadId ? { threadId: currentThreadId } : "skip");
  
  const clockRef = useRef<ClockIconHandle>(null);
  const chartRef = useRef<ChartSplineIconHandle>(null);


  useEffect(() => {
    if (threadMessages && threadMessages.length > 0) {
      const formattedMessages = threadMessages.map(msg => ({
        id: msg._id,
        role: msg.role as 'user' | 'assistant' | 'system',
        parts: msg.parts as any,
        createdAt: new Date(msg.createdAt),
      }));
      setMessages(formattedMessages);
    } else if (currentThreadId && threadMessages && threadMessages.length === 0) {
      setMessages([]);
    }
  }, [threadMessages, currentThreadId, setMessages]);

  useEffect(() => {
    if (thread?.title) {
      setConversationTitle(thread.title);
    }
  }, [thread?.title]);

  useEffect(() => {
    if (!messages.length || !currentThreadId || !user?.id || status !== 'ready') return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'assistant' || savedMessageIds.current.has(lastMessage.id)) return;
    
    savedMessageIds.current.add(lastMessage.id);
    
    // Extract text content from parts
    const textContent = lastMessage.parts
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join(' ');

    addMessage({
      threadId: currentThreadId,
      role: "assistant",
      content: textContent || 'AI Response',
      parts: lastMessage.parts,
    }).then(() => {
      console.log('AI message saved');
    }).catch((error) => {
      console.error('Error saving AI message:', error);
    });
  }, [status, currentThreadId, user?.id, addMessage]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user?.id) return;
    
    let threadId = currentThreadId;
    
    if (!threadId) {
      try {
        threadId = await createThread({
          title: input.split(' ').slice(0, 3).join(' ') || 'New Thread',
          userId: user.id,
        });
        setCurrentThreadId(threadId);
      } catch (error) {
        console.error("Failed to create thread:", error);
        return;
      }
    }
    
    try {
      await addMessage({
        threadId,
        role: "user",
        content: input,
        parts: [{ type: "text", text: input }],
      });
    } catch (error) {
      console.error("Failed to add message:", error);
      return;
    }
    
    sendMessage({ text: input });
    setInput('');
  }, [input, user?.id, currentThreadId, createThread, addMessage, sendMessage]);

  const handleCopy = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) copyMessageToClipboard(message);
  }, [messages]);

  const handleBookmarkWithAuth = useCallback(async () => {
    if (currentThreadId && user?.id) {
      await toggleBookmark({ threadId: currentThreadId, userId: user.id, isBookmarked: true });
      handleBookmark();
    }
  }, [currentThreadId, user?.id, toggleBookmark]);

  return (
    <div className="bg-white flex flex-col h-full rounded-xl">
      <ChatHeader 
        title={conversationTitle}
        hasMessages={messages.length > 0}
        onBookmark={handleBookmarkWithAuth}
        onShare={handleShare}
      />
      
      {messages.length === 0 && <EmptyState onSuggestionClick={setInput} />}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full px-0 lg:px-4 py-4">
            <Conversation>
              <ConversationContent className='px-2 lg:px-4'>
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
        <div className="max-w-4xl mx-auto w-full px-2 lg:px-4 py-4">
          <div className="w-full max-w-2xl mx-auto">
            <SignedIn>
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
                      onMouseEnter={() => clockRef.current?.startAnimation()}
                      onMouseLeave={() => clockRef.current?.stopAnimation()}
                      className={activeTabs.has('steps') ? 'border-[#00C48D] text-[#00C48D] hover:bg-[#00C48D]/10 hover:text-[#00C48D]' : ''}
                    >
                      <ClockIcon ref={clockRef} className="w-4 h-4" />
                      <span>Steps</span>
                    </PromptInputButton>
                    <PromptInputButton
                      variant="outline"
                      onClick={() => toggleTab('graph')}
                      onMouseEnter={() => chartRef.current?.startAnimation()}
                      onMouseLeave={() => chartRef.current?.stopAnimation()}
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
                    className={status === 'streaming' ? 'bg-destructive hover:bg-destructive/80' : 'bg-[#00C48D] hover:bg-[#00C48D]/80'}
                  />
                </PromptInputToolbar>
              </PromptInput>
            </SignedIn>

            <SignedOut>
              <PromptInput onSubmit={(e) => e.preventDefault()}>
                <PromptInputTextarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Sign in to start solving problems..."
                  disabled
                />
                <PromptInputToolbar>
                  <PromptInputTools>
                    <PromptInputButton variant="outline" disabled className="opacity-50">
                      <ClockIcon ref={clockRef} className="w-4 h-4" />
                      <span>Steps</span>
                    </PromptInputButton>
                    <PromptInputButton variant="outline" disabled className="opacity-50">
                      <ChartSplineIcon ref={chartRef} className="w-4 h-4" />
                      <span>Graph</span>
                    </PromptInputButton>
                  </PromptInputTools>
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 bg-[#00C48D] hover:bg-[#00C48D]/80 text-white text-sm font-medium rounded-md transition-colors">
                      Sign In to Continue
                    </button>
                  </SignInButton>
                </PromptInputToolbar>
              </PromptInput>
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
}