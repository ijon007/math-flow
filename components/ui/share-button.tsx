'use client';

import { Share, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUniversalShare, useIsShared } from '@/hooks/use-universal-share';

type ShareableType = 'thread' | 'flashcard' | 'graph' | 'practiceTest' | 'studyGuide';

interface ShareButtonProps {
  itemType: ShareableType;
  itemId: string;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'default';
  className?: string;
}

export function ShareButton({
  itemType,
  itemId,
  variant = 'icon',
  size = 'default',
  className = '',
}: ShareButtonProps) {
  const { share, unshare } = useUniversalShare();
  const isShared = useIsShared(itemType, itemId);

  const handleClick = async () => {
    if (isShared) {
      await unshare(itemType, itemId);
    } else {
      await share(itemType, itemId);
    }
  };

  if (variant === 'button') {
    return (
      <Button
        onClick={handleClick}
        size={size}
        variant="outline"
        className={`transition-colors duration-300 hover:bg-[#00C48D]/10 hover:text-[#00C48D] ${
          isShared ? 'text-[#00C48D] border-[#00C48D]' : 'text-neutral-600'
        } ${className}`}
      >
        <Share2 className="h-4 w-4 mr-2" />
        {isShared ? 'Shared' : 'Share'}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      size="icon"
      variant="ghost"
      className={`h-8 w-8 transition-colors duration-300 hover:bg-[#00C48D]/10 hover:text-[#00C48D] ${
        isShared ? 'text-[#00C48D]' : 'text-black'
      } ${className}`}
    >
      <Share2
        className={`h-4 w-4 ${isShared ? 'fill-current' : ''}`}
      />
      <span className="sr-only">
        {isShared ? 'Stop sharing' : 'Share'}
      </span>
    </Button>
  );
}
