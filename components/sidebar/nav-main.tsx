'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { ChevronDown, Edit, MoreHorizontal, Share, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { toast } from 'sonner';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { api } from '@/convex/_generated/api';
import { useIsMobile } from '@/hooks/use-mobile';

const IconWrapper = React.forwardRef<any, { icon: React.ReactNode }>(
  ({ icon }, ref) => {
    return React.cloneElement(icon as React.ReactElement, { ref } as any);
  }
);

IconWrapper.displayName = 'IconWrapper';

function SubItemDropdown({
  subItem,
  isMobile,
}: {
  subItem: {
    title: string;
    url: string;
    hasActions?: boolean;
    icon?: React.ReactNode;
    threadId?: string;
  };
  isMobile: boolean;
}) {
  const subIconRef = useRef<any>(null);

  return (
    <>
      <SignedIn>
        <Link
          className="flex w-full items-center gap-3 rounded-sm px-1 py-1 text-sm transition-colors hover:bg-neutral-100"
          href={subItem.url}
          onMouseEnter={() => {
            if (subIconRef.current?.startAnimation) {
              subIconRef.current.startAnimation();
            }
          }}
          onMouseLeave={() => {
            if (subIconRef.current?.stopAnimation) {
              subIconRef.current.stopAnimation();
            }
          }}
        >
          {subItem.icon && (
            <div className="flex h-4 w-4 items-center justify-center">
              <IconWrapper icon={subItem.icon} ref={subIconRef} />
            </div>
          )}
          <span>{subItem.title}</span>
        </Link>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <div
            className="flex w-full cursor-pointer items-center gap-3 rounded-sm px-1 py-1 text-sm transition-colors hover:bg-neutral-100"
            onMouseEnter={() => {
              if (subIconRef.current?.startAnimation) {
                subIconRef.current.startAnimation();
              }
            }}
            onMouseLeave={() => {
              if (subIconRef.current?.stopAnimation) {
                subIconRef.current.stopAnimation();
              }
            }}
          >
            {subItem.icon && (
              <div className="flex h-4 w-4 items-center justify-center">
                <IconWrapper icon={subItem.icon} ref={subIconRef} />
              </div>
            )}
            <span>{subItem.title}</span>
          </div>
        </SignInButton>
      </SignedOut>
    </>
  );
}

