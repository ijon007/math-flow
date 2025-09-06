'use client';

import { Terminal, Database } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-xl font-semibold text-neutral-900 mb-2">
          What are we exploring today?
        </h1>
        <Suggestions>
          <SignedIn>
            <Suggestion 
              suggestion="Solve this quadratic equation: x² + 5x + 6 = 0" 
              icon={<Terminal className="w-4 h-4" />} 
              onClick={onSuggestionClick} 
            />
            <Suggestion 
              suggestion="Graph the function f(x) = 2x + 3" 
              icon={<span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600">F(x)</span>} 
              onClick={onSuggestionClick} 
            />
            <Suggestion 
              suggestion="Find the derivative of x³ + 2x² - 5x + 1" 
              icon={<Database className="w-4 h-4" />} 
              onClick={onSuggestionClick} 
            />
            <Suggestion 
              suggestion="Calculate the area under the curve y = x² from 0 to 2" 
              icon={<span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600">∫</span>} 
              onClick={onSuggestionClick} 
              isLast 
            />
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <div className="cursor-pointer">
                <Suggestion 
                  suggestion="Solve this quadratic equation: x² + 5x + 6 = 0" 
                  icon={<Terminal className="w-4 h-4" />} 
                  onClick={() => {}} 
                />
              </div>
            </SignInButton>
            <SignInButton mode="modal">
              <div className="cursor-pointer">
                <Suggestion 
                  suggestion="Graph the function f(x) = 2x + 3" 
                  icon={<span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600">F(x)</span>} 
                  onClick={() => {}} 
                />
              </div>
            </SignInButton>
            <SignInButton mode="modal">
              <div className="cursor-pointer">
                <Suggestion 
                  suggestion="Find the derivative of x³ + 2x² - 5x + 1" 
                  icon={<Database className="w-4 h-4" />} 
                  onClick={() => {}} 
                />
              </div>
            </SignInButton>
            <SignInButton mode="modal">
              <div className="cursor-pointer">
                <Suggestion 
                  suggestion="Calculate the area under the curve y = x² from 0 to 2" 
                  icon={<span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600">∫</span>} 
                  onClick={() => {}} 
                  isLast 
                />
              </div>
            </SignInButton>
          </SignedOut>
        </Suggestions>
      </div>
    </div>
  );
}
