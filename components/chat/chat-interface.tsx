'use client';

import { useChat } from '@ai-sdk/react';
import { useMutation, useQuery } from 'convex/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatLoadingState } from '@/components/chat/chat-loading-state';
import { ChatMessagesArea } from '@/components/chat/chat-messages-area';
import { ChatInputArea } from '@/components/chat/chat-input-area';
import {
  type ChartSplineIconHandle,
} from '@/components/ui/chart-spline';
import { type ClockIconHandle } from '@/components/ui/clock';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useTabManagement } from '@/hooks/use-tab-management';
import { useUserManagement } from '@/hooks/use-user-management';
import {
  copyMessageToClipboard,
  handleShare,
} from '@/lib/chat/chat-utils';
import {
  getStepByStepTags,
  getGraphTitle,
  getGraphDescription,
  getGraphType,
  getGraphEquation,
  getGraphTags,
  getFlashcardTags,
} from '@/lib/chat/chat-interface-utils';
import { useRouter } from 'next/navigation';

interface ChatInterfaceProps {
  threadId: Id<'threads'>;
}

export function ChatInterface({ threadId }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [conversationTitle, setConversationTitle] = useState('New Thread');
  const { user } = useUserManagement();
  const { messages, sendMessage, status, stop, setMessages, regenerate } = useChat();
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

  useEffect(() => {
    if (thread === null) {
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
      !threadMessages.some(m => m.role === 'assistant') && // Check database messages, not current state
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
    if (threadId && user?.id && thread) {
      const newBookmarkState = !thread.isBookmarked;
      await toggleBookmark({
        threadId,
        userId: user.id,
        isBookmarked: newBookmarkState,
      });
      if (newBookmarkState) {
        toast.success('Thread bookmarked');
      } else {
        toast.success('Thread removed from bookmarks');
      }
    }
  }, [threadId, user?.id, thread, toggleBookmark]);

  // Show loading state while thread is being fetched
  if (thread === undefined) {
    return <ChatLoadingState />;
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
        isBookmarked={thread.isBookmarked}
      />

      <ChatMessagesArea
        messages={messages}
        status={status}
        onCopy={handleCopy}
        onRegenerate={regenerate}
        onSuggestionClick={setInput}
        user={user}
      />

      <ChatInputArea
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        status={status}
        stop={stop}
        activeTabs={activeTabs}
        toggleTab={toggleTab}
        clockRef={clockRef}
        chartRef={chartRef}
      />
    </div>
  );
}
