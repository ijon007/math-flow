'use client';

import { useQuery } from 'convex/react';
import { Flame } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function StreakIndicator({ userId }: { userId: string }) {
  const streakData = useQuery(
    api.streaks.getUserStreak,
    userId ? { userId } : 'skip'
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="cursor-default hover:bg-neutral-200 transition-colors duration-300">
          <Flame className="h-4 w-4 text-[#00C48D]" />
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-medium text-xs text-neutral-600">
              {streakData?.streak} day streak
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
