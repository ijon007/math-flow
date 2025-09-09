import { redirect } from 'next/navigation';
import type { Id } from '@/convex/_generated/dataModel';
import { SharedChatInterface } from '@/components/chat/shared-chat-interface';

interface SharedThreadPageProps {
  params: Promise<{ threadId: string }>;
}

export default async function SharedThreadPage({ params }: SharedThreadPageProps) {
  const { threadId } = await params;

  // Validate threadId format (basic validation)
  if (!threadId || typeof threadId !== 'string') {
    redirect('/chat');
  }

  return <SharedChatInterface threadId={threadId as Id<'threads'>} />;
}
