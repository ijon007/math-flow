'use client';

import type { ComponentProps } from 'react';
import {
  extractMathExpressions,
  MathExpression,
} from '@/components/ui/math-expression';
import { cn } from '@/lib/utils';

export type SuggestionsProps = ComponentProps<'div'>;

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => (
  <div className={cn('w-full space-y-0', className)} {...props}>
    {children}
  </div>
);

export type SuggestionProps = Omit<ComponentProps<'div'>, 'onClick'> & {
  suggestion: string;
  icon?: React.ReactNode;
  onClick?: (suggestion: string) => void;
  isLast?: boolean;
};

export const Suggestion = ({
  suggestion,
  icon,
  onClick,
  className,
  isLast = false,
  ...props
}: SuggestionProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick?.(suggestion);
  };

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-4 rounded-lg px-4 py-4 transition-colors hover:bg-neutral-200/60',
        !isLast && 'border-neutral-200 border-b',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {icon && (
        <div className="flex w-6 flex-shrink-0 justify-center text-neutral-600">
          {icon}
        </div>
      )}
      <span className="flex-1 text-left text-neutral-800 text-sm">
        {extractMathExpressions(suggestion).map((part, index) =>
          part.isMath ? (
            <MathExpression
              className="text-inherit"
              expression={part.text}
              inline={true}
              key={index}
            />
          ) : (
            <span key={index}>{part.text}</span>
          )
        )}
      </span>
    </div>
  );
};
