"use client"

import * as React from "react"
import {
  Bookmark,
  Command,
  Notebook,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FoldersIcon } from "../ui/folders"
import { ChartSplineIcon } from "../ui/chart-spline"
import { LayersIcon } from "../ui/layers"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Library",
      url: "#",
      icon: <FoldersIcon />,
      isActive: true,
      items: [
        {
          title: "Bookmarks",
          url: "#",
          icon: <Bookmark />,
          hasActions: false,
        },
        {
          title: "Graphs",
          icon: <ChartSplineIcon />,
          url: "#",
          hasActions: false,
        },
        {
          title: "Flashcards",
          icon: <LayersIcon />,
          url: "#",
          hasActions: false,
        },
        {
          title: "hello world",
          url: "#",
          hasActions: true,
        }
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="default" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
