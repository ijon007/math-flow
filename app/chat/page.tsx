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
  const { user } = useUser();
  const { messages, sendMessage, status, stop, setMessages, regenerate } = useChat();
  const { activeTabs, toggleTab } = useTabManagement();
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

  // Function to save tool results to database
  const saveToolResult = useCallback(async (part: any) => {
    if (!currentThreadId || !user?.id) return;
    
    if (part.type?.startsWith('tool-create_') && part.output) {
      const toolType = part.type.replace('tool-create_', '');
      const output = part.output;
      
      // Save graph tools
      if (['function_graph', 'bar_chart', 'line_chart', 'scatter_plot', 'histogram', 'polar_graph', 'parametric_graph'].includes(toolType)) {
        try {
          await saveGraph({
            threadId: currentThreadId,
            userId: user.id,
            title: getGraphTitle(toolType, part.input),
            description: getGraphDescription(toolType, part.input, output),
            type: getGraphType(toolType),
            equation: getGraphEquation(toolType, part.input),
            data: output.data,
            config: output.config,
            metadata: output.metadata,
            tags: getGraphTags(toolType)
          });
          console.log(`${toolType} saved to database`);
        } catch (error) {
          console.error(`Error saving ${toolType}:`, error);
        }
      }
      
      // Save flashcard tools
      if (toolType === 'flashcards') {
        try {
          await saveFlashcards({
            threadId: currentThreadId,
            messageId: part.messageId,
            userId: user.id,
            topic: output.topic,
            difficulty: output.difficulty,
            subject: output.subject || 'Math',
            tags: getFlashcardTags(output.topic),
            cards: output.cards || []
          });
          console.log('flashcards saved to database');
        } catch (error) {
          console.error('Error saving flashcards:', error);
        }
      }
    }
  }, [currentThreadId, user?.id, saveGraph, saveFlashcards]);

  // Helper functions for graph metadata
  const getGraphTitle = (toolType: string, input: any) => {
    switch (toolType) {
      case 'function_graph': return `Function Graph: ${input.expression}`;
      case 'bar_chart': return 'Bar Chart';
      case 'line_chart': return 'Line Chart';
      case 'scatter_plot': return 'Scatter Plot';
      case 'histogram': return 'Histogram';
      case 'polar_graph': return `Polar Graph: ${input.expression}`;
      case 'parametric_graph': return 'Parametric Graph';
      default: return 'Graph';
    }
  };

  const getGraphDescription = (toolType: string, input: any, output: any) => {
    switch (toolType) {
      case 'function_graph': return `Graph of ${input.expression}`;
      case 'bar_chart': return `Bar chart with ${input.data?.length || 0} data points`;
      case 'line_chart': return `Line chart with ${input.data?.length || 0} data points`;
      case 'scatter_plot': return `Scatter plot with ${input.data?.length || 0} data points`;
      case 'histogram': return `Histogram with ${input.bins || 10} bins`;
      case 'polar_graph': return `Polar graph of ${input.expression}`;
      case 'parametric_graph': return `Parametric graph: x=${input.xExpression}, y=${input.yExpression}`;
      default: return 'Generated graph';
    }
  };

  const getGraphType = (toolType: string) => {
    switch (toolType) {
      case 'function_graph': return 'function';
      case 'bar_chart': return 'bar';
      case 'line_chart': return 'line';
      case 'scatter_plot': return 'scatter';
      case 'histogram': return 'histogram';
      case 'polar_graph': return 'polar';
      case 'parametric_graph': return 'parametric';
      default: return 'unknown';
    }
  };

  const getGraphEquation = (toolType: string, input: any) => {
    switch (toolType) {
      case 'function_graph': return input.expression;
      case 'polar_graph': return input.expression;
      case 'parametric_graph': return `x=${input.xExpression}, y=${input.yExpression}`;
      default: return undefined;
    }
  };

  const getGraphTags = (toolType: string) => {
    switch (toolType) {
      case 'function_graph': return ['function', 'graph', 'mathematics'];
      case 'bar_chart': return ['bar', 'chart', 'data'];
      case 'line_chart': return ['line', 'chart', 'trend'];
      case 'scatter_plot': return ['scatter', 'plot', 'correlation'];
      case 'histogram': return ['histogram', 'distribution', 'statistics'];
      case 'polar_graph': return ['polar', 'graph', 'mathematics'];
      case 'parametric_graph': return ['parametric', 'graph', 'mathematics'];
      default: return ['graph'];
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
    if (topicLower.includes('differential')) tags.push('differential-equations');
    if (topicLower.includes('integral')) tags.push('integrals');
    if (topicLower.includes('derivative')) tags.push('derivatives');
    
    return tags;
  };

  useEffect(() => {
    if (!messages.length || !currentThreadId || !user?.id || status !== 'ready') return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'assistant' || savedMessageIds.current.has(lastMessage.id)) return;
    
    savedMessageIds.current.add(lastMessage.id);
    
    lastMessage.parts.forEach((part: any) => {
      if (part.type?.startsWith('tool-create_')) {
        saveToolResult(part);
      }
    });
    
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
  }, [status, currentThreadId, user?.id, addMessage, saveToolResult]);

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