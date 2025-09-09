'use client';

export function LoadingState() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00C48D] border-t-transparent"></div>
      <p className="mt-2 text-sm text-muted-foreground">Loading test...</p>
    </div>
  );
}
