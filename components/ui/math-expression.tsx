'use client';

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface MathExpressionProps {
  expression: string;
  inline?: boolean;
  className?: string;
  errorClassName?: string;
}

export function MathExpression({ 
  expression, 
  inline = true, 
  className,
  errorClassName = "text-red-500 text-sm"
}: MathExpressionProps) {
  if (!expression?.trim()) {
    return null;
  }

  try {
    const MathComponent = inline ? InlineMath : BlockMath;
    return (
      <span className={cn(className)}>
        <MathComponent math={expression} />
      </span>
    );
  } catch (error) {
    // Fallback to plain text if LaTeX parsing fails
    return (
      <span className={cn("font-mono text-sm", errorClassName)}>
        {expression}
      </span>
    );
  }
}

// Helper function to detect if a string contains math expressions
export function containsMath(text: string): boolean {
  if (!text) return false;
  
  // Common math patterns
  const mathPatterns = [
    /\$[^$]+\$/, // Inline math $...$
    /\$\$[^$]+\$\$/, // Block math $$...$$
    /\\[a-zA-Z]+\(/, // LaTeX functions like \sin(, \cos(, etc.
    /\^[0-9]/, // Superscripts
    /_[0-9]/, // Subscripts
    /[∫∑∏√∞±≤≥≠≈]/, // Math symbols
    /[α-ωΑ-Ω]/, // Greek letters
  ];
  
  return mathPatterns.some(pattern => pattern.test(text));
}

// Helper function to extract math expressions from text
export function extractMathExpressions(text: string): { text: string; isMath: boolean }[] {
  if (!text) return [];
  
  const parts: { text: string; isMath: boolean }[] = [];
  let currentText = text;
  
  // Handle block math $$...$$
  const blockMathRegex = /\$\$([^$]+)\$\$/g;
  let blockMatch;
  while ((blockMatch = blockMathRegex.exec(text)) !== null) {
    const before = currentText.substring(0, blockMatch.index);
    if (before) {
      parts.push({ text: before, isMath: false });
    }
    parts.push({ text: blockMatch[1], isMath: true });
    currentText = currentText.substring(blockMatch.index + blockMatch[0].length);
  }
  
  // Handle inline math $...$
  const inlineMathRegex = /\$([^$]+)\$/g;
  let inlineMatch;
  while ((inlineMatch = inlineMathRegex.exec(currentText)) !== null) {
    const before = currentText.substring(0, inlineMatch.index);
    if (before) {
      parts.push({ text: before, isMath: false });
    }
    parts.push({ text: inlineMatch[1], isMath: true });
    currentText = currentText.substring(inlineMatch.index + inlineMatch[0].length);
  }
  
  // Add remaining text
  if (currentText) {
    parts.push({ text: currentText, isMath: false });
  }
  
  return parts;
}
