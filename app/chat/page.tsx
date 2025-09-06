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

  console.log('DashboardPage rendered, user:', user?.id, 'currentThreadId:', currentThreadId);

  // Convex mutations
  const createThread = useMutation(api.threads.createThread);
  const addMessage = useMutation(api.messages.addMessage);
  const saveGraph = useMutation(api.graphs.saveGraph);
  const saveFlashcards = useMutation(api.flashcards.saveFlashcards);
  const saveStepByStep = useMutation(api.stepByStep.saveStepByStep);
  const toggleBookmark = useMutation(api.threads.toggleBookmark);
  
  const clockRef = useRef<ClockIconHandle>(null);
  const chartRef = useRef<ChartSplineIconHandle>(null);

  const generateTitle = (message: string): string => {
    const cleanMessage = message.trim();
    
    const words = cleanMessage.split(/\s+/).filter(word => word.length > 0);
    const title = words.slice(0, 3).join(' ');
    
    return title || 'New Thread';
  };

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'user') {
      const firstMessage = messages[0].parts.find(part => part.type === 'text')?.text || '';
      if (firstMessage) {
        setConversationTitle(generateTitle(firstMessage));
      }
    }
  }, [messages]);

  // Save AI responses and extract tool outputs
  const saveAIResponse = useCallback(async () => {
    if (messages.length > 0 && currentThreadId && user?.id) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !savedMessageIds.current.has(lastMessage.id)) {
        console.log('Saving AI response to thread:', currentThreadId);
        // Mark this message as saved
        savedMessageIds.current.add(lastMessage.id);
        
        // Save the assistant message
        await addMessage({
          threadId: currentThreadId,
          role: "assistant",
          parts: lastMessage.parts,
        });
        console.log('AI response saved');
        
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
              console.error('Error saving tool output:', error);
            }
          }
        }
      }
    }
  }, [messages.length, currentThreadId, user?.id]);

  useEffect(() => {
    saveAIResponse();
  }, [saveAIResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, input:', input, 'user:', user?.id);
    
    if (input.trim() && user?.id) {
      let threadId = currentThreadId;
      
      // Create thread if this is the first message
      if (!threadId) {
        console.log('Creating new thread...');
        try {
          threadId = await createThread({
            title: generateTitle(input),
            userId: user.id,
          });
          console.log('Thread created:', threadId);
          setCurrentThreadId(threadId);
          setConversationTitle(generateTitle(input));
        } catch (error) {
          console.error('Error creating thread:', error);
          return;
        }
      }
      
      // Add user message
      console.log('Saving user message to thread:', threadId);
      try {
        await addMessage({
          threadId,
          role: "user",
          content: input,
          parts: [{ type: "text", text: input }],
        });
        console.log('User message saved');
      } catch (error) {
        console.error('Error saving user message:', error);
        return;
      }
      
      sendMessage({ text: input });
      setInput('');
    } else {
      console.log('Form submission blocked - no input or user not authenticated');
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

  const handleBookmarkWithAuth = async () => {
    if (currentThreadId && user?.id) {
      await toggleBookmark({
        threadId: currentThreadId,
        userId: user.id,
        isBookmarked: true,
      });
      handleBookmark();
    }
  };

  const handleSuggestionClickWithAuth = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleSubmitWithAuth = handleSubmit;

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
              <PromptInput onSubmit={handleSubmitWithAuth}>
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
