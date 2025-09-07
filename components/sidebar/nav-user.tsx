'use client';

import { Bot, CreditCard, EllipsisVertical, Menu, User } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { AgentSettings } from '../settings/agent-settings';
import { BillingSettings } from '../settings/billing-settings';
import { GeneralSection } from '../settings/general-settings';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const SETTINGS_SECTIONS = [
  {
    id: 'general',
    title: 'General',
    description: 'User details and account',
    icon: User,
  },
  {
    id: 'agent',
    title: 'Agent',
    description: 'AI preferences',
    icon: Bot,
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'Subscription and pricing',
    icon: CreditCard,
  },
];

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const [activeSection, setActiveSection] = useState('general');

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSection user={user} />;
      case 'agent':
        return <AgentSettings />;
      case 'billing':
        return <BillingSettings />;
      default:
        return <GeneralSection user={user} />;
    }
  };

  const getCurrentSection = () => {
    return SETTINGS_SECTIONS.find((section) => section.id === activeSection);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton className="cursor-pointer hover:bg-neutral-200 data-[state=open]:bg-neutral-200 data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="size-7 rounded-lg">
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback className="rounded-lg">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium text-xs">
                  {user.email}
                </span>
              </div>
              <EllipsisVertical className="h-4 w-4" />
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent className="h-[90vh] w-[95vw] max-w-[1000px] bg-white p-0 sm:h-[600px] sm:w-[90vw] sm:max-w-[1000px] md:w-[800px] lg:w-[1000px] dark:bg-neutral-950">
            <DialogTitle className="sr-only">Settings</DialogTitle>
            <div className="flex h-full flex-col lg:flex-row">
              <div className="flex h-12 items-center justify-between border-neutral-200 border-b px-4 lg:hidden dark:border-neutral-800">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="mt-0.5 h-8 px-3" variant="ghost">
                      <Menu className="mr-2 h-4 w-4" />
                      {getCurrentSection()?.title}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {SETTINGS_SECTIONS.map((section) => {
                      const Icon = section.icon;
                      return (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {section.title}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="hidden w-48 border-neutral-200 border-r px-3 py-4 lg:block dark:border-neutral-800">
                <nav>
                  {SETTINGS_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        className={`flex w-full cursor-pointer items-center space-x-3 rounded-[10px] p-2 text-sm transition-colors hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 ${
                          activeSection === section.id
                            ? 'text-neutral-900 dark:text-white'
                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="font-medium">{section.title}</div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="h-full flex-1 overflow-y-auto">
                {renderSectionContent()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
