'use client';

import { Bookmark, Share2, Copy, X } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ChatHeaderProps {
  title?: string;
  hasMessages?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
}

export function ChatHeader({ 
  title = "New Thread", 
  hasMessages = false,
  onBookmark,
  onShare 
}: ChatHeaderProps) {
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
    <div className="flex items-center justify-between px-4 py-2 bg-white rounded-t-xl">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold text-neutral-900">
          {title}
        </h1>
      </div>
      
      {hasMessages && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBookmark}
            className="h-8 w-8 text-black hover:text-[#00C48D] hover:bg-[#00C48D]/10 transition-colors duration-300"
          >
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">Bookmark</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-black hover:text-[#00C48D] hover:bg-[#00C48D]/10 transition-colors duration-300 data-[state=open]:bg-[#00C48D]/10 data-[state=open]:text-[#00C48D]"
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-0 w-80">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-neutral-900">Share Thread</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-600 mb-1 block">
                      Thread Link
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={window.location.href}
                        readOnly
                        className="text-xs font-mono bg-neutral-50 h-8"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCopyLink}
                      className="flex-1 text-neutral-600 hover:text-neutral-800 h-7"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleShare}
                      className="flex-1 bg-[#00C48D] hover:bg-[#00C48D]/80 text-white border-none h-7"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
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
