'use client';

import { Bookmark, Copy, Share2, X, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface ChatHeaderProps {
  title?: string;
  hasMessages?: boolean;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  isShared?: boolean;
  threadId?: string;
  onToggleShare?: () => void;
}

export function ChatHeader({
  title = 'New Thread',
  hasMessages = false,
  onBookmark,
  isBookmarked = false,
  isShared = false,
  threadId,
  onToggleShare,
}: ChatHeaderProps) {
  const displayTitle = title || 'New Thread';
  
  const getShareUrl = () => {
    if (isShared && threadId) {
      return `${window.location.origin}/shared/thread/${threadId}`;
    }
    return window.location.href;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    toast.success('Thread link copied to clipboard');
  };

  const handleToggleShare = () => {
    if (onToggleShare) {
      onToggleShare();
    }
  };

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl bg-white px-4 py-2">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="font-semibold text-lg text-neutral-900">
          {displayTitle}
        </h1>
      </div>

      {hasMessages && (
        <div className="flex items-center gap-2">
          <Button
            className={`h-8 w-8 transition-colors duration-300 hover:bg-[#00C48D]/10 hover:text-[#00C48D] ${
              isBookmarked ? 'text-[#00C48D]' : 'text-black'
            }`}
            onClick={onBookmark}
            size="icon"
            variant="ghost"
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
            />
            <span className="sr-only">
              {isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-8 w-8 text-black transition-colors duration-300 hover:bg-[#00C48D]/10 hover:text-[#00C48D] data-[state=open]:bg-[#00C48D]/10 data-[state=open]:text-[#00C48D]"
                size="icon"
                variant="ghost"
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-neutral-900 text-sm">
                    Share Thread
                  </h3>
                  {isShared && (
                    <span className="rounded-full bg-[#00C48D]/10 px-2 py-1 text-xs font-medium text-[#00C48D]">
                      Shared
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block font-medium text-neutral-600 text-xs">
                      Thread Link
                    </label>
                    <div className="flex gap-2">
                      <Input
                        className="h-8 bg-neutral-50 font-mono text-xs"
                        readOnly
                        value={getShareUrl()}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-full gap-2">
                    <Button
                      className="h-7 flex-1 text-neutral-600 hover:text-neutral-800 w-1/2"
                      onClick={handleCopyLink}
                      variant="outline"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                    {!isShared && (
                      <Button
                        className="h-7 flex-1 border-none bg-[#00C48D] text-white hover:bg-[#00C48D]/80"
                        onClick={handleToggleShare}
                        variant="default"
                      >
                        <Share2 className="h-3 w-3" />
                        Share
                      </Button>
                    )}
                    {isShared && (
                      <Button
                        className="h-7 bg-red-500 hover:bg-red-500/80 text-white border-none w-1/2"
                        onClick={handleToggleShare}
                      >
                        <XCircle className="h-3 w-3" />
                        Stop Sharing
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
