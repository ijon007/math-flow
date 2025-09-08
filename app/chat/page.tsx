'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useCallback, useRef, useState } from 'react';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import {
  ChartSplineIcon,
  type ChartSplineIconHandle,
} from '@/components/ui/chart-spline';
import { ClockIcon, type ClockIconHandle } from '@/components/ui/clock';
import { api } from '@/convex/_generated/api';
import { EmptyState } from '@/components/chat/empty-state';
import { useTabManagement } from '@/hooks/use-tab-management';
import { useUserManagement } from '@/hooks/use-user-management';
import { useRouter } from 'next/navigation';


export default function DashboardPage() {
  const [input, setInput] = useState('');
  const { user, isSignedIn } = useUserManagement();
  const { activeTabs, toggleTab } = useTabManagement();
  const router = useRouter();


  const createThreadWithMessage = useMutation(api.threads.createThreadWithMessage);

  const clockRef = useRef<ClockIconHandle>(null);
  const chartRef = useRef<ChartSplineIconHandle>(null);



  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!(input.trim() && user?.id)) return;

      try {
        const threadId = await createThreadWithMessage({
          title: input.split(' ').slice(0, 3).join(' ') || 'New Thread',
          userId: user.id,
          messageContent: input,
          messageParts: [{ type: 'text', text: input }],
        });

        router.push(`/chat/${threadId}`);
      } catch (error) {
        console.error('Failed to create thread with message:', error);
      }
    },
    [input, user?.id, createThreadWithMessage, router]
  );


  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
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
