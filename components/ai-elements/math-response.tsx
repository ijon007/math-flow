'use client';

import { cn } from '@/lib/utils';
import { type ComponentProps, memo } from 'react';
import { Streamdown } from 'streamdown';
import { MathExpression, extractMathExpressions } from '@/components/ui/math-expression';

type MathResponseProps = ComponentProps<typeof Streamdown>;

function MathTextRenderer({ children }: { children: string }) {
  const parts = extractMathExpressions(children);
  
  return (
    <>
      {parts.map((part, index) => (
        part.isMath ? (
          <MathExpression 
            key={index}
            expression={part.text}
            inline={true}
            className="text-inherit"
          />
        ) : (
          <span key={index}>{part.text}</span>
        )
      ))}
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
