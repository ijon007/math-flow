"use client"

import { ChevronDown, Edit, MoreHorizontal, Share, Trash2 } from "lucide-react"
import React, { useRef } from "react"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"

const IconWrapper = React.forwardRef<any, { icon: React.ReactNode }>(({ icon }, ref) => {
  return React.cloneElement(icon as React.ReactElement, { ref } as any);
});

IconWrapper.displayName = "IconWrapper";

function SubItemDropdown({ subItem, isMobile }: { 
  subItem: { title: string; url: string; hasActions?: boolean; icon?: React.ReactNode }
  isMobile: boolean 
}) {
  const subIconRef = useRef<any>(null);
  
  return (
    <>
      <SignedIn>
        <Link 
          href={subItem.url}
          className="flex items-center gap-3 w-full px-1 py-1 text-sm hover:bg-neutral-100 rounded-sm transition-colors"
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
            <div className="flex items-center justify-center w-4 h-4">
              <IconWrapper ref={subIconRef} icon={subItem.icon} />
            </div>
          )}
          <span>{subItem.title}</span>
        </Link>
      </SignedIn>
      
      <SignedOut>
        <SignInButton mode="modal">
          <div 
            className="flex items-center gap-3 w-full px-1 py-1 text-sm hover:bg-neutral-100 rounded-sm transition-colors cursor-pointer"
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
              <div className="flex items-center justify-center w-4 h-4">
                <IconWrapper ref={subIconRef} icon={subItem.icon} />
              </div>
            )}
            <span>{subItem.title}</span>
          </div>
        </SignInButton>
      </SignedOut>
    </>
  );
}

function HoverDropdown({ item, isMobile }: { 
  item: { title: string; url: string; icon: React.ReactNode; items?: { title: string; url: string; hasActions?: boolean; icon?: React.ReactNode }[] }
  isMobile: boolean 
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <SidebarMenuButton className="cursor-pointer">
            {item.icon && <IconWrapper ref={mainIconRef} icon={item.icon} />}
          </SidebarMenuButton>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        side="right" 
        align="start" 
        className="w-48 p-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="space-y-0.5">
          {item.items?.map((subItem, index) => (
            <SubItemDropdown key={subItem.title + index} subItem={subItem} isMobile={isMobile} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SubItemCollapsible({ subItem, isMobile }: { 
  subItem: { title: string; url: string; hasActions?: boolean; icon?: React.ReactNode; threadId?: string }
  isMobile: boolean 
}) {
  const subIconRef = useRef<any>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const deleteThread = useMutation(api.threads.deleteThread);
  
  return (
    <SidebarMenuSubItem key={subItem.title} className="group group-data-[state=open]:w-full">
      <SignedIn>
        <SidebarMenuSubButton 
          asChild
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
          className="hover:bg-neutral-200"
        >
          <Link href={subItem.url}>
            {subItem.icon && <IconWrapper ref={subIconRef} icon={subItem.icon} />}
            <span className="group-data-[collapsible=icon]:hidden">{subItem.title}</span>
          </Link>
        </SidebarMenuSubButton>
        {subItem.hasActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:ring-0 active:ring-0">
              <SidebarMenuAction 
                className={`focus:ring-0 active:ring-0 transition-opacity hover:bg-neutral-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem>
                <Edit className="text-muted-foreground" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="text-muted-foreground" />
                <span>Share</span>
              </DropdownMenuItem>
              {subItem.threadId && (
                <DropdownMenuItem 
                  variant="destructive"
                  onClick={() => {
                    if (subItem.threadId) {
                      deleteThread({ threadId: subItem.threadId as any });
                    }
                  }}
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
            className="hover:bg-neutral-200 cursor-pointer"
          >
            <div>
              {subItem.icon && <IconWrapper ref={subIconRef} icon={subItem.icon} />}
              <span className="group-data-[collapsible=icon]:hidden">{subItem.title}</span>
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
    title: string
    url: string
    icon: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
      hasActions?: boolean
      icon?: React.ReactNode
    }[]
  }[]
}) {
  const isMobile = useIsMobile()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  
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
                  tooltip={item.title}
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
                >
                  <Link href={item.url}>
                    {item.icon && <IconWrapper ref={mainIconRef} icon={item.icon} />}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
          
          if (isCollapsed) {
            return (
              <SidebarMenuItem key={item.title}>
                <HoverDropdown item={item} isMobile={isMobile} />
              </SidebarMenuItem>
            );
          }
          
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild className="cursor-pointer pr-1 data-[state=open]:pr-1">
                  <SidebarMenuButton 
                    tooltip={item.title}
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
                  >
                    {item.icon && <IconWrapper ref={mainIconRef} icon={item.icon} />}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    <ChevronDown className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem, index) => (
                      <SubItemCollapsible key={subItem.title + index} subItem={subItem} isMobile={isMobile} />
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
