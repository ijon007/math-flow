import Link from 'next/link';

export default function SharedThreadNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white">
      <div className="text-center">
        <h2 className="mb-2 font-bold text-2xl text-neutral-900">
          Shared Thread Not Found
        </h2>
        <p className="mb-6 text-neutral-600">
          This shared thread doesn't exist or is no longer available.
        </p>
        <Link
          className="inline-flex items-center rounded-md bg-[#00C48D] px-4 py-2 text-white transition-colors hover:bg-[#00C48D]/80"
          href="/chat"
        >
          Start New Conversation
        </Link>
      </div>
    </div>
  );
}
