"use client"

import { ChevronDown, ChevronRight, Edit, MoreHorizontal, Share, Trash2 } from "lucide-react"
import React, { useRef } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"

// Helper component to forward refs to animated icons
const IconWrapper = React.forwardRef<any, { icon: React.ReactNode }>(({ icon }, ref) => {
  return React.cloneElement(icon as React.ReactElement, { ref } as any);
});

IconWrapper.displayName = "IconWrapper";

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
  return (
    <SidebarGroup className="pl-0">
      <SidebarMenu>
        {items.map((item) => {
          const mainIconRef = useRef<any>(null);
          
          // If item has no sub-items, render as non-collapsible
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
                  <a href={item.url}>
                    {item.icon && <IconWrapper ref={mainIconRef} icon={item.icon} />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
          
          // If item has sub-items, render as collapsible
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
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const subIconRef = useRef<any>(null);
                      const [isHovered, setIsHovered] = React.useState(false);
                      
                      return (
                        <SidebarMenuSubItem key={subItem.title} className="group group-data-[state=open]:w-full">
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
                            <a href={subItem.url}>
                              {subItem.icon && <IconWrapper ref={subIconRef} icon={subItem.icon} />}
                              <span>{subItem.title}</span>
                            </a>
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
                                <DropdownMenuItem variant="destructive">
                                  <Trash2 className="text-destructive" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </SidebarMenuSubItem>
                      );
                    })}
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
