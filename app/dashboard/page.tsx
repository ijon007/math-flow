'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef } from 'react';
import { Terminal, Database } from 'lucide-react';
import { toast } from 'sonner';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { Actions, Action } from '@/components/ai-elements/actions';
import { ClockIcon, type ClockIconHandle } from '@/components/ui/clock';
import { ChartSplineIcon, type ChartSplineIconHandle } from '@/components/ui/chart-spline';
import { Response } from '@/components/ai-elements/response';

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop, setMessages, regenerate } = useChat();
  const [activeTabs, setActiveTabs] = useState<Set<'steps' | 'graph'>>(new Set(['steps']));
  
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

  const toggleTab = (tab: 'steps' | 'graph') => {
    setActiveTabs(prev => {
      const newTabs = new Set(prev);
      if (newTabs.has(tab)) {
        newTabs.delete(tab);
      } else {
        newTabs.add(tab);
      }
      return newTabs;
    });
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
      const text = message.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('');
      navigator.clipboard.writeText(text);
      toast.success('Message copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Title */}
      <div className="py-8 px-4 mt-40">
        {/* Suggestions - only show when no messages */}
        {messages.length === 0 && (
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-2xl">
              <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                What are we exploring today?
              </h1>
              <Suggestions>
                <Suggestion 
                  suggestion="Solve this quadratic equation: x² + 5x + 6 = 0" 
                  icon={<Terminal className="w-4 h-4" />} 
                  onClick={handleSuggestionClick} 
                />
                <Suggestion 
                  suggestion="Graph the function f(x) = 2x + 3" 
                  icon={<span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600">F(x)</span>} 
                  onClick={handleSuggestionClick} 
                />
                <Suggestion 
                  suggestion="Find the derivative of x³ + 2x² - 5x + 1" 
                  icon={<Database className="w-4 h-4" />} 
                  onClick={handleSuggestionClick} 
                />
                <Suggestion 
                  suggestion="Calculate the area under the curve y = x² from 0 to 2" 
                  icon={<span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600">∫</span>} 
                  onClick={handleSuggestionClick} 
                  isLast 
                />
              </Suggestions>
            </div>
          </div>
        )}
      </div>

      {/* Chat Conversation */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 relative">
        <Conversation className="flex-1 pb-32">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id} className="w-full">
                <Message from={message.role}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      if (part.type === 'text') {
                        return (
                          <Response key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                            {part.text}
                          </Response>
                        );
                      }
                      return null;
                    })}
                  </MessageContent>
                </Message>
                {message.role === 'assistant' && (
                  <div className="flex justify-start mt-1">
                    <Actions>
                      <Action 
                        tooltip="Copy" 
                        label="Copy"
                        onClick={() => handleCopy(message.id)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </Action>
                      <Action 
                        tooltip="Regenerate" 
                        label="Regenerate"
                        onClick={() => regenerate()}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </Action>
                    </Actions>
                  </div>
                )}
              </div>
            ))}
            {status === 'submitted' && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
                    <span>Thinking...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Fixed Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-white py-4 px-4 z-10">
          <div className="max-w-4xl mx-auto">
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
    </div>
  );
}
