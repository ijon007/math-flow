'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, BarChart3, Terminal, Database, Code } from 'lucide-react';

// AI Elements imports
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

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();
  const [activeTab, setActiveTab] = useState<'steps' | 'graph'>('steps');

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Title */}
      <div className="py-8 px-4 mt-40">
        {/* Suggestions */}
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
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
                icon={<span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">F(x)</span>} 
                onClick={handleSuggestionClick} 
              />
              <Suggestion 
                suggestion="Find the derivative of x³ + 2x² - 5x + 1" 
                icon={<Database className="w-4 h-4" />} 
                onClick={handleSuggestionClick} 
              />
              <Suggestion 
                suggestion="Calculate the area under the curve y = x² from 0 to 2" 
                icon={<span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">∫</span>} 
                onClick={handleSuggestionClick} 
                isLast 
              />
            </Suggestions>
          </div>
        </div>
      </div>

      {/* Chat Conversation */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    if (part.type === 'text') {
                      return (
                        <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                          {part.text}
                        </div>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))}
            {status === 'submitted' && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <span>Thinking...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input Area */}
        <div className="py-4 flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Solve a problem..."
              />
              <PromptInputToolbar>
                <PromptInputTools>
                  <PromptInputButton
                    variant={activeTab === 'steps' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('steps')}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Steps</span>
                  </PromptInputButton>
                  <PromptInputButton
                    variant={activeTab === 'graph' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('graph')}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Graph</span>
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit disabled={false} status={status} />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
