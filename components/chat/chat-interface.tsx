'use client';

import { useChat } from '@ai-sdk/react';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInputArea } from '@/components/chat/chat-input-area';
import { ChatLoadingState } from '@/components/chat/chat-loading-state';
import { ChatMessagesArea } from '@/components/chat/chat-messages-area';
import type { ChartSplineIconHandle } from '@/components/ui/chart-spline';
import type { ClockIconHandle } from '@/components/ui/clock';
import type { FlaskIconHandle } from '@/components/ui/flask';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useTabManagement } from '@/hooks/use-tab-management';
import { useUserManagement } from '@/hooks/use-user-management';
import {
  getFlashcardTags,
  getGraphDescription,
  getGraphEquation,
  getGraphTags,
  getGraphTitle,
  getGraphType,
  getPracticeTestTags,
  getStepByStepTags,
} from '@/lib/chat/chat-interface-utils';
import { copyMessageToClipboard, handleShare } from '@/lib/chat/chat-utils';

interface ChatInterfaceProps {
  threadId: Id<'threads'>;
}

export function ChatInterface({ threadId }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [conversationTitle, setConversationTitle] = useState('New Thread');
  const { user } = useUserManagement();
  const { messages, sendMessage, status, stop, setMessages, regenerate } =
    useChat();
  const { activeTabs, toggleTab } = useTabManagement();
  const savedMessageIds = useRef<Set<string>>(new Set());
  const initialMessageSent = useRef<boolean>(false);
  const router = useRouter();

  const createThread = useMutation(api.threads.createThread);
  const addMessage = useMutation(api.messages.addMessage);
  const toggleBookmark = useMutation(api.threads.toggleBookmark);
  const shareThread = useMutation(api.threads.shareThread);
  const unshareThread = useMutation(api.threads.unshareThread);
  const saveGraph = useMutation(api.graphs.saveGraph);
  const saveFlashcards = useMutation(api.flashcards.saveFlashcards);
  const saveStepByStep = useMutation(api.stepByStep.saveStepByStep);
  const savePracticeTest = useMutation(api.practiceTests.savePracticeTest);

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
  const flaskRef = useRef<FlaskIconHandle>(null);

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
      !threadMessages.some((m) => m.role === 'assistant') && // Check database messages, not current state
      status === 'ready' && // Only send when chat is ready
      !initialMessageSent.current && // Prevent multiple sends
      messages.length === 0 // Only send if no messages are loaded yet (new thread)
    ) {
      const lastUserMessage = threadMessages[threadMessages.length - 1];
      const originalInput = lastUserMessage.content;
      
      // Create enhanced input with active tabs context for AI
      let enhancedInput = originalInput;
      if (activeTabs.has('steps')) {
        enhancedInput = `[STEPS MODE ENABLED] ${originalInput}`;
      }
      if (activeTabs.has('graph')) {
        enhancedInput = `[GRAPH MODE ENABLED] ${originalInput}`;
      }
      if (activeTabs.has('test')) {
        enhancedInput = `[TEST MODE ENABLED] ${originalInput}`;
      }
      
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

        if (toolType === 'create_practice_test') {
          savePracticeTest({
            threadId,
            messageId: part.messageId,
            userId: user.id,
            title: output.title,
            description: output.description,
            subject: output.subject,
            difficulty: output.difficulty,
            questionCount: output.questionCount,
            timeLimit: output.timeLimit,
            questions: output.questions || [],
            tags: getPracticeTestTags(output.subject, output.title),
            isPublic: false,
            settings: output.settings,
          }).catch((error) => {
            console.error('Error saving practice test:', error);
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
      if (activeTabs.has('test')) {
        enhancedInput = `[TEST MODE ENABLED] ${input}`;
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

  const handleToggleShare = useCallback(async () => {
    if (threadId && user?.id && thread) {
      try {
        if (thread.isShared) {
          await unshareThread({
            threadId,
            userId: user.id,
          });
          toast.success('Thread is no longer shared');
        } else {
          await shareThread({
            threadId,
            userId: user.id,
          });
          toast.success('Thread is now shareable');
        }
      } catch (error) {
        console.error('Failed to toggle share:', error);
        toast.error('Failed to update sharing status');
      }
    }
  }, [threadId, user?.id, thread, shareThread, unshareThread]);

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
        isBookmarked={thread.isBookmarked}
        isShared={thread.isShared}
        onBookmark={handleBookmarkWithAuth}
        onShare={handleShare}
        onToggleShare={handleToggleShare}
        threadId={threadId}
        title={conversationTitle}
      />

      <ChatMessagesArea
        messages={messages}
        onCopy={handleCopy}
        onRegenerate={regenerate}
        onSuggestionClick={setInput}
        status={status}
        user={user}
        threadId={threadId}
      />

      <ChatInputArea
        activeTabs={activeTabs}
        chartRef={chartRef}
        clockRef={clockRef}
        flaskRef={flaskRef}
        input={input}
        onSubmit={handleSubmit}
        setInput={setInput}
        status={status}
        stop={stop}
        toggleTab={toggleTab}
      />
    </div>
  );
}
