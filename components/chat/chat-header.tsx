'use client';

import { Bookmark, Copy, Share2, X } from 'lucide-react';
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
  onShare?: () => void;
  isBookmarked?: boolean;
}

export function ChatHeader({
  title = 'New Thread',
  hasMessages = false,
  onBookmark,
  onShare,
  isBookmarked = false,
}: ChatHeaderProps) {
  const displayTitle = title || 'New Thread';
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Thread link copied to clipboard');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Math Flow Chat',
          text: 'Check out this math conversation',
          url: window.location.href,
        });
        onShare?.();
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copy if native share not supported
      handleCopyLink();
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
              isBookmarked 
                ? 'text-[#00C48D]' 
                : 'text-black'
            }`}
            onClick={onBookmark}
            size="icon"
            variant="ghost"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="sr-only">{isBookmarked ? 'Remove bookmark' : 'Bookmark'}</span>
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
                        value={window.location.href}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="h-7 flex-1 text-neutral-600 hover:text-neutral-800"
                      onClick={handleCopyLink}
                      variant="outline"
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </Button>
                    <Button
                      className="h-7 flex-1 border-none bg-[#00C48D] text-white hover:bg-[#00C48D]/80"
                      onClick={handleShare}
                      variant="default"
                    >
                      <Share2 className="mr-1 h-3 w-3" />
                      Share
                    </Button>
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
