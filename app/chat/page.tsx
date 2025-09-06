'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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

  // URL search params handling
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Convex mutations and queries
  const createThread = useMutation(api.threads.createThread);
  const addMessage = useMutation(api.messages.addMessage);
  const saveGraph = useMutation(api.graphs.saveGraph);
  const saveFlashcards = useMutation(api.flashcards.saveFlashcards);
  const saveStepByStep = useMutation(api.stepByStep.saveStepByStep);
  const toggleBookmark = useMutation(api.threads.toggleBookmark);
  
  // Load thread data
  const thread = useQuery(
    api.threads.getThread,
    currentThreadId ? { threadId: currentThreadId } : "skip"
  );
  const threadMessages = useQuery(
    api.messages.getMessagesByThread,
    currentThreadId ? { threadId: currentThreadId } : "skip"
  );
  
  const clockRef = useRef<ClockIconHandle>(null);
  const chartRef = useRef<ChartSplineIconHandle>(null);

  const generateTitle = useCallback((message: string): string => {
    const cleanMessage = message.trim();
    
    const words = cleanMessage.split(/\s+/).filter(word => word.length > 0);
    const title = words.slice(0, 3).join(' ');
    
    return title || 'New Thread';
  }, []);

  // Create query string helper for URL updates
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Switch to a different thread
  const switchThread = useCallback((threadId: string) => {
    router.push(pathname + '?' + createQueryString('thread', threadId));
  }, [router, pathname, createQueryString]);

  // Load thread from URL on mount
  useEffect(() => {
    const threadIdFromUrl = searchParams.get('thread');
    if (threadIdFromUrl && threadIdFromUrl !== currentThreadId) {
      setCurrentThreadId(threadIdFromUrl as Id<"threads">);
    }
  }, [searchParams, currentThreadId]);

  // Validate thread exists after setting it
  useEffect(() => {
    if (currentThreadId && thread === null) {
      // Thread doesn't exist, clear the URL and reset
      router.push(pathname);
      setCurrentThreadId(null);
      setMessages([]);
    }
  }, [currentThreadId, thread, router, pathname]);

  // Load thread title when thread changes
  useEffect(() => {
    if (thread?.title) {
      setConversationTitle(thread.title);
    }
  }, [thread?.title]);

  // Load thread messages when thread changes
  useEffect(() => {
    if (threadMessages && threadMessages.length > 0) {
      // Convert Convex messages to useChat format
      const formattedMessages = threadMessages.map(msg => ({
        id: msg._id,
        role: msg.role as 'user' | 'assistant' | 'system',
        parts: msg.parts as any, // Type assertion for compatibility
        createdAt: new Date(msg.createdAt),
      })) as any; // Full type assertion for useChat compatibility
      
      setMessages(formattedMessages);
    } else if (currentThreadId && threadMessages && threadMessages.length === 0) {
      // Clear messages if thread has no messages
      setMessages([]);
    }
  }, [threadMessages, currentThreadId, setMessages]);

  // Only generate title for new threads (not when loading existing threads)
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'user' && !currentThreadId) {
      const firstMessage = messages[0].parts.find(part => part.type === 'text')?.text || '';
      if (firstMessage) {
        setConversationTitle(generateTitle(firstMessage));
      }
    }
  }, [messages, generateTitle, currentThreadId]);

  // Save AI responses and extract tool outputs
  const saveAIResponse = useCallback(async () => {
    if (messages.length > 0 && currentThreadId && user?.id) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !savedMessageIds.current.has(lastMessage.id)) {
        // Mark this message as saved
        savedMessageIds.current.add(lastMessage.id);
        
        // Save the assistant message
        await addMessage({
          threadId: currentThreadId,
          role: "assistant",
          parts: lastMessage.parts,
        });
        
        // Extract and save tool outputs
        for (const part of lastMessage.parts) {
          if (part.type.startsWith('tool-') && 'output' in part) {
            const output = (part as any).output;
            if (!output) continue;
            const toolName = part.type.replace('tool-', '');
            
            try {
              switch (toolName) {
                case 'create_function_graph':
                case 'create_bar_chart':
                case 'create_line_chart':
                case 'create_scatter_plot':
                case 'create_histogram':
                case 'create_polar_graph':
                case 'create_parametric_graph':
                  await saveGraph({
                    threadId: currentThreadId,
                    messageId: lastMessage.id as Id<"messages">,
                    userId: user.id,
                    title: output.metadata?.title || `Generated ${toolName}`,
                    type: output.type,
                    equation: output.metadata?.expression,
                    data: output.data,
                    config: output.config,
                    metadata: output.metadata,
                    tags: [],
                  });
                  break;
                  
                case 'create_flashcards':
                  await saveFlashcards({
                    threadId: currentThreadId,
                    messageId: lastMessage.id as Id<"messages">,
                    userId: user.id,
                    topic: output.topic,
                    difficulty: output.difficulty,
                    cards: output.cards || [],
                    tags: [],
                  });
                  break;
                  
                case 'create_step_by_step':
                  await saveStepByStep({
                    threadId: currentThreadId,
                    messageId: lastMessage.id as Id<"messages">,
                    userId: user.id,
                    problem: output.problem,
                    method: output.method,
                    solution: output.solution,
                    steps: output.steps || [],
                    tags: [],
                  });
                  break;
              }
            } catch (error) {
              // Silently handle tool output save errors
            }
          }
        }
      }
    }
  }, [messages, currentThreadId, user?.id, addMessage, saveGraph, saveFlashcards, saveStepByStep]);

  useEffect(() => {
    saveAIResponse();
  }, [saveAIResponse]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim() && user?.id) {
      let threadId = currentThreadId;
      
      // Create thread if this is the first message
      if (!threadId) {
        try {
          threadId = await createThread({
            title: generateTitle(input),
            userId: user.id,
          });
          setCurrentThreadId(threadId);
          setConversationTitle(generateTitle(input));
          // Update URL with new thread ID
          router.push(pathname + '?' + createQueryString('thread', threadId));
        } catch (error) {
          return;
        }
      }
      
      // Add user message
      try {
        await addMessage({
          threadId,
          role: "user",
          content: input,
          parts: [{ type: "text", text: input }],
        });
      } catch (error) {
        console.error("Failed to add message:", error);
        // If thread doesn't exist, create a new one
        if (error instanceof Error && error.message.includes("Thread not found")) {
          try {
            const newThreadId = await createThread({
              title: generateTitle(input),
              userId: user.id,
            });
            setCurrentThreadId(newThreadId);
            setConversationTitle(generateTitle(input));
            router.push(pathname + '?' + createQueryString('thread', newThreadId));
            
            // Retry adding the message
            await addMessage({
              threadId: newThreadId,
              role: "user",
              content: input,
              parts: [{ type: "text", text: input }],
            });
          } catch (retryError) {
            console.error("Failed to create new thread:", retryError);
            return;
          }
        } else {
          return;
        }
      }
      
      sendMessage({ text: input });
      setInput('');
    }
  }, [input, user?.id, currentThreadId, createThread, addMessage, sendMessage, generateTitle, router, pathname, createQueryString]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

  const handleStepsHover = useCallback(() => {
    clockRef.current?.startAnimation();
  }, []);

  const handleStepsLeave = useCallback(() => {
    clockRef.current?.stopAnimation();
  }, []);

  const handleGraphHover = useCallback(() => {
    chartRef.current?.startAnimation();
  }, []);

  const handleGraphLeave = useCallback(() => {
    chartRef.current?.stopAnimation();
  }, []);

  const handleCopy = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      copyMessageToClipboard(message);
    }
  }, [messages]);

  const handleBookmarkWithAuth = useCallback(async () => {
    if (currentThreadId && user?.id) {
      await toggleBookmark({
        threadId: currentThreadId,
        userId: user.id,
        isBookmarked: true,
      });
      handleBookmark();
    }
  }, [currentThreadId, user?.id, toggleBookmark]);

  const handleSuggestionClickWithAuth = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

  return (
    <div className="bg-white flex flex-col h-full rounded-xl">
      <ChatHeader 
        title={conversationTitle}
        hasMessages={messages.length > 0}
        onBookmark={handleBookmarkWithAuth}
        onShare={handleShare}
      />
      
      {messages.length === 0 && (
        <EmptyState onSuggestionClick={handleSuggestionClickWithAuth} />
      )}

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
                      <PromptInputButton
                        variant="outline"
                        disabled
                        className="opacity-50"
                      >
                        <ClockIcon ref={clockRef} className="w-4 h-4" />
                        <span>Steps</span>
                      </PromptInputButton>
                      <PromptInputButton
                        variant="outline"
                        disabled
                        className="opacity-50"
                      >
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
