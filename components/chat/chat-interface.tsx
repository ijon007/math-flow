'use client';

import { useChat } from '@ai-sdk/react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { ChatHeader } from '@/components/chat/chat-header';
import { EmptyState } from '@/components/chat/empty-state';
import { LoadingMessage } from '@/components/chat/loading-message';
import { MessageList } from '@/components/chat/message-list';
import {
  ChartSplineIcon,
  type ChartSplineIconHandle,
} from '@/components/ui/chart-spline';
import { ClockIcon, type ClockIconHandle } from '@/components/ui/clock';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useTabManagement } from '@/hooks/use-tab-management';
import { useUserManagement } from '@/hooks/use-user-management';
import {
  copyMessageToClipboard,
  handleBookmark,
  handleShare,
} from '@/lib/chat-utils';
import { useRouter } from 'next/navigation';

// Helper function for step-by-step tags
const getStepByStepTags = (problem: string, method: string) => {
  const problemLower = problem.toLowerCase();
  const methodLower = method.toLowerCase();
  const tags = ['step-by-step', 'solution', 'mathematics'];

  // Problem-based tags
  if (problemLower.includes('algebra')) tags.push('algebra');
  if (problemLower.includes('calculus')) tags.push('calculus');
  if (problemLower.includes('geometry')) tags.push('geometry');
  if (problemLower.includes('trigonometry')) tags.push('trigonometry');
  if (problemLower.includes('statistics')) tags.push('statistics');
  if (problemLower.includes('probability')) tags.push('probability');
  if (problemLower.includes('linear')) tags.push('linear-algebra');
  if (problemLower.includes('differential'))
    tags.push('differential-equations');
  if (problemLower.includes('integral')) tags.push('integrals');
  if (problemLower.includes('derivative')) tags.push('derivatives');
  if (problemLower.includes('equation')) tags.push('equations');
  if (problemLower.includes('solve')) tags.push('solving');

  // Method-based tags
  if (methodLower.includes('factoring')) tags.push('factoring');
  if (methodLower.includes('quadratic')) tags.push('quadratic-formula');
  if (methodLower.includes('substitution')) tags.push('substitution');
  if (methodLower.includes('elimination')) tags.push('elimination');
  if (methodLower.includes('integration')) tags.push('integration');
  if (methodLower.includes('differentiation')) tags.push('differentiation');
  if (methodLower.includes('chain rule')) tags.push('chain-rule');
  if (methodLower.includes('product rule')) tags.push('product-rule');
  if (methodLower.includes('quotient rule')) tags.push('quotient-rule');

  return tags;
};

interface ChatInterfaceProps {
  threadId: Id<'threads'>;
}

