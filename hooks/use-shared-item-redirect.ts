import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useSharedItemRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const shareItem = useMutation(api.sharing.shareItem);

  useEffect(() => {
    if (!isLoaded) return;

    // Check if user just signed in and there's a shared item to handle
    if (user?.id) {
      const sharedItemData = localStorage.getItem('sharedItem');
      if (sharedItemData) {
        try {
          const { type, id, redirectTo } = JSON.parse(sharedItemData);
          
          // Add the item to their account by sharing it
          shareItem({
            itemType: type,
            itemId: id,
            userId: user.id,
          }).then(() => {
            // Clear the stored data
            localStorage.removeItem('sharedItem');
            // Redirect to the appropriate page
            router.push(redirectTo);
          }).catch((error) => {
            console.error('Failed to add shared item to account:', error);
            // Still redirect even if sharing fails
            localStorage.removeItem('sharedItem');
            router.push(redirectTo);
          });
        } catch (error) {
          console.error('Failed to parse shared item data:', error);
          localStorage.removeItem('sharedItem');
        }
      }
    }
  }, [user?.id, isLoaded, shareItem, router]);
}
