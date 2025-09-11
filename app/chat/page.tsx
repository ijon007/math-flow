'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import { ChatHeader } from '@/components/chat/chat-header';
import { EmptyState } from '@/components/chat/empty-state';
import {
  ChartSplineIcon,
  type ChartSplineIconHandle,
} from '@/components/ui/chart-spline';
import { ClockIcon, type ClockIconHandle } from '@/components/ui/clock';
import { api } from '@/convex/_generated/api';
import { useTabManagement } from '@/hooks/use-tab-management';
import { useUserManagement } from '@/hooks/use-user-management';
import { FlaskIcon, type FlaskIconHandle } from '@/components/ui/flask';
import { BookTextIcon, type BookTextIconHandle } from '@/components/ui/book-text';
import { ToolsDropdown } from '@/components/chat/tools-dropdown';

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const { user } = useUserManagement();
  const { activeTabs, toggleTab } = useTabManagement();
  const router = useRouter();

  const createThreadWithMessage = useMutation(
    api.threads.createThreadWithMessage
  );

  const clockRef = useRef<ClockIconHandle>(null);
  const chartRef = useRef<ChartSplineIconHandle>(null);
  const flaskRef = useRef<FlaskIconHandle>(null);
  const bookRef = useRef<BookTextIconHandle>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!(input.trim() && user?.id)) return;

      try {
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
        if (activeTabs.has('guide')) {
          enhancedInput = `[GUIDE MODE ENABLED] ${input}`;
        }

        const threadId = await createThreadWithMessage({
          title: 'New Thread',
          userId: user.id,
          messageContent: input, // Store original user input
          messageParts: [{ type: 'text', text: input }], // Store original user input
        });

        router.push(`/chat/${threadId}`);
      } catch (error) {
        console.error('Failed to create thread with message:', error);
      }
    },
    [input, user?.id, createThreadWithMessage, router, activeTabs]
  );

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <ChatHeader title="New Thread" />
      <EmptyState onSuggestionClick={setInput} />

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
                  <ToolsDropdown
                    activeTabs={activeTabs}
                    toggleTab={toggleTab}
                    clockRef={clockRef}
                    chartRef={chartRef}
                    flaskRef={flaskRef}
                    bookRef={bookRef}
                  />
                  <PromptInputSubmit
                    className="bg-[#00C48D] hover:bg-[#00C48D]/80"
                    disabled={false}
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
                  <ToolsDropdown
                    activeTabs={new Set()}
                    toggleTab={() => {}}
                    clockRef={clockRef}
                    chartRef={chartRef}
                    flaskRef={flaskRef}
                    bookRef={bookRef}
                    disabled
                  />
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
