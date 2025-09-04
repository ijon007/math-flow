'use client';

import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

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
        'flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-neutral-200/60 transition-colors rounded-lg',
        !isLast && 'border-b border-neutral-200',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {icon && (
        <div className="flex-shrink-0 text-neutral-600 w-6 flex justify-center">
          {icon}
        </div>
      )}
      <span className="text-neutral-800 text-sm flex-1 text-left">
        {suggestion}
      </span>
    </div>
  );
};
