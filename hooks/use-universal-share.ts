import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';

type ShareableType = 'thread' | 'flashcard' | 'graph' | 'practiceTest' | 'studyGuide';

export function useUniversalShare() {
  const { user } = useUser();
  const shareItem = useMutation(api.sharing.shareItem);
  const unshareItem = useMutation(api.sharing.unshareItem);

  const share = useCallback(
    async (itemType: ShareableType, itemId: string) => {
      if (!user?.id) {
        toast.error('You must be logged in to share items');
        return;
      }

      try {
        await shareItem({
          itemType,
          itemId,
          userId: user.id,
        });

        const shareUrl = `${window.location.origin}/shared/${itemType}/${itemId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success('Item shared and link copied to clipboard');
      } catch (error) {
        console.error('Failed to share item:', error);
        toast.error('Failed to share item');
      }
    },
    [user?.id, shareItem]
  );

  const unshare = useCallback(
    async (itemType: ShareableType, itemId: string) => {
      if (!user?.id) {
        toast.error('You must be logged in to unshare items');
        return;
      }

      try {
        await unshareItem({
          itemType,
          itemId,
          userId: user.id,
        });
        toast.success('Item is no longer shared');
      } catch (error) {
        console.error('Failed to unshare item:', error);
        toast.error('Failed to unshare item');
      }
    },
    [user?.id, unshareItem]
  );

  const getShareUrl = useCallback(
    (itemType: ShareableType, itemId: string) => {
      return `${window.location.origin}/shared/${itemType}/${itemId}`;
    },
    []
  );

  return {
    share,
    unshare,
    getShareUrl,
  };
}

export function useIsShared(itemType: ShareableType, itemId: string) {
  return useQuery(
    api.sharing.isItemShared,
    itemId ? { itemType, itemId } : 'skip'
  );
}
