import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useEffect } from 'react';
import { api } from '@/convex/_generated/api';

export function useUserManagement() {
  const { user } = useUser();
  const createUser = useMutation(api.auth.createUser);
  const updateUser = useMutation(api.auth.updateUser);
  const currentUser = useQuery(api.auth.getCurrentUser, {
    clerkUserId: user?.id,
  });

  useEffect(() => {
    if (user && !currentUser) {
      createUser({
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || undefined,
      });
    } else if (user && currentUser) {
      updateUser({
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || undefined,
      });
    }
  }, [user, currentUser, createUser, updateUser]);

  return {
    user,
    currentUser,
    isSignedIn: !!user,
  };
}