function HoverDropdown({
  item,
  isMobile,
}: {
  item: {
    title: string;
    url: string;
    icon: React.ReactNode;
    items?: {
      title: string;
      url: string;
      hasActions?: boolean;
      icon?: React.ReactNode;
    }[];
  };
  isMobile: boolean;
}) {
  const mainIconRef = useRef<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
    if (mainIconRef.current?.startAnimation) {
      mainIconRef.current.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    if (mainIconRef.current?.stopAnimation) {
      mainIconRef.current.stopAnimation();
    }
  };

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <SidebarMenuButton className="cursor-pointer">
            {item.icon && <IconWrapper icon={item.icon} ref={mainIconRef} />}
          </SidebarMenuButton>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-48 p-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        side="right"
      >
        <div className="space-y-0.5">
          {item.items?.map((subItem, index) => (
            <SubItemDropdown
              isMobile={isMobile}
              key={subItem.title + index}
              subItem={subItem}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SubItemCollapsible({
  subItem,
  isMobile,
}: {
  subItem: {
    title: string;
    url: string;
    hasActions?: boolean;
    icon?: React.ReactNode;
    threadId?: string;
  };
  isMobile: boolean;
}) {
  const subIconRef = useRef<any>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const { user } = useUser();
  const deleteThread = useMutation(api.threads.deleteThread);
  const shareThread = useMutation(api.threads.shareThread);
  const unshareThread = useMutation(api.threads.unshareThread);
  const router = useRouter();

  return (
    <SidebarMenuSubItem
      className="group group-data-[state=open]:w-full"
      key={subItem.title}
    >
      <SignedIn>
        <SidebarMenuSubButton
          asChild
          className="hover:bg-neutral-200"
          onMouseEnter={() => {
            setIsHovered(true);
            if (subIconRef.current?.startAnimation) {
              subIconRef.current.startAnimation();
            }
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            if (subIconRef.current?.stopAnimation) {
              subIconRef.current.stopAnimation();
            }
          }}
        >
          <Link href={subItem.url}>
            {subItem.icon && (
              <IconWrapper icon={subItem.icon} ref={subIconRef} />
            )}
            <span className="group-data-[collapsible=icon]:hidden">
              {subItem.title}
            </span>
          </Link>
        </SidebarMenuSubButton>
        {subItem.hasActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:ring-0 active:ring-0">
              <SidebarMenuAction
                className={`transition-opacity hover:bg-neutral-200 focus:ring-0 active:ring-0 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isMobile ? 'end' : 'start'}
              side={isMobile ? 'bottom' : 'right'}
            >
              <DropdownMenuItem
                onClick={async () => {
                  if (subItem.threadId && user?.id) {
                    try {
                      // First make the thread shareable if it isn't already
                      await shareThread({
                        threadId: subItem.threadId as any,
                        userId: user.id,
                      });
                      
                      // Then copy the shareable URL
                      const shareUrl = `${window.location.origin}/shared/${subItem.threadId}`;
                      navigator.clipboard.writeText(shareUrl);
                      toast.success('Thread is now shareable and link copied to clipboard');
                    } catch (error) {
                      console.error('Failed to share thread:', error);
                      toast.error('Failed to share thread');
                    }
                  }
                }}
              >
                <Share className="text-muted-foreground" />
                <span>Share</span>
              </DropdownMenuItem>
              {subItem.threadId && (
                <DropdownMenuItem
                  onClick={async () => {
                    if (subItem.threadId) {
                      await deleteThread({ threadId: subItem.threadId as any });
                      router.push('/chat');
                    }
                  }}
                  variant="destructive"
                >
                  <Trash2 className="text-destructive" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <SidebarMenuSubButton
            asChild
            className="cursor-pointer hover:bg-neutral-200"
            onMouseEnter={() => {
              setIsHovered(true);
              if (subIconRef.current?.startAnimation) {
                subIconRef.current.startAnimation();
              }
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              if (subIconRef.current?.stopAnimation) {
                subIconRef.current.stopAnimation();
              }
            }}
          >
            <div>
              {subItem.icon && (
                <IconWrapper icon={subItem.icon} ref={subIconRef} />
              )}
              <span className="group-data-[collapsible=icon]:hidden">
                {subItem.title}
              </span>
            </div>
          </SidebarMenuSubButton>
        </SignInButton>
      </SignedOut>
    </SidebarMenuSubItem>
  );
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      hasActions?: boolean;
      icon?: React.ReactNode;
      threadId?: string;
    }[];
  }[];
}) {
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarGroup className="pl-0 group-data-[collapsible=icon]:pl-2">
      <SidebarMenu>
        {items.map((item) => {
          const mainIconRef = useRef<any>(null);

          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-neutral-200"
                  onMouseEnter={() => {
                    if (mainIconRef.current?.startAnimation) {
                      mainIconRef.current.startAnimation();
                    }
                  }}
                  onMouseLeave={() => {
                    if (mainIconRef.current?.stopAnimation) {
                      mainIconRef.current.stopAnimation();
                    }
                  }}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    {item.icon && (
                      <IconWrapper icon={item.icon} ref={mainIconRef} />
                    )}
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          if (isCollapsed) {
            return (
              <SidebarMenuItem key={item.title}>
                <HoverDropdown isMobile={isMobile} item={item} />
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible asChild defaultOpen={item.isActive} key={item.title}>
              <SidebarMenuItem>
                <CollapsibleTrigger
                  asChild
                  className="cursor-pointer pr-1 data-[state=open]:pr-1"
                >
                  <SidebarMenuButton
                    onMouseEnter={() => {
                      if (mainIconRef.current?.startAnimation) {
                        mainIconRef.current.startAnimation();
                      }
                    }}
                    onMouseLeave={() => {
                      if (mainIconRef.current?.stopAnimation) {
                        mainIconRef.current.stopAnimation();
                      }
                    }}
                    tooltip={item.title}
                  >
                    {item.icon && (
                      <IconWrapper icon={item.icon} ref={mainIconRef} />
                    )}
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                    <ChevronDown className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem, index) => (
                      <SubItemCollapsible
                        isMobile={isMobile}
                        key={subItem.title + index}
                        subItem={subItem}
                      />
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
