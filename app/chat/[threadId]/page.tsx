import { redirect } from 'next/navigation';
import { ChatInterface } from '@/components/chat/chat-interface';
import type { Id } from '@/convex/_generated/dataModel';

interface ThreadPageProps {
  params: Promise<{ threadId: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { threadId } = await params;

  // Validate threadId format (basic validation)
  if (!threadId || typeof threadId !== 'string') {
    redirect('/chat');
  }

  return <ChatInterface threadId={threadId as Id<'threads'>} />;
}
