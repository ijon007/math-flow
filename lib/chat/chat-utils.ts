import { toast } from 'sonner';

export interface MessagePart {
  type: string;
  text?: string;
  state?: string;
  input?: any;
  output?: any;
  errorText?: string;
}

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  parts: MessagePart[];
}

const MODE_PREFIX =
  /^\[(?:STEPS|GRAPH|TEST|GUIDE|FLASHCARDS) MODE ENABLED\]\s*/i;

export function getMessageText(message: { parts?: MessagePart[] }): string {
  return (
    message.parts
      ?.filter((part) => part.type === 'text')
      .map((part) => part.text ?? '')
      .join('') ?? ''
  );
}

export function normalizeUserMessageText(text: string): string {
  return text.replace(MODE_PREFIX, '').trim();
}

/** Drop back-to-back user messages with the same content (sync / remount races). */
export function dedupeChatMessages<T extends { role: string; parts?: MessagePart[] }>(
  messages: T[]
): T[] {
  return messages.filter((message, index) => {
    if (index === 0) return true;
    const prev = messages[index - 1];
    if (message.role !== 'user' || prev.role !== 'user') return true;
    return (
      normalizeUserMessageText(getMessageText(message)) !==
      normalizeUserMessageText(getMessageText(prev))
    );
  });
}

export function copyMessageToClipboard(message: any): void {
  let copyText = '';

  message.parts.forEach((part: any) => {
    if (part.type === 'text') {
      copyText += part.text;
    } else if (part.type.startsWith('tool-')) {
      const toolName = part.type.replace('tool-', '');

      copyText += `\n\n--- Tool Call: ${toolName} ---\n`;
      copyText += `Status: ${part.state}\n`;

      if (part.input) {
        copyText += `Input: ${JSON.stringify(part.input, null, 2)}\n`;
      }

      if (part.output) {
        if (typeof part.output === 'object' && part.output !== null) {
          // Handle structured output (charts, step-by-step, etc.)
          if (part.output.type === 'step-by-step') {
            copyText += 'Output: Step-by-step solution\n';
            if (part.output.steps) {
              part.output.steps.forEach((step: any, stepIndex: number) => {
                copyText += `  Step ${stepIndex + 1}: ${step.description || step}\n`;
              });
            }
          } else if (part.output.type && part.output.data) {
            copyText += `Output: ${part.output.type} chart/graph\n`;
            copyText += `Data: ${JSON.stringify(part.output.data, null, 2)}\n`;
          } else {
            copyText += `Output: ${JSON.stringify(part.output, null, 2)}\n`;
          }
        } else {
          copyText += `Output: ${part.output}\n`;
        }
      }

      if (part.errorText) {
        copyText += `Error: ${part.errorText}\n`;
      }

      copyText += '--- End Tool Call ---\n';
    }
  });

  navigator.clipboard.writeText(copyText.trim());
  toast.success('Message copied to clipboard');
}

export async function handleShare(): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Math Flow Chat',
        text: 'Check out this math conversation',
        url: window.location.href,
      });
    } catch (error) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed');
    }
  } else {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Chat link copied to clipboard');
  }
}
