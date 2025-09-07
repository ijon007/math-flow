'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Database, Terminal } from 'lucide-react';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-2 font-semibold text-neutral-900 text-xl">
          What are we exploring today?
        </h1>
        <Suggestions>
          <SignedIn>
            <Suggestion
              icon={<Terminal className="h-4 w-4" />}
              onClick={onSuggestionClick}
              suggestion="Solve this quadratic equation: x² + 5x + 6 = 0"
            />
            <Suggestion
              icon={
                <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-neutral-600 text-xs">
                  F(x)
                </span>
              }
              onClick={onSuggestionClick}
              suggestion="Graph the function f(x) = 2x + 3"
            />
            <Suggestion
              icon={<Database className="h-4 w-4" />}
              onClick={onSuggestionClick}
              suggestion="Find the derivative of x³ + 2x² - 5x + 1"
            />
            <Suggestion
              icon={
                <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-neutral-600 text-xs">
                  ∫
                </span>
              }
              isLast
              onClick={onSuggestionClick}
              suggestion="Calculate the area under the curve y = x² from 0 to 2"
            />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <div className="cursor-pointer">
                <Suggestion
                  icon={<Terminal className="h-4 w-4" />}
                  onClick={() => {}}
                  suggestion="Solve this quadratic equation: x² + 5x + 6 = 0"
                />
              </div>
            </SignInButton>
            <SignInButton mode="modal">
              <div className="cursor-pointer">
                <Suggestion
                  icon={
                    <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-neutral-600 text-xs">
                      F(x)
                    </span>
                  }
                  onClick={() => {}}
                  suggestion="Graph the function f(x) = 2x + 3"
                />
              </div>
            </SignInButton>
            <SignInButton mode="modal">
              <div className="cursor-pointer">
                <Suggestion
                  icon={<Database className="h-4 w-4" />}
                  onClick={() => {}}
                  suggestion="Find the derivative of x³ + 2x² - 5x + 1"
                />
              </div>
            </SignInButton>
            <SignInButton mode="modal">
              <div className="cursor-pointer">
                <Suggestion
                  icon={
                    <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-neutral-600 text-xs">
                      ∫
                    </span>
                  }
                  isLast
                  onClick={() => {}}
                  suggestion="Calculate the area under the curve y = x² from 0 to 2"
                />
              </div>
            </SignInButton>
          </SignedOut>
        </Suggestions>
      </div>
    </div>
  );
}
