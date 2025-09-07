'use client';

import { type ComponentProps, memo } from 'react';
import { Streamdown } from 'streamdown';
import {
  extractMathExpressions,
  MathExpression,
} from '@/components/ui/math-expression';
import { cn } from '@/lib/utils';

type MathResponseProps = ComponentProps<typeof Streamdown>;

function MathTextRenderer({ children }: { children: string }) {
  const parts = extractMathExpressions(children);

  return (
    <>
      {parts.map((part, index) =>
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
    </>
  );
}

export const MathResponse = memo(
  ({ className, children, ...props }: MathResponseProps) => {
    // If children is a string, render with math support
    if (typeof children === 'string') {
      return (
        <div
          className={cn(
            'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
            className
          )}
          {...props}
        >
          <MathTextRenderer>{children}</MathTextRenderer>
        </div>
      );
    }

    // For other content, use the original Streamdown
    return (
      <Streamdown
        className={cn(
          'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
          className
        )}
        {...props}
      >
        {children}
      </Streamdown>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

MathResponse.displayName = 'MathResponse';
