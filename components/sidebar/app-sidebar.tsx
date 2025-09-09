'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Bookmark, BookOpen, Command } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import { ProUpgradeCard } from '@/components/sidebar/pro-upgrade-card';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { api } from '@/convex/_generated/api';
import { ChartSplineIcon } from '../ui/chart-spline';
import { FoldersIcon } from '../ui/folders';
import { LayersIcon } from '../ui/layers';
import { PlusIcon } from '../ui/plus';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const threads = useQuery(
    api.threads.getThreadsByUser,
    user?.id ? { userId: user.id } : 'skip'
  );

  const data = {
    user: {
      name: user?.fullName || 'User',
      email: user?.primaryEmailAddress?.emailAddress || 'user@example.com',
      avatar: user?.imageUrl || '/avatars/default.jpg',
    },
    navMain: [
      {
        title: 'New thread',
        url: '/chat',
        icon: <PlusIcon />,
        isActive: true,
      },
      {
        title: 'Library',
        url: '',
        icon: <FoldersIcon />,
        isActive: true,
        items: [
          {
            title: 'Bookmarks',
            url: '/chat/bookmarks',
            icon: <Bookmark />,
            hasActions: false,
          },
          {
            title: 'Graphs',
            icon: <ChartSplineIcon />,
            url: '/chat/graphs',
            hasActions: false,
          },
          {
            title: 'Flashcards',
            icon: <LayersIcon />,
            url: '/chat/flashcards',
            hasActions: false,
          },
          {
            title: 'Practice Tests',
            icon: <BookOpen className="h-4 w-4" />,
            url: '/chat/practice-tests',
            hasActions: false,
          },
          // Add recent threads
          ...(threads?.slice(0, 5).map((thread) => ({
            title: thread.title,
            url: `/chat/${thread._id}`,
            hasActions: true,
            threadId: thread._id,
          })) || []),
        ],
      },
    ],
  };

  return (
    <Sidebar
      variant="inset"
      {...props}
      className="bg-neutral-100"
      collapsible="icon"
    >
      <SidebarHeader className="bg-neutral-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="default">
              <div className="flex items-center gap-2">
                <Image alt="logo" height={20} src="/logo.svg" width={20} />
                <div className="grid flex-1 text-left text-base leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">Math Flow</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-neutral-100">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-neutral-100">
        <SignedIn>
          <ProUpgradeCard />
          <NavUser user={data.user} />
        </SignedIn>
        <SignedOut>
          <div className="p-2">
            <SignInButton mode="modal">
              <div className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 font-medium text-neutral-700 text-sm transition-colors hover:bg-neutral-200">
                <Command className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Sign In
                </span>
              </div>
            </SignInButton>
          </div>
        </SignedOut>
      </SidebarFooter>
    </Sidebar>
  );
}
