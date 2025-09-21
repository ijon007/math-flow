import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';

export function useUsageLimits() {
  const { user } = useUser();
  const usageLimits = useQuery(api.usage.getUsageLimits, 
    user?.id ? { userId: user.id } : 'skip'
  );

  const isLoading = usageLimits === undefined;
  const isPro = usageLimits?.aiMessages.limit === Infinity;

  return {
    usageLimits,
    isLoading,
    isPro,
    hasReachedLimit: (feature: keyof NonNullable<typeof usageLimits>) => {
      if (!usageLimits) return false;
      return usageLimits[feature].hasReachedLimit;
    },
    getRemainingUsage: (feature: keyof NonNullable<typeof usageLimits>) => {
      if (!usageLimits) return 0;
      const { current, limit } = usageLimits[feature];
      return Math.max(0, limit - current);
    },
    getUsagePercentage: (feature: keyof NonNullable<typeof usageLimits>) => {
      if (!usageLimits) return 0;
      const { current, limit } = usageLimits[feature];
      if (limit === Infinity) return 0;
      return Math.min(100, (current / limit) * 100);
    },
  };
}
