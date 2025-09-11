import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import {
  ChartSplineIcon,
  type ChartSplineIconHandle,
} from '@/components/ui/chart-spline';
import { ClockIcon, type ClockIconHandle } from '@/components/ui/clock';
import { FlaskIcon, type FlaskIconHandle } from '../ui/flask';
import { BookTextIcon, type BookTextIconHandle } from '@/components/ui/book-text';
import { ToolsDropdown } from './tools-dropdown';

interface ChatInputAreaProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  stop: () => void;
  activeTabs: Set<string>;
  toggleTab: (tab: 'steps' | 'graph' | 'test' | 'guide') => void;
  clockRef: React.RefObject<ClockIconHandle | null>;
  chartRef: React.RefObject<ChartSplineIconHandle | null>;
  flaskRef: React.RefObject<FlaskIconHandle | null>;
  bookRef: React.RefObject<BookTextIconHandle | null>;
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
}: ChatInputAreaProps) {
  return (
    <div className="sticky bottom-0 z-10 mt-auto flex-shrink-0 rounded-xl bg-white">
      <div className="mx-auto w-full max-w-4xl px-2 py-4 lg:px-4">
        <div className="mx-auto w-full max-w-2xl">
          <SignedIn>
            <PromptInput onSubmit={onSubmit}>
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
  );
}
