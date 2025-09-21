import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import {
  type ChartSplineIconHandle,
} from '@/components/ui/chart-spline';
import { type ClockIconHandle } from '@/components/ui/clock';
import { type FlaskIconHandle } from '../ui/flask';
import { type BookTextIconHandle } from '@/components/ui/book-text';
import { type LayersIconHandle } from '../ui/layers';
import { ToolsDropdown } from './tools-dropdown';
import type { TabType } from '@/hooks/use-tab-management';

interface ChatInputAreaProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  stop: () => void;
  activeTabs: Set<TabType>;
  toggleTab: (tab: 'steps' | 'graph' | 'test' | 'guide' | 'flashcards') => void;
  clockRef: React.RefObject<ClockIconHandle | null>;
  chartRef: React.RefObject<ChartSplineIconHandle | null>;
  flaskRef: React.RefObject<FlaskIconHandle | null>;
  bookRef: React.RefObject<BookTextIconHandle | null>;
  flashcardsRef: React.RefObject<LayersIconHandle | null>;
}

export function ChatInputArea({
  input,
  setInput,
  onSubmit,
  status,
  stop,
  activeTabs,
  toggleTab,
  clockRef,
  chartRef,
  flaskRef,
  bookRef,
  flashcardsRef,
}: ChatInputAreaProps) {
  const { hasReachedLimit, isPro } = useUsageLimits();
  const hasReachedMessageLimit = hasReachedLimit('aiMessages');
  return (
    <div className="sticky bottom-0 z-10 mt-auto flex-shrink-0 rounded-xl bg-white">
      <div className="mx-auto w-full max-w-4xl px-2 py-4 lg:px-4">
        <div className="mx-auto w-full max-w-2xl">
          <SignedIn>
            <PromptInput onSubmit={onSubmit}>
              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  hasReachedMessageLimit && !isPro
                    ? "Daily message limit reached. Upgrade to Pro for unlimited messages."
                    : "Solve a problem..."
                }
                value={input}
                disabled={hasReachedMessageLimit && !isPro}
              />
              <PromptInputToolbar>
                <ToolsDropdown
                  activeTabs={activeTabs}
                  toggleTab={toggleTab}
                  clockRef={clockRef}
                  chartRef={chartRef}
                  flaskRef={flaskRef}
                  bookRef={bookRef}
                  flashcardsRef={flashcardsRef}
                  disabled={hasReachedMessageLimit && !isPro}
                />
                <PromptInputSubmit
                  className={
                    status === 'streaming'
                      ? 'bg-destructive hover:bg-destructive/80'
                      : hasReachedMessageLimit && !isPro
                      ? 'bg-neutral-400 cursor-not-allowed'
                      : 'bg-[#00C48D] hover:bg-[#00C48D]/80'
                  }
                  disabled={hasReachedMessageLimit && !isPro}
                  onClick={status === 'streaming' ? stop : undefined}
                  status={status}
                />
              </PromptInputToolbar>
            </PromptInput>
            {hasReachedMessageLimit && !isPro && (
              <div className="mt-2 text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Daily message limit reached. Upgrade to Pro for unlimited messages.
                </p>
              </div>
            )}
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
                  flashcardsRef={flashcardsRef}
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
  );
}
