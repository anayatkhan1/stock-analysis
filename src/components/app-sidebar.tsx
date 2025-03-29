"use client";
import {
  BarChart2,
  Command,
  DollarSign,
  FileText,
  Frame,
  Globe,
  LifeBuoy,
  LineChart,
  Map,
  PieChart,
  Send,
  TrendingUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import Link from "next/link";

export const navigationData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      label: "",
      items: [
        {
          name: "Overview",
          url: "/app",
          icon: Globe,
        },
      ],
    },
    {
      label: "Markets",
      items: [
        {
          name: "Global Markets",
          url: "/app/global",
          icon: Globe,
        },
        {
          name: "Indian Markets",
          url: "/app/indian",
          icon: BarChart2,
        },
      ],
    },
    {
      label: "Technical Analysis",
      items: [
        {
          name: "Stock Scanner",
          url: "/app/stock-scanner",
          icon: LineChart,
        },
      ],
    },
    {
      label: "Fundamental Analysis",
      items: [
        {
          name: "Financial Reports",
          url: "/app/fundamentals/reports",
          icon: FileText,
        },
        {
          name: "Balance Sheets",
          url: "/app/fundamentals/balance",
          icon: DollarSign,
        },
        {
          name: "Profit and Loss",
          url: "/app/fundamentals/profit-loss",
          icon: TrendingUp,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/app/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/app/feedback",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/app/projects/design",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/app/projects/sales",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/app/projects/travel",
      icon: Map,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  pathname?: string;
}

export function AppSidebar({ pathname = "", ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/app">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Stock analysis</span>
                  <span className="truncate text-xs">Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} currentPath={pathname} />
        {/* <NavProjects projects={navigationData.projects} /> */}
        <NavSecondary
          items={navigationData.navSecondary}
          className="mt-auto"
          currentPath={pathname}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigationData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
