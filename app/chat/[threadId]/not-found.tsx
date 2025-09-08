import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Thread Not Found</h2>
        <p className="text-neutral-600 mb-6">
          The conversation you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center px-4 py-2 bg-[#00C48D] text-white rounded-md hover:bg-[#00C48D]/80 transition-colors"
        >
          Start New Conversation
        </Link>
      </div>
    </div>
  );
}
