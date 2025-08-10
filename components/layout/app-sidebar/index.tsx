"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  MessageCircle,
  PieChart,
  Play,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "../navigation/nav-main"
import { NavProjects } from "../navigation/nav-projects"
import { NavUser } from "../navigation/nav-user"
import { WorkspaceSwitcher } from "../navigation/workspace-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Updated data for PEAI
const data = {
  workspaces: [
    {
      name: "PEAI",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "AI Research",
      logo: AudioWaveform,
      plan: "Professional",
    },
    {
      name: "ML Team",
      logo: Command,
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
        },
      ],
    },
    {
      title: "Chat",
      url: "#",
      icon: MessageCircle,
      items: [
        {
          title: "问答",
          url: "/chat/qa",
        },
      ],
    },
    {
      title: "AI Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Language Models",
          url: "#",
        },
        {
          title: "Computer Vision",
          url: "#",
        },
        {
          title: "Speech Recognition",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Getting Started",
          url: "#",
        },
        {
          title: "API Reference",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Best Practices",
          url: "#",
        },
      ],
    },
    {
      title: "视频观看",
      url: "#",
      icon: Play,
      items: [
        {
          title: "电力电子技术",
          url: "/videos/power-electronics",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "API Keys",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Data Processing",
      url: "#",
      icon: Frame,
    },
    {
      name: "Analytics Pipeline",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Model Training",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={data.workspaces} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
