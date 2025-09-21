'use client';

import { useQuery } from 'convex/react';
import { Flame } from 'lucide-react';
import { useRef } from 'react';
import { api } from '@/convex/_generated/api';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { FlameIcon, type FlameIconHandle } from '../ui/flame';

export function StreakIndicator({ userId }: { userId: string }) {
  const { state } = useSidebar();
  const flameRef = useRef<FlameIconHandle>(null);
  const streakData = useQuery(
    api.streaks.getUserStreak,
    userId ? { userId } : 'skip'
  );

  const handleMouseEnter = () => {
    flameRef.current?.startAnimation();
  };

  const handleMouseLeave = () => {
    flameRef.current?.stopAnimation();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          className="cursor-default hover:bg-neutral-200 transition-colors duration-300"
          tooltip={`${streakData?.streak || 0} day streak`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <FlameIcon ref={flameRef} className="h-4 w-4 text-[#00C48D]" />
          {state === 'expanded' && (
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-medium text-xs text-neutral-600">
                {streakData?.streak} day streak
              </span>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