export function ChatInterface({ threadId }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [conversationTitle, setConversationTitle] = useState('New Thread');
  const { user, isSignedIn } = useUserManagement();
  const { messages, sendMessage, status, stop, setMessages, regenerate } =
    useChat();
  const { activeTabs, toggleTab } = useTabManagement();
  const savedMessageIds = useRef<Set<string>>(new Set());
  const initialMessageSent = useRef<boolean>(false);
  const router = useRouter();

  const createThread = useMutation(api.threads.createThread);
  const addMessage = useMutation(api.messages.addMessage);
  const toggleBookmark = useMutation(api.threads.toggleBookmark);
  const saveGraph = useMutation(api.graphs.saveGraph);
  const saveFlashcards = useMutation(api.flashcards.saveFlashcards);
  const saveStepByStep = useMutation(api.stepByStep.saveStepByStep);

  const thread = useQuery(
    api.threads.getThread,
    threadId ? { threadId } : 'skip'
  );
  const threadMessages = useQuery(
    api.messages.getMessagesByThread,
    threadId ? { threadId } : 'skip'
  );

  const clockRef = useRef<ClockIconHandle>(null);
  const chartRef = useRef<ChartSplineIconHandle>(null);

  // Handle thread not found or access denied
  useEffect(() => {
    if (thread === null) {
      // Thread doesn't exist or user doesn't have access
      router.push('/chat');
    }
  }, [thread, router]);

  // Load messages from database
  useEffect(() => {
    if (threadMessages && threadMessages.length > 0) {
      const formattedMessages = threadMessages.map((msg) => ({
        id: msg._id,
        role: msg.role as 'user' | 'assistant' | 'system',
        parts: msg.parts as any,
        createdAt: new Date(msg.createdAt),
      }));
      setMessages(formattedMessages);
    } else if (threadId && threadMessages && threadMessages.length === 0) {
      setMessages([]);
    }
  }, [threadMessages, threadId, setMessages]);

  // Set conversation title
  useEffect(() => {
    if (thread?.title) {
      setConversationTitle(thread.title);
    }
  }, [thread?.title]);

  // Send initial message to AI if needed (only for new threads, not when loading existing ones)
  useEffect(() => {
    if (
      threadMessages &&
      threadMessages.length > 0 &&
      threadMessages[threadMessages.length - 1]?.role === 'user' &&
      !messages.some(m => m.role === 'assistant') &&
      status === 'ready' && // Only send when chat is ready
      !initialMessageSent.current && // Prevent multiple sends
      messages.length === 0 // Only send if no messages are loaded yet (new thread)
    ) {
      const lastUserMessage = threadMessages[threadMessages.length - 1];
      const enhancedInput = lastUserMessage.content;
      if (enhancedInput) {
        initialMessageSent.current = true;
        sendMessage({ text: enhancedInput });
      }
    }
  }, [threadMessages?.length, status, threadId, messages.length]);

  // Helper functions for graph metadata
  const getGraphTitle = (toolType: string, input: any) => {
    switch (toolType) {
      case 'create_function_graph':
        return `Function Graph: ${input.expression}`;
      case 'create_bar_chart':
        return 'Bar Chart';
      case 'create_line_chart':
        return 'Line Chart';
      case 'create_scatter_plot':
        return 'Scatter Plot';
      case 'create_histogram':
        return 'Histogram';
      case 'create_polar_graph':
        return `Polar Graph: ${input.expression}`;
      case 'create_parametric_graph':
        return 'Parametric Graph';
      default:
        return 'Graph';
    }
  };

  const getGraphDescription = (toolType: string, input: any, output: any) => {
    switch (toolType) {
      case 'create_function_graph':
        return `Graph of ${input.expression}`;
      case 'create_bar_chart':
        return `Bar chart with ${input.data?.length || 0} data points`;
      case 'create_line_chart':
        return `Line chart with ${input.data?.length || 0} data points`;
      case 'create_scatter_plot':
        return `Scatter plot with ${input.data?.length || 0} data points`;
      case 'create_histogram':
        return `Histogram with ${input.bins || 10} bins`;
      case 'create_polar_graph':
        return `Polar graph of ${input.expression}`;
      case 'create_parametric_graph':
        return `Parametric graph: x=${input.xExpression}, y=${input.yExpression}`;
      default:
        return 'Generated graph';
    }
  };

  const getGraphType = (toolType: string) => {
    switch (toolType) {
      case 'create_function_graph':
        return 'function';
      case 'create_bar_chart':
        return 'bar';
      case 'create_line_chart':
        return 'line';
      case 'create_scatter_plot':
        return 'scatter';
      case 'create_histogram':
        return 'histogram';
      case 'create_polar_graph':
        return 'polar';
      case 'create_parametric_graph':
        return 'parametric';
      default:
        return 'unknown';
    }
  };

  const getGraphEquation = (toolType: string, input: any) => {
    switch (toolType) {
      case 'create_function_graph':
        return input.expression;
      case 'create_polar_graph':
        return input.expression;
      case 'create_parametric_graph':
        return `x=${input.xExpression}, y=${input.yExpression}`;
      default:
        return;
    }
  };

  const getGraphTags = (toolType: string) => {
    switch (toolType) {
      case 'create_function_graph':
        return ['function', 'graph', 'mathematics'];
      case 'create_bar_chart':
        return ['bar', 'chart', 'data'];
      case 'create_line_chart':
        return ['line', 'chart', 'trend'];
      case 'create_scatter_plot':
        return ['scatter', 'plot', 'correlation'];
      case 'create_histogram':
        return ['histogram', 'distribution', 'statistics'];
      case 'create_polar_graph':
        return ['polar', 'graph', 'mathematics'];
      case 'create_parametric_graph':
        return ['parametric', 'graph', 'mathematics'];
      default:
        return ['graph'];
    }
  };

  const getFlashcardTags = (topic: string) => {
    const topicLower = topic.toLowerCase();
    const tags = ['flashcards', 'study', 'learning'];

    if (topicLower.includes('algebra')) tags.push('algebra');
    if (topicLower.includes('calculus')) tags.push('calculus');
    if (topicLower.includes('geometry')) tags.push('geometry');
    if (topicLower.includes('trigonometry')) tags.push('trigonometry');
    if (topicLower.includes('statistics')) tags.push('statistics');
    if (topicLower.includes('probability')) tags.push('probability');
    if (topicLower.includes('linear')) tags.push('linear-algebra');
    if (topicLower.includes('differential'))
      tags.push('differential-equations');
    if (topicLower.includes('integral')) tags.push('integrals');
    if (topicLower.includes('derivative')) tags.push('derivatives');

    return tags;
  };

  // Save AI responses and tool outputs
  useEffect(() => {
    if (!(messages.length && threadId && user?.id) || status !== 'ready')
      return;

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.role !== 'assistant' ||
      savedMessageIds.current.has(lastMessage.id)
    )
      return;

    savedMessageIds.current.add(lastMessage.id);

    lastMessage.parts.forEach((part: any) => {
      if (part.type?.startsWith('tool-') && part.output) {
        const toolType = part.type.replace('tool-', '');
        const output = part.output;

        if (
          [
            'create_function_graph',
            'create_bar_chart',
            'create_line_chart',
            'create_scatter_plot',
            'create_histogram',
            'create_polar_graph',
            'create_parametric_graph',
          ].includes(toolType)
        ) {
          saveGraph({
            threadId,
            userId: user.id,
            title: getGraphTitle(toolType, part.input),
            description: getGraphDescription(toolType, part.input, output),
            type: getGraphType(toolType),
            equation: getGraphEquation(toolType, part.input),
            data: output.data,
            config: output.config,
            metadata: output.metadata,
            tags: getGraphTags(toolType),
          }).catch((error) => {
            console.error(`Error saving ${toolType}:`, error);
          });
        }

        if (toolType === 'create_flashcards') {
          saveFlashcards({
            threadId,
            messageId: part.messageId,
            userId: user.id,
            topic: output.topic,
            difficulty: output.difficulty,
            subject: output.subject || 'Math',
            tags: getFlashcardTags(output.topic),
            cards: output.cards || [],
          }).catch((error) => {
            console.error('Error saving flashcards:', error);
          });
        }
      }
    });

    const textContent = lastMessage.parts
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join(' ');

    addMessage({
      threadId,
      role: 'assistant',
      content: textContent || 'AI Response',
      parts: lastMessage.parts,
    })
      .then((messageId) => {
        lastMessage.parts.forEach((part: any) => {
          if (part.type === 'tool-create_step_by_step' && part.output) {
            const output = part.output;
            saveStepByStep({
              threadId,
              messageId,
              userId: user.id,
              problem: output.problem,
              method: output.method,
              solution: output.solution,
              steps: output.steps || [],
              tags: getStepByStepTags(output.problem, output.method),
            }).catch((error) => {
              console.error('Error saving step-by-step solution:', error);
            });
          }
        });
      })
      .catch((error) => {
        console.error('Error saving AI message:', error);
      });
  }, [
    status,
    threadId,
    user?.id,
    addMessage,
    saveGraph,
    saveFlashcards,
    saveStepByStep,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!(input.trim() && user?.id)) return;

      try {
        await addMessage({
          threadId,
          role: 'user',
          content: input,
          parts: [{ type: 'text', text: input }],
        });
      } catch (error) {
        console.error('Failed to add message:', error);
        return;
      }

      // Create enhanced input with active tabs context
      let enhancedInput = input;
      if (activeTabs.has('steps')) {
        enhancedInput = `[STEPS MODE ENABLED] ${input}`;
      }
      if (activeTabs.has('graph')) {
        enhancedInput = `[GRAPH MODE ENABLED] ${input}`;
      }

      sendMessage({ text: enhancedInput });
      setInput('');
    },
    [input, user?.id, threadId, addMessage, sendMessage, activeTabs]
  );

  const handleCopy = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId);
      if (message) copyMessageToClipboard(message);
    },
    [messages]
  );

  const handleBookmarkWithAuth = useCallback(async () => {
    if (threadId && user?.id) {
      await toggleBookmark({
        threadId,
        userId: user.id,
        isBookmarked: true,
      });
      handleBookmark();
    }
  }, [threadId, user?.id, toggleBookmark]);

  // Show loading state while thread is being fetched
  if (thread === undefined) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00C48D] border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  // Don't render if thread is null (will redirect)
  if (thread === null) {
    return null;
  }

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <ChatHeader
        hasMessages={messages.length > 0}
        onBookmark={handleBookmarkWithAuth}
        onShare={handleShare}
        title={conversationTitle}
      />

      {messages.length === 0 && <EmptyState onSuggestionClick={setInput} />}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl px-0 py-4 lg:px-4">
            <Conversation>
              <ConversationContent className="px-2 lg:px-4">
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

      <div className="sticky bottom-0 z-10 mt-auto flex-shrink-0 rounded-xl bg-white">
        <div className="mx-auto w-full max-w-4xl px-2 py-4 lg:px-4">
          <div className="mx-auto w-full max-w-2xl">
            <SignedIn>
              <PromptInput onSubmit={handleSubmit}>
                <PromptInputTextarea
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Solve a problem..."
                  value={input}
                />
                <PromptInputToolbar>
                  <PromptInputTools>
                    <PromptInputButton
                      className={
                        activeTabs.has('steps')
                          ? 'border-[#00C48D] text-[#00C48D] hover:bg-[#00C48D]/10 hover:text-[#00C48D]'
                          : ''
                      }
                      onClick={() => toggleTab('steps')}
                      onMouseEnter={() => clockRef.current?.startAnimation()}
                      onMouseLeave={() => clockRef.current?.stopAnimation()}
                      variant="outline"
                    >
                      <ClockIcon className="h-4 w-4" ref={clockRef} />
                      <span>Steps</span>
                    </PromptInputButton>
                    <PromptInputButton
                      className={
                        activeTabs.has('graph')
                          ? 'border-[#00C48D] text-[#00C48D] hover:bg-[#00C48D]/10 hover:text-[#00C48D]'
                          : ''
                      }
                      onClick={() => toggleTab('graph')}
                      onMouseEnter={() => chartRef.current?.startAnimation()}
                      onMouseLeave={() => chartRef.current?.stopAnimation()}
                      variant="outline"
                    >
                      <ChartSplineIcon className="h-4 w-4" ref={chartRef} />
                      <span>Graph</span>
                    </PromptInputButton>
                  </PromptInputTools>
                  <PromptInputSubmit
                    className={
                      status === 'streaming'
                        ? 'bg-destructive hover:bg-destructive/80'
                        : 'bg-[#00C48D] hover:bg-[#00C48D]/80'
                    }
                    disabled={false}
                    onClick={status === 'streaming' ? stop : undefined}
                    status={status}
                  />
                </PromptInputToolbar>
              </PromptInput>
            </SignedIn>

            <SignedOut>
              <PromptInput onSubmit={(e) => e.preventDefault()}>
                <PromptInputTextarea
                  disabled
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Sign in to start solving problems..."
                  value={input}
                />
                <PromptInputToolbar>
                  <PromptInputTools>
                    <PromptInputButton
                      className="opacity-50"
                      disabled
                      variant="outline"
                    >
                      <ClockIcon className="h-4 w-4" ref={clockRef} />
                      <span>Steps</span>
                    </PromptInputButton>
                    <PromptInputButton
                      className="opacity-50"
                      disabled
                      variant="outline"
                    >
                      <ChartSplineIcon className="h-4 w-4" ref={chartRef} />
                      <span>Graph</span>
                    </PromptInputButton>
                  </PromptInputTools>
                  <SignInButton mode="modal">
                    <button className="rounded-md bg-[#00C48D] px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-[#00C48D]/80">
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
