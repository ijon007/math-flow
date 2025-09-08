export function ChatLoadingState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#00C48D] border-t-transparent" />
        <p className="text-neutral-600">Loading conversation...</p>
      </div>
    </div>
  );
}
